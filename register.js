///register.js
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
	CheckIfExists(username, function(err) {
		if (err) {
			console.log('ERROR: ' + err);
			callback(err);
			return;
		} else {
			connection.query('INSERT INTO player(username, password) VALUES("' + username + '", "' + password + '");', function(err) {
				callback(err);
			});
		};
	});
};


//Checks, if given information already exists in db
 function CheckIfExists(username, callback) {
	GetAllPlayers( function(err, players) {
		if (err) {
			callback(err);
			return;
		} else {
			for (i = 0; i < players.length; i++) {
				if (players[i].username == username) {
					err = "Username already exists, please choose another username.";
				};
			};
			callback(err);
		};
	});
};

//Gets all players from database
function GetAllPlayers(callback) {
	connection.query('SELECT username FROM player', function(err, rows) {
		callback(err, rows);
	});
};