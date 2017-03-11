var rock = document.getElementById('rock');
var paper = document.getElementById('paper');
var scissors = document.getElementById('scissors');
 
disableAll();
var sock= io();

function Player(room, name, choice){
this.name=name;
this.choice=choice;
this.room = room;
}

var player = new Player();
sock.on('msg', onMessage);

function onMessage(text) {

 var list = document.getElementById('chat');
 var el = document.createElement('li');
 	el.innerHTML = text;
 	list.appendChild(el);
}


sock.on('assign room', function(roomCount){
player.room = roomCount;
});


var form = document.getElementById('chat-form');
form.addEventListener('submit', function (e) {
 	var input = document.getElementById('chat-input');
 	var value = input.value;
    player.name=value;
    input.value = '';
    document.getElementById('nameDiv').style.visibility="hidden";
    document.getElementById('game-controls').style.visibility="visible";
    onMessage('Welcome ' + value);
 	e.preventDefault();
 });





rock.addEventListener('click', function (e) {
    var choice="rock";
    player.choice=choice;
    onMessage('You chose rock');
	sock.emit('get player', player);
    e.preventDefault();
    disableAll();
 });


paper.addEventListener('click', function (e) {
    var choice="paper";
    player.choice=choice;
    onMessage('You chose paper');
    sock.emit('get player', player);
	e.preventDefault();
    disableAll();
 });

scissors.addEventListener('click', function (e) {
    var choice="scissors";
    onMessage('You chose scissors');
    player.choice=choice;
    sock.emit('get player', player);
    disableAll();
	e.preventDefault();
 });


function disableAll(){
    rock.disabled = true;
    paper.disabled = true;	
    scissors.disabled = true;

}

function enableAll(){
    rock.disabled = false;
    paper.disabled = false;	
    scissors.disabled = false;

}

sock.on('start game', function(){
onMessage('You have a partner. Game begins. Make your choice.');
 enableAll();

});


sock.on('restart game', function(){
onMessage('Play New Game. Make your choice');
 enableAll();

});

sock.on('player left', function(){
onMessage('Player left');
sock.emit('find new', player);
 disableAll();
});


sock.on('waiting', function(){
onMessage('You are waiting for a partner.');
 disableAll();
});

