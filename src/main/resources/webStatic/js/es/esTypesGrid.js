

Ext.define('Horny.EsTypesGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.estypesgrid',

    id: 'esTypesGrid',

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

                var query = queryMgr.getActiveQueryJson();

                query.sort = {};
                query.sort[column.dataIndex] = {"order": direction.toLowerCase()};

                queryMgr.setActiveQueryJson(query);

                this.update();
            }
        }
    },

    loadData: function(data){

        var arr = [];

        for(var i = 0; i < data.hits.hits.length;i++){
            //console.log('record: ' + JSON.stringify(data.hits.hits[i]));
            var obj = data.hits.hits[i]._source;
            obj["id"] = data.hits.hits[i]._id;
            arr.push(obj);
        }

        var esTypesGrid = Ext.getCmp('esTypesGrid');
        esTypesGrid.getStore().loadData(arr);
        esTypesGrid.doLayout();
    },

    update: function(){

        var esIndex = settings.get('es.ui.selectedIndex');
        var esType = settings.get('es.ui.selectedType');

        this.store.removeAll();

        var query = queryMgr.getActiveQueryJson();

        query.filter = queryMgr.getActiveFilterJson();

        console.log("esTypesGrid.update query: " + JSON.stringify(query));

        //http.post('http://127.0.0.1:9200/' + path + '/_search','{"from":0,"size":1000}',function(res){
        http.post('es?op=search&index=' + esIndex + '&type=' + esType,
            query,
            function(res){
            //console.log(res);

            res = JSON.parse(res);
            var esTypesGrid = Ext.getCmp('esTypesGrid');
            esTypesGrid.loadData(res);
        });
    }
});