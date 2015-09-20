

Ext.define('Horny.BucketsGridToolbar',{
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.bucketsgridtoolbar',

    items: [
        {
            xtype: 'numberfield',
            //anchor:'100%',
            labelWidth: 25,
            //hideLabel: true,
            //width : 70,
            fieldLabel: ' Size',
            //name: 'basic',
            value: settings.get('es.ui.bucketsGrid.size') || 100,
            minValue: 1,
            maxValue: 10000,
            listeners: {
                change:{
                    fn: function(that, newValue, oldValue, eOpts ){
                        console.log('BucketsGridToolbar size: ' + newValue);
                        var grid = this.up().up();

                        settings.set('es.ui.bucketsGrid.size',newValue);

                        grid.update();

//                        docsQuery = JSON.parse(localStorage.getItem("docsQuery"));
//
//                        docsQuery.size = newValue;
//
//                        localStorage.setItem("docsQuery",JSON.stringify(docsQuery));
//
//                        grid.updateGrid(grid.id);
                        //viewSettings.minNgram = newValue;
                        //chrome.storage.local.set({"viewSettings" : viewSettings});
                        //updateNgrams(viewSettings.selectedTabId);
                        //trackEvent("ngramsToolbar.minNgram",newValue);



                    }
                }
            }
        }
    ]
});

