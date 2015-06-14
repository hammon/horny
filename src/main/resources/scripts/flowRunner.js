horny.load('scripts/lib/common.js');
horny.load('scripts/lib/actionTypeToFunction.js');

var flow = horny.readFile('flow/ttt/NewFlow.json');

log('flow: ' + flow);


flow = JSON.parse(flow);

log('flow text: ' + flow.text);


flow.steps.forEach(function(step){
    log('step: ' + JSON.stringify(step));

    if(actionTypeToFunction[step.actionType]){
        actionTypeToFunction[step.actionType](step);
        log('res: ' + step.res);
    }
    else{
        log('Unsupported action type - ' + step.actionType);
    }

});