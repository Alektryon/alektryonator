// use ";" for jQuery outside of main .html

$(document).ready(function(){
	
	$("#SearchField").keydown(function (event) {
		if ( event.which == 13 || event.which == 32 ) { // Enter/Space
			if (sam_soi.currentTime > 0) sam_soi.currentTime == 0;
			sam_soi.play();
		} else {
			if (sam_gaag.currentTime > 0) sam_gaag.currentTime == 0;
			sam_gaag.play();
		}
	});
	
	var sam_gaag = document.createElement('audio');
	sam_gaag.setAttribute('src', 'tts/sam_gaag.mp3');
	// sam_gaag.setAttribute('autoplay', 'autoplay');
	sam_gaag.load()
	
	var sam_soi = document.createElement('audio');
	sam_soi.setAttribute('src', 'tts/sam_soi.mp3');
	// sam_soi.setAttribute('autoplay', 'autoplay');
	sam_soi.load();
	
	//$.get();
	sam_gaag.addEventListener("load", function() {
		sam_gaag.play();
	}, true);

	$('.play').click(function() {
	audioElement.play();
	});

	$('.pause').click(function() {
	audioElement.pause();
	});
	
});