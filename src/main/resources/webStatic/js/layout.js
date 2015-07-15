
Ext.require(['*']);


Ext.onReady(function(){

   Ext.create('Ext.Viewport',{
       layout: {
           type: 'border',
           padding: 5
       },
       defaults: {
         // collapsible: true,
          split: true
       },
       items: [
        Ext.createWidget('tabpanel', {
            id: 'mainTabs',
            region: 'center',
            collapsible: false,
            activeTab: 0,
            items: [

                Ext.create('Horny.SplitView',{
                    title: 'Flow',
                    region:'center',
               //     layout: 'fit',
                    //width: 425,
                    items: [

                        Ext.create('Horny.FlowTree',{
                            region:'center',
                            minWidth: 150,
                        })
//                        Ext.create('Horny.NgramsGrid',{
//                            region:'east',
//                            id:'flowNgramsGrid'//,
//                            //collapsible: true
//                        })
                    ]
                }),
                Ext.create('Horny.SplitView',{
                    region:'center',
                    title: 'Files',
                    items: [
                        Ext.create('Horny.SplitView',{
                       //     layout: 'fit',
                        //    layout: 'anchor',
                            floatable: false,
                            region:'west',
                            width: 325,
                            items: [

                                Ext.create('Horny.FilesTree',{
//                                    layout: 'fit',
//                                    flex: 1,
                                    collapsible: false,
                                    region:'center',
                                    minWidth: 100,
                                }),
                                Ext.create('Horny.NgramsGrid',{
//                                    layout: 'fit',
//                                    flex: 1,
                                    region:'south',
                                    id:'ngramsGrid'//,
                                    //collapsible: true
                                })
                            ]
                         }),
                        Ext.create('Horny.SplitView',{
                            region:'center',
                            collapsible: false,
                            items: [

                            Ext.createWidget('tabpanel', {
                                id: 'contentTabs',
                                region: 'center',
                                collapsible: false,
                                activeTab: 0,
                                items: [
                                        Ext.create('Horny.JsonTree',{
                                            id: 'jsonView'
                                        //    region:'center',
                                        //    minWidth: 100,
                                        }),
                                        Ext.create('Horny.JsTreeView',{
                                            id: 'jsTreeView'
                                        //    region:'center',
                                        //    minWidth: 100,
                                        }),
                                        Ext.create('Horny.PropertiesEditorGrid',{
                                            id:'propsView',
                                            title: 'Properties'

                                        //    region:'center',
                                        //    minWidth: 100,
                                        }),
                                        Ext.create('Horny.TextView',{
                                         region:'south',
                                         id:'textView',
                                         title: 'Text',
                                        })//textView

                                    ]
                                }),
                                Ext.create('Horny.SnippetsGrid',{
                                    region:'south',
                                    id: 'snippetsGrid'//,
                                    //collapsible: true
                                })
                            ]
                        })
                    ]
                })//,
//                {
//                    html: '<h2>Web</h2><p>Wellcome!</p>',
//                    title: 'Web'
//                }
//                Ext.create('Ouroboros.JsonTree',{
//                                                //    region:'center',
//                                                //    minWidth: 100,
//                                                })
                ]
            })
        ]
   });
});
