

Ext.define('Horny.EsDocsGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.esdocsgrid',

    id: 'esDocsGrid',

    autoRender: true,
    autoScroll: true,
    layout: 'fit',

    tbar: [
    {
        text: 'New',
        'iconCls' : 'icon-add',
        handler : function(){
            var docsGrid = this.up('esdocsgrid');
            var store = docsGrid.getStore();

            var mapping = docsGrid.mapping;
            console.log('mapping: ' + JSON.stringify(mapping));

            var newRec = {};

            for(var col in mapping){
                if (mapping.hasOwnProperty(col)){
                    if(mapping[col].type === 'string'){
                        newRec[col] = 'new ' + col;
                    }
                    else if(mapping[col].type === 'long'){
                        newRec[col] = 0;
                    }
                    else if(mapping[col].type === 'date'){
                        newRec[col] = new Date().toISOString();
                    }
                }
            }

            http.post('/es?op=set&index=' + docsGrid.esIndex + '&type=' + docsGrid.esType,newRec,function(res){
                console.log(res);
                res = JSON.parse(res);
                newRec.id = res.message;
                store.insert(0, newRec);
            });

        }
        },
        {
            text: 'Delete',
            "iconCls" : 'icon-erase',
            handler : function(){
                var docsGrid = this.up('esdocsgrid');
                var store = docsGrid.getStore();
                var selectedRecord = null;

                if (docsGrid.getSelectionModel().hasSelection()) {
                    selectedRecord = docsGrid.getSelectionModel().getSelection()[0];
                }

                if(selectedRecord){
                    console.log('textfield blur selectedRecord.raw' + JSON.stringify(selectedRecord.raw));
                    id = selectedRecord.raw.id;
                }
                else{
                    return;
                }

                 http.get("/es?op=delete&index=" + docsGrid.esIndex + "&type=" + docsGrid.esType + "&id=" + id,function(res){
                        console.log("es delete res: " + res );

                        store.remove(selectedRecord);
                        //store.sync();
                    },
                    function onError(res,opts){
                        alert("Error on delete: " + JSON.stringify(res));
                    }
                 );
            }
        }
    ],

    plugins: [ Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 2
    })],

    //scroll works in win 7 chrome Version 44.0.2403.130 m and ff 40.0.2
    //scroll: false,
//    viewConfig: {
//        style: { overflow: 'auto', overflowY: 'hidden' }
//    },

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

//                docsQuery = JSON.parse(localStorage.getItem("docsQuery"));
//
//                docsQuery.sort = {};
//                docsQuery.sort[column.dataIndex] = {"order": direction.toLowerCase()};
//
//                localStorage.setItem("docsQuery",JSON.stringify(docsQuery));
//
//                this.update(this.esPath);
            }
        }
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

        this.esPath = path;

        this.store.removeAll();

        //http.post('http://127.0.0.1:9200/' + path + '/_search','{"from":0,"size":1000}',function(res){
        http.post('es?op=search&index=' + this.esIndex + '&type=' + this.esType,'{"from":0,"size":1000}',function(res){
            //console.log(res);

            res = JSON.parse(res);

            var arr = [];

            for(var i = 0; i < res.hits.hits.length;i++){
                //console.log('record: ' + JSON.stringify(res.hits.hits[i]));
                var obj = res.hits.hits[i]._source;
                obj["id"] = res.hits.hits[i]._id;
                arr.push(obj);
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