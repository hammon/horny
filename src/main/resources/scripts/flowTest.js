

// cd horny/build/libs
// java -jar horny-1.0.jar -f scripts/flowTest.js


//define action
var action = {
    'type': 'execute',
    'cmd': 'ls'
};

//define flow
var testFlow = [
    action,
    {
        'type': 'execute',
        'cmd': 'hostname'
    }
];

//map action types to functions
var actionTypeToFunction = {
    'execute': function(act){
        log(JSON.stringify(act));

        /*
            call process execute
            proc defined in JSExecutor.JSExecutor line 16
        */
        act['res'] = proc.exec(act.cmd);

        log(JSON.stringify(act));
    }
};

//run the flow
function run(flow){
    flow.forEach(function(a){
        actionTypeToFunction[a.type](a);
    });
}

run(testFlow);

function log(msg){
    print(msg + '\n');
}

