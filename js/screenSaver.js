var blankScreenElement = document.getElementById('blankScreen');

var screenSaver;

function ScreenSaver() {
	var blankScreenTimeout = false;
	var blankScreenFade;
	var blankScreenFadeInterval = false;
	
	var disabledOnClicks = false;
	
	// hideNow == undefined --> képernyő elhalványítása alapértelmezett idő után
	// hideNow == true --> képernyő azonnali elhalványítása
	// hideNow == false --> képernyő elhalványítás időzítés törlése
	this.setBlankScreenTimeout = function(hideNow) {
		blankScreenElement.style.display = 'none';
		disableOnClicks(false);
		
		if (blankScreenTimeout !== false) {
			clearTimeout(blankScreenTimeout);
		}
		if (blankScreenFadeInterval !== false) {
			clearInterval(blankScreenFadeInterval);
			blankScreenFadeInterval = false;
		}
		var ms = BLANK_SCREEN_TIMEOUT;
		if (hideNow === true) {
			ms = 1;
		} else if (hideNow === false) {
			ms = 0;
		}
		if (ms != 0) {
			blankScreenTimeout = setTimeout(function(){
				// fekete képernyő bekapcsolása, ha énekválasztó képernyőn vagyunk, vagy ha lejárt már az ének
				if (
					mainWindowElement.style.display != 'none' || 
					(panel.getSelected() == 'hymnal' && ( (player.track == -1 && player.musicEnabled) || player.onBlankPage ) ) || 
					(panel.getSelected() == 'bible' && biblePanel.playVerses.length > 0 && biblePanel.playIndex == biblePanel.playVerses.length) || 
					hideNow === true
				) {
					if (((infoContentElement.style.display != 'none' || mainWindowPanelElement.style.display != 'none') && !extended.isControllerMode() && (!extended.isDisplayMode() || extended.isIdle())) || hideNow === true) {
						blankScreenFade = 0.01;
						blankScreenElement.style.opacity = blankScreenFade;
						
						blankScreenElement.style.display = '';
						disableOnClicks(true);
						
						if (blankScreenFadeInterval !== false) {
							clearInterval(blankScreenFadeInterval);
						}
						blankScreenFadeInterval = setInterval(blankScreenFadeFn, 10);
					}
				}
			}, ms);
		}
	}
	
	function blankScreenFadeFn() {
		if (blankScreenFade < 1) {
			blankScreenFade += 0.005;
			blankScreenElement.style.opacity = blankScreenFade;
		} else {
			blankScreenFade = 1;
			blankScreenElement.style.opacity = blankScreenFade;
			clearInterval(blankScreenFadeInterval);
			blankScreenFadeInterval = false;
		}
	}


	/*function disableOnClicksRec(tag, disable) {
		for (var i = 0; i < tag.childNodes.length; i++) {
			if (disable) {
				if (tag.childNodes[i].onclick != undefined && tag.childNodes[i].onclick_ORIG == undefined) {
					tag.childNodes[i].onclick_ORIG = tag.childNodes[i].onclick;
					tag.childNodes[i].onclick = undefined;
				}
			} else {
				if (tag.childNodes[i].onclick == undefined && tag.childNodes[i].onclick_ORIG != undefined) {
					tag.childNodes[i].onclick = tag.childNodes[i].onclick_ORIG;
					tag.childNodes[i].onclick_ORIG = undefined;
				}
			}
			if (tag.childNodes[i].childNodes != undefined && tag.childNodes[i].childNodes.length > 0) {
				disableOnClicksRec(tag.childNodes[i], disable);
			}
		}
	}*/
	function disableOnClicks(disable) {
		if (disabledOnClicks != disable) {
			disabledOnClicks = disable;
			if (disabledOnClicks) {
				mainWindowElement.style.pointerEvents = 'none';
			} else {
				setTimeout(function() {
					mainWindowElement.style.pointerEvents = '';
				}, 500);
			}
			//disableOnClicksRec(mainWindow, disabledOnClicks);
		}
	}

	this.showBlankScreen = function() {
		if (extended.isControllerMode()) {
			extended.sendMessage('blankScreen');
		} else {
			this.setBlankScreenTimeout(true);
		}
	}

	this.showBackground = function() {
		if (extended.isControllerMode()) {
			extended.sendMessage('background');
		} else {
			mainWindowPanelElement.style.display = 'none';
			txtBlockElement.style.display = 'none';
			infoContentElement.style.display = 'none';
			this.setBlankScreenTimeout(false);
		}
	}

	this.exitBackground = function() {
		if (mainWindowPanelElement.style.display == 'none') {
			mainWindowPanelElement.style.display = '';
			txtBlockElement.style.display = '';
			if (player.playSongId != '' || extended.isDisplayMode()) {
				infoContentElement.style.display = '';
			}
			presenter.resizeDisplay();
			songPanel.updateSongPanel();
			presenter.autoTxtSize();
		}
	}
	
	blankScreenElement.onclick = function(evt){
		if (extended.isDisplayMode()) {
			presenter.toggleFullScreen(evt);
		} else {
			evt.preventDefault();
			controls.cancelHide();
		}
	}
	
	this.setBlankScreenTimeout();
}
