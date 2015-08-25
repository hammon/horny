

Ext.define('Horny.EsMappingTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.esmappingtree',

    id: 'esMappingTree',

    rootVisible: false,

    initComponent : function(){

        this.store = Ext.create('Ext.data.TreeStore', {
             root: {
                 text: 'Root',
                 expanded: true
             },
             folderSort: true
        });



        var treeStore = this.getStore();
        var root = treeStore.getRootNode();

        //http.get('http://127.0.0.1:9200/_mapping',function(res){
        http.get('es?op=mapping&path=/',function(res){
            console.log("ES MAPPING: " + res);

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
                            type: 'esDoc',
                            leaf: false
                        });
                    }
                }
            }
        });

        this.callParent(arguments);
    },

    listeners: {
        //itemclick: function( that, record, item, index, e, eOpts) {
        select : function( that, record, index, eOpts ){

            if(record.raw.type === 'esDoc'){

                var esIndex = record.parentNode.raw.text;
                var esDoc = record.raw.text;

                var path = esIndex + '/' + esDoc;

                //http.get('http://127.0.0.1:9200/' + path + '/_mapping',function(res){
                http.get('/es?op=mapping&path=' + path + '/',function(res){
                    console.log(path + ' mapping: ' + res);

                    var mapping = JSON.parse(res);
                    var storeFields =  [{name:'id',type:'string'}];
                    var gridColumns = [{text:'id',dataIndex:'id'}];

                    if(mapping[esIndex]
                        && mapping[esIndex]['mappings']
                        && mapping[esIndex]['mappings'][esDoc]
                        && mapping[esIndex]['mappings'][esDoc]['properties']){

                        var props = mapping[esIndex]['mappings'][esDoc]['properties'];
                        for(var propName in props){
                            if (props.hasOwnProperty(propName) && props[propName].type){
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
                                                var docsGrid = that.up('esdocsgrid');
                                                var editedRecord = null;

                                                if (docsGrid.getSelectionModel().hasSelection()) {
                                                    editedRecord = docsGrid.getSelectionModel().getSelection()[0];
                                                }

                                                if(editedRecord){
                                                    console.log('textfield blur editedRecord.raw' + JSON.stringify(editedRecord.raw));
                                                    id = editedRecord.raw.id;
                                                }
                                                else{
                                                    return;
                                                }

                                                http.get("/es?op=update&index=" + docsGrid.esIndex + "&type=" + docsGrid.esType + "&id=" + id + "&column=" + column + "&value=" + value,function(res){
                                                    console.log("es update res: " + res );
                                                    //docsGrid.getStore().sync();
                                                    docsGrid.getStore().getAt(editedRecord.index).commit();
                                                });

//                                                var mappingTree = Ext.getCmp('esMappingTree');
//                                                var selectedTreeNode = null;
//
//                                                if (mappingTree.getSelectionModel().hasSelection()) {
//                                                    selectedTreeNode = mappingTree.getSelectionModel().getSelection()[0];
//                                                }
//
//                                                if(selectedTreeNode){
//                                                    if(selectedTreeNode.raw.type !== 'esDoc'){
//                                                        console.log('Unexpected selectedTreeNode type: ' + selectedTreeNode.raw.type);
//                                                        return;
//                                                    }
//
//                                                    var esType = selectedTreeNode.raw.text;
//                                                    var esIndex = selectedTreeNode.parentNode.raw.text;
//
//                                                    console.log("index: " + esIndex + " type: " + esType + " id: " + id + " column: " + column + " value: " + value);
//
//                                                    http.get("/es?op=update&index=" + esIndex + "&type=" + esType + "&id=" + id + "&column=" + column + "&value=" + value,function(res){
//                                                        console.log("es update res: " + res );
//                                                        //docsGrid.getStore().sync();
//                                                        docsGrid.getStore().getAt(editedRecord.index).commit();
//                                                    });
//                                                }
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

                        var docGridStore = Ext.create('Ext.data.JsonStore', {
                            fields: storeFields
                        });

                        var parentPanel = Ext.getCmp('esMappingTree').up();
                        var esDocsGrid = Ext.getCmp('esDocsGrid');

                        if(esDocsGrid){
                            parentPanel.remove(esDocsGrid.id,true);
                        }

                        var esDocsGrid = Ext.create('Horny.EsDocsGrid',{
                            region: 'east',
                            title : "Docs",
                            flex: 1,
                            store: docGridStore,
                            columns: gridColumns
                        });

                        //for create new record
                        esDocsGrid['mapping'] = props;
                        esDocsGrid['esIndex'] = esIndex;
                        esDocsGrid['esType'] = esDoc;

                        esDocsGrid.update(path);

                        parentPanel.add(esDocsGrid);

                        esDocsGrid.update(path);

                        esDocsGrid.doLayout();
                    }
                });
            }
        }
    }
});