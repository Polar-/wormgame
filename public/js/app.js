//Function for initialization, loaded on body-onload
function init() {
	//Check if user is logged in using sessionID
	CheckSession(function(username) {
		//Change UI if logged in
		if (username) {
			InitLogoutUI(username);	
		} else {
			InitLoginUI();
		};
	});

	//Event listeners for enter-keypress
	$(".login").keyup(function(e) {
		console.log("keypress");
		if (e.keyCode == 13) {
			Login();
		};
	});
	$("#chat_message").keyup(function(e) {
		if (e.keyCode == 13) {
			Chat();
		};
		console.log("keypress");
	});

	$("#chat_test").html("");
};

function SendScore(score) {
	//Check if user is logged in
	CheckSession(function(username) {
		if (username) {
			//Create data object and send it to server
			var data = { username: username, score: score };
			$.post("/score/addScore", data, function() {
				if (err) {
					alert("ERROR: Could not send score.");
				};
				UpdateScores();
			});
		};
	});
};

function UpdateScores() {
    // TODO : FUNCTION FOR UPDATING HIGHSCORES TO UI
};

function Register() {
	var username = $("#username_text").val();
	var password = $("#password_text").val();

	//TODO: CHECK USERNAME / PASSWORD VALUES

	//Create md5 hash of password
	var pw_hash = md5(password);

	//Create data-object for user credentials
	var data = { username: username, password: pw_hash };
	$.post("auth/register", data, function(res) {
		alert(res);
	});
};

function Login() {
	var username = $("#username_text").val();
	var password = $("#password_text").val();

	//Create hash of password
	var pw_hash = md5(password);

	//Create data-object for user credentials
	var data = { username: username, password: pw_hash };
	$.post("auth/login", data, function(res) {
		if (res.err) {
			alert(res.err);
		} else {
			InitLogoutUI(username);
			document.cookie = "sessionID=" + res.sessionID;
		};
	});
};

//Removes sessionID-cookie
function Logout() {
	document.cookie = "sessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	InitLoginUI();
};

//Checks if current sessionID matches server sessionID
function CheckSession(callback) {
	var sessionID = GetCookie("sessionID");
	var data = { sessionID: sessionID };
	$.post("auth/checksession", data, function(res) { 
		return callback(res.username);
	});
};

//Show logout UI elements
function InitLogoutUI(username) {
	$(".login").hide();
	$(".logout").show();
	$("#loginInfo").html("Logged in as " + username + ".");
};

//Show login UI elements
function InitLoginUI() {
	$(".login").show();
	$(".logout").hide();
};

//Get cookie by cookie name
function GetCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
