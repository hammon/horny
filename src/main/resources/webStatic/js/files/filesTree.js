

Ext.define('Horny.FilesTreeAddMenu', {
    extend: 'Ext.menu.Menu',

    getSelectedNode: function(that){
        var selectedNode = null;

            //conext menu
            if(that.parentMenu
                && that.parentMenu.parentMenu
                && that.parentMenu.parentMenu.selectedRecord){
                selectedNode = that.parentMenu.parentMenu.selectedRecord;
            }
            //containercontextmenu
            else if(that.parentMenu
                    && that.parentMenu.selectedRecord){
                selectedNode = that.parentMenu.selectedRecord;
            }
            //toolbar menu
            else{
                var tree = that.up('treepanel');//.up().up().up();

                if (tree.getSelectionModel().hasSelection()) {
                    selectedNode = tree.getSelectionModel().getSelection()[0];
                } else {
                    selectedNode = tree.store.getRootNode();
                }
            }
            return selectedNode;
    },
    items: [
        {
           text: 'Folder',
           "iconCls" : 'icon-folder',
           handler: function(item){
                console.log(item);

                var selectedNode = this.parentMenu.getSelectedNode(this);

                if(selectedNode.data.leaf){
                    selectedNode = selectedNode.parentNode;
                }

                Ext.MessageBox.prompt('New folder', 'Please enter folder name:', function (btn, text){
                    console.log("btn: " + btn + " text: " + text);

                    if(btn === 'ok'){
                        var path = selectedNode.getPath('text','/').replace('/Root/','');

                        if(selectedNode.internalId === 'root'){
                            path = '';
                        }

                        http.get("/api/files?op=mkdir&path=" + path + "&name=" + text,function(res){
                            console.log(res);
                                selectedNode.appendChild({
                                    "text": text,
                                  //  "type":"[object String]",
                                  //  "value": "new string value",
                                    "leaf":false,
                                   // "iconCls" : 'icon-jsonValue'
                               });
                        },
                        function(response, opts){
                            var obj = JSON.parse(response.responseText);
                            Ext.MessageBox.show({
                                       title: 'Error creating folder',
                                       msg: obj.message,
                                       buttons: Ext.MessageBox.OK
                                     //  icon: Ext.get('icons').dom.value
                                   });
                        });
                    }
                });
           }
        },
        {
           text: 'File',
           "iconCls" : 'icon-file',
           handler: function(item){
                console.log(item);

                var selectedNode = this.parentMenu.getSelectedNode(this);

                if(selectedNode.data.leaf){
                    selectedNode = selectedNode.parentNode;
                }
                Ext.MessageBox.prompt('New file', 'Please enter file name:', function (btn, text){
                    console.log("btn: " + btn + " text: " + text);

                    if(btn === 'ok'){
                        var path = selectedNode.getPath('text','/').replace('/Root/','');

                        if(selectedNode.internalId === 'root'){
                            path = '';
                        }

                        http.get("/api/files?op=create&path=" + path + "&name=" + text,function(res){
                            console.log(res);
                                selectedNode.appendChild({
                                    "text": text,
                                  //  "type":"[object String]",
                                  //  "value": "new string value",
                                    "leaf":true,
                                   // "iconCls" : 'icon-jsonValue'
                               });
                        },
                        function(response, opts){
                            var obj = JSON.parse(response.responseText);
                            Ext.MessageBox.show({
                                       title: 'Error creating file',
                                       msg: obj.message,
                                       buttons: Ext.MessageBox.OK
                                     //  icon: Ext.get('icons').dom.value
                                   });
                        });
                    }
                });
//                var newName = "new Json";

//                selectedNode.appendChild({
//                    "text": newName,
//                 //   "type":"[object Number]",
//                    "value": 1,
//                    "leaf":true,
//                 //   "iconCls" : 'icon-jsonValue'
//               });
           }
        }
    ]
});

Ext.define('Horny.FilesTreeToolbar',{
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.filestreetoolbar',

    items: [
        {
           text: 'New',
           "iconCls" : 'icon-add',
           menu: Ext.create('Horny.FilesTreeAddMenu')
        }//,
//        {
//            boxLabel: 'Show hidden',
//            xtype: 'checkbox',
//            listeners: {
//                change: {
//                    fn: function( that, newValue, oldValue, eOpts ) {
//                        console.log('new val: ' + newValue);
//
//                        var tree = that.up().up();
//
//                        var store = tree.getStore();
//
//                        store.filter([
//                            {
//                                filterFn:function(item){
//                                    console.log('item.raw.hidden: ' + item.raw.hidden);
//                                    return item.raw.hidden;
//                                }
//                            }
//                        ]);
//                    }
//                }
//            }
//        }
    ]
});



