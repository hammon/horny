


Ext.define('Horny.PropertiesEditorGrid', {
       extend: 'Ext.grid.Panel',
       alias: 'widget.propertieseditorgrid',

       initComponent : function(){
            console.log("Horny.PropertiesEditorGrid initComponent");

            this.store = Ext.create('Ext.data.JsonStore',{
                                           fields:[{'name': 'name','type':'string'},{'name': 'value','type':'string'}]
                                      });

            this.callParent(arguments);
       },

       update : function(propsJson){
            var props = JSON.parse(propsJson);

            this.store.removeAll();

            for(var p in props){
                this.store.add({'name' : p,'value':props[p]});
            }
       },

       columns: [{
                //   id: this.id + '-name',
                   header: 'Name',
                   dataIndex: 'name',
                   flex: 1,
                   editor: {
                       allowBlank: false
                   }
               },
               {
              //    id: this.id + '-value',
                  header: 'Value',
                  dataIndex: 'value',
                  flex: 1,
                  editor: {
                      allowBlank: false
                  }
              }
              ],
              tbar: [{
                          text: 'Add Property',
                          'iconCls' : 'icon-add',
                          handler : function(){

                              this.up().up().store.insert(0, {
                                                                                name: 'prop name',
                                                                                value: 'prop value',
                                                                                dirty: true

                                                                            });
                              //cellEditing.startEditByPosition({row: 0, column: 0});
                          }
                      },
                      {
                            text: 'Save',
                            "iconCls" : 'icon-save',
                             handler : function(){

                                var propsView = this.up().up();

                                var store = propsView.getStore();

                                var propsArr = [];

                                store.each(function(record){
                                    console.log(record.data.name + ' : ' + record.data.value);
                                    propsArr.push(record.data);

//                                    record.phantom = false;
//                                    record.modified = {};

                                });

                                http.post('/api/props?op=save&path=' + propsView.propsPath,propsArr);
                                store.commitChanges( );

                             }
                      }
                      ],
                      plugins: [ Ext.create('Ext.grid.plugin.CellEditing', {
                        clicksToEdit: 1
                    })]

});