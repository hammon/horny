
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

                if(callback){
                    callback(text);
                }
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

    post: function(url,json,callback,onerror){
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            jsonData: json,
            success: function(response){
                if(callback){
                    callback(response.responseText);
                }
            },
            failure: function(response){
                if(onerror){
                    onerror(response);
                }
                else{
                    console.error("Http post Error: " - JSON.stringify(response));
                }

            }
        });
    }
};

var flowActions = {};

http.get('/flow/action?op=get',function(res){
//    console.log('flow: ' + res);
    flowActions = JSON.parse(res);
});
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

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
