

Ext.define('Horny.EsMappingTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.esmappingtree',

    id: 'ssMappingTree',

    rootVisible: false,

    initComponent : function(){

            this.store = Ext.create('Ext.data.TreeStore', {
                 root: {
                     text: 'Root',
                     expanded: true
                 },
                 folderSort: true
             });



            var treeStore = this.getStore();
            var root = treeStore.getRootNode();

            http.get('http://127.0.0.1:9200/_mapping',function(res){
                console.log("ES MAPPING: " + res);

                var mapping = JSON.parse(res);

                for(var index in mapping){
                    var indexNode = root.appendChild({
                        text: index,
                        leaf: false
                    });

                    if(mapping[index] && mapping[index]['mappings']){
                        for(var doc in mapping[index]['mappings']){
                            var docNode = indexNode.appendChild({
                                text: doc,
                                leaf: false
                            });
                        }
                    }
                }

            });

             this.callParent(arguments);
        }
});