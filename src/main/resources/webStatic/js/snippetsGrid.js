
Ext.define('Ouroboros.SnippetsGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.snippetsgrid',

    autoRender: true,
    autoScroll: true,
    layout: 'fit',

    columns: [
        {text: "Snippet", dataIndex: 'snippet',flex: 1, sortable: true}
    ],

    initComponent : function(){
        this.store = Ext.create('Ext.data.JsonStore', {
           // autoLoad: true,
            autoSync: true,
            fields: [
                         {name: 'snippet',  type: 'string'}
                    ]
            //data: arrData
        });
        this.callParent(arguments);
    }

});

function scrollToTextSelection(e){
	console.log(e.currentTarget.innerText);
	location.hash = e.currentTarget.attributes["id"].value.replace("snip","");
	//trackEvent("snippetsGrid.scrollToTextSelection",e.currentTarget.innerText);
}