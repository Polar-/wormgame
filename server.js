///server.js
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bcrypt = require('bcrypt');
var auth = require('./auth.js');
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
	auth.Register(username, password, function(err) {
		if (err) {
			res.send(err);
		} else {
			res.send('Your account has been successfully registered.');
		};
	});
});

//POST-request for logging in, responds with a success or an error message
app.post('/login', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	auth.Login(username, password, function(err, sessionID) {
		var data = { err: err, sessionID: sessionID };
		if (err) {
			res.send(data);
		} else {
			console.log('Logged in player ' + username);
			res.send(data);
		};
	});
});

app.post('/login/checksession', function(req, res) {
	var sessionID = req.body.sessionID;
	auth.CheckSession(sessionID, function(err, success, username) {
		data = { err: err, username: username };
		if (!success) {
			res.send(data);
		} else {
			console.log('Logged in player ' + username + ' using sessionID.');
			res.send(data);
		};
	});
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

//Listen on port..
http.listen(3000, function() {
  console.log('listening on port 3000');
});