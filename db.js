//db.js - Database module
//Handles database connection and queries

var mysql = require('mysql');

//Init MySQL-connection
var connection = mysql.createConnection({
	host     : process.env.OPENSHIFT_MYSQL_DB_HOST ||'localhost',
	port     : process.env.OPENSHIFT_MYSQL_DB_PORT || '3306',
	user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'root',
	password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD || '*****',
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
