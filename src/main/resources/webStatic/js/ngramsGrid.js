
Ext.define('Ouroboros.NgramsGrid', {
       extend: 'Ext.grid.Panel',
       alias: 'widget.ngramsgrid',

        autoRender: true,
        autoScroll: true,
        layout: 'fit',
        columns: [
            {text: "String", flex: 1, dataIndex: 'str', sortable: true},
            {text: "Count", width: 180, dataIndex: 'count', sortable: true}
        ],

       initComponent : function(){
            this.store = Ext.create('Ext.data.JsonStore', {
                sortInfo: { field: "count", direction: "DESC" },
                //autoLoad: true,
                //autoSync: true,
                fields: [
                     {name: 'str',  type: 'string'},
                     {name: 'count',   type: 'int'}
                ]//,
               // data: [{str:'',count:0}]
            });
            this.callParent(arguments);
       },

        listeners: {
               	selectionchange:{
                   	fn: function(/*Ext.selection.Model*/ that, /* Ext.data.Model[]*/ selected,/* Object*/ eOpts){
                   	if(!selected || selected.length == 0){
                        return;
                    }

                     var ngram = selected[0].data.str;
                     var textView = Ext.getCmp('textView');
                     var text = textView.body.dom.innerText;

                     var prefixSize = 20;
                     var suffixSize = 20;

                     var arrSnippets = [];

                     var newText = "";
                     var prev = 0;

                     for(var i = text.toLowerCase().indexOf(ngram.toLowerCase());
                            i != -1;
                            i = text.toLowerCase().indexOf(ngram.toLowerCase(),i + ngram.length)){

                        var ngramWithCase = text.substr(i,ngram.length);

                        var from = i - prefixSize;
                        if(from < 0){from = 0;}

                        prefix = text.substring(from,i);

                        var to = i + ngram.length + suffixSize;
                        if(to > text.length){to = text.length -1;}

                        var suffix = text.substring(i + ngram.length,to);

                        var snippet = prefix + "<font style=\"color:blue; background-color:yellow;\">"
                          + "<a href='#' class='snippetLink' id='snip" + i + "'>" + ngramWithCase + "</a>"
                          + "</font>"
                          + suffix;

                        arrSnippets.push({'snippet': snippet});

                        newText += text.substring(prev,i);
                        newText += "<font style=\"color:blue; background-color:yellow;\"><a name='" + i + "'>" + ngramWithCase + "</a></font>";
                        prev = i + ngram.length;

                        //console.log(snippet);

         //

//                        arr.splice(endPos,0,"</a></font>");
//                        			arr.splice(pos,0,"<font style=\"color:blue; background-color:yellow;\"><a name='" + pos + "'>");

                     }

                     newText += text.substring(prev,text.length - 1);

                     var snippetsGrid = Ext.getCmp('snippetsGrid');
                     snippetsGrid.getStore().loadData(arrSnippets);


                     var snipLinksArr = document.getElementsByClassName('snippetLink');

                     for(var i = 0;i < snipLinksArr.length;i++){
                        snipLinksArr[i].addEventListener('click', scrollToTextSelection);
                     }


                     Ext.getCmp('textView').update("<pre>" + newText + "</pre>");

                }
            }
        }

});