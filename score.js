///score.js - module for scores
//Handles inserting and getting scores

var db = require('./db.js');
var express = require('express');
var router = express.Router();

//POST-request for registering, responds with a success or an error message
router.post('/addScore', function(req, res) {
	var player = req.body.player;
	var score = req.body.score;
	db.Query('INSERT INTO score(player, score) VALUES("' + player + '", "' + score + '");', function(err) {
		if (err) console.log(err);
		res.send(err);
	});
});

//POST-request for logging in, responds with a success or an error message
router.post('/getAllScores', function(req, res) {
	//TODO: GET SCORES FROM DATABASE
	//db.Query(query, function(data) {
		//res.send(data);
	//});
});

//Export module as router
module.exports = router;
