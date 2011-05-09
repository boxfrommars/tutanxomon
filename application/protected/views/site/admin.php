
	<header class="no-cell">
		<h1>Если ты здесь, ты знаешь, что делать :)</h1>
	</header>
	<script>
		var wishes = <?php echo CJSON::encode($wishes); ?>;
	</script>
	<script type="text/javascript" src="/js/terminal/jquery.terminal-0.3.4.min.js"></script>
	
	<script type="text/javascript">
	// терминал
	$(document).ready(function(){
		var $terminal = $('#terminal');
		if ($terminal.length > 0) {
			$terminal.terminal("/rpc", { // инициируем отключённый терминал
				login: true,
				enabled: false,
				greetings: "You are authenticated"
			});
			$terminal.isEnabled = false;  // текущее состояние терминала
			// если была нажата тильда, то (в зависимости от текущего состояния). показываем/включаем или скрываем/отключаем терминал
			$(document.documentElement).keypress(function(e) { 
				
				if (e.which == 96) { 
					if (!$terminal.isEnabled) {
						$terminal.show();
						$terminal.enable();
						$terminal.isEnabled = true;
					} else {
						$terminal.disable();
						$terminal.hide();
						$terminal.isEnabled = false;
					}
				}
			})
		}
	});
	</script>
