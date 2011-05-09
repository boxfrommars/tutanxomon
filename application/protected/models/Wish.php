<?php
class Wish extends CActiveRecord
{
	// максимальное количество символов в пожелании
	// не забываем менять и в js тоже
	const MAX_TEXT_SIZE = 300;

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
	
    public function defaultScope(){
        return array('order' => 'id');
    }
	
	public function beforeValidate() {
		$this->text = mb_substr($this->text, 0, self::MAX_TEXT_SIZE);
		return parent::beforeValidate();
	}
}