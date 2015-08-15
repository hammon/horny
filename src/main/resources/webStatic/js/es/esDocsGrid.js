

Ext.define('Horny.EsDocsGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.esdocsgrid',

    id: 'esDocsGrid',

    autoRender: true,
    autoScroll: true,
    layout: 'fit',

    //scroll: false,
    viewConfig: {
        style: { overflow: 'auto', overflowY: 'hidden' }
    },

//    initComponent: function () {
//
//        scroll: false,
//        viewConfig: {
//            style: { overflow: 'auto', overflowY: 'hidden' }
//        },
//
//        this.callParent();
//    },



    update: function(path){
        this.store.removeAll();

        http.post('http://127.0.0.1:9200/' + path + '/_search','{"from":0,"size":100}',function(res){
            console.log(res);

            res = JSON.parse(res);

            var arr = [];

            for(var i = 0; i < res.hits.hits.length;i++){

                console.log('record: ' + JSON.stringify(res.hits.hits[i]));

                var obj = res.hits.hits[i]._source;
                //obj["_id"] = response.hits.hits[i]._id;
                arr.push(obj)
            }

            var esDocsGrid = Ext.getCmp('esDocsGrid');
            esDocsGrid.getStore().loadData(arr);
            esDocsGrid.doLayout();

        });

//        for(var p in props){
//            this.store.add({'name' : p,'value':props[p]});
//        }
    }

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