

function createDot(x,y){
    var e = document.createElement('div');
    e.id = id || elemUtils.generateId('div');
}

var jKeys = {
    time: 0,
    prevTime: 0,
    timer: 30,
    keyElemId: 'keyElem',
    xPos: 0,
    yPos: 0,
    fontSize: 0,
    keyCount: 0,
    wrongHits: 0,
    totalResponseTime: 0,
    key: '?',

    init: function(){

		console.log('init.');
//    	FB.getLoginStatus(function(response) {
//          if (response.status === 'connected') {
//            console.log('Logged in.');
//          }
//          else {
//          console.log('Loggin.');
//            FB.login();
//          }
//        });

        FB.api('/me', function(response) {
              console.log('Successful login for: ' + JSON.stringify(response));
//              document.getElementById('status').innerHTML =
//                'Thanks for logging in, ' + response.name + '!';
            });

        jKeys.key = jKeys.getRandomChar();
    	jKeys.keyCount = 0;
    	jKeys.totalResponseTime = 0;
    	jKeys.wrongHits = 0;

    	jKeys.keyElemId = elemUtils.addElem("body","div",jKeys.key,jKeys.keyElemId);

        var elem = document.getElementById(jKeys.keyElemId);
    	elem.addEventListener("click", function(e){
    	    console.log("click: " + e.srcElement.textContent);
    	    jKeys.onKeyDown({"which": e.srcElement.textContent.charCodeAt(0)});
    	}, false);

    	jKeys.showRandomChar();
    	//elemUtils.setAttribute(jKeys.keyElemId,"style","Z-INDEX: 102; POSITION: absolute; LEFT: 150px; TOP: 150px");

    	elemUtils.setAttribute("button1","style","display:none;");

    	progressElem.init();

    	window.focus();

    	var date = new Date();
        jKeys.time = date.getTime();
        jKeys.prevTime = jKeys.time;

    	timerUtils.startClock();
    },

    rgb: function(r,g,b){
    	var rr = r.toString(16);
    	if(rr.length == 1){
    		rr = "0".concat(rr);
    	}

    	var gg = g.toString(16);
    	if(gg.length == 1){
    		gg = "0".concat(gg);
    	}

    	var bb = b.toString(16);
    	if(bb.length == 1){
    		bb = "0".concat(bb);
    	}

    	var rgb = rr.concat(gg,bb);

    	return rgb;
    },

    getRandomColor: function(){
        var r = Math.round(Math.random() * 255);
        var	g = Math.round(Math.random() * 255);
        var	b = Math.round(Math.random() * 255);

        return jKeys.rgb(r,g,b);
    },

    showRandomChar: function (){
    	jKeys.fontSize = Math.round(Math.random() * 250) + 25;
    	jKeys.yPos = Math.round(Math.random() * window.innerHeight) - jKeys.fontSize;
    	jKeys.xPos = Math.round(Math.random() * window.innerWidth) - jKeys.fontSize;


    	if(jKeys.yPos < 0){
    		jKeys.yPos += jKeys.fontSize;
    	}

    	if(jKeys.xPos < 0){
    		jKeys.xPos += jKeys.fontSize;
    	}

    	jKeys.color = jKeys.getRandomColor();

    	jKeys.key = jKeys.getRandomChar();

    	elemUtils.setValue(jKeys.keyElemId,jKeys.key);

    	elemUtils.setAttribute(jKeys.keyElemId,"style","Z-INDEX: 102; color:#" + jKeys.color + "; POSITION: absolute;" +
    	"font-size:" + jKeys.fontSize + "px; LEFT: " + jKeys.xPos + "px; TOP: " + jKeys.yPos + "px");
    },

    onKeyDown: function(event){
    	if(timerUtils.timerID == null)	{
    		return;
    	}

    	jKeys.keyCount++;

    	var d = new Date();
    	jKeys.time = d.getTime();

    	var res;
    	if(jKeys.key == String.fromCharCode(event.which))	{
    		res = "GOOD";
    	}
    	else{
    		res = "BAD";
    		jKeys.wrongHits++;
    	}

    	var rt = jKeys.time - jKeys.prevTime;

    	elemUtils.setValue(jKeys.keyElemId,rt);

    	jKeys.totalResponseTime += rt;

    	jKeys.addResult(jKeys.key,jKeys.xPos,jKeys.yPos,jKeys.fontSize,jKeys.color,rt,res);

        setTimeout(function(){
            jKeys.showRandomChar();
            jKeys.prevTime = jKeys.time;
        },100);
    },

    getRandomChar: function(){
    	return String.fromCharCode(Math.round(Math.random()*25) + 65);
    },

    showSummary: function(){
    	var tr_id = elemUtils.addElem("summary","tr",null);
    	elemUtils.addElem(tr_id,"td","<h2>Summary</h2>");

    	tr_id = elemUtils.addElem("summary","tr",null);
    	elemUtils.addElem(tr_id,"td","Keys pressed:");
    	elemUtils.addElem(tr_id,"td",jKeys.keyCount);

    	tr_id = elemUtils.addElem("summary","tr",null);
    	elemUtils.addElem(tr_id,"td","Average response time:");
    	elemUtils.addElem(tr_id,"td",Math.round(jKeys.totalResponseTime/jKeys.keyCount));

    	tr_id = elemUtils.addElem("summary","tr",null);
    	elemUtils.addElem(tr_id,"td","Accuracy:");
    	elemUtils.addElem(tr_id,"td",((jKeys.keyCount-jKeys.wrongHits)*100)/jKeys.keyCount+"%");

    	tr_id = elemUtils.addElem("summary","tr",null);
    	elemUtils.addElem(tr_id,"td","<a href='javascript:void(0)' onclick=jKeys.showResults()>Show results</a>");

    	elemUtils.setAttribute("summary","style","display:block ");
    	//elemUtils.setAttribute("results","style","display:inline");
    		//var res = "keys: " + jKeys.keyCount + " average response time: " + (jKeys.totalResponseTime/jKeys.keyCount);
    		//elemUtils.setValue("res",res);
    },

    showResults: function(){
    	elemUtils.setAttribute("results","style","display:block");
    },

    addResult: function (key,x,y,fontSize,rgb,rt,res){
    	var tr_id = elemUtils.addElem("results","tr",null);
    	elemUtils.setAttribute(tr_id,"style","background-color:#" + rgb);

    	elemUtils.addElem(tr_id,"td",key);
    	elemUtils.addElem(tr_id,"td",x);
    	elemUtils.addElem(tr_id,"td",y);
    	elemUtils.addElem(tr_id,"td",fontSize);
    	var id = elemUtils.addElem(tr_id,"td",rgb);

    	elemUtils.addElem(tr_id,"td",rt);
    	elemUtils.addElem(tr_id,"td",res);
    },

    countDown: function(){
    	if(jKeys.timer <= 0){
    		timerUtils.stopClock();
    		jKeys.showSummary();
    		return;
    	}
    	//window.status = --jKeys.timer;

    	jKeys.timer = jKeys.timer - (timerUtils.intervalMs/1000);

    	progressElem.update();
    }

};

