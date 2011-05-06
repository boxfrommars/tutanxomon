<?php

class Terminal {
	static $login_documentation = "login to the server (return token)";
	public function login($user, $passwd) {
		if (strcmp($user, 'demo') == 0 && strcmp($passwd, 'demo') == 0) {
			// If you need to handle more than one user you can create
			// new token and save it in database
			// UPDATE users SET token = '$token' WHERE name = '$user'
			return md5($user . ":" . $passwd);
		} else {
			throw new Exception("Wrong Password");
		}
	}

	static $ls_documentation = "list directory if token is valid";
	public function ls($token, $path) {
		if (strcmp(md5("demo:demo"), $token) == 0) {
			return 'hey';
		} else {
			throw new Exception("Access Denied");
		}
	}
	static $whoami_documentation = "return user information";
	public function whoami() {
		return array("your User Agent" => $_SERVER["HTTP_USER_AGENT"],
                 "your IP" => $_SERVER['REMOTE_ADDR'],
                 "you acces this from" => $_SERVER["HTTP_REFERER"]);
	}

	public function remove($path, $id) {
		return 'removed!';
	}

}
