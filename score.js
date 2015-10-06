///score.js - module for scores
//Handles inserting and getting scores

var db = require('./db.js');
var express = require('express');
var router = express.Router();

//POST-request for registering, responds with a success or an error message
router.post('/addScore', function(req, res) {
	var username = req.body.username;
	var score = req.body.score;
	db.Query('INSERT INTO score(player, score) VALUES("' + username + '", "' + score + '");', function(err) {
		if (err) console.log(err);
		res.send(err);
	});
});

//POST-request for logging in, responds with a success or an error message
router.post('/getAllScores', function(req, res) {
	//Get top 30 scores in descending order from database
	var query = 'SELECT player, score FROM score ORDER BY score DESC, time ASC LIMIT 30;'
	db.Query(query, function(err, rows) {
		var data = { err: err, rows: rows };
		if (err) console.log(err);
		res.send(data);
	});
});

//Export module as router
module.exports = router;
