///server.js
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bcrypt = require('bcrypt');
var auth = require('./auth.js');
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

//set body parsing (for post request.body)
app.use(bodyParser.urlencoded({ extended: true }));

//set public environment
app.use(express.static('public'));

//set authentication module route
app.use('/auth', auth);


//Talk with player
io.on('connection', function(socket){

 	console.log("New player connected.");

 	//Send player a package containing online player names
 	socket.on('getPlayers', function(){
 		console.log("sending players");
 		var data = GetPlayerList();
    	socket.emit('getPlayers',data);
  	});

 	//Send player a package containing the rankings
 	socket.on('getRanking', function(){
 		console.log("sending ranking");
 		var data = GetRankingList();
    	socket.emit('getRanking',data);
  	});

 	 socket.on('chat', function(data){
    	socket.broadcast.emit('chat', data);
    	socket.emit('chat',data);
    	console.log(data);
  	});

});

//Make a data-package out of an array containing rankings / online players
var players = ["Hatti","Vatti"];
var highscore_players = ["Matti", "Katti", "Ratti", "Vatti", "Patti"];
var highscore_scores = ["9001", "8000", "6999", "5300", "4970"];

function GetPlayerList(){
	var data = "";
	for (var i=0; i < players.length; i++){
		data = data + players[i] + "</br>";
	}	 
	return data;
}

function GetRankingList(){
	var data = "";
	for (var i=0; i < highscore_players.length; i++){
		data = data + highscore_players[i] + ": " + highscore_scores[i]+"</br>";
	}	 
	return data;
}

//Listen on port..
http.listen(3000, function() {
  console.log('listening on port 3000');
});
