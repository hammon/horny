
function addStepEditorNode(treeNode,jsonNode){

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
                treeObj.value = "...";
            }
            else if( t === "[object Array]" ){
                treeObj.leaf = false;
                treeObj.iconCls = 'icon-jsonArray';
                treeObj.value = "...";
            }


            var childTreeNode = treeNode.appendChild(treeObj);

            addStepEditorNode(childTreeNode,jsonNode[m]);
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
                treeObj.value = "...";
            }
            else if( t === "[object Array]" ){
                treeObj.leaf = false;
                treeObj.iconCls = 'icon-jsonArray';
                treeObj.value = "...";
            }

            var childTreeNode = treeNode.appendChild(treeObj);
            //var childTreeNode = treeNode.appendChild({"name":i,"type":t,"value":jsonNode[i]});

            addStepEditorNode(childTreeNode,jsonNode[i]);
        }
    }
//    else{
//        console.log("jsonNode: " + " : " + jsonNode);
//    }

}


function editorNodeToJson(treeNode){
    var jsonNode = null;
    var type = treeNode.raw.type;

    console.log('editorNodeToJson: ' + treeNode.raw.name + " - " + type + " : " + treeNode.data.value);

    if(type === "[object String]"){
        jsonNode = treeNode.data.value;
    }
    else if(type === "[object Object]"){
        jsonNode = {};
        for(var i = 0; i < treeNode.childNodes.length;i++){

            if(treeNode.childNodes[i].data.leaf){
                jsonNode[treeNode.childNodes[i].data.name] = castTreeValue(treeNode.childNodes[i]);
            }
            else{
                jsonNode[treeNode.childNodes[i].data.name] = editorNodeToJson(treeNode.childNodes[i]);
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
                jsonNode[treeNode.childNodes[i].data.name] = editorNodeToJson(treeNode.childNodes[i]);
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

function getStepParamContextMenu(selectedRecord){

    console.log('getStepParamContextMenu selectedRecord.data.name: ' + selectedRecord.data.name);

    var menu = Ext.create('Horny.StepEditorAddMenu');

    var actionContext = flowActions['testAction'].context;

    if(actionContext[selectedRecord.data.name]){
        actionContext[selectedRecord.data.name].forEach(function(ctxVal){
            menu.add({text: ctxVal});
        });
    }

//    var arr = flowActions.filter(function(obj){
//        return obj.actionType === item.text;
//    });

//    if(arr.length === 1){
//    }


    return menu;
}

Ext.define('Horny.StepEditorAddMenu', {
    extend: 'Ext.menu.Menu',

    getSelectedNode: function(that){
        var selectedNode = null;

            //conext menu
            if(that.parentMenu
                && that.parentMenu.parentMenu
                && that.parentMenu.parentMenu.selectedRecord){
                selectedNode = that.parentMenu.parentMenu.selectedRecord;
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
           text: 'Array',
           "iconCls" : 'icon-jsonArray',
           handler: function(item){
                console.log(item);

                var selectedNode = this.parentMenu.getSelectedNode(this);

                if(selectedNode.data.leaf){
                    selectedNode = selectedNode.parentNode;
                }

                var newName = "new array";
                if(selectedNode.raw.type === "[object Array]"){
                    newName = selectedNode.childNodes.length;
                }

                selectedNode.appendChild({
                    "name": newName,
                    "type": "[object Array]",
                    "value": "...",
                    "leaf": false,
                    "iconCls" : 'icon-jsonArray'
               });
           }
        }
    ]
});

Ext.define('Horny.StepEditor', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.stepEditor',

    id: 'stepEditor',
//    title: 'JSON',
    rootVisible: false,
    flex: 1,

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

        addStepEditorNode(root,jsonObj);
    },

//    tbar:[
////        {
////           text: 'Add',
////           'iconCls' : 'icon-add',
////           menu: Ext.create('Horny.StepEditorAddMenu')
////        },
//        {
//            text: 'Save',
//            "iconCls" : 'icon-save',
//             handler : function(){
//
//                var jsonView = this.up().up();
//                var store = jsonView.getStore();
//                var json = editorNodeToJson(store.getRootNode(),{});
//
//                console.log("json from tree: " + JSON.stringify(json));
//
//                http.post('/api/json?op=save&path=' + jsonView.filePath,json);
//                store.sync( );
//                //jsonView.show();
//             }
//        }
//    ],


    xtype: 'tree-grid',//'tree-reorder',

    columns: [{
                    xtype: 'treecolumn', //this is so we know which column will show the tree
                    text: 'Name',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'name'
//                    editor:{
//                      xtype:'textfield'
//                    }
                },
                {
                   // xtype: 'treecolumn', //this is so we know which column will show the tree
                    text: 'Type',
                    hidden: true,
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
                        xtype:'textfield',
                        listeners : {
                            blur: function( that, The, eOpts ){
                                console.log('textfield blur');

                                var stepEditor = that.up('stepEditor');
                                var editedRecord = null;

                                if (stepEditor.getSelectionModel().hasSelection()) {
                                  editedRecord = stepEditor.getSelectionModel().getSelection()[0];
                                }

                                if(editedRecord){
                                  console.log('textfield blur editedRecord.raw' + JSON.stringify(editedRecord.raw));
                                }
                                else{
                                    return;
                                }

                                var flowTree = Ext.getCmp('flowTree');
                                var selectedTreeNode = null;

                                if (flowTree.getSelectionModel().hasSelection()) {
                                  selectedTreeNode = flowTree.getSelectionModel().getSelection()[0];
                                }

                                if(selectedTreeNode){
                                //editorNodeToJson(editedRecord);//
                                    selectedTreeNode.raw.params[editedRecord.raw.name] = that.value;
                                    console.log('textfield blur selectedTreeNode.raw' + JSON.stringify(selectedTreeNode.raw));

                                    var flowNode = selectedTreeNode.parentNode;
                                    if(flowNode.raw.type === 'flow'){
                                        saveFlow(flowNode);
                                        stepEditor.getStore().sync();
                                    }
                                    else{
                                        console.error('Unexpected node type ' + flowNode.raw.type);
                                    }
                                }
                            }
                        }
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
                                  "iconCls" : 'icon-add',
                                  menu: getStepParamContextMenu(record)//Ext.create('Horny.StepEditorAddMenu')
//                                  handler: function(item,e){
//                                     alert("Add");
//                                  }
                              },
                        //      {text: 'Edit'},
                              {text: 'Delete',
                              "iconCls" : 'icon-erase',
                              handler: function(item,e){
                                   //alert("Delete");
                                   var store = this.parentMenu.selectedRecord.store;//.remove(this.parentMenu.selectedRecord);

                                   this.parentMenu.selectedRecord.remove(true);

                                   store.sync();
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

//        http.get("/api/text?path=home/michael/dev/Ouroboros/src/main/resources/webStatic/task1.json",function(res){
//            console.log(res);
//
//            var jsonObj = JSON.parse(res);
//
//            root.raw.type = Object.prototype.toString.call(jsonObj);
//
//            addStepEditorNode(root,jsonObj);
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

            console.log('stepEditor select: ' + index);



        }
    }
});