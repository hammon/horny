
//var timerID = null;
var timer = 30;

var yPos,xPos,fontSize,r,g,b,gg,total_rt,wrong_hits;
var date = new Date();
var time = date.getTime();
var prev_time = time;
var key = random_char();


if (window.Event){
	document.captureEvents(Event.KEYDOWN);
	document.onkeydown = on_key_down;
}
else{
	document.onkeydown = function()	{
		return on_key_down(event);
	}
}

var jKeys = {
    keyElemId: null,
    keyCount: 0,
    init: function(){
    	jKeys.keyCount = 0;
    	total_rt = 0;
    	wrong_hits = 0;

    	jKeys.keyElemId = elemUtils.add_elem("body","div",key);

        var elem = document.getElementById(jKeys.keyElemId);
    	elem.addEventListener("click", function(e){
    	    console.log("click: " + e.srcElement.textContent);
    	    on_key_down({"which": e.srcElement.textContent.charCodeAt(0)});
    	}, false);

    	show_random_char();
    	//elemUtils.set_attribute(jKeys.keyElemId,"style","Z-INDEX: 102; POSITION: absolute; LEFT: 150px; TOP: 150px");

    	elemUtils.set_attribute("button1","style","display:none;");

    	window.focus();

    	timerUtils.startClock();
    }
};



var elemUtils = {
    add_elem: function (parent_id,tag,val,id){
        var parent = document.getElementById(parent_id);
    	if(parent == null){
    		alert("elemUtils.add_elem: parent == null parent_id = " + parent_id);
    	}

    	var e = document.createElement(tag);

        e.id = id || generate_id(tag);

    	if(val){
    		e.innerHTML = val;
    	}

    	parent.appendChild(e);
    	return e.id;
    },

    set_value: function(id,val){
    	var e = document.getElementById(id);
    	if(e == null){
    		alert("elemUtils.set_value: e == null e = " + id);
    	}
    	e.innerHTML = val;
    },

    set_attribute: function(elem_id,attr,val){
    	var elem = document.getElementById(elem_id);
    	elem.setAttribute(attr,val);
    }
};

//sum.style.display!="none"



function rgb(r,g,b){
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
}

function on_key_down(event){
	if(timerUtils.timerID == null)	{
		return;
	}

	jKeys.keyCount++;

	var d = new Date();
	time = d.getTime();

	var res;
	if(key == String.fromCharCode(event.which))	{
		res = "GOOD";
	}
	else{
		res = "BAD";
		wrong_hits++;
	}

	var rt = time - prev_time;

	total_rt += rt;

	add_result(key,xPos,yPos,fontSize,gg,rt,res);

	show_random_char();


/*
	elemUtils.set_value("res","rgb: " + gg + " font size: " + fontSize + " xPos: " + xPos + " yPos: " + yPos + " wh: "
	+ window.innerHeight + " ww: " + window.innerWidth + " response time: " + response_time +
	"<br>time: " + time + " prev_time: " + prev_time + " key: " + event.which +
	"<br>res: " + res);
	*/

	prev_time = time;
}

function show_random_char(){
	fontSize = Math.round(Math.random() * 250) + 25;
	yPos = Math.round(Math.random() * window.innerHeight) - fontSize;
	xPos = Math.round(Math.random() * window.innerWidth) - fontSize;


	if(yPos < 0){
		yPos += fontSize;
	}

	if(xPos < 0){
		xPos += fontSize;
	}

	r = Math.round(Math.random() * 255);
	g = Math.round(Math.random() * 255);
	b = Math.round(Math.random() * 255);

	gg = rgb(r,g,b);
	//alert(gg);

	key = random_char();

	elemUtils.set_value(jKeys.keyElemId,key);

	elemUtils.set_attribute(jKeys.keyElemId,"style","Z-INDEX: 102; color:#" + gg + "; POSITION: absolute;" +
	"font-size:" + fontSize + "px; LEFT: " + xPos + "px; TOP: " + yPos + "px");
}

function generate_id(tag){
	var id = tag + document.getElementsByTagName(tag).length;
	var e = null;
	for(e=document.getElementById(id);e != null;e=document.getElementById(id)){id +=0;}
	return id;
}

function random_char(){
	return String.fromCharCode(Math.round(Math.random()*25) + 65);
}


var timerUtils = {

    timerID: null,
    stopClock: function(){
    	if (timerUtils.timerID){
    		clearInterval(timerUtils.timerID);
    	}
    	timerUtils.timerID = null;
    },

    startClock: function(){
    	timerUtils.stopClock();
    	timerUtils.timerID = setInterval(showtime, 1000); // ??? setInterval("showtime()", 1000)
    }
};




function showtime(){
	if(timer == 0){
		timerUtils.stopClock();
		show_summary();
		return;
	}

	window.status = --timer;
}

function show_summary(){
	var tr_id = elemUtils.add_elem("summary","tr",null);
	elemUtils.add_elem(tr_id,"td","<h2>Summary</h2>");

	tr_id = elemUtils.add_elem("summary","tr",null);
	elemUtils.add_elem(tr_id,"td","Keys pressed:");
	elemUtils.add_elem(tr_id,"td",jKeys.keyCount);

	tr_id = elemUtils.add_elem("summary","tr",null);
	elemUtils.add_elem(tr_id,"td","Average response time:");
	elemUtils.add_elem(tr_id,"td",Math.round(total_rt/jKeys.keyCount));

	tr_id = elemUtils.add_elem("summary","tr",null);
	elemUtils.add_elem(tr_id,"td","Accuracy:");
	elemUtils.add_elem(tr_id,"td",((jKeys.keyCount-wrong_hits)*100)/jKeys.keyCount+"%");

	tr_id = elemUtils.add_elem("summary","tr",null);
	elemUtils.add_elem(tr_id,"td","<a href='javascript:void(0)' onclick=show_results()>Show results</a>");

	elemUtils.set_attribute("summary","style","display:block ");
	//elemUtils.set_attribute("results","style","display:inline");
		//var res = "keys: " + jKeys.keyCount + " average response time: " + (total_rt/jKeys.keyCount);
		//elemUtils.set_value("res",res);
}

function show_results(){
	elemUtils.set_attribute("results","style","display:block");
}

function add_result(key,x,y,fontSize,rgb,rt,res){
	var tr_id = elemUtils.add_elem("results","tr",null);
	elemUtils.set_attribute(tr_id,"style","background-color:#" + rgb);

	elemUtils.add_elem(tr_id,"td",key);
	elemUtils.add_elem(tr_id,"td",x);
	elemUtils.add_elem(tr_id,"td",y);
	elemUtils.add_elem(tr_id,"td",fontSize);
	var id = elemUtils.add_elem(tr_id,"td",rgb);

	elemUtils.add_elem(tr_id,"td",rt);
	elemUtils.add_elem(tr_id,"td",res);
}