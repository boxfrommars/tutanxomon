<?php
define('APPLICATION_PATH', realpath('../application'));

require_once '../library/F3/F3.php';									// подключаем Fat-Free Framework (http://fatfree.sourceforge.net)
F3::set('AUTOLOAD', '../library/autoload/'); 							// установка пути к плагинам.
F3::set('DB', array(													// параметры соединения с базой
					'dsn' => 'mysql:host=localhost;port=3306;dbname=tutanxomon',
					'user' => 'tutanxomon',
					'password' => 'CzqGeEKDWtfZS8js'
));

$view = new View(array('path' => APPLICATION_PATH . '/layouts'));		// инициируем вид
F3::set('VIEW', $view);													// заносим его в наше хранилище 

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
		require_once('../application/layouts/layout.phtml');			// рендерим вид
	}
}

$WishesController = new WishesController();

F3::route('GET /', array($WishesController, 'index'));
F3::route('GET /add', array($WishesController, 'add'));

F3::run();