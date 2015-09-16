///server.js
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bcrypt = require('bcrypt');
var register = require('./register.js');
var bodyParser = require('body-parser');
var io = require('socket.io')(http);

//set public environment
app.use(express.static('public'));

//set body parsing (for post request.body)
app.use(bodyParser.urlencoded({ extended: true }));

//POST-request for registering, responds with a success or an error message
app.post('/register', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	register.RegisterPlayer(username, password, function(err) {
		if (err) {
			res.send(err.toString());
		} else {
			res.send('Your account has been successfully registered.');
		};
	});
});

//Listen on port..
http.listen(3000, function() {
  console.log('listening on port 3000');
});

//Talk with player
io.on('connection', function(socket){

 	console.log("New player connected.");

 	//Send player a package containing online player names
 	socket.on('getPlayers', function(){
 		console.log("sending players");
 		var data = "TEST PLAYER 1</br>TEST PLAYER 2</br>TEST PLAYER 3</br>";
    	socket.emit('getPlayers',data);
  	});

 	//Send player a package containing the rankings
 	socket.on('getRanking', function(){
 		console.log("sending ranking");
 		var data = "TEST RANK 1</br>TEST RANK 2</br>TEST RANK 3</br>";
    	socket.emit('getRanking',data);
  	});
});