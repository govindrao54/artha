var pageModule = (function () {
	config = {
		navsLinksClass : '.navbar-nav a',
		navContainerClass : '.navbar-collapse',
		headerClass : 'js-header',
		stickyHeader : 'fixed'
	}

	// var scrollTo = function(element, to, duration) {
	//     var start = element.scrollTop,
	//         change = to - start,
	//         increment = 20;

	//     var animateScroll = function(elapsedTime) {        
	//         elapsedTime += increment;
	//         var position = easeInOut(elapsedTime, start, change, duration);                        
	//         element.scrollTop = position; 
	//         if (elapsedTime < duration) {
	//             setTimeout(function() {
	//                 animateScroll(elapsedTime);
	//             }, increment);
	//         }
	//     };
	//     animateScroll(0);
	// }

	var easeInOut = function(currentTime, start, change, duration) {
	    currentTime /= duration / 2;
	    if (currentTime < 1) {
	        return change / 2 * currentTime * currentTime + start;
	    }
	    currentTime -= 1;
	    return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
	}

	var scroller = function(targetId) {
		var ypos = document.getElementById(targetId).offsetTop;
		//scrollTo(document.body, ypos, 1000);
		scrollTo(0, ypos);
	}

	var fixHeader = function(){
		var h = document.getElementByTagName('header');
		h.classList.add('fixed');
	}

	var _addNavBarToggle = function(){
		console.log(document.querySelector('.navbar-toggle').classList);
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

	var scrollDetector = function(e) {
		if(window.scrollY > 100){
			_addStickyHeader();
		} else {
			_removeStickyHeader();
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