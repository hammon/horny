

Ext.define('Horny.FbFeedGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.fbfeedgrid',

    title: 'Feed',

    id: 'fbFeedGrid',

    autoRender: true,
    autoScroll: true,
    layout: 'fit',

/*123685654441395?fields=feed{
id,
name,
link,
message,
shares,
story,
description,
status_type,
caption,
created_time,
type,
from}
*/
    columns: [
        {
            text: 'id',
            flex: 1,
            sortable: true,
            dataIndex: 'id',
            hidden: true
        },
        {
            text: 'Name',
            flex: 1,
            sortable: true,
            dataIndex: 'name'
        },
        {
            text: 'link',
            flex: 1,
            sortable: true,
            dataIndex: 'link',
            hidden: true
        },
        {
            text: 'message',
            flex: 1,
            sortable: true,
            dataIndex: 'message'
        },
        {
            text: 'shares',
            flex: 1,
            sortable: true,
            dataIndex: 'shares'
        },
        {
            text: 'story',
            flex: 1,
            sortable: true,
            dataIndex: 'story'
        },
        {
            text: 'description',
            flex: 1,
            sortable: true,
            dataIndex: 'description'
        },
        {
            text: 'status_type',
            flex: 1,
            sortable: true,
            dataIndex: 'status_type'
        },
        {
            text: 'caption',
            flex: 1,
            sortable: true,
            dataIndex: 'caption'
        },
        {
            text: 'type',
            flex: 1,
            sortable: true,
            dataIndex: 'type'
        },
        {
            xtype: 'datecolumn',
            format: 'Y-m-d H:i:s',
            text: 'created_time',
            flex: 1,
            sortable: true,
            dataIndex: 'created_time'
        }
    ],

    initComponent : function(){

        /*123685654441395?fields=feed{
        id,
        name,
        link,
        message,
        shares,
        story,
        description,
        status_type,
        caption,
        created_time,
        type,
        from}
        */
        this.store = Ext.create('Ext.data.JsonStore', {
            fields: [
                {name: 'id',   type: 'string'},
                {name: 'name',  type: 'string'},
                {name: 'link',  type: 'string'},
                {name: 'message',  type: 'string'},
                {name: 'shares',  type: 'int'},
                {name: 'story',  type: 'string'},
                {name: 'description',  type: 'string'},
                {name: 'status_type',  type: 'string'},
                {name: 'caption',  type: 'string'},
                {name: 'type',  type: 'string'},
                {name: 'created_time',  type: 'date', format: 'Y-m-d H:i:s' }
            ]
        });

//        var likesStore = this.getStore();
//
//        FB.api('/me?fields=likes', function(response) {
//            console.log('me info: ' + JSON.stringify(response));
//
//            if(response && response.likes && response.likes.data){
//                likesStore.loadData(response.likes.data);
//            }
////              document.getElementById('status').innerHTML =
////                'Thanks for logging in, ' + response.name + '!';
//        });

        this.callParent(arguments);
    },

    listeners: {
        selectionchange:{
            fn: function( /*Ext.selection.Model*/ that, /* Ext.data.Model[]*/ selected,/* Object*/ eOpts ){

                if (selected[0]) {
                }
            }
        },

        itemdblclick : {
            fn: function( that, record, item, index, e, eOpts ){

            }
        },

        columnmove : {
            fn: function( ct, column, fromIdx, toIdx, eOpts ){
                console.log("columnmove fromIdx: " + fromIdx + " toIdx: " + toIdx);
//                var columns = this.columns;
//
//                for(var i = 0; i < columns.length; i++){
//                    console.log(columns[i].text + " " + columns[i].hidden);
//                }
            }
        },

        sortchange:{
            fn: function( ct, column, direction, eOpts ){
                console.log("sortchange column: " + column.dataIndex + " direction: " + direction);

//                var query = queryMgr.getActiveQueryJson();
//
//                query.sort = {};
//                query.sort[column.dataIndex] = {"order": direction.toLowerCase()};
//
//                queryMgr.setActiveQueryJson(query);
//
//                this.update();
            }
        }
    },

    loadData: function(data){

//        var arr = [];
//
//        for(var i = 0; i < data.hits.hits.length;i++){
//            //console.log('record: ' + JSON.stringify(data.hits.hits[i]));
//            var obj = data.hits.hits[i]._source;
//            obj["id"] = data.hits.hits[i]._id;
//            arr.push(obj);
//        }
//
//        var esTypesGrid = Ext.getCmp('esTypesGrid');
//        esTypesGrid.getStore().loadData(arr);
//        esTypesGrid.doLayout();
    },

    update: function(){

//        var esIndex = settings.get('es.ui.selectedIndex');
//        var esType = settings.get('es.ui.selectedType');
//
//        this.store.removeAll();
//
//        var query = queryMgr.getActiveQueryJson();
//
//        query.filter = queryMgr.getActiveFilterJson();
//
//        console.log("esTypesGrid.update query: " + JSON.stringify(query));
//
//        //http.post('http://127.0.0.1:9200/' + path + '/_search','{"from":0,"size":1000}',function(res){
//        http.post('es?op=search&index=' + esIndex + '&type=' + esType,
//            query,
//            function(res){
//            //console.log(res);
//
//            res = JSON.parse(res);
//            var esTypesGrid = Ext.getCmp('esTypesGrid');
//            esTypesGrid.loadData(res);
//        });
    }
});