///register.js

var bcrypt = require('bcrypt');
var mysql = require('mysql');

//Init MySQL-connection -info
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '****',
	database : 'worm'
});

//Adds player to database
exports.RegisterPlayer = function(username, password, callback) {
	//Generate encrypted password hash using bcrypt
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
			console.log(hash);
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
	connection.query('SELECT username FROM player', function(err, rows) {
		if (err) {
			err = 'Error database connection failed.';
		};
		return callback(err, rows);
	});
};