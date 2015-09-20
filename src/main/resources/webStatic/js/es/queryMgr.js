

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
    },

    getBucketQuery: function(field){
        var esIndex = settings.get('es.ui.selectedIndex');
        var esType = settings.get('es.ui.selectedType');

        var query = {
            "query": {
                "filtered": {
                   "query": {
                        "match_all": {}
                    },
                    "filter" : queryMgr.getActiveFilterJson()
                }
            },
            "aggs" : {
                "bucket_agg" : {
                        "terms" : { "field" : field, "size": settings.get('es.ui.bucketsGrid.size') || 100 }
                }
            },
            "size":"0"
        };

//        var query = {
//            "size" : settings.get('es.ui.bucketsGrid.size') || 100,
//            "aggs" : {
//                "bucket_agg" : {
////                    "filter" : {},
////                    "aggs":{
//                        "terms" : {
//                            "field" : field,
//                            "size" : settings.get('es.ui.bucketsGrid.size') || 100
//                        }
// //                   }
//
//                }
//            }
//        };

        return settings.get('es.bucketQuery.' + esIndex + '.' + esType + '.' + field) || JSON.stringify(query);
    },

    getBucketQueryJson: function(field){
        return JSON.parse(queryMgr.getBucketQuery(field));
    },

    setBucketQuery: function(field,query){
        var esIndex = settings.get('es.ui.selectedIndex');
        var esType = settings.get('es.ui.selectedType');
        settings.set('es.bucketQuery.' + esIndex + '.' + esType + '.' + field,query);
    },

    setBucketQueryJson: function(field,query){
        queryMgr.setBucketQuery(field,JSON.stringify(query));
    },

    getActiveFilter: function(){
        var esIndex = settings.get('es.ui.selectedIndex');
        var esType = settings.get('es.ui.selectedType');

        var filter = '';

        if(esIndex && esType){
            filter = settings.get('es.activeFilter.' + esIndex + '.' + esType);
        }

        if(!filter){
            filter = '{"and":{"filters":[]}}';
            queryMgr.setActiveFilter(filter);
        }
        return filter;
    },

    getActiveFilterJson: function(){
        return JSON.parse(queryMgr.getActiveFilter());
    },

    setActiveFilter: function(filter){
        var esIndex = settings.get('es.ui.selectedIndex');
        var esType = settings.get('es.ui.selectedType');
        settings.set('es.activeFilter.' + esIndex + '.' + esType,filter);
    },

    setActiveFilterJson: function(filter){
        queryMgr.setActiveFilter(JSON.stringify(filter));
    }

};