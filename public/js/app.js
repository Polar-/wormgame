//Function for initialization, loaded on body-onload
function init() {
	InitLoginUI();
	CheckSession();
};

//Register-function
function Register() {
	var username = $("#username_text").val();
	var password = $("#password_text").val();

	//TODO: CHECK USERNAME / PASSWORD VALUES

	//Create md5 hash of password
	var pw_hash = md5(password);

	//Create data-object for user credentials
	var data = { username: username, password: pw_hash };
	$.post("/register", data, function(res) {
		alert(res);
	});
};

//Register-function
function Login() {
	var username = $("#username_text").val();
	var password = $("#password_text").val();

	//Create hash of password
	var pw_hash = md5(password);

	//Create data-object for user credentials
	var data = { username: username, password: pw_hash };
	$.post("/login", data, function(res) {
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
	$.post("/login/checksession", data, function(res) { 
		if (!res.err)
		{
			return callback(res.username);
		};
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