/**
 *  GridDOMJs by Le-Satan-Pirate
 */

 /**
  *  Client утилиты
  */
var _Client = {
	Browser:{
		getName: function(){ /** Return: String **/
			var browsers = ["opera","msie","chrome","safari","firefox"];
			var ua = window.navigator.userAgent||navigator.userAgent;
			
			for(var i=0;i<browsers.length;i++){
				if(RegExp("("+browsers[i]+")","ig").test(ua)){return browsers[i]}
			}
			return "unknown";
		},
		getVersion: function(){ /** Return: String **/
			var nav = window.navigator||navigator;
			var ua = nav.userAgent||nav.userAgent;
			var browser = this.getName();
			var version = nav.appVersion||-1;
			if(browser!="unknown"){
				version = ua.substring(ua.toLowerCase().lastIndexOf(browser)+browser.length+1).substring(0,ua.indexOf(" ")+1);
			}
			return version;
		},
		getVersionMajor: function(){ /** Return: Int **/
			var ver = this.getVersion();
			return parseInt(ver,10);			  
		},
		isMobile: function(){ /** Return: Boolean **/
			var ua = window.navigator.userAgent||navigator.userAgent;
			if(    ua.match(/Android/i)
				|| ua.match(/webOS/i)
				|| ua.match(/iPhone/i)
				|| ua.match(/iPad/i)
				|| ua.match(/iPod/i)
				|| ua.match(/BlackBerry/i)
				|| ua.match(/Windows Phone/i))
				{
					return true;
				} else {
					return false;
				}
		}
	},
	
	OS:{
		getName: function(){ /** Return: String **/
			var osLabels = ["win","mac","x11","linux"]; // x11 == unix
			
			var av = window.navigator.appVersion||navigator.appVersion;
			
			for(var i=0;i<osLabels.length;i++){
				if(RegExp("("+osLabels[i]+")","ig").test(av)){return osLabels[i]}
			}
			return "unknown";
		}
	},
	
	Screen:{
		getView: function(){ /** Return: Object: {w: Int, h: Int} **/
			var _w = 0, _h = 0;
			if( typeof( window.innerWidth ) == 'number' ) {
				//Non-IE
				_w = window.innerWidth;
				_h = window.innerHeight;
			} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
				//IE 6+ in 'standards compliant mode'
				_w = document.documentElement.clientWidth;
				_h = document.documentElement.clientHeight;
			} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
				//IE 4 compatible
				_w = document.body.clientWidth;
				_h = document.body.clientHeight;
			}
			return {w:_w,h:_h};	
		},
		getResolution: function(){ /** Return: Object: {w: Int, h: Int} **/
			return {w: screen.width, h:screen.height};
		}			
	}
};
_Client.Screen.resolution = _Client.Screen.getResolution(); /* Init resolution */
_Client.Screen.initView = _Client.Screen.getView(); /* Init view */

 
 
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
 
/**
 *  Рассчитаем ширину и высоту скроллбаров. Они нам ещё пригодятся:
 */
(function(){
	var $i = document.createElement('p');
	$i.style.width = '100%';
	var o = document.createElement('div');
	o.style.position = 'absolute';
	o.style.top = o.style.left = '0px';
	o.style.visibility = o.style.overflow = 'hidden';
	o.style.width = $i.style.height = '200px';
	o.style.height = '150px';
	o.appendChild($i);
	document.body.appendChild(o);
	var w1 = $i.offsetWidth;
	var h1 = $i.offsetHeight;
	o.style.overflow = 'scroll';
	var w2 = $i.offsetWidth;
	var h2 = $i.offsetHeight;
	if(w1 === w2){ w2 = o.clientWidth; }
	if(h1 === h2){ h2 = o.clientWidth; }
	document.body.removeChild(o);
	window.scrollbarWidth = w1-w2;
	window.scrollbarHeight = h1-h2;
})(); 

var onEvent = function (el, event, fc) {  
	document.attachEvent ? el.attachEvent('on' + event, fc) : el.addEventListener(event, fc, !0);  
}; 

var rectangleCollision = function(x1, y1, w1, h1, x2, y2, w2, h2){	
	return !(x1 >= x2+w2 || x1+w1 <= x2 || y1 >= y2+h2 || y1+h1 <= y2);
};

/**
 *  Удаление DOM узла. Утилиты
 */
/*
if(!Element.prototype.remove){	
	Element.prototype.remove = function() {
		this.parentElement.removeChild(this);
	};
	Object.defineProperty(Element.prototype, 'remove', { enumerable: false });
}
if(!NodeList.prototype.remove && !HTMLCollection.prototype.remove){	
	NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
		for(var i = this.length - 1; i >= 0; i--) {
			if(this[i] && this[i].parentElement) {
				this[i].parentElement.removeChild(this[i]);
			}
		}
	};
	Object.defineProperty(NodeList.prototype, 'remove', { enumerable: false });
	Object.defineProperty(HTMLCollection.prototype, 'remove', { enumerable: false });
}
*/
/**
 *  DOM утилиты
 */
