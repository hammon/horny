Ext.application({
    requires: ['Ext.container.Viewport'],
    name: 'SlicerApp',

    appFolder: 'app',
	
	controllers: [
				'Panels'
			],
			
    launch: function() {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                {
                xtype: 'panel',
                region: 'center',
                layout: {
				    type: 'border',
				    padding: 1,
				    marginn: 1,
				    border: 1

				},
				defaults: {
				    split: true
				},
                title: 'Slicer',
                tbar : Ext.create('SlicerApp.view.panel.SlicerPanelToolbar'),
               	height : '100%',
//                html : 'Slicer',
       //         tools : [ 	//{type : 'gear', callback: regionsMenu },
            				//{type: 'close',handler: closeRegion}
        //    			]
            	}
            ]
        });
    }
});
