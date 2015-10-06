//db.js - Database module
//Handles database connection and queries

var mysql = require('mysql');

//Init MySQL-connection
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '*****',
	database : 'worm'
});

//Handles all database queries
exports.Query = function(query, callback) { 
	connection.query(query, function(err, rows) {
		if (err) {
			console.log(err);
			err = 'Database error.';
		};
		return callback(err, rows);
	});
};
