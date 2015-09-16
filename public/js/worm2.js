

// key codes
var esc = 27;
var leftArrow = 37;
var upArrow = 38;
var rightArrow = 39;
var downArrow = 40;
var space = 32;

var w = 87;
var a = 65;
var s = 83;
var d = 68;

var m = 77;

var gameboardHeight = 20;
var gameboardWidth = 20;
var applePos = 0;
var player;
var player2 = null;
var dead = false;

//controls
document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == upArrow) {
        if (player.direction != "down"){
			player.direction = "up";
    	}
		
    }
    else if (e.keyCode == downArrow) {
        if (player.direction != "up"){
			player.direction = "down";
    	}
    }
    else if (e.keyCode == leftArrow) {
        if (player.direction != "right"){
			player.direction = "left";
    	}
    }
    else if (e.keyCode == rightArrow) {
        if (player.direction != "left"){
			player.direction = "right";
    	}
    }

	if (player2 != null)
	{
		if (e.keyCode == w) {
			if (player2.direction != "down"){
				player2.direction = "up";
			}
			
		}
		else if (e.keyCode == s) {
			if (player2.direction != "up"){
				player2.direction = "down";
			}
		}
		else if (e.keyCode == a) {
			if (player2.direction != "right"){
				player2.direction = "left";
			}
		}
		else if (e.keyCode == d) {
			if (player2.direction != "left"){
				player2.direction = "right";
			}
		}
	}
	
    if (e.keyCode == space) {
		document.getElementById("score").innerHTML = "Score: 0";
		dead = false
		clearInterval(player.update);
		for (var i = 0; i < player.wormLength; i++)
		{
			document.getElementById(player.position[i]).style.backgroundColor = "white";
		}
		
		player = new worm(5, 61, "green", "player1");
		player.update = setInterval(function(){player.drawWorm();}, 150)
		
		
    }
	
	// if (e.keyCode == m && dead == true) {
		// dead  = false;
		// player = new worm(5, 61, "green", "player1");
		// player.update = setInterval(function(){player.drawWorm();}, 150)

		// player2 = new worm(5, 81, "black", "player2");
		// player2.update = setInterval(function(){player2.drawWorm();}, 150)
		
		
		// gameboard += '<p id = score2 style="text-align:center"> Player2 Score: 0</p>'
		
    // }
}


function initGame() {
	
	initGameboard()
	player = new worm(5, 61, "green", "player1");
	// player.update = setInterval(function(){player.drawWorm();}, 150);
	
	addFood()
}

function initGameboard(){
	console.log("gameboard started");
	
	var gameboard = '<table id="gameboard">';
	gameboard += '<p id = score style="text-align:center">Score: 0</p>'
	// gameboard += '<p id = score2 style="text-align:center"></p>'
	for(var i = 0; i<gameboardHeight; i++)
	{
		gameboard += '<tr>';
		
		for(var j = 0; j<gameboardWidth; j++)
		{
			var id = (j+(i*gameboardHeight));
			var grid = '<td id = "' + id + '" title= "' + id +'"></td>';
			gameboard += grid;
		}
		gameboard += '</tr>';
	}
	
	gameboard += '<p style="text-align color: black: center"> Contros: arrow keys, wasd. Space to reset. M for multiplayer</p>'
	gameboard += '</table>';
	
	document.getElementById('gameboard').innerHTML = gameboard;
}

function addFood(){
	var okFood = true;
	
	while(okFood){

		applePos = Math.floor((Math.random() * (gameboardWidth* gameboardHeight-1)));
		for(i = 0; i < player.wormLength; i++){
			if(applePos == player.position[i]){
				console.log("apple in snake. trying again");
				okFood = true;
				break;
			}
			else 
			{ 
				okFood = false;
			}
		}
	}
	
	var x = document.getElementById("gameboard").getElementsByTagName("td");
    x[applePos].style.backgroundColor = "red";

}

var worm = function (startLength, startPos, color, name){
	this.wormLength = startLength;
	this.startPos = startPos;
	this.color = color;
	this.name = name;
	
	this.direction = "right";
	this.position = [];
	this.score = 0;
	this.indexMoving = 0;
	this.update;
	
	// draw worm on gameBoard
	for (var i = 0; i < this.wormLength; i++)
	{
		this.position.push(this.startPos + i );
		document.getElementById(this.startPos+i).style.backgroundColor = this.color;
	}
}

worm.prototype.drawWorm = function() {
	
	// move the last piece of the worm to the front
	var nextIndex = 0
	var nextPosition;
	
	
	if (this.indexMoving == 0)
	{
		nextIndex = this.wormLength - 1;		
	}
	else
	{
		nextIndex = this.indexMoving - 1;	
	}
	

	// add the next position of the worm // currently only works with 20x20 gameboard
	if (this.direction == "right")
	{	
		nextPosition = this.position[nextIndex] + 1;
		if (nextPosition % gameboardWidth == 0)
		{
			nextPosition = nextPosition -gameboardWidth;
		}	
	}
	
	else if (this.direction == "left")
	{
		nextPosition = this.position[nextIndex] - 1;
		
		if ((nextPosition-gameboardWidth+1) % gameboardWidth == 0)
		{
			nextPosition = nextPosition +gameboardWidth;
			
		}
	}
	
	else if (this.direction == "up")
	{
		nextPosition = this.position[nextIndex] - gameboardHeight;
		
		if (nextPosition < 0)
		{
			nextPosition = gameboardHeight*gameboardWidth + nextPosition
		}	
	}
	
	else if (this.direction == "down")
	{
		nextPosition = this.position[nextIndex] + gameboardHeight;
		
		if (nextPosition >= 400)
		{
			
			nextPosition = nextPosition - gameboardHeight*gameboardWidth
			
		}

		
	}
	
	//check if apple is eaten
	if (nextPosition == applePos)
	{	
		this.score += 1;
		console.log("apple eaten")
		
		document.getElementById("score").innerHTML = "Score: " + this.score.toString()

		this.position.push(applePos)
		
		document.getElementById(applePos).style.backgroundColor = this.color;
			
		this.wormLength += 1
		addFood()
	}
	
	// check if there is a collision
	for(var i = 0; i < this.wormLength-1; i++)
	{
		if (nextPosition == this.position[i])
		{
			console.log("dead")
			alert("Game Over. Press Space to reset")
			dead = true;
			clearInterval(this.update);
			break;
		}
	}
	
	if (dead == false)
	{
		// clear worm
		document.getElementById(this.position[this.indexMoving]).style.backgroundColor = "white";
		
		// move the worm to next position
		this.position[this.indexMoving] = nextPosition;
		document.getElementById(this.position[this.indexMoving]).style.backgroundColor = this.color;
	}
	
	this.indexMoving += 1;
	if (this.indexMoving == this.wormLength)
	{
		this.indexMoving = 0;
	}
};






