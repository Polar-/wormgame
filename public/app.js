//Register-function
function Register() {
	var username = $("#username_text").val();
	var password = $("#password_text").val();
	//TODO: POST?
	$.get("/register", {username: username, password: password}, function(res) {
		alert(res);
	});
};