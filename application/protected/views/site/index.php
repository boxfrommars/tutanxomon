
	<header class="no-cell">
		<h1><strong>Маша,</strong> поздравляем с днём рождения! </h1>
	</header>
	<a href="#" data-reveal-id="add-wish" class="button green-button no-cell">Подарить единорога</a>
	<script>
		var wishes = <?php echo json_encode($wishes); ?>;
	</script>
	<div id="add-wish" class="reveal-modal">
		<h2>Поздравить Машу:</h2>
		<form method="post" id="add-wish-form" action="/add">
			<label for="wish[name]">Имя:</label><br />
			<input type="text" name="wish[name]" /><br />
			<label for="wish[text]">Поздравление:</label><br />
			<textarea name="wish[text]"></textarea><br />
			<input type="hidden" name="wish[position]" id="position" value="24" />
			<input type="submit" name="submit" value="поздравить">&nbsp;&nbsp;&nbsp;<span id="waiter"></span>
		</form>
		<a class="close-reveal-modal">&#215;</a>
	</div>
