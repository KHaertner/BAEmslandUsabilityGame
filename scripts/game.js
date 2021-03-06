var number = 0;									//Anzahl der gespawnten Hindernisse
var width = $(window).innerWidth();				//Ermittlung der Fenstergr��e und Anpassung der Spielfl�che
var height = $(window).innerHeight();			//Ermittlung der Fenstergr��e und Anpassung der Spielfl�che
var state = "menu";								//Startwert des Fensters (menu/play)
var maxTime = 10000;							//Maxwert, den ein Hindernis brauch um von links nach rechts zu gelangen in ms
var minTime = 5000;								//Minwert, den ein Hindernis brauch um von links nach rechts zu gelangen in ms
var intervall = 200;							//Nach 200 ms wird ein neues Hindernis gespawnt
var hardness = "slow";
var energyMode = false;							//Energymodus mit klick auf start ist aus zu Beginn
var energyLeft = 0;								//Anfangsenergie
var coin = 0;
var ingo = false;
var destroyed = 0;



/*$(document).keydown(function(e) { 				// noch nicht implementiert, aber evtl wollen wir tasten nutzen.
    switch(e.which) {
        case 37: 								// left
        ingo = true;

        case 38: 								// up
        break;

        case 39: 								// right
        ingo = false;

        case 40: 								// down
        break;

        default: return; 						// exit this handler for other keys
    }
    e.preventDefault();
}); */											//Ende Keyeingabe

function timer(){
	gameinterval = window.setInterval(function(){
		inGame();
	}, intervall);								//setzt die Zeit der neuberechnung, in diesem Fall wird die Spawnmethode nach "intervall" ms aufgerufen
}

function inGame(){ 								//bewegt und spawnt die Hindernisse
	number++;
	if (energyMode == true && energyLeft < 1) {
		energyOff();
		$('#game').css({'cursor':'url(./images/rocket.cur), default'});
	};

	if (energyMode == true) {
		energyLeft -= 1;
	};
	createBox(number); 							//spawn
	moveBox(number);							//bewegung

	if (maxTime > 2000) {maxTime = maxTime-12;}; //Die Geschwindigkeit der Hindernisse wird erh�ht
	if (minTime > 1000) {minTime = minTime-6;};

												//Der Schwierigkeitsgrad erh�ht sich, Hindernisse spawnen h�ufiger
	if (number > 250 && hardness == "slow") { 	//Erh�hung nach 250 Hindernissen
		clearInterval(gameinterval);
		hardness = "medium";
		intervall = 100;
		timer();								//Timer wird neu gestartet, damit das neue Intervall g�ltig ist
	};
	if (number > 500 && hardness == "medium") {
		clearInterval(gameinterval);			//Erh�hung nach 250 Hindernissen
		hardness = "hard";
		intervall = 50;
		timer();								//Timer wird neu gestartet, damit das neue Intervall g�ltig ist
	};

												//Daten werden angezeigt (unter den Spielfeld)
	$('#points').val(number);
	$('#intervall').val(intervall);
	$('#max').val(maxTime);
	$('#min').val(minTime);
	$('#energy').val(energyLeft);

}

function setState(gameState){ 					//Zeigt die Oberfl�che Modusbedingt an
	state = gameState;
	if (state == "play") {
		number = 0;								// setzt die Anzahl der erreichten Hindernisse zur�ck
		$('#game').stop();
		$('#highscore').remove();
		$('#info').hide();
		$('#game').animate({'background-position':'0px'},1);
		$('#cursor').css({'display': 'block'});
		$('.menu').fadeOut();
		$('.highscore').fadeOut();				
		var bgAnimate = $('#game').animate({'background-position':'-=1000px'},1*60*1000, 'linear');
		timer();
	}else if(state == "menu"){
		$('#highscore').remove();
		$('#tutorial').hide();
		$('#info').fadeIn();
		$('#cursor').css({'display': 'none'});
		$('.menu').fadeIn();
		$('.highscore').fadeIn();
	}else if(state == "highscore"){
		$('#highscore').remove();
		$('#cursor').css({'display': 'none'});
		$('.highscore').fadeIn();
		$('.menu').append("<iframe src='./hs.html' id='highscore' style='background:white; width:100%'>");
	}else if(state == "info"){
		$('.menu').hide();
		$('#tutorial').show();
		$('#info').hide();
	};
}

   function lose(points, reasonid){							//Anzeige und reset der Stats
	if (window.navigator && window.navigator.vibrate){ 	//checks if the device supports vibration
		navigator.vibrate(1000, 500, 750, 300, 500);	//first value vibration duration, second value pause duration
	}
	
	var reason = {1:"Du bist kollidiert", 2:"Du hast die Map verlassen", 3:"Anti NoHoverCheat"};
	if (energyMode==false || reasonid == 2) {
		
		//aktualisiert die Statistik your_points
		clearInterval(gameinterval);
		$('#reason').html(reason[reasonid]);
		$('#range').html(number);
		$('#coins').html(coin);
		$('#totalscore').html(coin*3 + number + destroyed*2);
		$('#destroyed').html(destroyed);
		$('#your_points').show();
		$('#scoreform').show();
		$('#submit').show();
		
		$('.box').remove();						//Container mit alten Stats wird gel�scht;
		maxTime = 10000;
		minTime = 5000;
		intervall = 200;
		energyMode = true;
		energyLeft = 0;
		hardness = "slow";
		ingo = false;
		setState('menu');	
		$('#coin').val(coin);
		$('#destroyed').val(destroyed);
	}else{
		destroyed += 1;
		$('#box'+points).remove();
		$('#destroyed').val(destroyed);
	};
}