var DOMUtils = {
	isElement: function(elem){ // ID or Element
		if(!elem){ return false; }
		var protoName = Object.prototype.toString.call(elem);//elem.constructor.name;
		//var regexp 	  = /HTML+([\S\s]+?)Element/i;
		var regexp = /Element/i;  // Element / HTMLElement / HTMLDivElement / ...
		return regexp.test(protoName.toString());
	},
	clearEl: function(elemId){ //
		var el;
		this.isElement(elemId)?(el = elemId):(el = document.getElementById(elemId));
		
		if(el){
			while(el.firstChild){
				el.removeChild(el.firstChild);
			}
		} else {
			console.error("DOMUtils.clearEl:",elemId,"not found");
		}
	},
	moveEl: function(sourceId, destId, clear, cb){
		var source, dest;
		this.isElement(sourceId)?(source = sourceId):(source = document.getElementById(sourceId));
		this.isElement(destId)?(dest = destId):(dest = document.getElementById(destId));
		//var source = document.getElementById(sourceId);
		//var dest = document.getElementById(destId);
		if(source&&dest){
			clear?this.clearEl(destId):0;
			/*
			var fragment = document.createDocumentFragment();
			fragment.appendChild(document.getElementById(source));
			document.getElementById(dest).appendChild(fragment);	
			*/
			//dest.appendChild(source);
			
			while (source.hasChildNodes()) dest.appendChild(source.firstChild); 
			while (source.firstChild) dest.appendChild(source.firstChild);
			
			cb?cb():0;
		} else {
			console.error("DOMUtils.moveEl:",sourceId,"->",destId,"one of elements not found");
		}
	},
	spoiler: function(id,fc){
		var obj = document.getElementById(id);

		if((obj.style.display == "none")||(obj.style.display == "")){
			obj.style.display = "block";
		}
		else{
			obj.style.display = "none";
		}
		
		if(fc){
			fc(obj);
		}
	}
};

/**
 *  Базовый класс для подвижных окон для DOM элементов без привязок к сетке.
 *  Механизмы навешиваются на элемент, если создан объект с указанием конечного ID элемента
 *  @elemId - DOM element id / DOM Element
 *  @params {object}:
 *  	onDragStart {function} - event
 *  	onDragEnd 	{function} - event
 *  	onMove		{function} - event
  *  	onResizeStart {function} - event
 *  	onResizeEnd   {function} - event
 *  	onResizeMove  {function} - event
 */
