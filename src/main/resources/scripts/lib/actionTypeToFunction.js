

var actionTypeToFunction = {
    'execute': function(act){
        //log(JSON.stringify(act));

        act['res'] = proc.exec(act.params.cmd);
        log(JSON.stringify(act));
        return act['res'];
    },
    'html': function(act,outputVarName){
        act['res'] = JSON.parse(html.getPageDetails(act.params.url));
        return act['res'];
    }
};