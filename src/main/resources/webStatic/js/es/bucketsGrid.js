

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

                        var store = this.up().up().getStore();
                        var rec = store.getAt(rowIndex);
                        console.log('Checkbox changed key: ' + rec.data.key + " count: " + rec.data.doc_count + " checked: " + checked );

                        //'{"query":{"bool":{"must":{"terms":{"userDetails_genome_attributes_Brand_Aware":["0,9","1.0"]}}}},"from":0,"size":5,"sort":{"userDetails_genome_attributes_Activist":{"order":"desc"}}}'

//                            {
//                            	"query" : {
//                                    "filtered": {
//                                        "filter": {
//                                            "range": {
//                                                "rating" : {
//                            						"from" : 7,
//                            						"to" : 11
//                            					}
//                                            }
//                                        }
//                                    }
//                                },
//                               "aggs": {
//                            		"sport": {
//                            			"terms": {
//                            				"field": "sport"
//                            			}
//                            		}
//                            	}
//                            }
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

        http.post('/es?op=search&index=' + esIndex + '&type=' + esType,
        queryMgr.getBucketQueryJson(esProperty),
//        {
//            "size" : 0,
//            "aggs" : {
//                "bucket_agg" : {
//                    "terms" : {
//                        "field" : esProperty,
//                        "size" : settings.get('es.ui.bucketsGrid.size')
//                    }
//                }
//            }
//        },
        function(res){
            res = JSON.parse(res);
            //console.log(JSON.stringify(res));
            if(res && res.aggregations && res.aggregations.bucket_agg && res.aggregations.bucket_agg.buckets){
                var buckets = res.aggregations.bucket_agg.buckets;

                grid.getStore().loadData(buckets);


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

                    var query = queryMgr.getBucketQueryJson(column.dataIndex);

//                    if(!query.aggs || !query.aggs.bucket_agg || !query.aggs.bucket_agg.terms){
//                        console.error('Invalid bucket query!');
//                        return;
//                    }

//                    query.aggs.bucket_agg.terms['order'] = {};
//                    query.aggs.bucket_agg.terms['order'][column.dataIndex] = direction;
                    query['order'] = {};
                    query['order'][column.dataIndex] = direction;

                    queryMgr.setBucketQueryJson(column.dataIndex,query);

                    this.update();
//
//                    query.sort = {};
//                    query.sort[column.dataIndex] = {"order": direction.toLowerCase()};
//
//                    queryMgr.setActiveQueryJson(query);
//
//                    this.update();
                }
            }
        }

});