var Draggable = function(elemId, params){  
	var el;
	DOMUtils.isElement(elemId)?(el = elemId):(el = document.getElementById(elemId));
	this.el = el;
	var self = this;
	
	params = params||{};
	this.onDragStart = params.onDragStart||function(){};
	this.onDragEnd 	 = params.onDragEnd	 ||function(){};
	this.onMove 	 = params.onMove	 ||function(){};
	
	this.onResizeStart = params.onResizeStart||function(){};
	this.onResizeEnd   = params.onResizeEnd	 ||function(){};
	this.onResizeMove  = params.onResizeMove ||function(){};
	
	this.moveLocked = false;
	this.isDragReady = false;  
	this.dragoffset = {  
		x: 0,  
		y: 0  
	}; 
	
	this.init = function () {  
		self.el.style.position = 'absolute';  
		self.el.style.zIndex = '9999';  
		self.saveInitialPos(); 
		self.initEvents();
		self.imagesFix();
	}; 
	this.initialPos = {
		x: "0px",
		y: "0px"
	};
	this.saveInitialPos = function(){  
		this.initialPos.y = self.el.style.top||"0px";  
		this.initialPos.x = self.el.style.left||"0px";  
	}; 
	this.resetPos = function(){
		self.el.style.top = this.initialPos.y;  
		self.el.style.left = this.initialPos.x;  		
	};
	
	this.imagesFix = function(){ // Чтобы картинки в блоке не тянулись, как файл
		var imgs = self.el.getElementsByTagName('img');
		for(var i=0;i<imgs.length;i++){
			imgs[i].onmousedown = function(){ return false; };
		}		
	};

	this.startCell = {
		x: this.x,
		y: this.y,
		width: 	this.width,
		height: this.height,
	};
	
	this.triggerMode = false;
	this.resizeMode = false;
	
	// Начинаем прослушивать события ._.
	this.initEvents = function(){ 
		onEvent(self.el, 'mousedown', function(e){ 			
			//if(e.path[0].isResizer){
			if(e.target.isResizer){
				self.resizeMode = true;
			}		
			self.isDragReady = !e.target.nondraggable;  
			if(!self.isDragReady){return 0;}
			
			self.startCell = {
				x: self.x,
				y: self.y,
				width: 	self.width,
				height: self.height,
			};			
			
			if(!self.resizeMode){				
				if(self.moveLocked){ return 0; }
				//if(self.triggerMode && !e.path[0].isTrigger){ return 0; }				
				if(self.triggerMode && !e.target.isTrigger){ return 0; }
				self.grid.el.style.userSelect = self.grid.el.style.MozUserSelect = self.grid.el.style.msUserSelect = "none";	
				
				e.pageX = e.pageX || e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);  
				e.pageY = e.pageY || e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);  
				
				self.dragoffset.x = e.pageX - self.el.offsetLeft;  
				self.dragoffset.y = e.pageY - self.el.offsetTop; 

				self.el.classList.add("gd-dragging");
				document.body.classList.add("gd-bodyDragging");
				self.el.style.zIndex = '10001';
				self.el.scrollLeft = 1;
				self.el.scrollLeft = 0;
				self.onDragStart?self.onDragStart(e):0;
			} else {
				self.grid.el.style.userSelect = self.grid.el.style.MozUserSelect = self.grid.el.style.msUserSelect = "none";					
				self.el.classList.add("gd-resizing");
				self.resizeStartW = parseFloat(document.defaultView.getComputedStyle(self.el).width);
				self.resizeStartH = parseFloat(document.defaultView.getComputedStyle(self.el).height);
				self.resizeStartX = e.clientX;
				self.resizeStartY = e.clientY;				
			}
		}); 
		onEvent(document, 'mouseup', function(e){ 
			self.grid.el.style.userSelect = self.grid.el.style.MozUserSelect = self.grid.el.style.msUserSelect = "";

		
			var lastResizeMode = self.resizeMode;
			self.resizeMode = false;
			
			self.el.classList.remove("gd-dragging");
			self.el.classList.remove("gd-resizing");
			document.body.classList.remove("gd-bodyDragging");
			self.el.style.zIndex = '9999';
			
			if(self.moveLocked && !lastResizeMode){ return 0; }
			if(self.triggerDrag){ self.triggerMode = true; }
			//if(self.triggerMode && !e.path[0].isTrigger){ return 0; }			
			
			if(!self.isDragReady){return 0;}
			self.isDragReady = false; 

			var dontSave = false;
			if(!lastResizeMode && self.triggerMode && !e.target.isTrigger){ 
				dontSave = true;
			}

			self.onDragEnd?self.onDragEnd(e, dontSave):0;
		}); 
		onEvent(document, 'mousemove', function(e){  
			if(self.isDragReady && !e.target.nondraggable){  
				if(!self.resizeMode){
					if(self.moveLocked){ return 0; }
					if(self.triggerMode) {
						//if(!e.path[0].isTrigger){ return 0; }
						if(!e.target.isTrigger){ return 0; }
						self.triggerDrag = true;
						self.triggerMode = false;
					}						
					e.pageX = e.pageX || e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);  
					e.pageY = e.pageY || e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop); 
					
					self.el.style.top = (e.pageY - self.dragoffset.y) + "px";  
					self.el.style.left = (e.pageX - self.dragoffset.x) + "px";  
					self.onMove?self.onMove(e):0;
				} else {					
					self.el.style.width = (self.resizeStartW + e.clientX - self.resizeStartX) + 'px';
					self.el.style.height = (self.resizeStartH + e.clientY - self.resizeStartY) + 'px';
					self.onResizeMove?self.onResizeMove(e):0;
				}
			} 
		}); 
	}; 
	
	this.resizer = document.createElement('div');
	this.resizer.style.width = this.resizer.style.height = '8px';
	this.resizer.style.position = 'absolute';
	this.resizer.style.right = this.resizer.style.bottom = '2px';
	this.resizer.style.border = '1px dashed';
	//this.resizer.nondraggable = true;
	this.resizer.isResizer = true;
	this.resizer.classList.add("gd-resizer");
	if(this.el.getAttribute('gd-resize-lock')){
		this.resizer.style.display = 'none';
		this.resizeLocked = true;
	}

	this.moveTrigger = document.createElement('div');
	this.moveTrigger.style.width = this.moveTrigger.style.height = '8px';
	this.moveTrigger.style.position = 'absolute';
	this.moveTrigger.style.right = this.moveTrigger.style.top = '2px';
	this.moveTrigger.style.border = '1px dashed';
	//this.moveTrigger.nondraggable = true;
	this.moveTrigger.isTrigger = true;
	this.moveTrigger.classList.add("gd-trigger");
	this.moveTrigger.style.display = 'none';
	if(this.el.getAttribute('gd-trigger')){
		this.moveTrigger.style.display = 'block';
		this.triggerMode = true;
	}
	
	this.moveLocked = this.el.getAttribute('gd-move-lock');
	
	// Проворачиваем магический трюк с дочерним контейнером и скрываем скроллбар X_X
	this.contentEl = document.createElement('div');
	DOMUtils.moveEl(this.el, this.contentEl, true);
	this.el.appendChild(this.contentEl);
	this.el.style.overflow = 'hidden';
	this.contentEl.style.position = 'absolute';
	this.contentEl.style.left = this.contentEl.style.top = this.contentEl.style.bottom = '0';
	this.contentEl.style.right = '-64px';
	this.contentEl.style.paddingRight = '64px';
	this.contentEl.style.overflowY = 'scroll';
	this.contentEl.classList.add("gd-content");
	
	this.el.appendChild(this.resizer);
	this.el.resizer = this.resizer;	
	
	this.el.appendChild(this.moveTrigger);
	this.el.moveTrigger = this.moveTrigger;		

	this.el.style.minHeight = '32px';
	this.el.style.minWidth = '32px';
	
	this.init();  
}; 

