///auth.js

var bcrypt = require('bcrypt');
var mysql = require('mysql');

//Init MySQL-connection -info
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'karhu',
	database : 'worm'
});

//Adds player to database
exports.Register = function(username, password, callback) {
	CheckIfExists(username, function(err) {
		if (err) {
			console.log('ERROR: ' + err);
			return callback(err);
		};
		//Encrypt password hash with bcrypt
		bcrypt.hash(password, 8, function(err, hash) {
			if (err) {
				err = 'There was an error in password encryption.';
				return callback(err);
			};
			//Insert username and password-hash into database
			connection.query('INSERT INTO player(username, password) VALUES("' + username + '", "' + hash + '");', function(err) {
				if (err) {
					err = 'Database error.';
				};
				return callback(err);
			});
		});
	});
};

//Login player using username and password
exports.Login = function(username, password, callback) {
	console.log('Logging in player ' + username + '...');
	GetAllPlayers(function(err, players) {
		if (err) {
			return callback(err);
		};
		var found = false;
		for (var i = 0; i < players.length; i++) {
			//If username is found
			if (players[i].username == username) {
				found = true;
				//Compare password hashes with bcrypt - res = true if passwords match
				bcrypt.compare(password, players[i].password, function(err, res) {
					if (!res) {
						err = 'Incorrect password. Please check your password.';
						console.log('ERROR: Incorrect password.');
					} else {
						//Create random sessionID
						var sessionID = CreateSessionID(20);
						connection.query('UPDATE player SET session = "' + sessionID + '" WHERE username = "' + username + '";');
					};
					return callback(err, sessionID);
				});
			};
		};
		//If username is not found
		if (!found) {
			err = 'User not found. Check your username and password.';
			console.log('ERROR: User not found.')
			return callback(err);
		};
	});
};

exports.CheckSession = function(sessionID, callback) {
	console.log('Checking session ID ' +  sessionID + '...');
	//Get all players from db
	GetAllPlayers(function(err, players) {
		if (err) {
			return callback(err, false, username);
		};
		var found = false;
		for (var i = 0; i < players.length; i++) {
			//If sessionID matches player.sessionID return success and username
			if (players[i].session == sessionID) { 
				found = true;
				return callback(err, true, players[i].username);
			};
		};
		//If no matching sessionID is found
		if (!found) {
			err = 'SessionID not found.';
			console.log('ERROR: SessionID not found.');
			return callback(err, false);
		};
	});
};

//Checks, if given information already exists in db
function CheckIfExists(username, callback) {
	GetAllPlayers(function(err, players) {
		if (err) {
			return callback(err);
		};
		for (i = 0; i < players.length; i++) {
			if (players[i].username == username) {
				err = 'Username already exists, please choose another username.';
			};
		};
		return callback(err);
	});
};

//Gets all players from database
function GetAllPlayers(callback) {
	connection.query('SELECT * FROM player;', function(err, rows) {
		if (err) {
			err = 'Error database connection failed.';
		};
		return callback(err, rows);
	});
};

//Creates a random string of numbers and letters
function CreateSessionID(length) {
	var avchars = 'abcdefghijklmnopqrstuwvxyz1234567890';
	var chars = [];
	var rstring = "";
	for (var i = 0; i < avchars.length; i++) {
		chars[i] = avchars.charAt(i);
	};
	for (var i = 0; i < length; i++) {
		var tmpChar;
		var random = Math.floor(Math.random() * avchars.length);
		tmpChar = chars[random];
		random = Math.random();
		//Randomly make letter uppercase
		if (random > 0.5) {
			tmpChar = tmpChar.toUpperCase();
		};
		rstring += tmpChar;
	};
	console.log('Created sessionID: ' + rstring);
	return rstring;
};