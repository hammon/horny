

Ext.define('Horny.EsMappingTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.esmappingtree',

    id: 'esMappingTree',

    rootVisible: false,

       tbar: [
        {
            text: 'New',
            'iconCls' : 'icon-add',
            handler : function(){
                var esMappingTree = this.up('esmappingtree');
                var store = esMappingTree.getStore();

                Ext.Msg.prompt('Name', 'Please enter new index name:', function(btn, text){
                    if (btn == 'ok'){

                    //Ext.Msg.alert('new index name', text);
                        http.post('/es?op=set&index=' + text + '&type=' + text,'{"str":"hello","number1":1}',function(res){
                            console.log(res);
//                            res = JSON.parse(res);
//                            newRec.id = res.message;
//                            store.insert(0, newRec);
                        });
                    }
                });
            }
        },
        {
            text: 'Delete',
            "iconCls" : 'icon-erase',
            handler : function(){
                var esMappingTree = this.up('esmappingtree');
                var store = esMappingTree.getStore();
                var selectedRecord = null;

                if (esMappingTree.getSelectionModel().hasSelection()) {
                    selectedRecord = esMappingTree.getSelectionModel().getSelection()[0];
                }

                if(selectedRecord){
                    console.log('esMappingTree selectedRecord.raw' + JSON.stringify(selectedRecord.raw));
                    id = selectedRecord.raw.id;
                }
                else{
                    return;
                }

                 http.get("/es?op=delete&index=" + selectedRecord.raw.text,function(res){
                        console.log("es delete res: " + res );

                        store.remove(selectedRecord);
                        //store.sync();
                    },
                    function onError(res,opts){
                        alert("Error on delete: " + JSON.stringify(res));
                    }
                 );
            }
        }
    ],

    initComponent : function(){

        this.store = Ext.create('Ext.data.TreeStore', {
             root: {
                 text: 'Root',
                 expanded: true
             },
             folderSort: true
        });


        var tree = this;
        var treeStore = tree.getStore();
        var root = treeStore.getRootNode();

        //http.get('http://127.0.0.1:9200/_mapping',function(res){
        http.get('es?op=mapping&path=/',function(res){
//            console.log("ES MAPPING: " + res);

            var mapping = JSON.parse(res);

            for(var index in mapping){
                var indexNode = root.appendChild({
                    text: index,
                    type: 'esIndex',
                    leaf: false
                });

                if(mapping[index] && mapping[index]['mappings']){
                    for(var doc in mapping[index]['mappings']){
                        var docNode = indexNode.appendChild({
                            text: doc,
                            type: 'esType',
                            leaf: false
                        });
                    }
                }
            }

            var esIndex = settings.get('es.ui.selectedIndex');
            var esType = settings.get('es.ui.selectedType');

            //var rootNode = this.getStore().getRootNode( );

            if(esIndex){
                var indexRec = root.findChild('text',esIndex);
                tree.getSelectionModel().select(indexRec);
                indexRec.expand();
                if(esType){
                    var typeRec = indexRec.findChild('text',esType);
                    tree.getSelectionModel().select(typeRec);
                    typeRec.expand();
                }
            }

        });

        this.callParent(arguments);
    },

    listeners: {
        //itemclick: function( that, record, item, index, e, eOpts) {
        select : function( that, record, index, eOpts ){

            settings.remove('es.ui.selectedIndex');
            settings.remove('es.ui.selectedType');
            settings.remove('es.ui.selectedProperty');

            if(record.raw.type === 'esIndex'){
                var esIndex = record.raw.text;
                settings.set('es.ui.selectedIndex',esIndex);
            }
            else if(record.raw.type === 'esType'){

                var esIndex = record.parentNode.raw.text;
                var esType = record.raw.text;

                settings.set('es.ui.selectedIndex',esIndex);
                settings.set('es.ui.selectedType',esType);

                var path = esIndex + '/' + esType;

                //http.get('http://127.0.0.1:9200/' + path + '/_mapping',function(res){
                http.get('/es?op=mapping&path=' + path + '/',function(res){
                    console.log(path + ' mapping: ' + res);

                    var mapping = JSON.parse(res);
                    var storeFields =  [{name:'id',type:'string'}];
                    var gridColumns = [{text:'id',dataIndex:'id'}];

                    if(mapping[esIndex]
                        && mapping[esIndex]['mappings']
                        && mapping[esIndex]['mappings'][esType]
                        && mapping[esIndex]['mappings'][esType]['properties']){

                        record.removeAll();

                        var props = mapping[esIndex]['mappings'][esType]['properties'];
                        for(var propName in props){
                            if (props.hasOwnProperty(propName) && props[propName].type){

                                record.appendChild({
                                    text: propName,
                                    type: 'esProperty',
                                    esType: props[propName].type,
                                    leaf: false
                                });

                                var field = {};
                                var column = {
                                    editor: {
                                        //allowBlank: false,
                                        xtype:'textfield',
                                        listeners : {
                                            blur: function( that, The, eOpts ){
                                                console.log('textfield blur');
                                                var id = "";
                                                var column = that.column.text;
                                                var value = that.value;
                                                var typesGrid = that.up('estypesgrid');
                                                var editedRecord = null;

                                                if (typesGrid.getSelectionModel().hasSelection()) {
                                                    editedRecord = typesGrid.getSelectionModel().getSelection()[0];
                                                }

                                                if(editedRecord){
                                                    console.log('textfield blur editedRecord.raw' + JSON.stringify(editedRecord.raw));
                                                    id = editedRecord.raw.id;
                                                }
                                                else{
                                                    return;
                                                }

                                                http.get("/es?op=update&index=" + typesGrid.esIndex + "&type=" + typesGrid.esType + "&id=" + id + "&column=" + column + "&value=" + value,function(res){
                                                    console.log("es update res: " + res );
                                                    //typesGrid.getStore().sync();
                                                    //typesGrid.getStore().getAt(editedRecord.index).commit();
                                                    typesGrid.getStore().getById(editedRecord.internalId).commit();
                                                });
                                            }
                                        }
                                    }
                                };

                                if(props[propName].type.toLowerCase() === "double" || props[propName].type.toLowerCase() === "long"){
                                    field.type = "number";
                                }
                                else if(props[propName].type.toLowerCase() === "date"){
                                    field.type = "string";
                                }
                                else{
                                    field.type = props[propName].type;
                                }

                                field.name = propName;
                                storeFields.push(field);

                                column.text = propName;
                                column.dataIndex = propName;
                                //column.hidden = !columnChecks[columnChecks.props(function(e) { return e.text; }).indexOf(column.text)].checked || false;
                                gridColumns.push(column);
                            }
                        }

                        var typeGridStore = Ext.create('Ext.data.JsonStore', {
                            fields: storeFields
                        });

                        var esCenter = Ext.getCmp('esCenterTabs');
                        var esTypesGrid = Ext.getCmp('esTypesGrid');

                        if(esTypesGrid){
                            esCenter.remove(esTypesGrid.id,true);
                        }

                        var esTypesGrid = Ext.create('Horny.EsTypesGrid',{
                            //region: 'center',
                            title : "Docs",
                            //flex: 2,
                            store: typeGridStore,
                            columns: gridColumns
                        });

                        //for create new record
                        esTypesGrid['mapping'] = props;
                        esTypesGrid['esIndex'] = esIndex;
                        esTypesGrid['esType'] = esType;

//                        esTypesGrid.update(path);

                        esCenter.add(esTypesGrid);

                        esCenter.setActiveTab(esTypesGrid);

                        esTypesGrid.update();

                        esTypesGrid.doLayout();
                    }
                });
            }
            else if(record.raw.type === 'esProperty'){

                var esProperty = record.raw.text;
                var esType = record.parentNode.raw.text;
                var esIndex = record.parentNode.parentNode.raw.text;

                settings.set('es.ui.selectedIndex',esIndex);
                settings.set('es.ui.selectedType',esType);
                settings.set('es.ui.selectedProperty',esProperty);

                Ext.getCmp('bucketsGrid').update();

//                http.post('/es?op=search&index=' + esIndex + '&type=' + esType,{
//                    "size" : 0,
//                    "aggs" : {
//                        "bucket_agg" : {
//                            "terms" : {
//                                "field" : esProperty,
//                                "size" : 0
//                            }
//                        }
//                    }
//                },function(res){
//                    res = JSON.parse(res);
//                    //console.log(JSON.stringify(res));
//                   if(res && res.aggregations && res.aggregations.bucket_agg && res.aggregations.bucket_agg.buckets){
//                        var buckets = res.aggregations.bucket_agg.buckets;
//
//                        var ngramsGrid = Ext.getCmp('bucketsGrid').getStore().loadData(buckets);
//
//
//                        var esCenter = Ext.getCmp('esCenterTabs');
//                        var esBarChart = Ext.getCmp('esBarChart');
//
//                        if(esBarChart){
//                            esCenter.remove('esBarChart',true);
//                        }
//
//                        esBarChart = createEsBarChart();
//
//                        esCenter.add(esBarChart);
//
//                        esCenter.setActiveTab(esBarChart);
//
//                        esBarChart.updateLayout();
//
//                   }
//                });
            }
        },

        viewready: function( that, eOpts ){
//            var esIndex = settings.get('es.ui.selectedIndex');
//            var esType = settings.get('es.ui.selectedType');
//
//            var rootNode = this.getStore().getRootNode( );
//
//            if(esIndex){
//                var indexRec = rootNode.findChild('text',esIndex);
//                this.getSelectionModel().select(indexRec);
//                if(esType){
//                    var typeRec = indexRec.findChild('text',esType);
//                    this.getSelectionModel().select(indexRec);
//                }
//            }
        }
    }
});