/**
 *  Расширение для класса Draggable. Реализует механику drag&drop с привязкой 
 *  указанного DOM объекта к сетке
 *  @elemId - DOM element id / DOM Element
 *  @grid   - GridDOMGrid объект, отвечающий за сетку-контейнер
 *  @params {object}: 
 *  	x {number} - координата (столбец)
 *  	y {number} - координата (строка)
 *  	width  {number} - ширина (столбцов)
 *  	height {number} - высота (строк)
 */
var GridDraggable = function(elemId, grid, params){
	if(!grid){ return; }
	this.grid = grid;
	
	params = params || {};
	this.width = params.width || 1;
	this.height = params.height || 1;
	this.x = this.plcX = (~~params.x) || 0;
	this.y = this.plcY = (~~params.y) || 0;
	
	this.placeholder = document.createElement('div');
	this.placeholder.style.display = 'none';
	this.placeholder.style.position = 'absolute';
	this.placeholder.style.zIndex = '10000';
	this.placeholder.style.border = '1px dashed';
	this.placeholder.classList.add("gd-placeholder");
	document.body.appendChild(this.placeholder);
	
	var self = this;
	
	this.drawPlaceholder = function(e, x, y){
		var rect = this.grid.el.getBoundingClientRect();
		var w = rect.width / self.grid.width; // Cell width
		var h = rect.height / self.grid.height; // Cell height
	
		var top = self.el.offsetTop||parseInt(self.el.style.top);
		var left = self.el.offsetLeft||parseInt(self.el.style.left);		
		
		var scrollX = (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
		var scrollY = (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);		
		
		var cellX = e ? ((left-self.grid.paddingX-self.grid.el.offsetLeft)/w + 0.5 | 0) : x;
		var cellY = e ? ((top-self.grid.paddingY-self.grid.el.offsetTop)/h + 0.5 | 0) : y;

		var elX = cellX * w;
		var elY = cellY * h;

		self.plcX = cellX;
		self.plcY = cellY;
		
		var isGridAbs = Boolean( (self.grid.el.style.position==='absolute') ||
								 (self.grid.el.style.position==='relative'));
		
		self.placeholder.style.left = ( (!isGridAbs ? (/*rect.left*/self.grid.el.offsetLeft/* + scrollX*/) : 0) + elX + self.grid.paddingX)+'px';
		self.placeholder.style.top = ( (!isGridAbs ? (/*rect.top*/self.grid.el.offsetTop/* + scrollY*/) : 0) + elY + self.grid.paddingY)+'px';	

		self.placeholder.style.width = (w*self.width - self.grid.paddingX*2)+'px';
		self.placeholder.style.height = (h*self.height - self.grid.paddingY*2)+'px';			
		self.placeholder.style.display = 'block';
	};
	this.setOnCell = function(x, y, e){
		self.observer ? self.observer.disconnect() : 0;
		var rect = this.grid.el.getBoundingClientRect();
		var w = rect.width / self.grid.width; // Cell width
		var h = rect.height / self.grid.height; // Cell height
	
		var top = self.el.offsetTop||parseInt(self.el.style.top);
		var left = self.el.offsetLeft||parseInt(self.el.style.left);	

		var scrollX = (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
		var scrollY = (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);		
		
		var cellX = e ? ((left-self.grid.paddingX-self.grid.el.offsetLeft)/w + 0.5 | 0) : x;
		var cellY = e ? ((top-self.grid.paddingY-self.grid.el.offsetTop)/h + 0.5 | 0) : y;
						
		/*
		(cellX<0)?(cellX=0):0;
		((cellX+self.width)>self.grid.width)?(cellX=self.grid.width-self.width):0;
		(cellY<0)?(cellY=0):0;
		((cellY+self.height)>self.grid.height)?(cellY=self.grid.height-self.height):0;
		*/
		(cellX<0)?(cellX=self.startCell.x):0;
		((cellX+self.width)>self.grid.width)?(cellX=self.startCell.x,self.width=self.startCell.width):0;
		(cellY<0)?(cellY=self.startCell.y):0;
		((cellY+self.height)>self.grid.height)?(cellY=self.startCell,self.height=self.startCell.height):0;
		
		var elX = cellX * w;
		var elY = cellY * h;
		
		var isGridAbs = Boolean( (self.grid.el.style.position==='absolute') ||
								 (self.grid.el.style.position==='relative'));

		self.el.style.left = ( (!isGridAbs ? (/*rect.left*/self.grid.el.offsetLeft/* + scrollX*/) : 0) + elX + self.grid.paddingX)+'px';
		self.el.style.top  = ( (!isGridAbs ? (/*rect.top*/self.grid.el.offsetTop/* + scrollY*/) : 0) + elY + self.grid.paddingY)+'px';		
		self.el.style.width = (w*self.width - self.grid.paddingX*2)+'px';
		self.el.style.height = (h*self.height - self.grid.paddingY*2)+'px';

		self.x = cellX;
		self.y = cellY;
		self.el.setAttribute('gd-item-x', cellX);
		self.el.setAttribute('gd-item-y', cellY);		
		self.placeholder.style.display = 'none';
		self.observer ? self.observer.observe(self.el, self.observerCfg) : 0;
	};
	
	this.updateSize = function(){
		var rect = this.grid.el.getBoundingClientRect(),
			w = rect.width / self.grid.width,
			h = rect.height / self.grid.height,	
			pxW = parseFloat(document.defaultView.getComputedStyle(self.el).width),
			pxH = parseFloat(document.defaultView.getComputedStyle(self.el).height);
		self.width = ((pxW+self.grid.paddingX*2)/w|0)||1;
		self.height = ((pxH+self.grid.paddingY*2)/h|0)||1;
		self.observer ? self.observer.disconnect() : 0;
		self.el.setAttribute('gd-item-width',  self.width);
		self.el.setAttribute('gd-item-height', self.height);	
		self.observer ? self.observer.observe(self.el, self.observerCfg) : 0;
	};
	
	this.hasCollisions = function(indrag){
		var collisions = [];
		for(var i=0;i<self.grid.childs.length;i++){
			var c = self.grid.childs[i];	
			if(c.idx === self.idx){ continue; }
			
			var collision = (!indrag) ? 
				rectangleCollision(c.x, c.y, c.width, c.height, 
									self.x, self.y, self.width, self.height) :
				rectangleCollision(c.x, c.y, c.width, c.height, 
									self.plcX, self.plcY, self.width, self.height);
			if(collision){
				collisions.push(c);
			}
		}
		return collisions;
	};
	
	this.drawCollisions = function(){
		if(!self.grid.noIntersects){ return 0; }
		for(var i=0;i<self.grid.childs.length;i++){
			self.grid.childs[i].el.classList.remove('gd-target');
		}			
		var collisions = self.hasCollisions(true);
		if(collisions.length){
			var l = [];
			for(var i=0;i<collisions.length;i++){
				var c = collisions[i];
				var distVect = {
					x:(c.x + c.width/2) - (self.plcX + self.width/2),
					y:(c.y + c.height/2) - (self.plcY + self.height/2)
				};
				l[i] = Math.pow(distVect.x*distVect.x + distVect.y*distVect.y, 0.5);
			}

			var nearIdx = 0,
				nearL = l[0];
			for (var i = 1; i < l.length; i++) {
			  if (l[i] < nearL) {
				nearL = l[i];
				nearIdx = i;
			  }
			}				
			
			if(!collisions[nearIdx].moveLocked){				
				collisions[nearIdx].el.classList.add('gd-target');
			}
			//self.updateSize();
		}			
	};
	
	this.onMove_grid = function(e){		
		self.drawPlaceholder(e);
		self.drawCollisions();		
	};	
	this.onDragEnd_grid = function(e, dontSave){
		self.setOnCell(null, null, e);	
		for(var i=0;i<self.grid.childs.length;i++){
			self.grid.childs[i].el.classList.remove('gd-target');
		}		
		if(!self.grid.noIntersects){ 
			self.updateSize();
			return 0; 
		}
		var collisions = self.hasCollisions();
		if(collisions.length){
			var l = [];
			for(var i=0;i<collisions.length;i++){
				var c = collisions[i];
				var distVect = {
					x:(c.x + c.width/2) - (self.x + self.width/2),
					y:(c.y + c.height/2) - (self.y + self.height/2)
				};
				l[i] = Math.pow(distVect.x*distVect.x + distVect.y*distVect.y, 0.5);
			}

			var nearIdx = 0,
				nearL = l[0];
			for (var i = 1; i < l.length; i++) {
			  if (l[i] < nearL) {
				nearL = l[i];
				nearIdx = i;
			  }
			}	
						
			var tmpCell = {
				x: self.startCell.x,
				y: self.startCell.y,
				width:  self.startCell.width,
				height: self.startCell.height
			};
			
			if(!collisions[nearIdx].moveLocked && !self.moveLocked){	
				if(!self.resizeLocked){
					self.width = collisions[nearIdx].width;
					self.height = collisions[nearIdx].height;
				}
				self.setOnCell(collisions[nearIdx].x, collisions[nearIdx].y);
				
				if(!collisions[nearIdx].resizeLocked){
					collisions[nearIdx].width = tmpCell.width;
					collisions[nearIdx].height = tmpCell.height;
				}
				collisions[nearIdx].setOnCell(tmpCell.x, tmpCell.y);
			} else {
				self.width = self.startCell.width;
				self.height = self.startCell.height;
				self.setOnCell(self.startCell.x, self.startCell.y);
			}
			
		}
		(!dontSave)?self.grid.stateManager.save():0;
	};		
	
	this.onResizeMove_grid = function(e){
		self.updateSize();
		self.onMove_grid(e);
	};
	
	var events = {
		onMove: this.onMove_grid,
		onDragEnd: this.onDragEnd_grid,
		onResizeMove: this.onResizeMove_grid
	};
	Draggable.apply(this, [elemId, events]);

	var startX = self.el.getAttribute('gd-item-x')||0,
		startY = self.el.getAttribute('gd-item-y')||0;
	
	this.observer = window.MutationObserver ? (new MutationObserver(
		function(mutations){
			self.width = ~~(self.el.getAttribute('gd-item-width')||1);
			self.height = ~~(self.el.getAttribute('gd-item-height')||1);
			self.setOnCell( ~~(self.el.getAttribute('gd-item-x')||0),
							~~(self.el.getAttribute('gd-item-y')||0)
							);
			if(self.el.getAttribute('gd-resize-lock')){
				self.resizer.style.display = 'none';
				self.resizeLocked = true;
			} else {
				self.resizer.style.display = 'block';
				self.resizeLocked = true;
			}
			self.moveLocked = self.el.getAttribute('gd-move-lock');
			if(self.el.getAttribute('gd-trigger')){
				self.moveTrigger.style.display = 'block';
				self.triggerMode = true;
			} else {
				self.moveTrigger.style.display = 'none';
				self.triggerMode = false;				
			}
			
    }) ) : 0;  
    this.observerCfg = {/*childList: true, */attributes:true, attributeFilter:['gd-item-width','gd-item-height','gd-item-x','gd-item-y','gd-resize-lock','gd-move-lock','gd-trigger']};
	this.observer.observe(this.el, this.observerCfg);	
		
	this.el.cell = this;	
		
	this.setOnCell(~~startX, ~~startY);
}

/**
 *  Базовый класс сетки, назначающейся DOM элементу-контейнеру
 *  @elemId - DOM element id / DOM Element
 *  @params {object}:
 *  	width	   {number} - ширина (столбцов)
 *  	height	   {number} - высота (строк)
 *  	paddingX   {number} - отступ по X (пиксели. Половина расстояния между соседними блоками)
 *  	paddingY   {number} - отступ по Y (пиксели. См. paddingX)
 *  	noIntersects {bool} - запретить блокам пересекаться
 */
var GridDOMGrid = function(elemId, params){  
	var el;
	DOMUtils.isElement(elemId)?(el = elemId):(el = document.getElementById(elemId));
	this.el = el;
	var self = this;
	
	params = params || {};
	this.width  = ~~params.width  || 16;
	this.height = ~~params.height || 16;
	this.paddingX = ~~params.paddingX || 0;
	this.paddingY = ~~params.paddingY || 0;
	this.noIntersects = params.noIntersects || false;
	
	el.style.height = params.cssHeight || '100%';
	el.style.width = params.cssWidth || '100%';
	
	var html = document.getElementsByTagName("html")[0];
	if(html){ 
		html.style.height = html.style.width = '100%';
		//html.style.overflow = 'hidden';
	}
	document.body.style.height = document.body.style.width = '100%';
	
	
	document.body.style.display = 'block';
	document.body.style.margin = document.body.style.padding = 0;
	
	this.childs = [];
	for(var i=0;i<el.children.length;i++){
		if(el.children[i].hasAttribute('gd-item')){
			var elCells = ~~(el.children[i].getAttribute('gd-item-width') || 1),
				elRows  = ~~(el.children[i].getAttribute('gd-item-height') || 1),
				elX     = ~~(el.children[i].getAttribute('gd-item-x') || 0),
				elY     = ~~(el.children[i].getAttribute('gd-item-y') || 0);
			var idx = this.childs.push( new GridDraggable(el.children[i], this, {
				width: elCells,
				height:elRows,
				x:	   elX,
				y:	   elY
			}) );
			this.childs[idx - 1].idx = idx;
		}
	}
	this.changeDim = function(w, h){
		self.width = ~~w || 16;
		self.height = ~~h || 16;
	};
	this.changePadding = function(px, py){
		self.paddingX = ~~px || 0;
		self.paddingY = ~~py || 0;
	}
	this.onResize = function(){
		//self.el.style.height = (window.innerHeight - self.paddingY*2 - self.el.offsetTop)+'px';
		
		for(var i=0;i<self.childs.length;i++){
			self.childs[i].setOnCell(~~self.childs[i].x, ~~self.childs[i].y);
		}
	};
	onEvent(window, 'resize', this.onResize);
	this.checkCollisions = function(){
		for(var i=0;i<self.childs.length;i++){
			//...
		}
	};
	this.observer = window.MutationObserver ? (new MutationObserver(
		function(mutations){
			self.noIntersects = el.getAttribute('gd-no-intersects') || false;
			self.changeDim(self.el.getAttribute('gd-width'), self.el.getAttribute('gd-height'));
			self.changePadding(self.el.getAttribute('gd-padding-x'), self.el.getAttribute('gd-padding-y'));
			self.onResize();
    }) ) : 0;  
    this.observerCfg = {/*childList: true, */attributes:true,attributeFilter:['gd-width','gd-height','gd-padding-x','gd-padding-y','gd-no-intersects']};
	this.observer.observe(this.el, this.observerCfg);

	this.stateManager = {
		presets: {
			'1920':'[{"id":"graph-block","x":0,"y":0,"width":22,"height":20},{"id":"stats-block","x":11,"y":20,"width":11,"height":12},{"id":"orders-block","x":22,"y":0,"width":5,"height":20},{"id":"orders-blocek","x":27,"y":0,"width":5,"height":20},{"id":"handle-block","x":22,"y":20,"width":10,"height":12},{"id":"graph-block-second","x":0,"y":20,"width":11,"height":6},{"id":"volume-block","x":0,"y":26,"width":11,"height":6}]',
			'1680':'[{"id":"graph-block","x":0,"y":0,"width":22,"height":15},{"id":"stats-block","x":11,"y":15,"width":11,"height":17},{"id":"orders-block","x":22,"y":0,"width":5,"height":21},{"id":"orders-blocek","x":27,"y":0,"width":5,"height":21},{"id":"handle-block","x":0,"y":15,"width":11,"height":10},{"id":"graph-block-second","x":22,"y":21,"width":10,"height":11},{"id":"volume-block","x":0,"y":25,"width":11,"height":7}]',
			'1600':'[{"id":"graph-block","x":0,"y":0,"width":22,"height":15},{"id":"stats-block","x":11,"y":15,"width":11,"height":17},{"id":"orders-block","x":22,"y":0,"width":5,"height":25},{"id":"orders-blocek","x":27,"y":0,"width":5,"height":25},{"id":"handle-block","x":0,"y":15,"width":11,"height":10},{"id":"graph-block-second","x":22,"y":25,"width":10,"height":7},{"id":"volume-block","x":0,"y":25,"width":11,"height":7}]',
			'1440x900':'[{"id":"graph-block","x":0,"y":0,"width":22,"height":15},{"id":"stats-block","x":11,"y":15,"width":11,"height":17},{"id":"orders-block","x":22,"y":0,"width":5,"height":25},{"id":"orders-blocek","x":27,"y":0,"width":5,"height":25},{"id":"handle-block","x":0,"y":15,"width":11,"height":10},{"id":"graph-block-second","x":22,"y":25,"width":10,"height":7},{"id":"volume-block","x":0,"y":25,"width":11,"height":7}]',
			'1366x768':'[{"id":"graph-block","x":0,"y":0,"width":20,"height":13},{"id":"stats-block","x":0,"y":23,"width":20,"height":9},{"id":"orders-block","x":20,"y":0,"width":6,"height":23},{"id":"orders-blocek","x":26,"y":0,"width":6,"height":23},{"id":"handle-block","x":0,"y":13,"width":13,"height":10},{"id":"graph-block-second","x":20,"y":23,"width":12,"height":9},{"id":"volume-block","x":13,"y":13,"width":7,"height":10}]',
			'1280x1024':'[{"id":"graph-block","x":0,"y":0,"width":32,"height":11},{"id":"stats-block","x":0,"y":17,"width":18,"height":9},{"id":"orders-block","x":18,"y":11,"width":7,"height":15},{"id":"orders-blocek","x":25,"y":11,"width":7,"height":15},{"id":"handle-block","x":0,"y":11,"width":18,"height":6},{"id":"graph-block-second","x":18,"y":26,"width":14,"height":6},{"id":"volume-block","x":0,"y":26,"width":18,"height":6}]',
			'1024x768':'[{"id":"graph-block","x":0,"y":0,"width":32,"height":9},{"id":"stats-block","x":0,"y":15,"width":16,"height":8},{"id":"orders-block","x":16,"y":9,"width":8,"height":14},{"id":"orders-blocek","x":24,"y":9,"width":8,"height":14},{"id":"handle-block","x":0,"y":9,"width":16,"height":6},{"id":"graph-block-second","x":0,"y":23,"width":14,"height":5},{"id":"volume-block","x":14,"y":23,"width":18,"height":5}]',
			'800x600':'[{"id":"graph-block","x":0,"y":0,"width":32,"height":7},{"id":"stats-block","x":0,"y":25,"width":32,"height":7},{"id":"orders-block","x":14,"y":12,"width":9,"height":13},{"id":"orders-blocek","x":23,"y":12,"width":9,"height":13},{"id":"handle-block","x":0,"y":7,"width":32,"height":5},{"id":"graph-block-second","x":0,"y":12,"width":14,"height":5},{"id":"volume-block","x":0,"y":17,"width":14,"height":8}]'
		},
		save: function(){
			var data = [];
			for(var i=0;i<self.childs.length;i++){
				var d = {};
				d.id = self.childs[i].el.id;
				d.x = self.childs[i].x;
				d.y = self.childs[i].y;
				d.width = self.childs[i].width;
				d.height = self.childs[i].height;
				data.push(d);
			}
			var json = JSON.stringify(data);			
			setCookie('gd-grid-save', json, 1000);
			if(self.resetButton){ self.resetButton.style.display = ''; }
			return json;
		},
		load: function(presetData){
			var json = presetData || getCookie('gd-grid-save');
			if(json){
				data = JSON.parse(json);
				for(var i=0;i<data.length;i++){
					var el = document.getElementById(data[i].id);
					if(!el){ continue; }
					if(el.cell){
						el.cell.x = data[i].x;
						el.cell.y = data[i].y;
						el.cell.width = data[i].width;
						el.cell.height = data[i].height;						
						el.cell.setOnCell(~~data[i].x, data[i].y);
					}
					el.setAttribute('gd-item-x', data[i].x);
					el.setAttribute('gd-item-y', data[i].y);
					el.setAttribute('gd-item-width', data[i].width);
					el.setAttribute('gd-item-height', data[i].height);
				}
				self.onResize();
				return data;
			}
			return false;
		}
	};
	
	/**
	 *  Узнаем разрешение (нам нужна ширина и, да, НЕ viewport'а), да будем искать ближайший пресет:
	 */
	this.clientRes = _Client.Screen.getResolution();
	this.clientPreset = this.stateManager.load();
	
	this.loadDefaultPreset = function(num){
			var curr = 1920;
			var diff = Math.abs (num - curr);
			
			for(k in self.stateManager.presets){
				var newdiff = Math.abs (num - ~~(k.split('x')[0]));
				if (newdiff < diff) {
					diff = newdiff;
					curr = k;
				}				
			}		
			console.log('Changed to standart preset:', curr);
			self.stateManager.load(self.stateManager.presets[curr]);
			
	};
	
	if(!this.clientPreset){	// У клиента НЕТ своего пресета (он ничего не менял)	
		this.loadDefaultPreset(this.clientRes.w);
	}
	
	this.resetButton = null;
	var resets = document.querySelectorAll('[gd-reset-button]');
	if(resets.length){
		this.resetButton = resets[0];
		if(!this.clientPreset) { this.resetButton.style.display = 'none'; } 
						  else { this.resetButton.style.display = ''; }
		this.resetButton.onclick = function(){
			setCookie('gd-grid-save', '', 0);
			self.loadDefaultPreset(self.clientRes.w);
			self.resetButton.style.display = 'none';
		};
	}
	
	
	this.onResize();
};

/**
 *  Класс-инициализатор системы drag&drop позиционирования по сетке.
 *  Отвечает за первичную подготовку сеток GridDOMGrid исходя из данных HTML
 *  кода страницы.
 */
var GridDOM = function(){
	this.gridsDOM = document.querySelectorAll('[gd-grid]');
	this.grids = [];
	for(var i=0;i<this.gridsDOM.length;i++){
		var el = this.gridsDOM[i];
		this.grids[i] = new GridDOMGrid(el.id, {
			width:		  el.getAttribute('gd-width'),
			height: 	  el.getAttribute('gd-height'),
			paddingX:	  el.getAttribute('gd-padding-x'),
			paddingY:	  el.getAttribute('gd-padding-y'),
			noIntersects: el.getAttribute('gd-no-intersects')
		});
	}
};

var griddom = new GridDOM();
