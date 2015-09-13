///server.js
var express = require('express');
var app = express();
var https = require('http').Server(app);
var register = require('./register.js');

//set public environment
app.use(express.static('public'));

//GET-request for registering, responds with a success or an error message
//TODO: POST?
app.get('/register', function(req, res) {
	var username = req.query.username;
	var password = req.query.password;
	register.RegisterPlayer(username, password, function(err) {
		if (err) {
			res.send(err.toString());
		} else {
			res.send('Your account has been successfully registered.');
		};
	});
});

https.listen(3000, function() {
  console.log('listening on port 3000');
});