document.createElement('header');
document.createElement('footer');

$(document).ready(function(){
	// настройки
	var cellSize = { 'width' : 34, 'height' : 23 };	// ширина картинки единорога
	var blocks = {'width' : 10, 'height' : 6, 'total' : this.width * this.height} 		// на сколько блоков делим
	
	

	var fieldSize = { 'width' : $('body').width(), 'height' : $('body').height() }; 
	var blockSize = {
			'width' : ~~(fieldSize.width / (cellSize.width * blocks.width)), 
			'height' : ~~(fieldSize.height / (cellSize.height * blocks.height))
	};
	console.log(blockSize);
	var getRandomBlockCell = function(){
		return {
			x : ~~(Math.random() * (blockSize.width)),
			y : ~~(Math.random() * (blockSize.height))
		} 
	}

	
	var deadFields = []; // тут будем хранить координаты блоков, где не могут быть клетки
	$('.no-cell').each(function(i){
		
		var dimension = { 'width' : $(this).outerWidth(), 'height' : $(this).outerHeight() }
		var offset = $(this).offset();
		
		// ну ещё с бордюрчиком + 1 клетка
		deadFields.push({
			'left' : ~~(offset.left / cellSize.width),
			'right' : ~~((offset.left + dimension.width) / cellSize.width),
			'top' : ~~(offset.top / cellSize.height),
			'bottom' : ~~((offset.top + dimension.height) / cellSize.height)
		});
	});
//	var Field = {
//			cellSize : { 'width' : 34, 'height' : 23 },
//			fieldSize : { 'width' : $('body').width(), 'height' : $('body').height() },
//			deadFields : [],
//			
//			init : function() {
//				
//			},
//			
//			addWish : function(wish) {
//				
//			},
//			
//			getPosition : function(wish) {
//				
//			}
//			
//	}
	
	var Wish = function(data){
		this.data = data;
	};
	
	var inDeadFields = function(pos) {
		var inDead = false;
		$.each(deadFields, function(i, field) {
			if ((pos.x >= field.left) && (pos.x <= field.right) && (pos.y >= field.top) && (pos.y <= field.bottom)) {
				inDead = true;
				console.log('hey!')
				return false;
			};
		});
		return inDead;
	}
	
	var isCorrectCell = function(pos) {
		return !inDeadFields(pos);
	}
	
	var findWishCoords = function(wish) {
		var fieldBlockId = wish.getPosition();
		var wishBlock = {
				x : fieldBlockId % blocks.width,
				y : ~~(fieldBlockId / blocks.width)
		}
		var blockCell = getRandomBlockCell();
		
		var cell = {x : (wishBlock.x * blockSize.width) + blockCell.x, y : (wishBlock.y * blockSize.height) + blockCell.y};
		return isCorrectCell(cell) ? cell : findWishCoords(wish);
		return cell;
	}
	
	Wish.prototype = {
		getName : function() { return this.data.name; },
		getText : function() { return this.data.text; },
		getPosition : function() { return this.data.position; },
		getBubbleHtml : function() { return '<strong>' + this.getName() + '</strong><p>' + this.getText() + '</p>'; },
	}
	
	var addWish = function(wish) {
		var wishCoords = findWishCoords(wish);
		$('<div>').addClass('cell')
		          .data({'wish' : wish})
		          .css({'top' : cellSize.height * wishCoords.y, 'left' : cellSize.width * wishCoords.x})
		          .appendTo($('body'));
	};
	
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
	

//    $('#terminal').terminal("/rpc", {
//        login: true,
//        greetings: "You are authenticated"
//    });
	
	
});
