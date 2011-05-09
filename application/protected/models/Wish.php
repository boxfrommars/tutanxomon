<?php
class Wish extends CActiveRecord
{
	public static function model($className=__CLASS__){
		return parent::model($className);
	}

	public function rules() {
		return array(
		array('name, text, position', 'required'),
		);
	}

	public function tableName(){
		return 'wishes';
	}

	public function toArray() {
		$arr = array();
		foreach ($this as $key => $value) {
			$arr[$key] = $value;
		}
		return $arr;
	}
	
	/**
	 * named scopes, хуле, очень удобны, молодцы Yii
	 * говорим о том, что нужно получить последние по id записи со смещением $offset
	 * 
	 * @param int $limit
	 * @param int $offset
	 */
	public function recently($limit = 10, $offset = 0){
		$this->getDbCriteria()->mergeWith(array(
			'order' => 'id DESC',
			'limit' => $limit,
			'offset' => $offset,
		));
		return $this;
	}
}