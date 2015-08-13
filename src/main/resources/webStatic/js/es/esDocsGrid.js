

Ext.define('Horny.EsDocsGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.esdocsgrid',

    id: 'esDocsGrid',

    autoRender: true,
    autoScroll: true,
    layout: 'fit'

//    initComponent : function(){
//        this.store = Ext.create('Ext.data.JsonStore', {
//            sortInfo: { field: "count", direction: "DESC" },
//            //autoLoad: true,
//            //autoSync: true,
//            fields: [
//                 {name: 'str',  type: 'string'},
//                 {name: 'count',   type: 'int'}
//            ]//,
//           // data: [{str:'',count:0}]
//        });
//        this.callParent(arguments);
//    }

});