<?php
class Terminal {
	
	protected function _auth($user, $passwd) {
		if (strcmp($user, Yii::app()->params->rpcAdmin['user']) == 0 && strcmp($passwd, Yii::app()->params->rpcAdmin['password']) == 0) {
			return md5($user . ":" . $passwd);
		} else {
			throw new Exception("Wrong Password");
		}
	}
	
	protected function _checkToken($token) {
		return (strcmp(md5(Yii::app()->params->rpcAdmin['user'] . ":" . Yii::app()->params->rpcAdmin['password']), $token) == 0);
	}
	
	static $login_documentation = "login to the server (return token)";
	
	public function login($user, $passwd) {
		return $this->_auth($user, $passwd);
	}
	
	static $ls_documentation = "список пожеланий начиная с последнего добавленного. по умолчанию возвращает 10 последних.\n
								если выполнен с одним параметром (например, 'ls 14'), то вернёт данное количество последних записей.\n 
								если вы полнен с двумя параметрами (напр. 'ls 17 3'), то вернёт последние 17 не считая последних 3";
	
	public function ls($token, $limit = 10, $offset = 0) {
		if ($this->_checkToken($token)) {
			
			$wishes = Wish::model()->recently($limit, $offset)->findAll();
			
			$list = array();
			foreach ($wishes as $wish) {
				$list[] = '#' . $wish->id . ' ' . $wish->text . "\n";
			}
			return $list;
		} else {
			throw new Exception("Access Denied");
		}
	}
	
	static $count_documentation = "считает количество пожеланий";
	
	public function count($token) {
		if ($this->_checkToken($token)) {
			return $wishes = Wish::model()->count();
		} else {
			throw new Exception("Access Denied");
		}
	}
	
	static $remove_documentation = 'удаляет пожелание с заданным id';
	
	public function delete($token, $id) {
		if ($this->_checkToken($token)) {
			
			$wishes = Wish::model()->findAll();
			return 'wish with id #' . (int) $id . ' was deleted, reload page to see thats TRUE :)';
		} else {
			throw new Exception("Access Denied");
		}
	}
}