'use strict';

let http = require('http');
let express = require('express');
let socketio = require('socket.io');

let app = express();
let server = http.createServer(app);
let io = socketio(server);
let roomArray = [];
let waitingPlayer;
let waitRoom=0;
let roomCount=0;


io.on('connection', onConnection);

app.use(express.static(__dirname + '/'));
server.listen(8080, () => console.log('Ready to work!'));

function onConnection(sock) {

    if (waitingPlayer) {
        console.log('waiting room' + waitRoom);
        var  room = 'Room'+waitRoom;
        sock.join(room);
        sock.emit('assign room', waitRoom);
         io.sockets.in(room).emit('start game');
         waitingPlayer = null;
     
    } else {
        roomCount=roomCount+1;
        var  room = 'Room'+roomCount;
        waitingPlayer = sock;
        waitRoom = roomCount;
        sock.join(room);
        sock.emit('waiting');
        roomArray[roomCount]=[];
        sock.emit('assign room', roomCount);
     }

    sock.on('get player',  function(player){ 
        var k = player.room;
        roomArray[k].push(player);
        if(roomArray[k].length==2){
                  sortChoices(sock, k);
                  newGame(k); 
        }
             
    });

    sock.on('disconnect', function(){
        io.sockets.in(room).emit('player left');
    }); 

    sock.on('find new', function(player){
          if (waitingPlayer) {
              console.log('waiting room' + waitRoom);
              var  room = 'Room'+waitRoom;
              sock.emit('assign room', waitRoom);
              sock.join(room);
              io.sockets.in(room).emit('start game');
              waitingPlayer = null;}
        else{
            waitingPlayer = sock;
            waitRoom= player.room; 
            roomArray[waitRoom]=[];
            var  room = 'Room'+waitRoom;
            io.sockets.in(room).emit('waiting');
        }
    }); 

}







function sortChoices(sock, k){
var  room = 'Room'+k;
      if(roomArray[k][0].choice=='paper'){
        if(roomArray[k][1].choice=='paper') io.sockets.in(room).emit('msg','Game is a draw. Both players chose paper.' );
        else if(roomArray[k][1].choice=='rock')  io.sockets.in(room).emit('msg', roomArray[k][0].name + ' chose paper. ' +  roomArray[k][1].name + ' chose rock. ' + roomArray[k][0].name + ' wins.');
        else if(roomArray[k][1].choice=='scissors')  io.sockets.in(room).emit('msg', roomArray[k][0].name + ' chose paper. ' + roomArray[k][1].name + ' chose scissors. ' +  roomArray[k][1].name +' wins.');
    }
    
    if(roomArray[k][0].choice=='rock'){
        if(roomArray[k][1].choice=='paper')  io.sockets.in(room).emit('msg', roomArray[k][0].name + ' chose rock. ' + roomArray[k][1].name + ' chose paper. ' +  roomArray[k][1].name + ' wins.'  );
        else if(roomArray[k][1].choice=='rock')  io.sockets.in(room).emit('msg', 'Game is a draw. Both players chose rock.');
        else if(roomArray[k][1].choice=='scissors')  io.sockets.in(room).emit('msg', roomArray[k][0].name + ' chose rock. ' + roomArray[k][1].name + ' chose scissors. ' + roomArray[k][0].name + ' wins. ');
    }
    
    if(roomArray[k][0].choice=='scissors'){
        if(roomArray[k][1].choice=='paper')  io.sockets.in(room).emit('msg',roomArray[k][0].name + ' chose scissors. ' + roomArray[k][1].name + ' chose paper. ' +  roomArray[k][0].name + ' wins.');
        else if(roomArray[k][1].choice=='rock')  io.sockets.in(room).emit('msg', roomArray[k][0].name + ' chose scissors. ' + roomArray[k][1].name + ' chose rock. ' +  roomArray[k][1].name+' wins.');
        else if(roomArray[k][1].choice=='scissors')  io.sockets.in(room).emit('msg',  'Game is a draw. Both players chose scissors.');
    }
    

}


function newGame(k){
var  room = 'Room'+k;
io.sockets.in(room).emit('restart game');
 roomArray[k]=[];
 }

