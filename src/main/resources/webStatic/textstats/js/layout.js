
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
            {
                html: '<h2>Web</h2><div class="fb-login-button" scope="user_likes" data-max-rows="1" data-size="medium" data-show-faces="false" data-auto-logout-link="true"></div><input id=button1 type="button" value="Button" onclick=init()>',
                region: 'north',
            //    title: 'Web'
                collapsible: true,
                collapsed: true
            },
            Ext.createWidget('tabpanel', {
                id: 'mainTabs',
                region: 'center',
                collapsible: false,
                //activeTab: 2,
                items: [

                    Ext.create('Horny.SplitView',{
                        region:'center',
                        items:[
                            Ext.create('Horny.FbLikesGrid',{
                                layout: 'fit',
                                flex: 1,
                                collapsible: true,
                                region:'center'
                            }),
                            Ext.create('Horny.FbFeedGrid',{
                                layout: 'fit',
                                flex: 1,
                                collapsible: false,
                                region:'south'

                            })
                        ]
                    })


                ]
            })
        ]
    });
});
