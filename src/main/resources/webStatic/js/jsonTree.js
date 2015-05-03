
function addJsonTreeNode(treeNode,jsonNode){

    var nodeType = Object.prototype.toString.call(jsonNode);

    if(nodeType === "[object Object]"){
        for(var m in jsonNode){
            console.log("obj: " + m + " : " + jsonNode[m]);
            var t = Object.prototype.toString.call(jsonNode[m]);

            var treeObj = {
                              "name" : m,
                              "type" : t,
                              "value" : jsonNode[m],
                              "leaf" : true,
                              "iconCls" : 'icon-jsonValue'
                          };

            if(t === "[object Object]"){
                treeObj.leaf = false;
                treeObj.iconCls = 'icon-jsonObject';
            }
            else if( t === "[object Array]" ){
                treeObj.leaf = false;
                treeObj.iconCls = 'icon-jsonArray';
            }


            var childTreeNode = treeNode.appendChild(treeObj);

            addJsonTreeNode(childTreeNode,jsonNode[m]);
        }
    }
    else if(nodeType === "[object Array]"){
        for(var i = 0; i < jsonNode.length;i++){
            console.log("arr: " + i + " : " + jsonNode[i]);
            var t = Object.prototype.toString.call(jsonNode[i]);

            var treeObj = {
                            "name":i,
                            "type":t,
                            "value":jsonNode[i],
                            "leaf":true,
                            "iconCls" : 'icon-jsonValue'
                          };

            if(t === "[object Object]"){
                treeObj.leaf = false;
                treeObj.iconCls = 'icon-jsonObject';
            }
            else if( t === "[object Array]" ){
                treeObj.leaf = false;
                treeObj.iconCls = 'icon-jsonArray';
            }

            var childTreeNode = treeNode.appendChild(treeObj);
            //var childTreeNode = treeNode.appendChild({"name":i,"type":t,"value":jsonNode[i]});

            addJsonTreeNode(childTreeNode,jsonNode[i]);
        }
    }
//    else{
//        console.log("jsonNode: " + " : " + jsonNode);
//    }

}


function treeToJson(treeNode){
    var jsonNode = null;
    var type = treeNode.raw.type;

    console.log(treeNode.raw.name + " - " + type + " : " + treeNode.data.value);

    if(type === "[object Object]"){
        jsonNode = {};
        for(var i = 0; i < treeNode.childNodes.length;i++){

            if(treeNode.childNodes[i].data.leaf){
                jsonNode[treeNode.childNodes[i].data.name] = castTreeValue(treeNode.childNodes[i]);
            }
            else{
                jsonNode[treeNode.childNodes[i].data.name] = treeToJson(treeNode.childNodes[i]);
            }
        }
    }
    else if(type === "[object Array]"){
        jsonNode = [];
        for(var i = 0; i < treeNode.childNodes.length;i++){
            if(treeNode.childNodes[i].data.leaf){
                jsonNode[treeNode.childNodes[i].data.name] = castTreeValue(treeNode.childNodes[i]);
            }
            else{
                jsonNode[treeNode.childNodes[i].data.name] = treeToJson(treeNode.childNodes[i]);
            }
        }
    }

    return jsonNode;
}

function castTreeValue(treeNode){
    if(treeNode.data.type === "[object Number]"){
        return parseFloat(treeNode.data.value);
    }
    else if(treeNode.data.type === "[object Boolean]"){
        return treeNode.data.value.toLowerCase() === 'true' ? true : false;
    }
    else{
        return treeNode.data.value;
    }
}


Ext.define('Ouroboros.JsonTreeAddMenu', {
    extend: 'Ext.menu.Menu',
    items: [
        {
           text: 'String',
           "iconCls" : 'icon-jsonValue',
           handler: function(item){
                console.log(item);
                var selectedNode = null;

                //conext menu
                if(this.parentMenu
                    && this.parentMenu.parentMenu
                    && this.parentMenu.parentMenu.selectedRecord){
                    selectedNode = this.parentMenu.parentMenu.selectedRecord;
                }
                //toolbar menu
                else{
                    var tree = this.up('treepanel');//.up().up().up();

                    if (tree.getSelectionModel().hasSelection()) {
                        selectedNode = tree.getSelectionModel().getSelection()[0];
                    } else {
                        selectedNode = tree.store.getRootNode();
                    }
                }

                if(selectedNode.data.leaf){
                    selectedNode = selectedNode.parentNode;
                }

                selectedNode.appendChild({
                    "name":"new string",
                    "type":"[object String]",
                    "value": "new string value",
                    "leaf":true,
                    "iconCls" : 'icon-jsonValue'
               });
           }
        },
        {
           text: 'Number',
           "iconCls" : 'icon-jsonValue',
           handler: function(item){

           }
        },
        {
           text: 'Object',
           "iconCls" : 'icon-jsonObject',
           handler: function(item){

           }
        },
        {
           text: 'Array',
           "iconCls" : 'icon-jsonArray',
           handler: function(item){

           }
        }
    ]
});

