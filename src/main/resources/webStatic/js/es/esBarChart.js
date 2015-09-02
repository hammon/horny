
Ext.define('Horny.EsBarChart', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.esbarchart',

    id: 'esBarChart',

    style: 'background:#fff',
    animate: true,
    shadow: true,

    //store: store,
                legend: false,
                axes: [{
                    type: 'Numeric',
                    position: 'left',
//                    minimum: 0,
//                	maximum: 1,
                    fields: ['key','doc_count'],
                    title: false,
                    grid: true,
//                    label: {
//                        renderer: function(v) {
//                            return String(Math.round(v*100)/100);
//                        }
//                    }
                }, {

                    type: 'Category',
                    position: 'bottom',
                    fields: ['key'],
                    title: false
                }],
                series: [{
                                type: 'column',
                                axis: 'bottom',
                                gutter: 80,
                                xField: 'key',
                                showInLegend: true,
                                yField: ['doc_count'],
                                listeners: {
                                	'itemclick': function(e) {
                                        console.log('itemclick');
                				        }
                				},
                                //stacked: true,
                                tips: {
                                    trackMouse: true,
                                    width: 165,
                                    height: 28,
//                                    renderer: function(storeItem, item) {
//                                        this.setTitle(String(item.value[0] + " " + item.value[1]));// / 1000000) + 'M');
//                                    }
                                }
                            }]



});


function createEsBarChart(){

    var bucketsGrid = Ext.getCmp('bucketsGrid');
    var store = bucketsGrid.getStore();

    var chart = Ext.create('Horny.EsBarChart',{
        store: store,
        region: 'east',
        //flex: 1
    });

    return chart;
}