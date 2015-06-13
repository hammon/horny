

Ext.define('Horny.FlowTreeAddMenu', {
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
           text: 'Flow',
           "iconCls" : 'icon-file',
           handler: function(item){
                console.log(item);

                var selectedNode = this.parentMenu.getSelectedNode(this);

                if(selectedNode.data.leaf){
                    selectedNode = selectedNode.parentNode;
                }
                Ext.MessageBox.prompt('New flow', 'Please enter flow name:', function (btn, text){
                    console.log("btn: " + btn + " text: " + text);

                    if(btn === 'ok'){
                        var path = selectedNode.getPath('text','/').replace('/Root/','');

                        if(selectedNode.internalId === 'root'){
                            path = '';
                        }

                        http.get("/flow?op=create&path=" + path + "&name=" + text,function(res){
                            console.log(res);
                                selectedNode.appendChild({
                                    "text": text,
                                    "type":'flow',
                                  //  "value": "new string value",
                                  //  "leaf":true,
                                    "iconCls" : 'icon-flow'
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

Ext.define('Horny.FlowTreeToolbar',{
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.filestreetoolbar',

    items: [
        {
           text: 'New',
           "iconCls" : 'icon-add',
           menu: Ext.create('Horny.FlowTreeAddMenu')
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

function saveFlow(flowRecord){
    if(flowRecord.raw.type !== 'flow'){
        return;
    }

    var flowObj = flowRecord.raw;
    delete flowObj.iconCls;

    var steps = [];

    flowObj.steps = steps;

    for(var i = 0; i < flowRecord.childNodes.length;i++){
        var action = flowRecord.childNodes[i].raw;
        delete action.iconCls;
        steps.push(flowRecord.childNodes[i].raw);
    }

    console.log('flowObj: ' + JSON.stringify(flowObj));

    http.post('/api/json?op=save&path=' + flowObj.path,JSON.stringify(flowObj));
}

Ext.define('Horny.FlowTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.filestree',

    id: 'flowTree',
//    title: 'Files',
    rootVisible: false,

    tbar:Ext.create('Horny.FlowTreeToolbar'),

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
                drop: function (node, data, overModel, dropPosition) {
                      console.log('drop');
                },
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
                    var menu = Ext.create('Horny.FlowTreeAddMenu');

                    menu.selectedRecord = that.getTreeStore().getRootNode();

                    menu.showAt(e.getXY());
                 },
                 itemcontextmenu: function(view,record,item,index,e,eOpts){
                     e.stopEvent();

                     var menu = null;

                     if(record.raw.type === 'directory'){
                            menu = new Ext.menu.Menu({
                            items: [
                               {
                                   text: 'Add',
                                   "iconCls" : 'icon-add',
                                   menu: Ext.create('Horny.FlowTreeAddMenu')
 //                                  handler: function(item,e){
 //                                     alert("Add");
 //                                  }
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
                     }
                     else if(record.raw.type === 'flow'){
                        menu = new Ext.menu.Menu();

                        flowActions.forEach(function(act){
                            menu.add({
                               text: act.actionType,
                               handler: function(item,e){
                                    console.log(item.text);
                                    var arr = flowActions.filter(function(obj){
                                        return obj.actionType === item.text;
                                    });

                                    if(arr.length === 1){
                                        var actNode = arr[0];
                                        actNode.text = actNode.actionType;
                                        actNode.iconCls = 'icon-action';
                                        console.log(actNode);
                                        record.appendChild(actNode);
                                        saveFlow(record);
                                    }
                               }
                             });
                        });

                     }
                     else{
                        return;
                     }

                      menu.selectedRecord = record;

                      menu.showAt(e.getXY());
                 }
             }
         };

        var treeStore = this.getStore();
        var root = treeStore.getRootNode();

        http.get('/flow?op=list&path=',function(res){
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

            var spliview = this.up('splitview');

            var stepEditor = Ext.getCmp('stepEditor');
            if(stepEditor){
                spliview.remove(stepEditor,true);
            }

            if(record.raw.type === 'directory'){

                 http.get("/flow?op=list&path=" + path,function(res){
                    console.log(res);

                    record.removeAll();
                    var filesArr = JSON.parse(res);

                    filesArr.forEach(function(file){
                        record.appendChild(file);
                    });

                    record.expand();
                });
            }
            else if(record.raw.type === 'flow'){

                http.get('/api/json?path=' + path + '.json',function(res){
                    console.log('flow: ' + res);
                    var action = JSON.parse(res);
                    var steps = action.steps;
                    record.removeAll();
                    steps.forEach(function(step){

                        step.text = step.actionType;
                        step.iconCls = 'icon-action';

                        record.appendChild(step);
                        record.expand();

                    });
                });
            }
            else if(record.raw.type === 'action'){

                stepEditor = Ext.create('Horny.StepEditor',{
                    region:'east',
                    //minWidth: 150,
                });

                stepEditor.update(JSON.stringify(record.raw.params));
                spliview.add(stepEditor);
                spliview.doLayout();

                var i = 0;



            }
        }
    }
});