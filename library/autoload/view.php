<?php
class View {
	
	protected $_path = '';
	
	public function __construct() {
		$this->setPath(F3::get('GUI'));
	}
	
	public function setPath($path) {
		$this->_path = $path;
	}
	
	public function render($template, $data) {
		foreach ($data as $key => $value) {
			$$key = $value;
			ob_start();
			require $this->_path . '/' . $template;
			return ob_get_clean();
		}
	}
}