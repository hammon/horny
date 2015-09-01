
Ext.define('Horny.QueryView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.queryview',

    title: 'Query',
    border: true,
    layout      : 'fit',
    //html: '<p>Text Content</p>',

    items: [
        {
            id: 'esTxtQuery',
            xtype : 'textareafield',
            name  : 'query',
            autoScroll: true,
            value: '{}'
           //flex: 1,
           //border: 0,
           //style : { border: 0 },
           //lid: 'ietextarea'
        }
    ],

    tbar: [
         {
             text: 'Run >>',
             //'iconCls' : 'icon-add',
             handler : function(){
                 //var esMappingTree = this.up('esmappingtree');
                 //var store = esMappingTree.getStore();
                 var queryView = Ext.getCmp('esTxtQuery');
                 var text = queryView.getValue();

                 console.log(text);

                 http.post('/es?op=search&index=horny&type=web1gram',JSON.parse(text),function(res){
                    console.log(res);
                 });
             }
         }
    ]

});