Ext.define('Horny.FilesTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.filestree',

    id: 'filesTree',
//    layout: 'fit',
//    floatable: false,
//    title: 'Files',
    rootVisible: false,

    tbar:Ext.create('Horny.FilesTreeToolbar'),

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
             },
             listeners:{
                 beforecellcontextmenu: function(vthis, td, cellIndex, record, tr, rowIndex, e, eOpts ){
                     //your menu code here
                    // alert("beforecellcontextmenu");
                 },
                 containerclick: function( that, e, eOpts ){
//                    alert("containerclick");
                 },
                 containercontextmenu: function( that, e, eOpts ){
                    e.stopEvent();
//                     alert("containercontextmenu");
                    var menu = Ext.create('Horny.FilesTreeAddMenu');

                    menu.selectedRecord = that.getTreeStore().getRootNode();

                    menu.showAt(e.getXY());
                 },
                 itemcontextmenu: function(view,record,item,index,e,eOpts){
                     e.stopEvent();

                     var menu = new Ext.menu.Menu({
                          items: [
                              {
                                  text: 'Add',
                                  "iconCls" : 'icon-add',
                                  menu: Ext.create('Horny.FilesTreeAddMenu')
//                                  handler: function(item,e){
//                                     alert("Add");
//                                  }
                              },
                              {
                                text: 'Index',
                                "iconCls" : 'icon-add',
                                handler: function(item,e){
                                    var selectedRecord = this.parentMenu.selectedRecord;
                                    var path = selectedRecord.getPath('text','/').replace('/Root/','');
                                    http.get('/api/files?op=index&path=' + path ,function(res){
                                        console.log(res);
                                   });
                                }
                              },
                        //      {text: 'Edit'},
                              {text: 'Delete',
                              'iconCls' : 'icon-erase',
                              handler: function(item,e){
                                   //alert("Delete");

                                   var selectedRecord = this.parentMenu.selectedRecord;

                                   var path = selectedRecord.getPath('text','/').replace('/Root/','');
//+ "&name=" + text
                                   http.get('/api/files?op=rm&path=' + path ,function(res){
                                       console.log(res);

                                       var store = selectedRecord.store;//.remove(this.parentMenu.selectedRecord);

                                       selectedRecord.remove();

                                       store.sync();

                                   },
                                   function(response, opts){
                                       var obj = JSON.parse(response.responseText);
                                       Ext.MessageBox.show({
                                            title: 'Error deleting',
                                            msg: obj.message,
                                            buttons: Ext.MessageBox.OK
                                            //  icon: Ext.get('icons').dom.value
                                       });
                                   });
                                }
                              }
                          ]
                      });

                      menu.selectedRecord = record;

                      menu.showAt(e.getXY());
                 }
             }
         };

        var treeStore = this.getStore();
        var root = treeStore.getRootNode();

        http.get("/api/files?op=list&path=",function(res){
//            console.log(res);

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

                var itemText = record.data.text;
                var namePartsArr = itemText.split('.');

                var propsView = Ext.getCmp('propsView');
                var jsonView = Ext.getCmp('jsonView');

                var jsTreeView = Ext.getCmp('jsTreeView');

                propsView.tab.hide();
                jsonView.tab.hide();
                jsTreeView.tab.hide();


                http.get("/api/text?escapeHtml=true&path=" + path,function(res){
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




                if(namePartsArr.length > 0){
                    var fileExt = namePartsArr[namePartsArr.length - 1];
                    if( fileExt ){
                        if(fileExt === 'properties'){
                            http.get("/api/props?op=get&path=" + path,function(res){
                                //console.log(res);

                                propsView.propsPath = path;
                                propsView.update(res);
                                propsView.tab.show();
                                propsView.show();
                            });
                        }
                        else if(fileExt === 'json'){
                            http.get('/api/json?path=' + path,function(res){

                                jsonView.filePath = path;
                                jsonView.update(res);
                                jsonView.tab.show();
                                jsonView.show();
                            });
                        }
                        else if(fileExt === 'js'){
                            http.get('/api/text?path=' + path,function(res){

                                console.log('js: ' + res);
                                var ast = esprima.parse(res.replace('"','\"'), {range: true, loc: true});
                                console.log(JSON.stringify(ast));
                                jsTreeView.filePath = path;
                                jsTreeView.update(ast);
                                jsTreeView.tab.show();
                                jsTreeView.show();
                            });
                        }
                    }
                }
            }
        }
    }
});