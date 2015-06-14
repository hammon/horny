
var Properties = java.util.Properties;
var System = java.lang.System;

var fileUtils = Packages.org.apache.commons.io.FileUtils;
var base64 = Packages.org.apache.commons.codec.binary.Base64;


function log(msg){
//    print(msg + "\n");
    horny.printToLog(msg);
}

function parallel(arrFuncs){
    var executor = new java.util.concurrent.ThreadPoolExecutor(5,25,1,Packages.java.util.concurrent.TimeUnit.MINUTES,new java.util.concurrent.ArrayBlockingQueue(50));
    var arrFutures = [];

    for(var i = 0;i < arrFuncs.length;i++){
        arrFutures.push(executor.submit(new java.lang.Runnable({ run: arrFuncs[i] })));
    }

    for(var i = 0;i < arrFutures.length;i++){
        arrFutures[i].get();
    }

    executor.shutdown();
}