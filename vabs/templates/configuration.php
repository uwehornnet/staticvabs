<html>
<head>
	<title>configuration</title>
	<style>
		body{
			margin: 0px;
			padding: 0px;
			font-family: sans-serif;
			font-size: 14px;
		}
		label{
			font-size: .7rem;
		}
	</style>
</head>
<body>
<form action="/vabs/?logout" method="POST">
	<input type="submit" value="logout">
</form>
<form action="/vabs/handler/setupformhandler.php" method="POST" style="display: block; margin: 35px auto; width: 90%; max-width: 500px;">
	<label>API TOKEN</label>
	<input type="text" name="api_token" style="display: block; margin: 0px auto 14px; width: 100%; padding: 7px;" required value="<?= isset($config['api_token']) ? $config['api_token'] : null ?>">
	<label>CLIENT ID</label>
	<input type="text" name="client_id" style="display: block; margin: 0px auto 14px; width: 100%; padding: 7px;" required value="<?= isset($config['api_token']) ? $config['client_id'] : null ?>">
	<label>REFERRER ID</label>
	<input type="text" name="referrer" style="display: block; margin: 0px auto 14px; width: 100%; padding: 7px;" required value="<?= isset($config['referrer']) ? $config['referrer'] : null ?>">
	<label>URL</label>
	<input type="text" name="url" style="display: block; margin: 0px auto 14px; width: 100%; padding: 7px;" required value="<?= isset($config['url']) ? $config['url'] : null ?>">
	<input type="submit" value="Daten speichern">
</form>
<?php if(isset($config['api_token'])):?>
	<form action="" id="vabsSelectorForm" style="display: block; margin: 35px auto; width: 90%; max-width: 500px;">
		<p>Was möchten Sie darstellen?</p>
		<label style="display: block;"><input type="radio" value="booking" name="type"> Buchungsformular</label>
		<label style="display: block;"><input type="radio" value="contact" name="type"> Kontaktformular</label>
		<div class="courseList" style="display: none;">
			<p>Wählen Sie aus</p>
		</div>
		<input type="text" disabled name="placeholder" style="display: none; margin: 14px auto; width: 100%; padding: 7px;">
		<input type="submit" value="Platzhalter generieren" style="margin: 14px auto;">
	</form>
<?php endif; ?>
<script>
	var type;
	var placeholder;
	var query;
	var courses = [];

	var form = document.getElementById('vabsSelectorForm');
	var courseList = document.querySelector('.courseList');
	var outputField = document.querySelector('input[name="placeholder"]');


	if(form) {
		var submitButton = form.querySelector('input[type="submit"]');
		if(submitButton){
			submitButton.addEventListener('click', generatePlaceholder);
		}

		var radioButtons = document.querySelectorAll('input[type="radio"]');
		if(radioButtons) {
			radioButtons.forEach(function(radio) {
				radio.addEventListener('change', updateType)
			});
		}


	}

	function generatePlaceholder(e) {
		e.preventDefault();

		if(type === 'contact'){
			placeholder = '<div class="vabs-api-form" data-formtype="' + type + '"></div>';

		}

		if(type === 'booking') {
			placeholder = '<div class="vabs-api-form" data-formtype="' + type + '" data-query="' + courses + '"></div>';
		}

		outputField.value = placeholder;
		outputField.style.display = 'block';
	}

	function updateType(e) {
		type = e.target.value;
		if(type === 'contact') {
			courseList.style.display = 'none';
		}
		if(type === 'booking') {
			if(!query){
				api('get_all_courses').then(function(list) {
					query = list;
					for(var key in list) {
						var label = document.createElement('label');
						var checkbox = '<input type="checkbox" name="course" value="' + list[key].id + '"/>' + list[key].name;
						label.innerHTML = checkbox;
						label.style.display = 'block';
						label.style.margin = '14px auto';
						label.querySelector('input[type="checkbox"]').addEventListener('change', updateCourseList);
						courseList.append(label);
					}
				});
			}
			courseList.style.display = 'block';
		}
	}

	function updateCourseList(e) {
		if(e.target.checked){
			courses.push(e.target.value);
		}else{
			courses.pop(e.target.value)
		}
	}

	function api(method) {
		var url = '/vabs/handler/ajaxHandler.php';
		return fetch(url + '?method=' + method,
			{
				method: 'POST',
				body: {}
			}).then(function(response) {
				return response.json();
			})
	}
</script>
</body>
</html>