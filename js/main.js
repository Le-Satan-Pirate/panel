


jQuery(function($) {
		/*
        $('.grid-stack').gridstack({
			width: 60,
		  // !!! BUG: при нулевых значениях начинается мистика и может неадекватно повести себя перемещения блоков по-вертикали -_-
		
	}); 
	*/

	
	 // Инициализируем gridstack сетку
	

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