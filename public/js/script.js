document.createElement('header');
document.createElement('footer');

$(document).ready(function(){
	var cellSize = { 'width' : 34, 'height' : 23 };
	var fieldSize = { 'width' : $('body').width(), 'height' : $('body').height() };
	
	var Wish = function(data){
		this.data = data;
	};
	
	Wish.ptototype = {
		getName : function() { return this.data.name; },
		getText : function() { return this.data.text; },
		getPosition : function() { return {x : 10, y : 10} },
		getBubbleHtml : function() { return '<strong>' + this.getName() + '</strong><p>' + this.getText() + '</p>'; },
	}
	
	var addWish = function(wish) {
		var pos = wish.getPosition();
		$('<div>').addClass('cell')
		          .data({'wish' : wish})
		          .css({'top' : cellSize.height * pos.y, 'left' : cellSize.width * pos.x})
		          .appendTo($('body'));
	};
	
	var deadFields = []; // тут будем хранить координаты блоков, где не могут быть клетки
	$('.no-cell').each(function(i){
		
		var dimension = { 'width' : $(this).width(), 'height' : $(this).height() }
		var offset = $(this).offset();
		
		// ну ещё с бордюрчиком + 1 клетка
		deadFields.push({
			'left' : ~~(offset.left / cellSize.width) - 1,
			'right' : ~~((offset.left + dimension.width) / cellSize.width) + 2,
			'top' : ~~(offset.top / cellSize.height) - 1,
			'bottom' : ~~((offset.top + dimension.height) / cellSize.height) + 2
		});
	});
	
	$.each(wishes, function(i, wishData){
		wish = new Wish(wishData);
		addWish(wish);
	});
	
	$('.cell').CreateBubblePopup();
	$('.cell').each(function(){
		var $cell = $(this);
		$cell.SetBubblePopupOptions({
			'position' : 'right',
			'align' : 'center',
			'innerHtml': $cell.data('wish').getBubbleHtml(),
			'innerHtmlStyle' : {'text-align' : 'left', 'font-size': '1.1em'},
			'themeName' : 	'all-azure',
			'themePath' : 	'/js/bubble/themes',
			'alwaysVisible' : false,
			'closingDelay' : 200
		});
	});
});