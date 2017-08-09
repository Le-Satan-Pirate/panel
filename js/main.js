/**
 *  Cookies утилиты
 */
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)===' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function getMousePos(el, evt) {
	var rect = el.getBoundingClientRect();
	return {
		x: (evt.clientX - rect.left),
		y: (evt.clientY - rect.top),
		w: rect.width,
		h: rect.height
	};
}

jQuery(function($) {

    var $window = $(window); //$window.width() - for example .___.

	//Selectors init by jQuery bootstrap-select plugin:
    $('.select1').selectpicker();
    $('.select2').selectpicker();

	var opts = {
		handle: '.grid-stack-item-content'
	};
	$('.grid-stack').gridstack({
		handle: opts.handle || '.grid-stack-item-content',
		width: 16,
		draggable: {
			handle: '.grid-stack-item-content',
			scroll: true,
			appendTo: 'body'
		},
		verticalMargin: '0.01px' // !!! BUG: при нулевых значениях начинается мистика и может неадекватно повести себя перемещения блоков по-вертикали -_-
	}); // Инициализируем gridstack сетку
	
	/**
	 *  Менеджер состояний сетки блоков, отвечающий за сохранение/загрузку
	 */
	var GridSettings = {
		load: function(){
			var gridSettings = getCookie('grid-settings');
			if(gridSettings){
				var elemState = [];
				elemState = gridSettings.split('&');
				for(var i=0;i<elemState.length;i++){
					var bParts = elemState[i].split(':');
					var id = bParts[0];
					if(!id){ continue; } // Не указан id
					var p = bParts[1].split(',');
					var el = document.getElementById(id);
					if(!el){ continue; } // Элемент с таким id не найден
					
					el.setAttribute('data-gs-x', 	  ~~p[0]);
					el.setAttribute('data-gs-y', 	  ~~p[1]);
					el.setAttribute('data-gs-width',  ~~p[2]);
					el.setAttribute('data-gs-height', ~~p[3]);
				}
				return true;
			}
			return false;
		},
		save: function(event, items) {	// -> "el1:0,0,4,2&el2:1,0,4,3"	
			var $e = document.querySelectorAll('[data-gs-x]');
			var state = '';
			for(var i=0;i<$e.length;i++){
				if(!$e[i].id){ continue; }
				state += ($e[i].id + ":" 
					+ ~~$e[i].getAttribute('data-gs-x') 	 + ','
					+ ~~$e[i].getAttribute('data-gs-y') 	 + ','
					+ ~~$e[i].getAttribute('data-gs-width')  + ','
					+ ~~$e[i].getAttribute('data-gs-height') + '&'
				);
			}
			setCookie('grid-settings', state, 1000);
			return state;
		}
	};
	window.GridSettings = GridSettings;
	
	/**
	 *  Прочитаем настройки из кукис-строки, которую распарсим ._.
	 */
	GridSettings.load();
	
	/**
	 *  При изменениях сетки запишем данные в кукисы пользователя
	 *  ** WARNING ** : DOM элемент сетки должен содержать аттрибут id! 
	 */
	$('.grid-stack').on('change', GridSettings.save);	

	/* //ref:useless-sidebar?
	$('.open-panel').click(function() {
	 	$('.left-sidebar').toggleClass('active');
	});
	*/
	
	/**
	 *  Таб-меню %(
	 */
	var TabMenu = {
		_assign: {},
		assign: function(el){
			this._assign[el] = $(el);
			var fc = function(e){
				var $this = $(this);
				var parentUL = $this.parent();
				var tabContent = $(el + ' .tab-container');
				if($this.hasClass('active')) {
					return false;
				}	
				parentUL.children().removeClass('active');
				$this.addClass('active');
				tabContent.find('.tab-item').hide();
				var showById = $( $this.find('a').attr('href'));			
				tabContent.find(showById).fadeIn(500); 				 
				e.preventDefault();				
			};
			var $elem = $(el + ' .tab-list');
			$elem.on.apply($elem, ['click', 'li', fc]);
			$(el + ' .tab-list li').first().addClass('active');
			$(el + ' .tab-item').first().show();			
		}
	};
	window.TabMenu = TabMenu;
	
	TabMenu.assign('.tabs-block');
	TabMenu.assign('.third-block');
	TabMenu.assign('.right-side');
	
	//TabMenu.assign('.second-block');	// См. метку 'useless-sidebar?'
	
	/**
	 *  Прокрутка по вертикали при наведении мышки на края блока. Some magic ^^
	 */
	var Scroller = {
		_assign: {},
		assign: function(id, params){
			var el = document.getElementById(id);
			if(!el){return 0;}
			this._assign[id] = el;
			el.style.overflow = 'hidden';
			
			params = params||{};
			el._scrollerArea  = params.area || 32;
			el._scrollerSpeed = params.speed || 1;
			
			var self = this;
			el.onMouseMove = function(e, fork){	
				!fork ? clearTimeout(this._scrollerTimer) : 0;
				var mPos = getMousePos(el, e);
				if(/*(mPos.y > 0)&&*/(mPos.y < this._scrollerArea)&&(el.scrollTop)){
					el.scrollTop += /*-3;*/ (-1 - el.scrollHeight*0.005 * (1 - mPos.y/this._scrollerArea) * el._scrollerSpeed * (window.devicePixelRatio ? 1/window.devicePixelRatio: 1));
				} else {					
					if(/*(mPos.y < mPos.h)&&*/(mPos.h - mPos.y < this._scrollerArea)&&(el.scrollTop + mPos.h  < el.scrollHeight)){
						el.scrollTop += /*4;*/ (2 + el.scrollHeight*0.005 * (1 - (mPos.h-mPos.y)/this._scrollerArea) * el._scrollerSpeed * (window.devicePixelRatio ? 1/window.devicePixelRatio: 1));
					}
				}
				var $el = this;
				this._scrollerTimer = setTimeout(function(){
					$el.onMouseMove(e, true);
				}, 20);
			};
			el.onMouseLeave = function(e){
				clearTimeout(this._scrollerTimer);
			};
			el.addEventListener("mousemove", el.onMouseMove);
			el.addEventListener("mouseout", el.onMouseLeave);			
		}
	};
	window.Scroller = Scroller;
	
	Scroller.assign('graph', {
		area: 48,
		speed: 1.2
	}); // Пример-"жертва" X_x
	
});