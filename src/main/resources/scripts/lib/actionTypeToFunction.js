

var actionTypeToFunction = {
    'execute': function(act){
        //log(JSON.stringify(act));

        act['res'] = proc.exec(act.params.cmd);

        //log(JSON.stringify(act));
    }
};