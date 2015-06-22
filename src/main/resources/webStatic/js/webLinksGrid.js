
Ext.define('Horny.WebLinksGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.weblinksgrid',

    autoRender: true,
    autoScroll: true,
    layout: 'fit',

    columns: [
        {text: "Text", dataIndex: 'text',flex: 1, sortable: true},
        {text: "Url", dataIndex: 'url',flex: 1, sortable: true}
    ],

    initComponent : function(){
        this.store = Ext.create('Ext.data.JsonStore', {
           // autoLoad: true,
            autoSync: true,
            fields: [
                         {name: 'text',  type: 'string'},
                         {name: 'url',  type: 'string'}
                    ]
            //data: arrData
        });

        this.callParent(arguments);
    }

    update : function(links){
        var props = JSON.parse(links);

        this.store.removeAll();

        for(var links in props){
            this.store.add({'name' : p,'value':props[p]});
        }
    }

});

