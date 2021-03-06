

var jsTypesHandlers = {
    'BlockStatement' : function(treeNode,jsonNode){
        if(jsonNode.body){
            addJsTreeViewNode(treeNode,jsonNode.body);
        }
    },

    'ExpressionStatement' : function(treeNode,jsonNode){
        if(jsonNode.expression){
            addJsTreeViewNode(treeNode,jsonNode.expression);
        }
    },
    'FunctionDeclaration' : function(treeNode,jsonNode){
        if(jsonNode.id && jsonNode.id.name){
            var treeObj = {
                "name" : jsonNode.id.name,
                "type" : 'FunctionDeclaration',
                "value" : '...',
                "leaf" : false,
                "iconCls" : 'icon-function',
                "range" : jsonNode.range
            };

            if(jsonNode.params && jsonNode.params.length){
                var args = "(";
                for(var i = 0; i < jsonNode.params.length;i++){
                    if(jsonNode.params[i].type === 'Identifier'){
                        args += jsonNode.params[i].name + ",";
                    }
                    else if(jsonNode.params[i].type === 'Literal'){
                        args += jsonNode.params[i].value + ",";
                    }
                }
                args = args.substr(0,args.length - 1) + ")";
                treeObj.name += args;
            }

            var childTreeNode = treeNode.appendChild(treeObj);
            addJsTreeViewNode(childTreeNode,jsonNode.body);
        }
    },
    'FunctionExpression' : function(treeNode,jsonNode){
        var funcName = 'function';
        if(jsonNode.id && jsonNode.id.name){
            funcName = jsonNode.id.name;
        }

        var treeObj = {
            "name" : funcName,
            "type" : 'FunctionDeclaration',
            "value" : '...',
            "leaf" : false,
            "iconCls" : 'icon-function',
            "range" : jsonNode.range
        };
        var childTreeNode = treeNode.appendChild(treeObj);
        addJsTreeViewNode(childTreeNode,jsonNode.body);
    },

    'Program' : function(treeNode,jsonNode){
        addJsTreeViewNode(treeNode,jsonNode.body);
    },
    'Property' : function(treeNode,jsonNode){
        if(!jsonNode.key){
            return;
        }

        var treeObj = {
            "name" : jsonNode.key.value || jsonNode.key.name,
            "type" : jsonNode.key.type,
            "value" : jsonNode.value.value || '...',
            "leaf" : false,
            "iconCls" : 'icon-jsonValue',
            "range" : jsonNode.range
        };

        var childTreeNode = treeNode.appendChild(treeObj);
        if(jsonNode.value){
            addJsTreeViewNode(childTreeNode,jsonNode.value);
        }
    },

//    'Identifier' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },

//    'Literal' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },

    'VariableDeclarator' : function(treeNode,jsonNode){
        addJsTreeViewNode(treeNode,jsonNode);
    },

    'CallExpression' : function(treeNode,jsonNode){

        var name = "";

        if(jsonNode.callee){

            if(jsonNode.callee.name){
                name = jsonNode.callee.name;
            }
            else if(jsonNode.callee.object){
                name = jsonNode.callee.object.name;

                if(jsonNode.callee.property){
                    name += "." + jsonNode.callee.property.name;
                }
            }

            var treeObj = {
                "name" : name,
                "type" : 'CallExpression',
                "value" : '...',
                "leaf" : false,
                "iconCls" : 'icon-action',
                "range" : jsonNode.range
            };

            var complexArgs = [];
            if(jsonNode.arguments && jsonNode.arguments.length){
                var args = "(";
                for(var i = 0; i < jsonNode.arguments.length;i++){
                    if(jsonNode.arguments[i].type === 'Identifier'){
                        args += jsonNode.arguments[i].name + ",";
                    }
                    else if(jsonNode.arguments[i].type === 'Literal'){
                        args += jsonNode.arguments[i].value + ",";
                    }
                    else if(jsonNode.arguments[i].type === 'ObjectExpression'){
                        args += "...,";
                        complexArgs.push(jsonNode.arguments[i]);
                        //addJsTreeViewNode(treeObj,jsonNode.arguments[i]);
                    }
                }
                args = args.substr(0,args.length - 1) + ")";
                treeObj.name += args;
            }

            var childTreeNode = treeNode.appendChild(treeObj);
            for(var i = 0; i < complexArgs.length;i++){
                addJsTreeViewNode(childTreeNode,complexArgs[i]);
            }
            //addJsTreeViewNode(childTreeNode,jsonNode.callee);
        }
    },

//    'MemberExpression' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },

    'ObjectExpression' : function(treeNode,jsonNode){
        if(jsonNode.properties){
            addJsTreeViewNode(treeNode,jsonNode.properties);
        }
    },

    'VariableDeclaration' : function(treeNode,jsonNode){
        var decls = jsonNode.declarations;
        for(var i = 0; i < decls.length;i++){
            var decl = decls[i];
            if(decl.type === 'VariableDeclarator'){
                var treeObj = {
                    "name" : decl.id.name,
                    "type" : 'VariableDeclaration',
                    "value" : '...',
                    "leaf" : false,
                    "iconCls" : 'icon-jsonValue',
                    "range" : jsonNode.range
                };

                var childTreeNode = treeNode.appendChild(treeObj);

                if(decl.init){
                    addJsTreeViewNode(childTreeNode,decl.init);
                }
            }
        }
    }
//    'AssignmentExpression' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'AssignmentPattern' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'ArrayExpression' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'ArrayPattern' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'ArrowFunctionExpression' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },

//    'BinaryExpression' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'BreakStatement' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },

//    'CatchClause' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'ClassBody' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'ClassDeclaration' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'ClassExpression' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'ConditionalExpression' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'ContinueStatement' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'DoWhileStatement' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'DebuggerStatement' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'EmptyStatement' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },

//    'ForStatement' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'ForInStatement' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },


//    'IfStatement' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },

//    'LabeledStatement' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'LogicalExpression' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },

//    'MethodDefinition' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'NewExpression' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },






//    'ObjectPattern' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//     },

//    'RestElement' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'ReturnStatement' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'SequenceExpression' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'SpreadElement' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'SwitchStatement' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'SwitchCase' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'ThisExpression' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'ThrowStatement' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'TryStatement' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'UnaryExpression' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'UpdateExpression' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },


//    'WhileStatement' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    },
//    'WithStatement' : function(treeNode,jsonNode){
//        addJsTreeViewNode(treeNode,jsonNode);
//    }
};

