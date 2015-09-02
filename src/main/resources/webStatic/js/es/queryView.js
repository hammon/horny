
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
            value: '{"size":10,"filter":{"range":{"count":{"gt": 150, "lte": 300}}}}'
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

                 var esIndex = settings.get('es.ui.selectedIndex');
                 var esType = settings.get('es.ui.selectedType');

                 if(!esIndex || !esType){
                    console.error('Index or Type selection missing !!!');
                    return;
                 }

                 http.post('/es?op=search&index=' + esIndex + '&type=' + esType,JSON.parse(text),function(res){
                    console.log(res);

                    var esTypesGrid = Ext.getCmp('esTypesGrid');
                    if(!esTypesGrid){
                        console.error('esTypesGrid not found !!!');
                        return;
                    }

                    esTypesGrid.loadData(JSON.parse(res));

                 });
             }
         }
    ]

});