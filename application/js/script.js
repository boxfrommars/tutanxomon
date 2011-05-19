document.createElement('header');
document.createElement('footer');

$(document).ready(function(){
	
	// немного спагетти для затравочки (добавляем субхедер со ссылкой на модальное окно-список
	// со всеми пожеланиями
	var $subHeader = $('<h2>').appendTo('header');
	var refreshWishCounters = function(){
		var count = wishes.length;
		
		var subHeaderText = '<em>И дарим тебе ';
			subHeaderText += pluralizeWord(count, ['замечательного', 'замечательных', 'замечательных']) + ' '
			subHeaderText += pluralizeWord(count, ['единорога', 'единорогов', 'единорогов']) + ' ;)</em>';
		
		$subHeader.html(subHeaderText);
		
		var wishListHeaderText = 'Всего ' + count + ' ' + pluralizeWord(count, ['поздравление', 'поздравления', 'поздравлений']) + ':';
		$('#wish-list-block h2').html(wishListHeaderText);
	}
	
	refreshWishCounters();
		
	$('#show-wishes').live('click', function(){
		$('#wish-list-block').reveal();
		return false;
	});
	// настройки счётчика символов в поле 
	characterCountOptions = {
			'elm' : '#add-wish-form textarea', // селектор текстового поля, в котором считаем символы
			'allowed' : 200, // максимальное количество символов в пожелании не забываем менять и в php (модель Wish)
			'warning' : 25,  // когда останется столько возможных символов, это уже варнинг
		}
	
	// настройки нашей сетки с поздравлениями
	var $field = $('body'); // в нашем случае весь body, по хорошему, если всё правильно, то можно и любой блок пользовать
	var cellSize = { 'width' : 34, 'height' : 23 };	// ширина картинки единорога
	var blocks = {'width' : 7, 'height' : 4} 		// на сколько блоков делим поле
	
	blocks.total = blocks.width * blocks.height; // всего блоков
	var fieldSize = { 'width' : $field.width(), 'height' : $field.height() }; // размер поля в пикселях 
	
	// размер одного блока в клетках
	var blockSize = {
			'width' : ~~(fieldSize.width / (cellSize.width * blocks.width)), 
			'height' : ~~(fieldSize.height / (cellSize.height * blocks.height))
	};
	
	/**
	 * находим случайные координаты клетки внутри (относительно блока) в клетках
	 * 
	 * @return object randomBlockCell {x : int, y : int}
	 */
	var getRandomBlockCell = function(){
		return {
			x : ~~(Math.random() * (blockSize.width)),
			y : ~~(Math.random() * (blockSize.height))
		} 
	}
	
	// тут будем хранить координаты блоков, где не могут быть клетки пожеланий
	var deadFields = []; 
	// пробегаем по всем блокам с классом no-cell и добавляем их координаты в deadFields
	$('.no-cell').each(function(i){
		var dimension = { 'width' : $(this).outerWidth(), 'height' : $(this).outerHeight() } // размер в пикселях
		var offset = $(this).offset(); // положение в пикселях (кстати, посмотреть, что будет, если field не будет body)
		
		// добавляем координаты в хранилище наших "мёртвых" блоков
		deadFields.push({
			'left' : ~~(offset.left / cellSize.width),
			'right' : ~~((offset.left + dimension.width) / cellSize.width),
			'top' : ~~(offset.top / cellSize.height),
			'bottom' : ~~((offset.top + dimension.height) / cellSize.height)
		});
	});
	
	// сосбственно наш объект пожелания
	var Wish = function(data){
		this.data = data;
	}
	Wish.prototype = {
		getName : function() { return this.data.name; },
		getId : function() { return this.data.id; },
		getText : function() { return this.data.text; },
		getPosition : function() { return this.data.position; },
		getBubbleHtml : function() { 
			var $bubble = $('<div>');
			$('<span>').text('#' + this.getId()).addClass('wish-id').appendTo($bubble);
			$('<strong>').text(this.getName()).appendTo($bubble);
			$('<p>').text(this.getText()).appendTo($bubble);
			return $bubble.html(); 
		},
	};
	
	/**
	 * определяем, попадает ли клетка с заданными координатами в "мёртвый блок"
	 * 
	 * @param object coord {x : int, y : int}. x,y -- координаты клетки в клетках 
	 * @return bool inDead
	 */
	var inDeadFields = function(coord) {
		var inDead = false;
		$.each(deadFields, function(i, field) {
			if ((coord.x >= field.left) && (coord.x <= field.right) && (coord.y >= field.top) && (coord.y <= field.bottom)) {
				inDead = true;
				return false;
			};
		});
		return inDead;
	}
	
	/**
	 * проверяем, можем ли мы добавить в данную координату клетку (пока только проверка на deadFields)
	 * 
	 * @param object coord {x : int, y : int}. x,y -- координаты клетки в клетках 
	 * @return bool isCorrect
	 */
	var isCorrectCell = function(coord) {
		return !inDeadFields(coord);
	}
	
	/**
	 * находим координаты клетки (в клетках)
	 * 
	 * @return object cell {x : int, y : int}
	 * @param Wish wish
	 */
	var findWishCoords = function(wish) {
		var fieldBlockId = wish.getPosition(); // id блока (его порядковый номер) [0, blocks.total) 
		// координаты блока (в блоках)
		var wishBlock = {
			x : fieldBlockId % blocks.width,       // остаток от деления ID блока на количество блоков в строке (очевидно позиция x)
			y : ~~((fieldBlockId / blocks.width) % blocks.width)    // целая часть от деления ID блока на количество блоков в строке (очевидно позиция y)
		}
		var blockCellCoords = getRandomBlockCell(); // внутри и относительно блока случайно находим координаты клетки, в которой будет пожелание
		
		// вычисляем абсолютное положение клетки относительно лв-угла поля (в клетках)
		var coords = {
			x : (wishBlock.x * blockSize.width) + blockCellCoords.x, 
			y : (wishBlock.y * blockSize.height) + blockCellCoords.y
		};
		
		// уходим в рекурсию, если клетка "мёртвая". 
		// @TODO надо бы сделать прерывание, со смещением блока если после, скажем, 5-и рекурсий не нашли "живую" клетку.  
		return isCorrectCell(coords) ? coords : findWishCoords(wish); 
	}
	
	/**
	 * добавляем к клетке попап на основе данных записанных в data
	 * @param object $cell необходимое условие -- объект должен обладать методом .getBubbleHtml()
	 * 
	 * @return null
	 */
	var addPopup = function($cell) {
		var offset = $cell.offset();
		offset.right = fieldSize.width - offset.left;
		$.extend(offset, {
			'right' : fieldSize.width - (offset.left + cellSize.width),
			'bottom' : fieldSize.height - (offset.top + cellSize.height)
		});
		var bubbleWidth = 400;
		
		// тут надо ещё немного подумать, вв углах выглядит не очень и есть способы улучшить
		var vMax = 4 * cellSize.height;
		var hMax = 6 * cellSize.width;
		
		var position = 'right', align = 'center';
		
		// верхняя часть экрана
		if (offset.top <= vMax) {
			// если при этом не углы -- просто показываем пожелание снизу
			if (offset.left >= hMax && offset.right >= hMax) {
				position = 'bottom';
			} else {   // а вот если углы, то будет смотреться немного криво
				align = 'top';
			}
		}
		
		// нижняя часть экрана
		if (offset.bottom <= vMax) {
			// если при этом не углы -- просто показываем пожелание снизу
			if (offset.left >= hMax && offset.right >= hMax) {
				position = 'top';
			} else {   // а вот если углы, то будет смотреться немного криво
				align = 'bottom';
			}
		}
		var position = (offset.right < bubbleWidth && ((position !== 'bottom') && position !== 'top')) ? 'left' : position;
		
//		var position = (fieldSize.width - offset.left) < bubbleWidth ? 'left' : 'right';
//		var align = (offset.top <= 4 * cellSize.height) ? 'top' : 'center';
//		align = (fieldSize.height - offset.top) <= 4 * cellSize.height ? 'bottom' : align;
		$cell.CreateBubblePopup({
			'position' : position,
			'align'	 : align,
			'innerHtml': $cell.data('wish').getBubbleHtml(),
			'innerHtmlStyle' : {'text-align' : 'left', 'font-size' : '1.1em', 'overflow' : 'hide', 'max-width' : bubbleWidth + 'px'},
			'themeName' : 	'all-azure',
			'themePath' : 	'/js/bubble/themes',
			'alwaysVisible' : false,
			'closingDelay' : 200,
			'width' : bubbleWidth
		});
	}

	/**
	 * добавляем пожелание (добавляем клетку с единорогом (css-класс 'cell'), а также навешиваем на неё баббл-попап)
	 * 
	 * @param Wish wish объект нашей клетки
	 * @return object $wish jquery-объект добавленного пожелания
	 */
	var addWish = function(wish) {
		var wishCoords = findWishCoords(wish); // находим координату нашего пожелания (в клетках от лв-угла поля)
		$wish = addCell(wishCoords, {'wish' : wish}, 'cell');
		$('#wish-list').append('<div>' + wish.getBubbleHtml() + '</div>');
		addPopup($wish);
		return $wish;
	}
	
	/**
	 * добавляет клетку-копирайт, вешаем на неё показ модального окна с инфой о разработчиках
	 * 
	 * @return null
	 */
	var addCopyright = function() {
		var copyrightCoords = {
			x : ~~(fieldSize.width / cellSize.width) - 3, 
			y : ~~(fieldSize.height / cellSize.height) - 2
		};
		$copyrightCell = addCell(copyrightCoords, {}, 'cell copy-cell');
		$copyrightCell.click(function(e){
			e.preventDefault();
			$('#copy-info').reveal();
		});
	}
	
	/**
	 * добавляет клетку на поле. также, добавляет координаты этой клетки в deadFields, чтобы избежать 
	 * добавления другой клетки в это же поле (пока подразумевается, что размер клетки 1x1, но это легко исправить)
	 * 
	 * @param object coords координаты (в клетках). eg {x : 7, y : 12}
	 * @param object data данные,которые привяжем к элементу
	 * @param string classNames css классы, которые добавим к элементу (разделённые пробелом)
	 * @return object $cell jquery-объект добавленной клетки 
	 */
	var addCell = function(coords, data, classNames) {
		$cell = $('<div>').addClass(classNames)
			.data(data)
			.css({'top' : cellSize.height * coords.y, 'left' : cellSize.width * coords.x}) // коорд. есть, размер клетки есть, добавляем
			.appendTo($field);
		deadFields.push({
			'left' : coords.x,
			'right' : coords.x,
			'top' : coords.y,
			'bottom' : coords.y
		});
		return $cell;
	}
	
	var informer = {
		'elm' : $('#informer'),
		'add' : function(html, type) {
			type = (null == type) ? 'info' : type;
			informer.elm.html($('<span>').addClass(type).html(html));
		},
		'clear' : function(){
			informer.elm.html('')
		}
	};
	
	addCopyright();
	
	// пробегаемся по всем поздравлениям (они уже должны присутствовать в теле страницы в виде объекта)
	// на основе данных строим объект Wish, добавляем его на страницу
	if (typeof wishes !== 'undefined') {
		$.each(wishes, function(i, wishData){
			wish = new Wish(wishData);
			addWish(wish);
		});
	} 

	// навешиваем на текст поздравления счётчик символов
	(function(options){
		var $elm = $(options.elm);
		if ($elm.length > 0) {
			var calculateChars = function($elm) {
				var count = $elm.val().length;
				var available = options.allowed - count;
				
				var informerType = (available <= options.warning) ? 'warning' : 'info';
				informerType = (available < 0) ? 'error' :  informerType;
				
				informer.add(available, informerType)
			}
			
			calculateChars($elm);
			$elm.keyup(function(){ calculateChars($elm)} );
			$elm.change(function(){ calculateChars($elm)} );
		}
	})(characterCountOptions);
	// навешиваем обработчик на отправку форму:
	// добавляем позицию пожелания, отправляем данные аяксом, получаем обыкновенный объект с пожеланием
	// преобразовываем в Wish-объект, добавляем его, закрываем форму, 
	// показываем новодобавленное пожелание и мерцаем его клеткой 
	$('#add-wish-form').submit(function(){
		var $form = $(this);
		
		// если сообщение длиннее чем допустимо -- предупреждаем и не сохраняем
		if ($form.find('textarea').val().length > characterCountOptions.allowed) {
			informer.add('Ошибка: текст больше ' + characterCountOptions.allowed + ' символов', 'error');
			return false
		}
		
		informer.add('Подождите...', 'info');
		
		$form.find('#position').val(~~(Math.random() * blocks.total));
		var data = $form.serialize();
		
		var url = '/add';
		// немного фигни для ie, чтобы не кешировал
		var d = new Date();
		url += '?t=' + d.getTime();
		
		$.ajax({
			'url' : url,
			'type' : 'post',
			'dataType' : 'json',
			'data' : data,
			'success' : function(response) {  // должен приходить в формате {'success' : true, wish : {данные}}
				if (response.success) {
					informer.clear();
					$form[0].reset();
					$wish = addWish(new Wish(response.wish));
					wishes.push(response.wish);
					// паренёк, который разработал reveal говорит, что сделает метод, который будет закрывать окно пограммно в след. версии,
					// пока я нашёл такой выход (в любом случае он будет оборачивать именно этот триггер)
					$('#add-wish').trigger('reveal:close');
					$wish.fadeOut().fadeIn().fadeOut().fadeIn().fadeOut().fadeIn().fadeOut().fadeIn();
					$wish.ShowBubblePopup();
					refreshWishCounters();
				} else {
					informer.add('Проверьте правильность всех полей', 'error');
				}
			},
			'error' : function(response) {
				informer.add('Что-то пошло не так, попробуйте позже', 'error');
			}
		});
		return false;
	});
});

/**
 * Функция возвращает окончание для множественного числа слова на основании числа и массива окончаний
 * 
 * @param  iNumber Integer Число на основе которого нужно сформировать окончание
 * @param  aEndings Array Массив слов или окончаний для чисел (1, 4, 5), например ['яблоко', 'яблока', 'яблок']
 * @return String
 */
function pluralizeWord(iNumber, aEndings)
{
	var sEnding, i;
	iNumber = iNumber % 100;
	if (iNumber>=11 && iNumber<=19) {
		sEnding=aEndings[2];
	}
	else {
		i = iNumber % 10;
		switch (i) {
			case (1): sEnding = aEndings[0]; break;
			case (2):
			case (3):
			case (4): sEnding = aEndings[1]; break;
			default: sEnding = aEndings[2];
		}
	}
	return sEnding;
}