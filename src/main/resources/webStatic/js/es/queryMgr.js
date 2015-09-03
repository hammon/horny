

var queryMgr = {

    getActiveQuery: function(){
        var esIndex = settings.get('es.ui.selectedIndex');
        var esType = settings.get('es.ui.selectedType');

        var query = '';

        if(esIndex && esType){
            query = settings.get('es.activeQuery.' + esIndex + '.' + esType);
        }

        if(!query){
            query = '{"from":0,"size":1000}';
            queryMgr.setActiveQuery(query);
        }
        return query;
    },

    setActiveQuery: function(query){
        var esIndex = settings.get('es.ui.selectedIndex');
        var esType = settings.get('es.ui.selectedType');

        if(esIndex && esType){
            settings.set('es.activeQuery.' + esIndex + '.' + esType,query);
        }
        else{
            console.warning('esIndex or esType not set!');
            settings.set('es.activeQuery',query);
        }

    },

    getActiveQueryJson: function(){
        return JSON.parse(queryMgr.getActiveQuery());
    },

    setActiveQueryJson: function(query){
        queryMgr.setActiveQuery(JSON.stringify(query));
    }

};