jQuery(function($) {

    var $window = $(window); //$window.width() - for example .___.

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
			$(el).find('.tab-item').hide();
			$(el + ' .tab-item').first().show();	
			return this._assign[el];
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
	
	/*
	Scroller.assign('graph', {
		area: 48,
		speed: 1.2
	}); // Пример-"жертва" X_x
	*/
	
});