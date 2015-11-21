Ext.define('Horny.TextView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.textview',

    autoScroll: true,
    border: true,
    html: '<p>Text Content</p>',

    listeners:{
             render:function(){
                console.log("TextView render");
                 CodeMirror.fromTextArea(document.getElementById("jscode"),{
                     lineNumbers:true,
                     //fullScreen:true,
                     mode:{name:'javascript',globalVars:true}
                 });
             }
          }

//    tbar:[
//            {
//               text: 'Add',
//               'iconCls' : 'icon-add',
//               //menu: Ext.create('Ouroboros.JsonTreeAddMenu')
//            },
//            {
//                text: 'Save',
//                "iconCls" : 'icon-save',
//                 handler : function(){
//
//                    var textView = this.up().up();
//
//                    console.log(textView.body.dom.innerText);
////                    var store = jsonView.getStore();
////                    var json = treeToJson(store.getRootNode(),{});
////
////                    console.log("json from tree: " + JSON.stringify(json));
////
////                    http.post('/api/json?op=save&path=' + jsonView.filePath,json);
////                    store.sync( );
//                    //jsonView.show();
//                 }
//            }
//        ]

});