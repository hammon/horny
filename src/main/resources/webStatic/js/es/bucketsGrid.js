
Ext.define('Horny.BucketsGrid', {
       extend: 'Ext.grid.Panel',
       alias: 'widget.bucketsgrid',

        autoRender: true,
        autoScroll: true,
        layout: 'fit',
        columns: [
            {text: "Key", flex: 1, dataIndex: 'key', sortable: true},
            {text: "Count", width: 180, dataIndex: 'doc_count', sortable: true},
            {xtype: 'checkcolumn', header: 'Filter By', dataIndex: 'filterBy', width: 55,
                listeners: {
                    checkchange: {
                        fn: function(column,rowIndex,checked) {

                            var store = this.up().up().getStore();
                            var rec = store.getAt(rowIndex);
                            console.log('Checkbox changed key: ' + rec.data.key + " count: " + rec.data.doc_count + " checked: " + checked );

                            //'{"query":{"bool":{"must":{"terms":{"userDetails_genome_attributes_Brand_Aware":["0,9","1.0"]}}}},"from":0,"size":5,"sort":{"userDetails_genome_attributes_Activist":{"order":"desc"}}}'

//                            {
//                            	"query" : {
//                                    "filtered": {
//                                        "filter": {
//                                            "range": {
//                                                "rating" : {
//                            						"from" : 7,
//                            						"to" : 11
//                            					}
//                                            }
//                                        }
//                                    }
//                                },
//                               "aggs": {
//                            		"sport": {
//                            			"terms": {
//                            				"field": "sport"
//                            			}
//                            		}
//                            	}
//                            }
                        }
                    }
                }
            }
        ],

       initComponent : function(){
            this.store = Ext.create('Ext.data.JsonStore', {
                sortInfo: { field: "count", direction: "DESC" },
                //autoLoad: true,
                //autoSync: true,
                fields: [
                     {name: 'key',  type: 'string'},
                     {name: 'doc_count',   type: 'int'},
                     {name: 'filterBy', type: 'bool'}
                ]//,
               // data: [{str:'',count:0}]
            });
            this.callParent(arguments);
       },

        listeners: {
               	selectionchange:{
                   	fn: function(/*Ext.selection.Model*/ that, /* Ext.data.Model[]*/ selected,/* Object*/ eOpts){
                   	if(!selected || selected.length == 0){
                        return;
                    }

                     var ngram = selected[0].data.str;


                }
            }
        }

});