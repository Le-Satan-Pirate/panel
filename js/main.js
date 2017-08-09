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
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}


jQuery(function($) {

    $('.right-side-container').mCustomScrollbar({
        axis:"y"
    });



    $('.statistics-container').mCustomScrollbar({
		axis:"x"
	});

    $('.graph').mCustomScrollbar({
        axis:"y"
    });

    $('.tabs-block').mCustomScrollbar({
        axis:"y"
    }); 

    $('.trades-block').mCustomScrollbar({
        axis:"y"
    });

    var $window = $(window);

    if($window.width()>=1140) {
        $('.custom-scroll').mCustomScrollbar({
            axis:"y"
        });
    }

   // $('.select1').selectpicker();
   // $('.select2').selectpicker();

    function statisticsHeight(height) {
        if($window.width()<=1100) return false;
        var height = height - $('.plot').height() - 45;
        $('.statistics-container').height(height + 'px')
    }

    function customHeight() {
        var height = $window.height() - $('header').height() - 8;
        $('.custom-scroll').height(height + 'px');
        statisticsHeight(height);
        $('.trades-block').css('max-height', height - 227 + 'px')
    }

    customHeight();

    $window.resize(customHeight)
	
	
	$('.grid-stack').gridstack({
		verticalMargin: '0.01px' // !!! BUG: при нулевых значениях начинается мистика и может неадекватно повести себя перемещения блоков по-вертикали -_-
	}); // Инициализируем gridstack сетку
	
	/**
	 *  Прочитаем настройки из кукис-строки, которую распарсим ._.
	 */
	(function(){
		var gridSettings = getCookie('grid-settings');
		if(gridSettings){
			var elemState = [];
			elemState = gridSettings.split('/');
			for(var i=0;i<elemState.length;i++){
				var bParts = elemState[i].split(':');
				var id = bParts[0];
				if(!id){ continue; }
				var p = bParts[1].split(',');
				var el = document.getElementById(id);
				if(!el){ continue; }
				
				el.setAttribute('data-gs-x', ~~p[0]);
				el.setAttribute('data-gs-y', ~~p[1]);
				el.setAttribute('data-gs-width', ~~p[2]);
				el.setAttribute('data-gs-height', ~~p[3]);
			}
		}
		
	})();
	
	/**
	 *  При изменениях сетки запишем данные в кукисы
	 *  ** WARNING ** : элемент сетки должен содержать аттрибут id! 
	 */
	$('.grid-stack').on('change', function(event, items) {		
		var $e = document.querySelectorAll('[data-gs-x]');
		var state = '';
		for(var i=0;i<$e.length;i++){
			if(!$e[i].id){ continue; }
			state += ($e[i].id + ":" 
				+ ~~$e[i].getAttribute('data-gs-x') + ','
				+ ~~$e[i].getAttribute('data-gs-y') + ','
				+ ~~$e[i].getAttribute('data-gs-width') + ','
				+ ~~$e[i].getAttribute('data-gs-height') + '/'
			);
		}
		setCookie('grid-settings', state, 1000);
	});	
	
	/*
    dragula([document.getElementById('trades-block')], {
        moves: function (el, container, handle) {
            console.log(arguments)
            return true
        }
    })
    
	
	dragula([document.getElementById('statistics'), document.getElementById('right-side')], {
        direction: 'horizontal',
  		moves: function (el, container, handle) {
    		return handle.classList.contains('handle');
  		},
        accepts: function(el, target, parent) {
            // if(parent.classList.contains('right-side') && target.children.length >= 2) return false;
            return true;
        }
	}).on('drop', function (el, container, parent) {
        if($(parent).hasClass('statistics')) {
            $('.statistics-container').mCustomScrollbar("destroy");
            $('.statistics-container').mCustomScrollbar({
                axis:"x"
            });
        }
        if($(container).hasClass('statistics')) {
            if(container.children.length > 2) {
                var item = $(container).children().last();
                $('.right-side').append(item);
                $('.statistics-container').mCustomScrollbar("destroy");
                $('.statistics-container').mCustomScrollbar({
                    axis:"x"
                });
            }
        }
    });

    dragula([document.getElementById('left-side')], {
        moves: function (el, container, handle) {
            return handle.classList.contains('mega-handle');
        }
    })

    */

	// $('.open-panel').click(function() {
	// 	$('.left-sidebar').toggleClass('active');
	// })

	$('.tabs-block .tab-list').on('click', 'li', function(e) {
        var $this = $(this);
        var parentUL = $this.parent();
        var tabContent = $('.tabs-block .tab-container');
        if($this.hasClass('active')) {
            return false;
        }
        parentUL.children().removeClass('active');
        $this.addClass('active');
        tabContent.find('.tab-item').hide();
        var showById = $( $this.find('a').attr('href'));
        tabContent.find(showById).fadeIn(400);  
        e.preventDefault();
    });

    $('.tabs-block .tab-list li').first().addClass('active');
    $('.tabs-block .tab-item').first().show();


	$('.third-block .tab-list').on('click', 'li', function(e) {
        var $this = $(this);
        var parentUL = $this.parent();
        var tabContent = $('.third-block .tab-container');
        if($this.hasClass('active')) {
            return false;
        }
        parentUL.children().removeClass('active');
        $this.addClass('active');
        tabContent.find('.tab-item').hide();
        var showById = $( $this.find('a').attr('href'));
        tabContent.find(showById).fadeIn(400);  
        e.preventDefault();
    });

    $('.third-block .tab-list li').first().addClass('active');
    $('.third-block .tab-item').first().show();

    $('.right-side .tab-list').on('click', 'li', function(e) {
        var $this = $(this);
        var parentUL = $this.parent();
        var tabContent = $('.right-side .tab-container');
        if($this.hasClass('active')) {
            return false;
        }
        parentUL.children().removeClass('active');
        $this.addClass('active');
        tabContent.find('.tab-item').hide();
        var showById = $( $this.find('a').attr('href'));
        tabContent.find(showById).fadeIn(400);  
        e.preventDefault();
    });

    $('.right-side .tab-list li').first().addClass('active');
    $('.right-side .tab-item').first().show();
})