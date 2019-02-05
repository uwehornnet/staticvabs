<?php

$password = sha1('password');

session_start();

if (isset($_POST['password'])) {
	if (sha1($_POST['password']) == $password) {
		$_SESSION['loggedIn'] = true;
	} else {
		die ('Incorrect password');
	}
}

if (!isset($_SESSION['loggedIn'])): ?>

	<html><head><title>Login</title></head>
	<body>
	<form method="post">
		<input type="password" name="password">
		<input type="submit" name="submit" value="Login">
	</form>
	</body>
	</html>

	<?php
	exit();
endif;
?>