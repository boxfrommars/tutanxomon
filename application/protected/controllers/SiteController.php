<?php
class SiteController extends CController {
	
	public function actionIndex() {
		$this->render('index', array(
			'wishes' => Wish::model()->findAll(array('order' => 'id'))
		));
	}
	
	public function actionAdd() {
		if (!empty($_POST['wish']) && $this->validateCom()){
			$wish = new Wish();
			$wish->setAttributes($_POST['wish']);
			if($wish->save()) {
				echo CJSON::encode(array('success' => true, 'wish' => $wish));
				return;
			}
		}
		echo CJSON::encode(array('success' => false));
	}
	
	public function actionAdmin() {
		$this->render('admin', array(
			'wishes' => Wish::model()->findAll()
		));
	}
	
	public function actionRpc() {
		include_once Yii::app()->basePath . '/vendors/terminal/json-rpc.php';
		handle_json_rpc(new Terminal());
	}
	
	public function validateCom() {
		$name = $_POST['name'];
		return ((mb_strpos($_POST['name'], 'Тиреч') === false) && (mb_strpos($_POST['name'], 'Tirech') === false));
	}
	
	public function actionError() {
	    if($error=Yii::app()->errorHandler->error) {
	    	if(Yii::app()->request->isAjaxRequest) 
	    		echo $error['message'];
	    	else 
	    		$this->render('error', $error);
	    }
	}
}