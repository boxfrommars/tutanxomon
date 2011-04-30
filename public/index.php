<?php
define('APPLICATION_PATH', realpath('../application'));

require_once '../library/F3/F3.php';									// подключаем Fat-Free Framework (http://fatfree.sourceforge.net)
F3::set('AUTOLOAD', '../library/autoload/'); 							// установка пути к плагинам.
F3::set('DB', array(													// параметры соединения с базой
					'dsn' => 'mysql:host=localhost;port=3306;dbname=tutanxomon',
					'user' => 'tutanxomon',
					'password' => 'CzqGeEKDWtfZS8js'
));
												// заносим его в наше хранилище 
F3::set('GUI', APPLICATION_PATH . '/layouts/');
F3::set('E404','e404.htm');
F3::set('VIEW', new View());

/**
 * Собственно, наш единственный контроллер для пожеланий
 */
class WishesController {

	/**
	 * действие для списка пожеланий
	 */
	public function index() {
		$wishesModel = new Axon('wishes'); 								//подключение к таблице comments БД
		$wishes = $wishesModel->find();
		echo F3::get('VIEW')->render('layout.phtml', array('wishes' => $wishes));
	}

	/**
	 * действие для нового пожелания
	 */
	public function add() {
		$wishesModel = new Axon('wishes');
		$wishesModel->copyFrom('REQUEST');
		$wishesModel->save();
		
		$this->index();
	}
}

$WishesController = new WishesController();

F3::route('GET /', array($WishesController, 'index'));
F3::route('POST /', array($WishesController, 'add'));

F3::run();