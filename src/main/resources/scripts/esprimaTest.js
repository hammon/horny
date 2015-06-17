horny.load('scripts/lib/common.js');
horny.load('scripts/lib/esprima.js');

var jsFile = "/home/michael/dev/horny/src/main/resources/scripts/esprimaTest.js";


var ast = esprima.parse(horny.readFile(jsFile), {range: true, loc: true});

log(JSON.stringify(ast));

var filter = {
    'type' : 'FunctionDeclaration'
};

var countMap = {};

var result = [];


printJsonTree(ast);

print('result: ' + JSON.stringify(result));


function printJsonTree(jsonNode){

    var nodeType = getType(jsonNode);

    if(nodeType === '[object Object]'){
        printJsonObj(jsonNode);
    }
    else if(nodeType === '[object Array]'){
        printJsonArr(jsonNode);
    }
    else{
        print(jsonNode);
    }
}

function getType(jsonNode){
    return Object.prototype.toString.call(jsonNode);
}

function printJsonObj(obj){

    if(isIn(obj)){
        result.push(obj.id.name);
    }

    for(var m in obj){
        if(obj.hasOwnProperty(m)){
            print(m + ' - ' + getType(obj[m]));
            //print('obj[m]' + ' - ' + getType(obj[m]));
            count(obj[m]);
            printJsonTree(obj[m]);
        }
    }
}

function printJsonArr(arr){
    arr.forEach(function(e){
        printJsonTree(e);
    });
}

function count(name){
    if(countMap[name]){
        countMap[name] = countMap[name] + 1;
    }
    else{
        countMap[name] = 1;
    }
}

function isIn(obj){
    for(var f in filter){
        if(obj[f] &&
        obj[f] === filter[f]){
            return true;
        }
    }
    return false;
}