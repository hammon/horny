
var http = {
    get : function (url,callback,onError){

    var start = Date.now();

        Ext.Ajax.request({
            method: 'GET',
            url: url,

            success: function(response){
                var end = Date.now();
                var total = end - start;

                var text = response.responseText;

                console.log("Request took: " + total + " size: " + text.length);


                //console.log("text:" + text);

                if(callback){
                    callback(text);
                }

                //updateRecommendations(text);
            },
            failure: function(response, opts) {
                var end = Date.now();
                var total = end - start;

                console.log("Request took: " + total + 'server-side failure with status code ' + response.status);

                if(onError){
                    onError(response, opts);
                }
            }
        });
    },

    post: function(url,json,callback){
        Ext.Ajax.request({
        	   	url: url,
        	   	method: 'POST',

        	   	jsonData: json,

        	   	success: function(transport){
                          // do something
        	   	},
        	   	failure: function(transport){
        	   			alert("Error: " - transport.responseText);
        	   	}
        	});
    }
};


// fix hide submenu (in chrome 43)
//http://stackoverflow.com/questions/30399433/extjs-submenus-disappear-on-chrome-43

Ext.override(Ext.menu.Menu, {
    onMouseLeave: function(e) {
    var me = this;


    // BEGIN FIX
    var visibleSubmenu = false;
    me.items.each(function(item) {
        if(item.menu && item.menu.isVisible()) {
            visibleSubmenu = true;
        }
    })
    if(visibleSubmenu) {
        //console.log('apply fix hide submenu');
        return;
    }
    // END FIX


    me.deactivateActiveItem();


    if (me.disabled) {
        return;
    }


    me.fireEvent('mouseleave', me, e);
    }
});



