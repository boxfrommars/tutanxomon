<?php

class SiteController extends CController
{
	
	public function actionIndex() {
		$this->render('index', array(
			'wishes' => $this->_prepareToJSON(Wish::model()->findAll())
		));
	}
	
	public function actionAdd() {
		if (!empty($_POST['wish'])){
			$wish = new Wish();
			$wish->setAttributes($_POST['wish']);
			if($wish->save()) {
				echo json_encode(array('success' => true, 'wish' => $wish->attributes));
				return;
			}
		}
		echo json_encode(array('success' => false));
	}
	
	public function actionRpc() {
		include_once Yii::app()->basePath . '/vendors/terminal/json-rpc.php';
		handle_json_rpc(new Terminal());
	}
	
	public function actionAdmin() {
		$this->render('admin', array(
			'wishes' => $this->_prepareToJSON(Wish::model()->findAll())
		));
	}
	
	protected function _prepareToJSON($arrayOfActiveRecords){
		$arrayOfArrays = array();
		foreach ($arrayOfActiveRecords as $activeRecord) {
			$arrayOfArrays[] = $activeRecord->getAttributes();	
		}
		return $arrayOfArrays;
	}
	
	/**
	 * This is the action to handle external exceptions.
	 */
	public function actionError() {
	    if($error=Yii::app()->errorHandler->error)
	    {
	    	if(Yii::app()->request->isAjaxRequest)
	    		echo $error['message'];
	    	else
	        	$this->render('error', $error);
	    }
	}
}