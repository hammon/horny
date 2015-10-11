
Ext.define('Horny.SelectIndexCombo', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.selectindexcombo',
    queryMode:      'local',
    //value:          'master',

//    triggerAction:  'all',
    forceSelection: true,
    editable:       false,

    fieldLabel:     'Index',
    //name:           'title',
    displayField:   'name',
    valueField:     'value',
    anchor:'95%',

    initComponent : function(){

        console.log("init SelectIndexCombo");

        this.store = Ext.create('Ext.data.Store',{
           fields:[{'name': 'name','type':'string'},{'name': 'value','type':'string'}],
        });

        var that = this;
        console.log("init Ext.data.Store: " + this.initialConfig.id);

        var mappingPath = this.initialConfig.mappingPath || '';

        http.get('es?op=mapping&path=/' + mappingPath,function(res){
            var arr = [];
            var mapping = JSON.parse(res);
            for(var index in mapping){
                arr.push({'name':index,'value':index});
            }
            that.getStore().loadData(arr);
        });

        this.callParent(arguments);
    },

    listeners:{
         'select': function(combo, records, eOpts){
            console.log(" index " + records[0].raw.value);

         }
    }
});


Ext.define('Horny.EsQuery', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.esquery',

    title: 'Es Query',

    id: 'esQuery',

    autoRender: true,
    autoScroll: true,
    layout: 'fit',

    columns: [{
        text: 'text',
      //  flex: 2,
        sortable: true,
        dataIndex: 'text'
    }],

    initComponent : function(){
        this.store = Ext.create('Ext.data.JsonStore', {
            fields: [{name: 'text',  type: 'string'},]
        });

        this.callParent(arguments);
    },


    tbar: [
        Ext.create('Ext.toolbar.Toolbar', {
            id: 'mappingToolbar',
            items   : [
                Ext.create('Horny.SelectIndexCombo', {
                    'id':'indexCombo',
                    listeners:{
                        'select': function(combo, records, eOpts){
                            console.log(" index " + records[0].raw.value);

                        }
                    }
                })
            ]
        })
        //Ext.create('Horny.SelectIndexCombo', {'id':'indexCombo'})

    ],

//    plugins: [ Ext.create('Ext.grid.plugin.CellEditing', {
//        clicksToEdit: 2
//    })],

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
            }
        },

        sortchange:{
            fn: function( ct, column, direction, eOpts ){

            }
        }
    },

    loadData: function(data){

    },

    update: function(){


    }
});