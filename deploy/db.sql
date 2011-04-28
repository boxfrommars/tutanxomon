CREATE TABLE  `tutanxamon`.`wishes` (
`id` SMALLINT NOT NULL AUTO_INCREMENT ,
`name` VARCHAR( 255 ) NOT NULL ,
`text` TEXT NOT NULL ,
`twitter_name` VARCHAR( 255 ) NOT NULL ,
PRIMARY KEY (  `id` )
) ENGINE = MYISAM ;

INSERT INTO  `tutanxomon`.`wishes` (
`id` ,
`name` ,
`text` ,
`twitter_name`
)
VALUES (
NULL ,  'maxnebo',  'Побльше тебе безумно красивых и чудесных твитов!',  'maxnebo'
);