Ext.define('Horny.BucketsGrid', {
   extend: 'Ext.grid.Panel',
   alias: 'widget.bucketsgrid',

    autoRender: true,
    autoScroll: true,
    layout: 'fit',
    tbar: Ext.create('Horny.BucketsGridToolbar'),

    columns: [
        {text: "Key", flex: 1, dataIndex: 'key', sortable: true},
        {text: "Count", width: 180, dataIndex: 'doc_count', sortable: true},
        {xtype: 'checkcolumn', header: 'Filter By', dataIndex: 'filterBy', width: 55,
            listeners: {
                checkchange: {
                    fn: function(column,rowIndex,checked) {

                        var esProperty = settings.get('es.ui.selectedProperty');

                        var store = this.up().up().getStore();
                        var rec = store.getAt(rowIndex);
                        console.log('Checkbox changed key: ' + rec.data.key + " count: " + rec.data.doc_count + " checked: " + checked );

                        var query = queryMgr.getActiveQueryJson();

                        console.log("getActiveQueryJson: " + JSON.stringify(query));

                        //var filtered = query.filtered || {'filter': {'terms':{}}};

                        var filter = queryMgr.getActiveFilterJson();

                        var esMappingTree = Ext.getCmp('esMappingTree');
                        var selectedTreeRecord = null;
                        if (esMappingTree.getSelectionModel().hasSelection()) {
                            selectedTreeRecord = esMappingTree.getSelectionModel().getSelection()[0];
                        }

                        //filter = filter || {"and":{"filters":[]}};

                        if(checked){
                            //clean tree color mark
                            selectedTreeRecord.set("text","<span style=color:blue;'>" + selectedTreeRecord.raw.text + "</span>");

                            var terms = {};
                            terms[esProperty] = [];

                            //remove column filter
                            for(var i = 0;i < filter.and.filters.length;i++){
                                if(filter.and.filters[i].terms && filter.and.filters[i].terms[esProperty]){
                                    terms = filter.and.filters[i].terms;
                                    filter.and.filters.splice(i,1);
                                    break;
                                }
                            }

                            //add selected
                            for(var i = 0;i < store.count();i++){
                                var r = store.getAt(i);
                                if(r.data.filterBy === true){
                                    //facetsFilter[arr[1]][arr[2]][arr[3]].push(r.data.term);
                                    console.log(r.data.key + ' - checked');
                                    if(terms[esProperty].indexOf(r.data.key) === -1){
                                        terms[esProperty].push(r.data.key);
                                    }
                                }
                            }

                            if(terms[esProperty] && terms[esProperty].length > 0){
                                filter.and.filters.push({"terms" : terms});
                            }

                            queryMgr.setActiveFilterJson(filter);
                        }
                        else{
                            var r = store.getAt(rowIndex);
                            for(var i = 0;i < filter.and.filters.length;i++){
                                if(filter.and.filters[i].terms && filter.and.filters[i].terms[esProperty]){
                                    var ind = filter.and.filters[i].terms[esProperty].indexOf(r.data.key)
                                    if(ind > -1){
                                        filter.and.filters[i].terms[esProperty].splice(ind,1);
                                        if(filter.and.filters[i].terms[esProperty].length === 0){
                                            filter.and.filters.splice(i,1);
                                            break;
                                        }
                                    }
                                }
                            }

                            //clean tree color mark
                            if(filter.and.filters.length === 0)
                            //if(filter.and.filters.terms[esProperty].length === 0){
                            {
                                selectedTreeRecord.set("text", selectedTreeRecord.raw.text );
                            }
//                            else{
//                                var ind = filter.and.filters
//                            }

                            queryMgr.setActiveFilterJson(filter);

                            var bucketsGrid =  Ext.getCmp('bucketsGrid');

                            bucketsGrid.update();
                        }


                        console.log("getActiveQueryJson: " + JSON.stringify(filter));



                        var esTypesGrid = Ext.getCmp('esTypesGrid');

                        esTypesGrid.update();

                    }
                }
            }
        }
    ],

    update: function(){

        var esIndex = settings.get('es.ui.selectedIndex');
        var esType = settings.get('es.ui.selectedType');
        var esProperty = settings.get('es.ui.selectedProperty');

        var grid = this;

        grid.store.removeAll();

        var query = queryMgr.getBucketQueryJson(esProperty);

        console.log('buckets query: ' + JSON.stringify(query));

        http.post('/es?op=search&index=' + esIndex + '&type=' + esType,
        query,
        function(res){
            res = JSON.parse(res);
            //console.log(JSON.stringify(res));
            if(res && res.aggregations && res.aggregations.bucket_agg && res.aggregations.bucket_agg.buckets){
                var buckets = res.aggregations.bucket_agg.buckets;

                var store = grid.getStore();
                store.loadData(buckets);

                var filter = queryMgr.getActiveFilterJson();

                if(filter && filter.and && filter.and.filters ){

                    var terms = {};
                    terms[esProperty] = [];

                    for(var i = 0;i < filter.and.filters.length;i++){
                        if(filter.and.filters[i].terms && filter.and.filters[i].terms[esProperty]){
                            terms = filter.and.filters[i].terms;
                            break;
                        }
                    }

                    terms[esProperty].forEach(function(value){
                        var rec = store.findRecord('key',value);
                        if(rec){
                            rec.set('filterBy',true);
                        }
                        else{
                            console.log(esProperty + ' - ' + value + ' not found in store.');
                        }
                    });
                    store.sort('filterBy','DESC');
                }

                var esCenter = Ext.getCmp('esCenterTabs');
                var esBarChart = Ext.getCmp('esBarChart');

                if(esBarChart){
                    esCenter.remove('esBarChart',true);
                }

                esBarChart = createEsBarChart();
                esCenter.add(esBarChart);
                esCenter.setActiveTab(esBarChart);
                esBarChart.updateLayout();
            }
        });

    },

    initComponent : function(){
            this.store = Ext.create('Ext.data.JsonStore', {
                sortInfo: { field: "count", direction: "DESC" },
                //autoLoad: true,
                //autoSync: true,
                fields: [
                     {name: 'key',  type: 'string'},
                     {name: 'doc_count',   type: 'int'},
                     {name: 'filterBy', type: 'bool'}
                ]//,
               // data: [{str:'',count:0}]
            });
            this.callParent(arguments);
       },

    listeners: {
               	selectionchange:{
                   	fn: function(/*Ext.selection.Model*/ that, /* Ext.data.Model[]*/ selected,/* Object*/ eOpts){
                   	if(!selected || selected.length == 0){
                        return;
                    }

                     var ngram = selected[0].data.str;


                }
            },
            sortchange:{
                fn: function( ct, column, direction, eOpts ){
                    console.log("sortchange column: " + column.dataIndex + " direction: " + direction);
                    if(column.dataIndex !== 'filterBy '){
                          return;
                    }

                    var query = queryMgr.getBucketQueryJson(column.dataIndex);

                    query['order'] = {};
                    query['order'][column.dataIndex] = direction;

                    queryMgr.setBucketQueryJson(column.dataIndex,query);

                    this.update();
                }
            }
        }

});


