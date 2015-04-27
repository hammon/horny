


Ext.define('Ouroboros.PropertiesEditorGrid', {
       extend: 'Ext.grid.Panel',
       alias: 'widget.propertieseditorgrid',

       initComponent : function(){
            console.log("EnvConfig.PropertiesEditorGrid initComponent");
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
                          handler : function(){

                              this.up().up().store.insert(0, {
                                                                                name: 'prop name',
                                                                                value: 'prop value'
                                                                            });
                              //cellEditing.startEditByPosition({row: 0, column: 0});
                          }
                      },
                      {
                            text: 'Apply',
                             handler : function(){

                             }
                      }
                      ],
                      plugins: [ Ext.create('Ext.grid.plugin.CellEditing', {
                                        clicksToEdit: 1
                                    })]

});