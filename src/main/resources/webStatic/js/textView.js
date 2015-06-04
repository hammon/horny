Ext.define('Ouroboros.TextView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.textview',

    autoScroll: true,
    border: true,
    html: '<p>Text Content</p>',

    tbar:[
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
        ]

});