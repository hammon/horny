Ext.define('Ouroboros.FilesTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.filestree',

    id: 'filesTree',
    title: 'Files',
    rootVisible: false,

//    requires: [
//            'Ext.data.*',
//            'Ext.grid.*',
//            'Ext.tree.*',
//            'Ext.ux.CheckColumn'
//
//        ],

    xtype: 'tree-grid',//'tree-reorder',

    columns: [{
                    xtype: 'treecolumn', //this is so we know which column will show the tree
                    text: 'Name',
                    flex: 2,
                    sortable: true,
                    dataIndex: 'text'
                },
                {
                   // xtype: 'treecolumn', //this is so we know which column will show the tree
                    text: 'Size',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'length'
                },
                {
                    xtype: 'datecolumn',
                    format: 'Y-m-d H:i:s',
                    text: 'lastModified',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'lastModified'
                },
                {
                    xtype: 'checkcolumn',
                    header: 'selected',
                    dataIndex: 'selected',
                    width: 55,
                    stopSelection: false,
                    menuDisabled: true,
                    listeners: {
                        checkchange: function( that, rowIndex, checked, eOpts ) {
                            //Ext.Msg.alert('Editing' + (record.get('selected') ? ' completed task' : '') , record.get('text'));
                            console.log("checkchange" + rowIndex + " checked " + checked);

                            var arrSelected = [];

                            var findSelected = function(node){
                                node.eachChild(function(n){
                                    //console.log(n.data.text + " " + n.data.selected);
                                    if(n.data['selected'] == true){
                                        console.log(">>>> " + n.data.text + " " + n.data.selected);
                                        arrSelected.push(n.getPath('text'));
                                    }
                                });

                                if(node.childNodes.length > 0){
                                    node.eachChild(findSelected);
                                }
                            }

                           findSelected( that.up().up().getStore().getRootNode());

                           console.log("arrSelected: " + JSON.stringify(arrSelected));

                        }
                    }
                }
                ],
    initComponent : function(){



        this.store = Ext.create('Ext.data.TreeStore', {
             root: {
                 text: 'Root',
                 expanded: true
             },
             folderSort: true,
             fields: [
                  {name: 'text',  type: 'string'},
                  {name: 'lastModified',  type: 'date', format: 'Y-m-d H:i:s' },
                  {name: 'length',   type: 'int'},
                  {name: 'selected',   type: 'boolean'}
             ]
                             //, lastModified
//             sorters: [{
//                 property: 'text',
//                 direction: 'ASC'
//             }]
         });

         this.viewConfig = {
             plugins: {
                 ptype: 'treeviewdragdrop',
                 containerScroll: true
             }
         };

        var treeStore = this.getStore();
        var root = treeStore.getRootNode();

        http.get("/api/files?op=list&path=",function(res){
            console.log(res);

            var filesArr = JSON.parse(res);

            filesArr.forEach(function(file){
                root.appendChild(file);
            });

            treeStore.sort([
                {
                    property : 'text',
                    direction: 'ASC'
                }
            ]);
        });


         this.callParent(arguments);
    },



    listeners: {
        //itemclick: function( that, record, item, index, e, eOpts) {
        select : function( that, record, index, eOpts ){

            var path = record.getPath('text','/').replace('/Root/','');

            if(record.data.leaf === false){

                 http.get("/api/files?op=list&path=" + path,function(res){
                    console.log(res);

                    record.removeAll();
                    var filesArr = JSON.parse(res);

                    filesArr.forEach(function(file){
                        record.appendChild(file);
                    });

                    record.expand();
                });
            }
            else{

                http.get("/api/text?path=" + path,function(res){
                    //console.log(res);

                   Ext.getCmp('textView').update("<pre>" + res + "</pre>");
                });

                 http.get("/api/chargram?path=" + path,function(res){
                    //console.log(res);

                  //  var ngramsGrid = Ext.getCmp('ngramsGrid').getStore().loadData(JSON.parse(res));
                 });

                http.get("/api/ngram?path=" + path,function(res){
                    //console.log(res);

                    var ngramsGrid = Ext.getCmp('ngramsGrid').getStore().loadData(JSON.parse(res));
                });

                var itemText = record.data.text;
                var namePartsArr = itemText.split('.');
                if(namePartsArr.length > 0){
                    var fileExt = namePartsArr[namePartsArr.length - 1];
                    if( fileExt ){
                        if(fileExt === 'properties'){
                            http.get("/api/props?op=get&path=" + path,function(res){
                                //console.log(res);

                                var propsView = Ext.getCmp('propsView');
                                propsView.propsPath = path;
                                propsView.update(res);
                            });
                        }
                        else if(fileExt === 'json'){
                            http.get('/api/text?path=' + path,function(res){
                                var jsonView = Ext.getCmp('jsonView');
                                jsonView.update(res);
                            });
                        }
                    }
                }
            }
        }
    }
});