//Herstellen des XMLHttpRequest und Anbindung an das PHP Skript zur �bermittlung des Scores
function submitScore(){
	
	name = $('#scoreform').val();
	
	var request = new XMLHttpRequest();
	request.open("POST", "xmlsubmit.php", true);
	request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	request.onload = function() {
		var resp = request.response;
	};
	request.send("name=" + name + "&score=" + (coin*3 + number + destroyed*2));		//Weitergabe des Highscores an das PHP Skript
	
	//versteckt das Formular nachdem die �bermittlung geschehen ist
	$('#scoreform').hide();
	$('#submit').hide();
}

function createBox(id){							//Hindernis berechnen und als container anzeigen
	var cometheight = height/15;
	if (id == 1 && energyMode==true) {energy();};
	var powerUp = Math.floor(Math.random()*100);
	var y = Math.floor(Math.random() * height-10);	//Zufallszahl der Spawnh�he
	if (y<10) {y=10;};
	if (y-height>height-10) {y=height-10;};
	var reason = 1;
	if (powerUp == 5) {
		box = $("<div id=box"+id+" class='box' style='width: 20px; height: 20px; cursor:none; background: url(./images/ingo.png); position: fixed; border-radius: 10px; left: "+width+"px; top: "+y+"px' onmouseover='getPowerUp("+id+"); energyOn(); '></div>");
	}else if(powerUp<5){
		box = $("<div id=box"+id+" class='box' style='width: 20px; height: 20px; cursor:none; background: url(./images/coin.png); position: fixed; border-radius: 10px; left: "+width+"px; top: "+y+"px' onmouseover='coins("+id+");'></div>");
	}else if(ingo == false) {
		box = $("<canvas id=box"+id+" class='box bad' style='width:"+cometheight+"px; height:"+cometheight+"px; cursor:none; background: url(./images/comet_big.png); position: fixed; border-radius: 50px; left: "+width+"px; top: "+y+"px' onmouseover='lose("+id+", "+reason+");'></canvas>");
	}else{
		box = $("<div id=box"+id+" class='box bad' style='width: 20px; height: 20px; cursor:none; background: url(./images/ingo.png); position: fixed; border-radius: 10px; left: "+width+"px; top: "+y+"px' onmouseover='lose("+id+", "+reason+");'></div>");
	};
	
	$(document.body).append(box);
	
}

function getPowerUp(id){
	energyLeft += 20; 
	$('#box'+id).remove();
}

function moveBox(id){							//Geschwindigkeit des Hindernis zuf�llig erzeugen
	var speed = Math.floor(Math.random() * (maxTime-minTime))+minTime;
	var left = width+100;
	var top = Math.floor(Math.random() * 300)-150;
	$("#box"+id).animate({'left' : "-="+left+"px", 'top' : "+="+top+"px"}, speed, 'linear'); //Bewegung erzeugen
}

function energy(){								//wechselt bei klick den cursur
	if (energyMode == false) {
		energyOn();
	}else{
		energyOff();
	};

}

function energyOn(){
	$('#game').css({'cursor':'url(./images/rocketenergy.cur), default'});
	energyMode = true;
}

function energyOff(){
	$('#game').css({'cursor':'url(./images/rocket.cur), default'});
	energyMode = false;
}

function coins(id){
	coin += 1;
	$('#coin').val(coin);
	$('#box'+id).remove();	
}

$(document).ready(function() { 					//nachdem das HTML-Dokument geladen wurde
	$("button").click(function() {
		if (window.navigator && window.navigator.vibrate){ 	//checks if the device supports vibration
			navigator.vibrate(1000);						//vibrate for 1 second
		}
	});
	$('body').mousemove(function(e) { 			//Achte auf Mausbewegung
		var offset = $(this).offset();			//Berechnung der Mauskoordinaten
		var new_x = (e.clientX - offset.left);
		var new_y = (e.clientY - offset.top);
		$('#showEnergy').css({'top': new_y-6, 'left' : new_x-energyLeft+10, 'width' : energyLeft});
		$('#cursor').css({'top': new_y-5, 'left' : new_x}); //Bild (Rakete) bewegen
		$('#x').val(new_x);						//Ausgabe der x,y Koordinaten under der Frame
		$('#y').val(new_y);
		
		/*if (state == "play" && ((new_x) < -8 || (new_x) > width || (new_y) < -7 || (new_y) > height)) {
			if((number-100) < 0){number = 0}else{number = number-100};
			lose(number, 2);								//Wenn die Maus die Frame verl�sst
		};*/
		

		if (number >= 100) {
			$('#box'+(number-100)).remove();	//Es werden maximal 100 Hindernisse erstellt, fr�here werden gel�scht.
		};			
	});
	$("button").click(function() {
		if (window.navigator && window.navigator.vibrate){ 	//checks if the device supports vibration
			navigator.vibrate(1000);						//vibrate for 1 second
		}
	});	
});	