<?php

$route = $_SERVER['HTTP_REFERER'];

$data = array(
	'api_token' => $_POST['api_token'] ? $_POST['api_token'] : null,
	'client_id' => $_POST['client_id'] ? $_POST['client_id'] : null,
	'url' => $_POST['url'] ? $_POST['url'] : null,
	'referrer' => $_POST['referrer'] ? $_POST['referrer'] : null
);

$file = dirname(realpath(__FILE__), 2) . '/config.php';

if(file_put_contents($file, '<?php $config = ' . var_export($data, true) . ';')){
	header("Location:" . $route, true, 302);
}else{
	echo 'Upps something wnet wrong';
	die;
}


