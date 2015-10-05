
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
            activeTab: 2,
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
                                    flex: 1,
                                    collapsible: false,
                                    region:'center',
                                    minWidth: 100,
                                }),
                                Ext.create('Horny.NgramsGrid',{
//                                    layout: 'fit',
                                    flex: 1,
                                    region:'south',
                                    id:'ngramsGrid',
                                    collapsed: true
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
                                flex:1,
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
                                    id: 'snippetsGrid',
                                    collapsed: true,
                                    flex:1
                                    //collapsible: true
                                })
                            ]
                        })
                    ]
                }),

                Ext.create('Horny.SplitView',{
                    title: 'ES',
                    region:'center',
                    items: [
                        Ext.create('Horny.SplitView',{
                       //     layout: 'fit',
                        //    layout: 'anchor',
                            flex: 1,
                            floatable: false,
                            region:'west',
                            width: 325,
                            items: [

                                Ext.create('Horny.EsMappingTree',{
                                    flex: 2,
                                    collapsible: false,
                                    region:'center',
                                }),
                                Ext.create('Horny.BucketsGrid',{
//                                    layout: 'fit',
                                    flex: 1,
                                    region:'south',
                                    id:'bucketsGrid',
                                    collapsed: false
                                })
                            ]
                         }),
                        Ext.create('Horny.SplitView',{
                        //     layout: 'fit',
                         //    layout: 'anchor',
                             collapsible: false,
                             id: "esCenter",
                          //   title: "esCenter",
                             floatable: false,
                             region:'center',
                             flex: 3,
                             //width: 325,
                             items: [
 //                               Ext.create('Horny.QueryView',{region:'north'}),
 //                                Ext.createWidget('tabpanel', {
                                     Ext.create('Horny.SplitView',{
                                            id: 'esCenterTabs',
                                            region: 'center',
                                            collapsible: false,
                                            //activeTab: 2,
                                            //items: [createEsBarChart()]
                                            })
                             ]
                          }),
                    ]
                })


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
