///server.js
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bcrypt = require('bcrypt');
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var auth = require('./auth.js');
var score = require('./score.js');

//set body parsing (for post request.body)
app.use(bodyParser.urlencoded({ extended: true }));

//set public environment
app.use(express.static('public'));

//set module-routes
app.use('/auth', auth);
app.use('/score', score);

//Socket-list for online players
var oPlayers = [];


io.on('connect', function(socket) {

 	io.emit('updateOnline', oPlayers);

	socket.on('disconnect', function() {
		RemovePlayer(socket);
	});

	//Used when player willingly logs out
	socket.on('removePlayer', function() {
		RemovePlayer(socket);
	});

 	socket.on('addPlayer', function(username) {
 		//Check if player is already listed
 		var i = oPlayers.indexOf(username);
	 	if (i == -1) {
	 		socket.id = username;
	 		oPlayers.push(socket.id);

	 		//Broadcast update event
	 		io.emit('updateOnline', oPlayers);
	 	};
 	});

 	//Send player a package containing the rankings
 	//socket.on('getRanking', function(){
 	//	var data = GetRankingList();
    //	socket.emit('getRanking',data);
  	//});

 	 socket.on('chat', function(data){
 	 	//Send message to all connected sockets
    	io.emit('chat', data);
  	});

});

function RemovePlayer(socket) {
	//Check if player already exists
	var i = oPlayers.indexOf(socket.id);

	//Remove player from online players
	if (i != -1) {
		oPlayers.splice(i, 1);
	};
 	io.emit('updateOnline', oPlayers);
};

//Listen on port..
http.listen(3000, function() {
  console.log('listening on port 3000');
});
