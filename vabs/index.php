<?php

require('handler/authentificationHandler.php');

if(isset($_SESSION['loggedIn'])) {

	if(file_exists(realpath(__DIR__). '/config.php')) {
		require_once(realpath(__DIR__). '/config.php');
	}

	include_once('templates/configuration.php');

	if(isset($_GET['logout'])) {
		session_destroy();
		header("Location: /", true, 302);
	}

	exit();
};
