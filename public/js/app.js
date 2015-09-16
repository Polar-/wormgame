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