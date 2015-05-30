Ext.define('SlicerApp.view.panel.SlicerPanel' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.slicerpanel',

    title: 'Slicer Panel',
    
    autoRender : true,
    
    //tbar : Ext.create('SlicerApp.view.panel.SlicerPanelToolbar'),
    
    layout: {
            type: 'border'

        },
        defaults: {
            split: true,
            padding: 0,
            margin: 0,
            border: 0
        },
        
        items: 
        [
        	{
                xtype: 'panel',
                region: 'center',
                title: 'center',
                tbar : Ext.create('SlicerApp.view.panel.SlicerPanelToolbar'),
            //    autoRender : true,
                width: '100%',
                height: '100%',
				//plain: true,
                html : 'center',
                padding: 0,
                margin: 0,
                border: 0
            }
            

		]

 //   initComponent: function() {
        

        //this.callParent(arguments);
  //  }
});