Ext.define('Ouroboros.JsonTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.jsontree',

  //  id: 'jsonTree',
    title: 'JSON',
    rootVisible: false,

    plugins:[
        Ext.create('Ext.grid.plugin.CellEditing', {
          clicksToEdit:2
        })
      ],

    update : function(json){

                var treeStore = this.getStore();
                var root = treeStore.getRootNode();

                root.removeAll();
                //this.store.removeAll();

                var jsonObj = JSON.parse(json);

                root.raw.type = Object.prototype.toString.call(jsonObj);

                addJsonTreeNode(root,jsonObj);
           },

    tbar:[
        {
           text: 'Add',
           menu: Ext.create('Ouroboros.JsonTreeAddMenu')
        },
        {
            text: 'Save',
             handler : function(){

                var jsonView = this.up().up();

                var store = jsonView.getStore();

                var json = treeToJson(store.getRootNode(),{});

                console.log("json from tree: " + JSON.stringify(json));

                http.post('/api/text?op=save&path=' + jsonView.filePath,json);
                store.sync( );
                //jsonView.show();
             }
        }
    ],


    xtype: 'tree-grid',//'tree-reorder',

    columns: [{
                    xtype: 'treecolumn', //this is so we know which column will show the tree
                    text: 'Name',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'name',
                    editor:{
                      xtype:'textfield'
                    }
                },
                {
                   // xtype: 'treecolumn', //this is so we know which column will show the tree
                    text: 'Type',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'type'
                },
                {
                   // xtype: 'treecolumn', //this is so we know which column will show the tree
                    text: 'Value',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'value',
                    editor:{
                      xtype:'textfield'
                    }
                }

        ],
    initComponent : function(){

        this.store = Ext.create('Ext.data.TreeStore', {
             root: {
                 text: 'Root',
                 name: 'Root',
                 expanded: true
             },
             folderSort: true,
             fields: [
                  {name: 'name',  type: 'string'},
                  {name: 'type',  type: 'string'},
                  {name: 'value',  type: 'string'}
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
                 itemcontextmenu: function(view,record,item,index,e,eOpts){
                     e.stopEvent();

                     var menu = new Ext.menu.Menu({
                          items: [
                              {
                                  text: 'Add',
                                  menu: Ext.create('Ouroboros.JsonTreeAddMenu')
//                                  handler: function(item,e){
//                                     alert("Add");
//                                  }
                              },
                              {text: 'Edit'},
                              {text: 'Delete'}
                          ]
                      });

                      menu.selectedRecord = record;

                      menu.showAt(e.getXY());
                 }
             }
         };

        var treeStore = this.getStore();
        var root = treeStore.getRootNode();

//        http.get("/api/text?path=home/michael/dev/Ouroboros/src/main/resources/webStatic/task1.json",function(res){
//            console.log(res);
//
//            var jsonObj = JSON.parse(res);
//
//            root.raw.type = Object.prototype.toString.call(jsonObj);
//
//            addJsonTreeNode(root,jsonObj);
//            //Object.prototype.toString.call(jsonObj.task.arr)
//
////            filesArr.forEach(function(file){
////                root.appendChild(file);
////            });
//
////            treeStore.sort([
////                {
////                    property : 'text',
////                    direction: 'ASC'
////                }
////            ]);
//        });

//        this.on('itemcontextmenu', function(view, record, item, index, event){
//                         alert(record)
//                         //treePanelCurrentNode = record;
//                         //menu1.showAt(event.getXY());
//                         event.stopEvent();
//                 },this);


         this.callParent(arguments);
    },



    listeners: {

//        itemcontextmenu:{
//            fn: function(view, record, item, index, event){
//                  alert(record)
//                  //treePanelCurrentNode = record;
//                  //menu1.showAt(event.getXY());
//                  event.stopEvent();
//              }
//        },
        //itemclick: function( that, record, item, index, e, eOpts) {
        select : function( that, record, index, eOpts ){

//            var path = "task.json";//record.getPath('text','/').replace('/Root/','');
//
//            if(record.data.leaf === false){
//
//                 http.get("/api/files?op=list&path=" + path,function(res){
//                    console.log(res);
//
//                    record.removeAll();
//                    var filesArr = JSON.parse(res);
//
//                    filesArr.forEach(function(file){
//                        record.appendChild(file);
//                    });
//
//                    record.expand();
//                });
//            }
//            else{
//
//                http.get("/api/text?path=" + path,function(res){
//                    //console.log(res);
//
//                   Ext.getCmp('textView').update("<pre>" + res + "</pre>");
//                });
//
//                 http.get("/api/chargram?path=" + path,function(res){
//                    //console.log(res);
//
//                  //  var ngramsGrid = Ext.getCmp('ngramsGrid').getStore().loadData(JSON.parse(res));
//                 });
//
//                http.get("/api/ngram?path=" + path,function(res){
//                    //console.log(res);
//
//                    var ngramsGrid = Ext.getCmp('ngramsGrid').getStore().loadData(JSON.parse(res));
//                });
//            }



        }
    }
});