
var settings = {

    set: function (key,value){
        localStorage.setItem(key,value);

        var obj= {
            "key" : key,
            "value": value
        };

        http.post('/es?op=set&index=horny&type=settings',JSON.stringify(obj),function(res){
                                    console.log(res);
        //                            res = JSON.parse(res);
        //                            newRec.id = res.message;
        //                            store.insert(0, newRec);
                                });
    },
    setJson: function (key,value){
        setting.set(key,JSON.stringify(value));
    },
    get: function (key){
        return localStorage.getItem(key);
    }
    getJson: function (key){
        return settings.get(JSON.parse(key));
    }
};