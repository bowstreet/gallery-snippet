$(document).ready(function () {
	
	// initialize slider
	
	var galleryList = new Array();
	
	$('.gallery').each(function () {
		galleryList.push(new Gallery(this));
	});
	
});

function createGallery(images, targetElement) {
	var gallery = $(targetElement).append('div.gallery');

	var slider = gallery.append('div.slider');

	for(var i = 0; i < images.length; i++) {
		var image = images[i];

		var figure = slider.append('figure');
		figure.append('<img src="' + image +  '" />');
	}
}

function Gallery(newElement, newConfig) {
	
	var isMobileDevice = function () {
		// TODO: don't do user-agent sniffing or check for more agents
		return (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i));
	}

	// 0. dummy config
	var config = {
		debug: true,
		autoplay: !isMobileDevice(),
		wrapAround: true,
		animationDuration: 500,
		playInterval: 2000,
		usePageList: true,
		scaling: {width: 3, height: 2}
	};
	
	
	// 1. assign fields
	var element = $(newElement);
	
	var index = 0, slider, width, height, figures;
	var playInterval;
	var x = 0;
	var pageList;
	
	var animating = false;
	
	// 2. declare methods
	
	var setup = function () {
		if (config.debug) {
			console.log("--- setup ---");
		}
		
		slider = element.children('div.slider');

		// retrieve & store desired dimensions
		width = element.width();
		height = width * (config.scaling.height / config.scaling.width);

		// assign height to element
		element.height(height);
		
		// set up figures
		figures = element.find('div.slider figure');
		
		slider.css('width', (figures.length * width) + 'px');
		
		figures.each(function () {
			var figure = $(this);

			if (config.debug) {
				console.log(figure);
			}

			figure.width(width);
			figure.height(height);
			
			// resize images in figure
			figure.children('img').width(width);
		});
		
		if (figures.length == 1) {
			element.find('div.controls').remove();
			
			return;
		}
		
		assignControlHandlers();
		
		if (config.usePageList === true) {
			setupPageList();
		}
		
		layoutControls();
		
		if (config.autoplay === true) {
			play();
		}
	}
	
	var layoutControls = function () {
		var controls = element.find('div.controls');

		controls.width(width);

		var previousControl = element.find('a.control-previous');
		var nextControl = element.find('a.control-next');
		
		previousControl.css('top', (height/2 - previousControl.height()/2) + 'px');
		nextControl.css('top', (height/2 - nextControl.height()/2) + 'px');
	}
	
	var assignControlHandlers = function () {
		$('a.control-previous').click(function(event) {
			event.preventDefault();
			if (!animating) {
				previousPage();
			}
			return false;
		});
		
		$('a.control-next').click(function(event) {
			event.preventDefault();
			if (!animating) {
				nextPage();
			}
			return false;
		});
		
		element.mouseover(function (event) {
			stop();
		});
		
		element.mouseout(function (event) {
			if (config.autoplay === true) {
				play();
			}
		});
	}
	
	var setupPageList = function () {
		
		var controls = element.children('div.controls');

		controls.append('<ul class="pages"></ul>');
		pageList = controls.find('ul.pages');
		
		figures.each(function (i) {
			pageList.append('<li><a href="#">' + i + '</a></li>');
		});
		
		$(pageList.find('li a')[index]).addClass('active');
		
		pageList.find('li a').click(function (event) {
			event.preventDefault();
			setIndex(new Number($(this).text()));
			return false;
		});
		
	}
	
	var play = function () {
		playInterval = window.setInterval(function () {
			nextPage();
		}, config.playInterval);
	}
	
	var stop = function () {
		window.clearInterval(playInterval);
	}
	
	var setIndex = function (newIndex) {
		if (newIndex < 0 || newIndex > figures.length-1) {
			if (config.wrapAround === true) {
				newIndex = newIndex < 0 ? figures.length-1 : 0;
			} else {
				return;
			}
		}
		
		animating = true;
		
		slider.animate({left: (-newIndex*width)}, config.animationDuration, function () {
			animating = false;
		});
		
		if (config.usePageList === true && pageList) {
			$(pageList).find('li a.active').removeClass('active');
			$($(pageList).find('li a')[newIndex]).addClass('active');
		}
		
		index = newIndex;
	}
	
	var nextPage = function () {
		setIndex(index+1);
	}
	
	var previousPage = function () {
		setIndex(index-1);
	}
	
	// 3. run setup
	setup();
}