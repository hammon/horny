
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
                    //width: 425,
                    items: [

                        Ext.create('Horny.FlowTree',{
                            region:'center',
                            minWidth: 150,
                        }),
                        Ext.create('Horny.NgramsGrid',{
                            region:'east',
                            id:'flowNgramsGrid'//,
                            //collapsible: true
                        })
                    ]
                }),
                Ext.create('Horny.SplitView',{
                    region:'center',
                    title: 'Files',
                    items: [
                        Ext.create('Horny.SplitView',{
                            region:'west',
                            width: 325,
                            items: [

                                Ext.create('Horny.FilesTree',{
                                    region:'center',
                                    minWidth: 100,
                                }),
                                Ext.create('Horny.NgramsGrid',{
                                    region:'south',
                                    id:'ngramsGrid'//,
                                    //collapsible: true
                                })
                            ]
                         }),
                        Ext.create('Horny.SplitView',{
                            region:'center',
                            items: [
                            Ext.create('Horny.SnippetsGrid',{
                                region:'center',
                                id: 'snippetsGrid'//,
                                //collapsible: true
                            }),
                            Ext.createWidget('tabpanel', {
                                        id: 'contentTabs',
                                        region: 'south',
                                        collapsible: false,
                                        activeTab: 0,
                                        items: [
                                            Ext.create('Horny.JsonTree',{
                                                id: 'jsonView'
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
                                    }
                                )
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