var elemUtils = {
    addElem: function (parent_id,tag,val,id){
        var parent = document.getElementById(parent_id);
    	if(parent == null){
    		alert("elemUtils.addElem: parent == null parent_id = " + parent_id);
    	}
    	var e = document.createElement(tag);
        e.id = id || elemUtils.generateId(tag);
    	if(val){
    		e.innerHTML = val;
    	}
    	parent.appendChild(e);
    	return e.id;
    },

    setValue: function(id,val){
    	var e = document.getElementById(id);
    	if(e == null){
    		alert("elemUtils.setValue: e == null e = " + id);
    	}
    	e.innerHTML = val;
    },

    setAttribute: function(elem_id,attr,val){
    	var elem = document.getElementById(elem_id);
    	elem.setAttribute(attr,val);
    },

    generateId: function(tag){
    	var id = tag + document.getElementsByTagName(tag).length;
    	var e = null;
    	for(e=document.getElementById(id);e != null;e=document.getElementById(id)){id +=0;}
    	return id;
    }
};

var timerUtils = {

    timerID: null,
    intervalMs: 100,
    stopClock: function(){
    	if (timerUtils.timerID){
    		clearInterval(timerUtils.timerID);
    	}
    	timerUtils.timerID = null;
    },

    startClock: function(){
    	timerUtils.stopClock();
    	timerUtils.timerID = setInterval(jKeys.countDown, timerUtils.intervalMs);
    }
};

var progressElem = {
    id: 'progressElem',
    xPos: 0,
    yPos: 0,
    init: function(){
        elemUtils.addElem("body","div",0,progressElem.id);
        elemUtils.setAttribute(progressElem.id,"style","Z-INDEX: 102; color:#6cc322; POSITION: absolute;" +
            	"font-size:50px; LEFT: 0px; TOP: 0px");
    },
    update: function(){
        var val = jKeys.timer.toFixed(1);
        val += '<br/>';
        val += jKeys.keyCount;
        val += '<br/>';
        val += jKeys.totalResponseTime / jKeys.keyCount;
        elemUtils.setValue(progressElem.id,val);
    }

};

if (window.Event){
	document.captureEvents(Event.KEYDOWN);
	document.onkeydown = jKeys.onKeyDown;
}
else{
	document.onkeydown = function()	{
		return jKeys.onKeyDown(event);
	}
}