function addJsTreeViewNode(treeNode,jsonNode){

//    console.log("addJsTreeViewNode type: " + jsonNode.type + " json: " + JSON.stringify(jsonNode));

    var nodeType = Object.prototype.toString.call(jsonNode);

    if(nodeType === "[object Object]"){
        if(jsonNode.type && jsTypesHandlers[jsonNode.type]){
            console.log('type: ' + jsonNode.type);
            jsTypesHandlers[jsonNode.type](treeNode,jsonNode);
        }
        else{
           // return;
            for(var m in jsonNode){

                if(!jsonNode.hasOwnProperty(m)){
                    continue;
                }



                var t = Object.prototype.toString.call(jsonNode[m]);

                console.log("obj props name: " + m + " val: " + jsonNode[m]);

                if(!jsTypesHandlers[jsonNode.type]){
                    continue;
                }

                var treeObj = {
                    "name" : m,
                    "type" : t,
                    "value" : jsonNode[m],
                    "leaf" : false,
                    "iconCls" : 'icon-jsonValue',
                    "range" : jsonNode.range
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
                addJsTreeViewNode(childTreeNode,jsonNode[m]);
            }
        }
    }
    else if(nodeType === "[object Array]"){
        for(var i = 0; i < jsonNode.length;i++){
            addJsTreeViewNode(treeNode,jsonNode[i]);
        }
    }
}


function jsTreeToJson(treeNode){
    var jsonNode = null;
    var type = treeNode.raw.type;

    console.log(treeNode.raw.name + " - " + type + " : " + treeNode.data.value);

    if(type === "[object Object]"){
        jsonNode = {};
        for(var i = 0; i < treeNode.childNodes.length;i++){

            if(treeNode.childNodes[i].data.leaf){
                jsonNode[treeNode.childNodes[i].data.name] = castJsTreeValue(treeNode.childNodes[i]);
            }
            else{
                jsonNode[treeNode.childNodes[i].data.name] = jsTreeToJson(treeNode.childNodes[i]);
            }
        }
    }
    else if(type === "[object Array]"){
        jsonNode = [];
        for(var i = 0; i < treeNode.childNodes.length;i++){
            if(treeNode.childNodes[i].data.leaf){
                jsonNode[treeNode.childNodes[i].data.name] = castJsTreeValue(treeNode.childNodes[i]);
            }
            else{
                jsonNode[treeNode.childNodes[i].data.name] = jsTreeToJson(treeNode.childNodes[i]);
            }
        }
    }

    return jsonNode;
}

function castJsTreeValue(treeNode){
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


//function addJsProgramToTree(treeNode,jsonNode){
//    if(!jsonNode.type
//        || jsonNode.type !== 'Program'){
//        return;
//    }
//
//    addJsTreeViewNode(treeNode,jsonNode.body);
//
//}

//function addJsFunctionDeclarationToTree(treeNode,jsonNode){
//    if(!jsonNode.type
//        || jsonNode.type !== 'FunctionDeclaration'){
//        return;
//    }
//
//    if(jsonNode.id && jsonNode.id.name){
//        var treeObj = {
//            "name" : jsonNode.id.name,
//            "type" : 'FunctionDeclaration',
//            "value" : '...',
//            "leaf" : true,
//            "iconCls" : 'icon-function'
//        };
//        var childTreeNode = treeNode.appendChild(treeObj);
//
//        addJsTreeViewNode(childTreeNode,jsonNode.body);
//    }
//}

//function addJsFunctionExpressionToTree(treeNode,jsonNode){
//    if(!jsonNode.type
//        || jsonNode.type !== 'FunctionExpression'){
//        return;
//    }
//
//    var funcName = 'function';
//    if(jsonNode.id && jsonNode.id.name){
//        funcName = jsonNode.id.name;
//    }
//
//    var treeObj = {
//        "name" : funcName,
//        "type" : 'FunctionDeclaration',
//        "value" : '...',
//        "leaf" : true,
//        "iconCls" : 'icon-function'
//    };
//    var childTreeNode = treeNode.appendChild(treeObj);
//    addJsTreeViewNode(childTreeNode,jsonNode.body);
//}

//function addJsVariableToTree(treeNode,jsonNode){
//    if(!jsonNode.type
//        || jsonNode.type !== 'VariableDeclaration'){
//        return;
//    }
//
//    var varNames = "";
//
//    var decls = jsonNode.declarations;
//    for(var i = 0; i < decls.length;i++){
//        var decl = decls[i];
//        if(decl.type === 'VariableDeclarator'){
//            //varNames += decl.id.name + ',';
//            var treeObj = {
//                        "name" : decl.id.name,
//                        "type" : 'VariableDeclaration',
//                        "value" : '...',
//                        "leaf" : false,
//                        "iconCls" : 'icon-jsonValue'
//            };
//
//            var childTreeNode = treeNode.appendChild(treeObj);
//
//            if(decl.init){
//                addJsTreeViewNode(childTreeNode,decl.init);
//            }
//        }
//    }
//
////    var varNames = varNames.substring(0,varNames.length - 1);
//
//    if(varNames){
//
//
// //       addJsTreeViewNode(childTreeNode,jsonNode);
//    }
//}

//function addJsObjectExpressionToTree(treeNode,jsonNode){
//    if(!jsonNode.type
//        || jsonNode.type !== 'ObjectExpression'){
//        return;
//    }
//
//    if(!jsonNode.properties){
//        return;
//    }
//
//    addJsTreeViewNode(treeNode,jsonNode.properties);
////    jsonNode.properties.forEach(function(prop){
////
////    });
//}

//function addJsPropertyToTree(treeNode,jsonNode){
//    if(!jsonNode.type
//        || jsonNode.type !== 'Property'){
//        return;
//    }
//
//    if(!jsonNode.key){
//        return;
//    }
//
//    var treeObj = {
//        "name" : jsonNode.key.value,
//        "type" : jsonNode.key.type,
//        "value" : '...',
//        "leaf" : false,
//        "iconCls" : 'icon-jsonValue'
//    };
//
//    var childTreeNode = treeNode.appendChild(treeObj);
//
//    if(jsonNode.value){
//        addJsTreeViewNode(childTreeNode,jsonNode.value);
//    }
//
//
////    jsonNode.properties.forEach(function(prop){
////
////    });
//}

Ext.define('Horny.JsTreeViewAddMenu', {
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
           text: 'String',
           "iconCls" : 'icon-jsonValue',
           handler: function(item){
                console.log(item);

                var selectedNode = this.parentMenu.getSelectedNode(this);

                if(selectedNode.data.leaf){
                    selectedNode = selectedNode.parentNode;
                }

                var newName = "new string";
                if(selectedNode.raw.type === "[object Array]"){
                    newName = selectedNode.childNodes.length;
                }

                selectedNode.appendChild({
                    "name": newName,
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
                console.log(item);

                var selectedNode = this.parentMenu.getSelectedNode(this);


                if(selectedNode.data.leaf){
                    selectedNode = selectedNode.parentNode;
                }

                var newName = "new number";
                if(selectedNode.raw.type === "[object Array]"){
                    newName = selectedNode.childNodes.length;
                }

                selectedNode.appendChild({
                    "name": newName,
                    "type":"[object Number]",
                    "value": 1,
                    "leaf":true,
                    "iconCls" : 'icon-jsonValue'
               });
           }
        },
        {
           text: 'Boolean',
           "iconCls" : 'icon-jsonValue',
           handler: function(item){
                console.log(item);

                var selectedNode = this.parentMenu.getSelectedNode(this);

                if(selectedNode.data.leaf){
                    selectedNode = selectedNode.parentNode;
                }

                var newName = "new boolean";
                if(selectedNode.raw.type === "[object Array]"){
                    newName = selectedNode.childNodes.length;
                }

                selectedNode.appendChild({
                    "name": newName,
                    "type":"[object Boolean]",
                    "value": true,
                    "leaf":true,
                    "iconCls" : 'icon-jsonValue'
               });
           }
        },
        {
           text: 'Object',
           "iconCls" : 'icon-jsonObject',
           handler: function(item){
                console.log(item);

                var selectedNode = this.parentMenu.getSelectedNode(this);

                if(selectedNode.data.leaf){
                    selectedNode = selectedNode.parentNode;
                }

                var newName = "new object";
                if(selectedNode.raw.type === "[object Array]"){
                    newName = selectedNode.childNodes.length;
                }

                selectedNode.appendChild({
                    "name": newName,
                    "type":"[object Object]",
                    "value": "...",
                    "leaf":false,
                    "iconCls" : 'icon-jsonObject'
               });
           }
        },
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

Ext.define('Horny.JsTreeView', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.jsontree',

  //  id: 'jsonTree',
    title: 'JS',
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

        var jsonObj = json;//JSON.parse(json);

        root.raw.type = Object.prototype.toString.call(jsonObj);

        addJsTreeViewNode(root,jsonObj);
    },

    tbar:[
        {
           text: 'Add',
           'iconCls' : 'icon-add',
           menu: Ext.create('Horny.JsTreeViewAddMenu')
        },
        {
            text: 'Save',
            "iconCls" : 'icon-save',
             handler : function(){

                var jsonView = this.up().up();
                var store = jsonView.getStore();
                var json = jsTreeToJson(store.getRootNode(),{});

                console.log("json from tree: " + JSON.stringify(json));

                http.post('/api/json?op=save&path=' + jsonView.filePath,json);
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
                      xtype:'textfield',
                      listeners : {
                        blur: function( that, The, eOpts ){
                            console.log('textfield blur');
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
                                  menu: Ext.create('Horny.JsTreeViewAddMenu')
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


            console.log("on select " + record.data.name + " range: " + JSON.stringify(record.raw.range));

            console.log(record.data.name + " js src: " + this.jsSrc.substring(record.raw.range[0],record.raw.range[1]));

            var jsSrc = Ext.getCmp('jsSrc');

            jsSrc.update("<pre>" + this.jsSrc.substring(record.raw.range[0],record.raw.range[1]) + "</pre>");
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


        }
    }
});