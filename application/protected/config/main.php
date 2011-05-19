<?php
return array(
	'params' => array(
		'rpcAdmin' => array(
			'user' => 'worksterdam',
			'password' => 'weareworking'
		)
	),
	'basePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',
	'name' => 'Tutanxomon',
	'preload' => array('log'),
	'import' => array(
		'application.models.*',
	),
	'components' => array(
		'db' => array(
			'class' => 'CDbConnection',
			'connectionString' => 'mysql:host=localhost;dbname=tutanxomon',
			'username' => 'tutanxomon',
			'password' => 'CzqGeEKDWtfZS8js',
			'charset' => 'UTF8',
			'emulatePrepare' => true,
		),
		'ipblocker' => array(
			'class' => 'application.components.IPBlocker',
			'sendEmail' => 'maxnebo@gmail.com', //кому отсылать мылы и забаненности
			'errorText' => 'Internal Server Error',
		),
		'urlManager' => array(
			'urlFormat' => 'path',
			'rules' => array(
				'add' => '/site/add',
				'rpc' => '/site/rpc',
				'admin' => '/site/admin',
			),
		),
		'errorHandler' => array('errorAction'=>'site/error'),
		'log' => array(
			'class' => 'CLogRouter',
			'routes' => array(
				array(
					'class' => 'CFileLogRoute',
					'levels' => 'error, warning'
				),
			),
		),
	)
);