var infoBoxFrameElement = document.getElementById('infoBoxFrame');
var infoBoxContentElement = document.getElementById('infoBoxContent');

var infoBox;

function InfoBox() {
	var infoBoxTimer = false;
	var infoBoxOpacity = 0;

	this.position = function(middle) {
		if (infoBoxFrameElement.style.display != 'none') {
			infoBoxFrameElement.style.left = (window.innerWidth / 2 - infoBoxFrameElement.clientWidth / 2) + 'px';
			if (middle) {
				var top = (window.innerHeight / 2 - infoBoxFrameElement.clientHeight / 2);
				if (top < 0) {
					top = 0;
				}
				infoBoxFrameElement.style.top = top + 'px';
			}
		}
	}

	function fadeOutInfoBox() {
		infoBoxTimer = false;
		infoBoxOpacity -= 0.1;
		if (infoBoxOpacity > 0) {
			infoBoxFrameElement.style.opacity = infoBoxOpacity;
			infoBoxTimer = setTimeout(function(){
				fadeOutInfoBox();
			}, 40);
		} else {
			infoBoxFrameElement.style.opacity = 0;
			infoBoxFrameElement.style.display = 'none';
		}
	}

	this.show = function(msg, autoFadeOut, middle) {
		if (autoFadeOut === undefined || autoFadeOut === null) {
			autoFadeOut = 2000;
		} else if (autoFadeOut === false) {
			autoFadeOut = 0;
		}
		infoBoxContentElement.innerHTML = msg;
		infoBoxOpacity = 0.9;
		infoBoxFrameElement.style.opacity = infoBoxOpacity;
		infoBoxFrameElement.style.display = '';
		this.position(middle);
		if (infoBoxTimer !== false) {
			clearTimeout(infoBoxTimer);
			infoBoxTimer = false;
		}
		if (autoFadeOut > 0) {
			infoBoxTimer = setTimeout(function(){
				fadeOutInfoBox();
			}, autoFadeOut);
		}
	}

	this.close = function() {
		if (infoBoxTimer !== false) {
			clearTimeout(infoBoxTimer);
		}
		infoBoxTimer = false;
		
		fadeOutInfoBox();
	}
}
