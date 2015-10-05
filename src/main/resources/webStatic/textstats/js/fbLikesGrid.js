

Ext.define('Horny.FbLikesGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.fblikesgrid',

    title: 'Likes',

    id: 'fbLikesGrid',

    autoRender: true,
    autoScroll: true,
    layout: 'fit',

//id,name,category,likes,talking_about_count,link,created_time
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
            text: 'category',
            flex: 1,
            sortable: true,
            dataIndex: 'category'
        },
        {
            text: 'likes',
            flex: 1,
            sortable: true,
            dataIndex: 'likes'
        },
        {
            text: 'talking_about_count',
            flex: 1,
            sortable: true,
            dataIndex: 'talking_about_count'
        },
        {
            text: 'link',
            flex: 1,
            sortable: true,
            dataIndex: 'link',
            hidden: true
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

        //id,name,category,likes,talking_about_count,link,created_time
        this.store = Ext.create('Ext.data.JsonStore', {
            fields: [
                {name: 'id',   type: 'string'},
                {name: 'name',  type: 'string'},
                {name: 'category',  type: 'string'},
                {name: 'likes',  type: 'int'},
                {name: 'talking_about_count',  type: 'int'},
                {name: 'link',  type: 'string'},
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

                    var feedStore = Ext.getCmp('fbFeedGrid').getStore();
                    feedStore.removeAll(true);

                    var uid = selected[0].data.id;

                    var path = uid + '?fields=feed.limit(100){id,name,link,message,shares,story,description,status_type,caption,created_time,type}';

                    FB.api(path, function(feedResponse) {
                        //console.log('feedResponse: ' + JSON.stringify(feedResponse));

                        if(feedResponse && feedResponse.feed && feedResponse.feed.data){
                            var data = feedResponse.feed.data;

                            for(var i = 0;i < data.length;i++){
                                var rec = data[i];

                             //   console.log('i: ' + i + ' rec: ' + JSON.stringify(rec));

                                if(rec.shares && rec.shares.count){
                                    rec.shares = rec.shares.count;
                                }
                                else{
                                    rec.shares = 0;
                                }

                                feedStore.add(rec);
                            }
                        }
                    });
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