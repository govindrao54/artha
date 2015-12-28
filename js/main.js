var pageModule = (function () {
	config = {
		navsLinksClass : '.navbar-nav a',
		navContainerClass : '.navbar-collapse',
		headerClass : 'js-header',
		stickyHeader : 'fixed',
		section1 : 'bookNow',
		section2 : 'section2',
		section3 : 'section3',
		section4 : 'section4'
	}

	var easeInOut = function(currentTime, start, change, duration) {
	    currentTime /= duration / 2;
	    if (currentTime < 1) {
	        return change / 2 * currentTime * currentTime + start;
	    }
	    currentTime -= 1;
	    return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
	}

	var scrollTo = function(element, to, duration) {
	    var start = element.scrollTop,
	        change = to - start - document.querySelector('.navbar-header').clientHeight,
	        increment = 20;

	    var animateScroll = function(elapsedTime) {
	        elapsedTime += increment;
	        var position = easeInOut(elapsedTime, start, change, duration);
	        element.scrollTop = position;
	        if (elapsedTime < duration) {
	            setTimeout(function() {
	                animateScroll(elapsedTime);
	            }, increment);
	        }
	    };
	    animateScroll(0);
	}

	var scroller = function(targetId) {
		var el,
			ypos,
			isWebkit;

		ypos = document.getElementById(targetId).offsetTop;

		isWebkit = 'WebkitAppearance' in document.documentElement.style;
		el = isWebkit ? document.body : document.getElementsByTagName('html')[0];
		scrollTo(el, ypos, 1000);
	}

	var fixHeader = function(){
		var h = document.getElementByTagName('header');
		h.classList.add('fixed');
	}

	var _addNavBarToggle = function(){
		document.querySelector('.navbar-toggle').classList.toggle('collapsed');
		document.querySelector(config.navContainerClass).classList.toggle('in');
	}

	var _addStickyHeader = function(){
		var elemHead = document.querySelector('.' + config.headerClass);
		elemHead.classList.add(config.stickyHeader);
	}

	var _removeStickyHeader = function(){
		var elemHead = document.querySelector('.' + config.headerClass);
		elemHead.classList.remove(config.stickyHeader);
	}

	var _removeActiveClass = function(elemList){
		for(i=0;i < 4; i++){
			elemList[i].classList.remove('active');
		}
	}

	var scrollDetector = function(e) {
		var yy = window.scrollY + document.querySelector('.navbar-header').clientHeight;
		if(yy > 100){
			_addStickyHeader();
		} else {
			_removeStickyHeader();
		}
		var lis = document.querySelectorAll('.navbar-nav li');
		_removeActiveClass(lis);
		if(yy >= document.getElementById(config.section1).offsetTop && yy < document.getElementById(config.section2).offsetTop){
			_removeActiveClass(lis);
			lis[0].classList.add('active');
		} else if (yy >= document.getElementById(config.section2).offsetTop && yy < document.getElementById(config.section3).offsetTop){
			_removeActiveClass(lis);
			lis[1].classList.add('active');
		} else if (yy >= document.getElementById(config.section3).offsetTop && yy < document.getElementById(config.section4).offsetTop){
			_removeActiveClass(lis);
			lis[2].classList.add('active');
		} else if (yy >= document.getElementById(config.section4).offsetTop && yy < document.getElementsByTagName('footer')[0].offsetTop){
			_removeActiveClass(lis);
			lis[3].classList.add('active');
		}
	}

	var _bindUIActions = function () {
		document.querySelector('.navbar-toggle').addEventListener("click",_addNavBarToggle);
		var navs = document.querySelectorAll(config.navsLinksClass);
		for(var i = 0; i < navs.length; i++) {
			navs[i].onclick = function(e) {
				e.preventDefault();
				var targetId = this.getAttribute('data-scroll');
				scroller(targetId);
			}
		}
		window.onscroll = scrollDetector;
	}

	var init = function(){
		leadModule.init();
		_bindUIActions();
	}
	init();

	return {
		init : init
	};

})();