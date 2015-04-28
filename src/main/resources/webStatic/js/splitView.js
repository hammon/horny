Ext.define('Ouroboros.SplitView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.splitview',

    collapsible: true,

    layout: {
        type: 'border',
    //    align: 'stretch'
        //padding: 5
    },
    defaults: {
      //  collapsible: true,
    //     layout: 'anchor',
        split: true,
        flex: 1

     // bodyPadding: 10
    }


});