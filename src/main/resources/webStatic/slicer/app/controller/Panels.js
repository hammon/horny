Ext.define('SlicerApp.controller.Panels', {
    extend: 'Ext.app.Controller',

	views: [
        'panel.SlicerPanel',
        'panel.SlicerPanelToolbar'
    ],
    
    init: function() {
        console.log('Initialized Panels! This happens before the Application launch function is called');
        
        this.control({
            'viewport > panel': {
                render: this.onPanelRendered
            }
        });
    },
    
     onPanelRendered: function() {
        console.log('The panel was rendered');
    }
});
