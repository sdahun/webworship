var touchInfoElement = document.getElementById('touchInfo');
var posListElement = document.getElementById('posList');
var posListContentElement = document.getElementById('posListContent');

var controls;

function Controls() {
	var touchStartX = false;
	var touchPage = 0;
	var touchPageLast = 0;
	var hideCounter = 0;
	var wheelAccept = true;
	
	var posListKey = true;

	var inputSearchValue = '';
	
	var middleButtonTimeout = false;

	var _this = this;
	
	function hideMouse() {
		if (bodyElement.className.indexOf(' hideMouse') == -1) {
			bodyElement.className = bodyElement.className + ' hideMouse';
		}
	}

	function showMouse() {
		if (bodyElement.className.indexOf(' hideMouse') != -1) {
			bodyElement.className = bodyElement.className.replace(' hideMouse', '');
		}
	}

	function startAutoHideMouse() {
		if (!extended.isDisplayMode()) {
			setInterval(function(){
				if (mainWindowElement.style.display == 'none' || mainWindowPanelElement.style.display == 'none') {
					if (hideCounter > 0) {
						hideCounter--;
						if (hideCounter == 0) {
							hideMouse();
						}
					}
				} else {
					showMouse();
					hideCounter = 10;
				}
			}, 100);
		}
	}

	this.cancelHide = function() {
		screenSaver.setBlankScreenTimeout();
		showMouse();
		hideCounter = 10 * 1;
	}
	
	startAutoHideMouse();
	
	document.body.onmousemove = function(e) {
		if (!extended.isDisplayMode()) {
			_this.cancelHide();
		}
	}
	
	document.body.onwheel = document.onmousewheel = document.DOMMouseScroll = function(e) {
		if (wheelAccept) {
			wheelAccept = false;
			setTimeout(function(){ wheelAccept = true; }, 10);
			if ((informationsWindowElement.style.display == 'none' && !songPanel.isTitleListOpen() && !songBook.isBookOpen() && !biblePanel.isBibleOpen() && themeWindowElement.style.display == 'none' && menuElement.className.indexOf(' show') == -1) || mainWindowElement.style.display == 'none') {
				if (e.wheelDeltaY > 0 || e.wheelDelta > 0 || e.deltaY < 0) {
					if (mouseSongSelector.isEnabled()) {
						mouseSongSelector.inc();
					} else {
						player.setVolumeUp();
					}
				} else if (e.wheelDeltaY < 0 || e.wheelDelta < 0 || e.deltaY > 0) {
					if (mouseSongSelector.isEnabled()) {
						mouseSongSelector.dec();
					} else {
						player.setVolumeDown();
					}
				}
			}
		}
	}

	// jobb egér gomb kattintás a szöveges képernyőn
	textContentElement.onmouseup = function(e) {
		var rightClick;
		if (!e) var e = window.event;
		if (e.which) rightClick = (e.which == 3);
		else if (e.button) rightClick = (e.button == 2);
		if (rightClick) {
			presenter.txtRightClick();
		}
	}

	document.onmousedown = function(e) {
		var leftClick = false;
		var middleClick = false;
		var rightClick = false;
		
		if (!e) var e = window.event;
		
		if (e.which) leftClick = (e.which == 1);
		else if (e.button) leftClick = (e.button == 0);
		
		if (e.which) middleClick = (e.which == 2);
		else if (e.button) middleClick = (e.button == 1);
		
		if (e.which) rightClick = (e.which == 3);
		else if (e.button) rightClick = (e.button == 2);
		
		if (middleClick && !mouseSongSelector.isEnabled()) {
			// long middle press --> blank screen
			if (middleButtonTimeout !== false) {
				clearTimeout(middleButtonTimeout);
			}
			middleButtonTimeout = setTimeout(function(){
				//mouseSongSelector.hide();
				
				middleButtonTimeout = false;
				var onBlankScreen = blankScreenElement.style.display != 'none';
				if (!onBlankScreen && !extended.isDisplayMode()) {
					setTimeout(function(){
						screenSaver.showBlankScreen();
					}, 100);
				}
			}, 500);
		}
	}
	
	document.onmouseup = function(e) {
		var leftClick = false;
		var middleClick = false;
		var rightClick = false;
		
		if (!e) var e = window.event;
		
		if (e.which) leftClick = (e.which == 1);
		else if (e.button) leftClick = (e.button == 0);
		
		if (e.which) middleClick = (e.which == 2);
		else if (e.button) middleClick = (e.button == 1);
		
		if (e.which) rightClick = (e.which == 3);
		else if (e.button) rightClick = (e.button == 2);
		
		if (middleClick) {
			if (middleButtonTimeout !== false) {
				clearTimeout(middleButtonTimeout);
				middleButtonTimeout = false;
			}
		}
		
		if (mouseSongSelector.isEnabled()) {
			if (leftClick) {
				mouseSongSelector.leftClick()
			} else if (rightClick) {
				mouseSongSelector.rightClick();
			} else if (middleClick) {
				mouseSongSelector.hide();
			}
		} else {
			if (middleClick) {
				var onBlankScreen = blankScreenElement.style.display != 'none';
				if (!onBlankScreen) {
					if (panel.getSelected() == 'hymnal') {
						mouseSongSelector.show();
					}
				}
			}
		}
	}
	
	textContentElement.ontouchstart = function(evt){
		evt.preventDefault();
		var touches = evt.changedTouches;
		if (touches.length == 1) {
			touchStartX = touches[0].pageX;
			touchPage = 0;
		} else {
			touchStartX = false;
			touchPage = 0;
		}
	}
	
	textContentElement.ontouchmove = function(evt) {
		evt.preventDefault();
		var touches = evt.changedTouches;
		if (touches.length == 1 && touchStartX !== false) {
			var moveX = touches[0].pageX - touchStartX;
			var sizeX = textContentElement.clientWidth;
			if (player.pagingEnabled && Math.abs(moveX) > sizeX / 3) {
				if (moveX < 0) {
					touchPage = 1;
				} else {
					touchPage = -1;
				}
			} else {
				touchPage = 0;
			}
		}
		if (touchPageLast != touchPage) {
			touchPageLast = touchPage;
			switch (touchPage) {
				case 1 : touchInfoElement.innerHTML = '&raquo;'; break;
				case -1 : touchInfoElement.innerHTML = '&laquo;'; break;
				default : touchInfoElement.innerHTML = '';
			}
		}
	}
	
	textContentElement.ontouchend = function(evt) {
		evt.preventDefault();
		if (touchPage != 0) {
			switch (panel.getSelected()) {
				case 'hymnal' :
					if (touchPage > 0) {
						player.next();
					} else {
						player.previous();
					}
					break;
				case 'bible' :
					if (touchPage > 0) {
						biblePanel.next();
					} else {
						biblePanel.previous();
					}
					break;
			}
		}
		touchStartX = false;
		touchPage = 0;
		touchInfoElement.innerHTML = '';
		
		// android hack
		if (player.playSongId != '' && pauseButtonElement.style.display != 'none' && player.musicEnabled && /*!androidHackFired &&*/ player.androidHackAlert /*&& player.loading*/ && player.track != -1) {
			audioElement[player.track].pause();
			audioElement[player.track].currentTime = 0;
			audioElement[player.track].play();
			//androidHackFired = true;
			player.androidHackAlert = false;
			presenter.refresh();
			/*for (var i = 0; i <= 3; i++) {
				if (audioElement[i].duration === 0) {
					audioElement[i].play();
					audioElement[i].pause();
					audioElement[i].currentTime = 0;
					if (player.track == i) {
						audioElement[i].play();
					}
					androidHackFired = true;
					player.androidHackAlert = false;
				}
			}*/
		}
	}
	
	this.clearTouchInfo = function(forceClear) {
		if (touchInfoElement.innerHTML != '' || forceClear) {
			touchStartX = false;
			touchPage = 0;
			touchPageLast = 0;
			touchInfoElement.innerHTML = '';
		}
	}
	
	textContentElement.ontouchcancel = function(evt) {
		evt.preventDefault();
		_this.clearTouchInfo(true);
	}
	
	function getControlKey(e) {
		var key = '';
		var isNumpad = false;
		if (e.keyCode == 32) {
			key = 'space';
		} else if (e.keyCode == 13 || e.keyCode == 10) {
			key = 'enter';
		} else if (e.keyCode == 8 /*backspace*/) {
			key = 'del';
		} else if (e.keyCode == 46 /*del*/) {
			key = 'del';
			if (e.location == 3 /*numpad del*/) {
				isNumpad = true;
			}
		} else if (e.keyCode == 110 /*numpad dot*/) {
			key = 'del';
			isNumpad = true;
		} else if (e.keyCode == 111 /*numpad divide button*/) {
			key = '/';
			isNumpad = true;
		} else if (e.keyCode == 109 /*numpad - button*/) {
			key = '-';
			isNumpad = true;
		} else if (e.keyCode == 107 /*numpad + button*/) {
			key = '+';
			isNumpad = true;
		} else if (e.keyCode >= 48 && e.keyCode <= 57) {
			// numeric buttons
			switch (e.keyCode) {
				case 48: key = '0'; break;
				case 49: key = '1'; break;
				case 50: key = '2'; break;
				case 51: key = '3'; break;
				case 52: key = '4'; break;
				case 53: key = '5'; break;
				case 54: key = '6'; break;
				case 55: key = '7'; break;
				case 56: key = '8'; break;
				case 57: key = '9'; break;
			}
		} else if (e.keyCode >= 96 && e.keyCode <= 105) {
			// numpad numeric buttons
			switch (e.keyCode) {
				case  96: key = '0'; break;
				case  97: key = '1'; break;
				case  98: key = '2'; break;
				case  99: key = '3'; break;
				case 100: key = '4'; break;
				case 101: key = '5'; break;
				case 102: key = '6'; break;
				case 103: key = '7'; break;
				case 104: key = '8'; break;
				case 105: key = '9'; break;
			}
			isNumpad = true;
		} else if (e.keyCode == 45 && e.location == 3 /*numpad insert*/) {
			key = '0';
			isNumpad = true;
		} else if (e.keyCode == 38 /*up*/) {
			if (e.location == 3) {
				key = '8';
				isNumpad = true;
			} else {
				key = 'up';
			}
		} else if (e.keyCode == 40 /*down*/) {
			if (e.location == 3) {
				key = '2';
				isNumpad = true;
			} else {
				key = 'down';
			}
		} else if (e.keyCode == 106 /*numpad * button*/) {
			key = '*';
		} else if (e.keyCode == 12 /*numpad clear*/) {
			key = '5';
			isNumpad = true;
		} else if (e.keyCode == 37 /*left*/) {
			if (e.location == 3) {
				key = '4';
				isNumpad = true;
			} else {
				key = 'left';
			}
		} else if (e.keyCode == 39 /*right*/) {
			if (e.location == 3) {
				key = '6';
				isNumpad = true;
			} else {
				key = 'right';
			}
		} else if (e.keyCode == 33 /*pageUp*/) {
			if (e.location == 3) {
				key = '9';
				isNumpad = true;
			} else {
				key = 'pageUp';
			}
		} else if (e.keyCode == 34 /*pageDown*/) {
			if (e.location == 3) {
				key = '3';
				isNumpad = true;
			} else {
				key = 'pageDown';
			}
		} else if (e.keyCode == 35 /*end*/) {
			if (e.location == 3) {
				key = '1';
				isNumpad = true;
			} else {
				key = 'end';
			}
		} else if (e.keyCode == 36 /*home*/) {
			if (e.location == 3) {
				key = '7';
				isNumpad = true;
			} else {
				key = 'home';
			}
		} else if (e.keyCode == 9) {
			key = e.shiftKey ? 'shiftTab' : 'tab';
		}
		
		if ((mainWindowElement.style.display == 'none' || panel.isPanelOpen() || songBook.isBookOpen() || biblePanel.isBibleOpen()) && isNumpad) {
			// presenter text display
			switch (key) {
				case '0': key = 'space'; break;
				case '1': key = 'end'; break;
				case '2': key = 'down'; break;
				case '3': key = 'pageDown'; break;
				case '4': key = 'left'; break;
				case '5': key = 'clear'; break;
				case '6': key = 'right'; break;
				case '7': key = 'home'; break;
				case '8': key = 'up'; break;
				case '9': key = 'pageUp'; break;
			}
		}
		
		var isFn = e.ctrlKey || e.shiftKey || e.altKey || e.metaKey;
		
		return {
			key: key,
			isNumpad: isNumpad,
			isFn: isFn,
			event: e
		};
	}
	
	document.body.onkeydown = function(e) {
		if (extended.isDisplayMode()) {
			return;
		}
		if (ownTextWindow.style.display != 'none') {
			return;
		}
		var fnKey = e.ctrlKey || e.shiftKey || e.altKey || e.metaKey;
		var isMainWindow = mainWindowElement.style.display != 'none';
		
		switch (panel.getSelected()) {
			case 'hymnal' :
				var isSearch = isMainWindow && document.getElementById('search').style.display != 'none';
				if (e.keyCode == 8) {
					if (!isSearch) {
						return false;
					}
				} else if (e.keyCode == 9) {
					return false;
				} else if (e.keyCode == 80) {
					// P - pozíció lista
					if (!isSearch && !fnKey && posListKey && player.track != -1) {
						posListKey = false;
						if (posListElement.style.display == 'none') {
							posListElement.style.display = '';
							posListContentElement.innerHTML = '';
						}
						
						var p = audioElement[player.track].currentTime;
						var sec2 = (Math.floor(p * 1000) % 1000) + '';
						while (sec2.length < 3) {
							sec2 = '0' + sec2;
						}
						p = Math.floor(p);
						var sec = p % 60;
						sec = (sec < 10 ? '0' : '') + sec;
						var min = Math.floor(p / 60);
						posListContentElement.innerHTML += '<div>&lt;!--' + min + ':' + sec + '.' + sec2 + '--&gt;</div>';
						
						posListContentElement.scrollTop = posListElement.scrollHeight;
					}
				}
				inputSearchValue = document.getElementById('searchInput').value;
				break;
				
			case 'bible' :
				if (e.keyCode == 8) {
					return false;
				} else if (e.keyCode == 9) {
					return false;
				} else if (isMainWindow && !biblePanel.isSelectedNothing() && (e.keyCode == 107 || e.keyCode == 109)) {
					var add = e.keyCode == 107;
					
					var bookPart = 0;
					if (biblePanel.isSelectedInput(bibleBookInputElement)) {
						bookPart = 1;
					}
					if (biblePanel.isSelectedInput(bibleBookInput2Element)) {
						bookPart = 2;
					}
					if (bookPart != 0) {
						biblePanel.incDecSelectedBook(bookPart, add);
						biblePanel.clearOption = false;
					}
					
					var chapterPart = 0;
					if (biblePanel.isSelectedInput(bibleChapterInputElement)) {
						chapterPart = 1;
					}
					if (biblePanel.isSelectedInput(bibleChapterInput2Element)) {
						chapterPart = 2;
					}
					if (chapterPart != 0) {
						biblePanel.incDecSelectedChapter(chapterPart, add);
						biblePanel.clearOption = false;
					}

					
					var versePart = 0;
					if (biblePanel.isSelectedInput(bibleVerseInputElement)) {
						versePart = 1;
					}
					if (biblePanel.isSelectedInput(bibleVerseInput2Element)) {
						versePart = 2;
					}
					if (versePart != 0) {
						biblePanel.incDecSelectedVerse(versePart, add);
						biblePanel.clearOption = false;
					}
				}
				break;
		}
	}
	
	document.body.onkeyup = function(e) {
		var controlKey = getControlKey(e);
		var key = controlKey.key;
		var isNumpad = controlKey.isNumpad;
		var fnKey = controlKey.isFn;
		
		// if blank screen enabled
		var onBlankScreen = blankScreenElement.style.display != 'none';
		screenSaver.setBlankScreenTimeout();
		if (onBlankScreen) {
			return false;
		}
		
		// if background enabled
		if (mainWindowPanelElement.style.display == 'none') {
			screenSaver.exitBackground();
			return false;
		}
		
		// cancell all if own text window enabled
		if (ownTextWindow.style.display != 'none') {
			return;
		}
		
		// toggle fullscreen if display mode
		if (extended.isDisplayMode()) {
			if (key == 'enter') {
				presenter.toggleFullScreen();
			}
			return;
		}
		
		var isMainWindow = mainWindowElement.style.display != 'none';
		
		if (panel.isPanelOpen()) {
			if (key == 'up') {
				panel.setPreviousPanel();
				return;
			} else if (key == 'down') {
				panel.setNextPanel();
				return;
			} else if (key == 'enter' || key == 'del') {
				panel.selectUp();
				return;
			}
		}
		
		if (songBook.isBookOpen()) {
			if (key == 'up') {
				songBook.setPreviousBook();
				return;
			} else if (key == 'down') {
				songBook.setNextBook();
				return;
			} else if (key == 'enter' || key == 'del') {
				songBook.bookSelectUp();
				return;
			}
		}
		
		if (biblePanel.isBibleOpen()) {
			if (key == 'up') {
				biblePanel.setPreviousBible();
				return;
			} else if (key == 'down') {
				biblePanel.setNextBible();
				return;
			} else if (key == 'enter' || key == 'del') {
				biblePanel.bibleSelectUp();
				return;
			}
		}
		
		switch (panel.getSelected()) {
			case 'hymnal' :
			
				var isSearch = isMainWindow && document.getElementById('search').style.display != 'none';
				if (key == 'space') {
					if (!isSearch) {
						if (isMainWindow) {
							if (songPanel.songNumberWriteEnabled) {
							} else {
								songPanel.writeVerseNumber(0);
							}
						} else {
							if (player.playSongId != '') {
								if (pauseButtonElement.style.display == 'none') {
									player.continue();
								} else {
									player.pause();
								}
							}
						}
					}
				} else if (key == 'enter') {
					if (!isSearch) {
						if (isMainWindow) {
							if (songPanel.songNumberWriteEnabled) {
								if (songPanel.selectedSongId != '' && song[songPanel.selectedSongId] != undefined) {
									songPanel.songNumberWriteEnabled = false;
									if (songPanel.getPlayMode() == '') {
										songPanel.updateSongPanel(true);
									} else {
										songPanel.updateSongPanel();
									}
								}
							} else {
								//player.setup({intro: true, zene: true, lapozas: true});
								for (var i = 0; i < songPanel.playModeOptions.length; i++) {
									if (document.getElementById(songPanel.playModeOptions[i]).className.indexOf('selected') != -1) {
										songPanel.playModeClick(songPanel.playModeOptions[i]);
										break;
									}
								}
							}
						} else {
							presenter.toggleFullScreen();
						}
					}
				} else if (key >= '0' && key <= '9') {
					var digit = key.charCodeAt(0) - 48;
					if (!isSearch) {
						if (isMainWindow && songPanel.delNumberOnWrite) {
							songPanel.delNumberOnWrite = false;
							songPanel.songNumberWriteEnabled = true;
							songPanel.selectSong('');
							songPanel.updateSongPanel();
						}
						if (!isMainWindow) {
							presenter.showMainWindow();
							songPanel.selectSong('');
							songPanel.songNumberWriteEnabled = true;
						}
						if (songPanel.songNumberWriteEnabled) {
							songPanel.writeSongNumber(digit);
						} else {
							/*if (digit == 0) {
								//  // az ének számoknál a 0 megnyomása a 10. versszakot jelenti
								//  digit = 10;
								digit = 0; // 0 megnyomása a szünetet jelenti
							}*/
							
							if (songPanel.verseNumber10) {
								digit = 10 + digit;
							}
							songPanel.verseNumber10 = false;
							var elozoLength = songPanel.selectedVerses.length;
							// 0 megnyomása a szünetet jelenti
							songPanel.writeVerseNumber(digit);
							if (digit == 1 && songPanel.selectedVerses.length == elozoLength) {
								songPanel.verseNumber10 = true;
								songPanel.updateSongPanel(true);
							}
						}
					}
				} else if (key == 'del') {
					if (!isSearch) {
						if (isMainWindow) {
							if (songPanel.songNumberWriteEnabled) {
								songPanel.writeSongNumber(-1);
							} else {
								if (songPanel.selectedVerses.length == 0) {
									songPanel.songNumberWriteEnabled = true;
									songPanel.writeSongNumber(-1);
								} else {
									if (songPanel.verseNumber10) {
										songPanel.verseNumber10 = false;
										songPanel.updateSongPanel(false);
									} else {
										songPanel.writeVerseNumber(-1);
									}
								}
							}
						} else {
							if (player.playSongId != '') {
								player.pause();
							}
							presenter.showMainWindow();
						}
					} else {
						if (inputSearchValue == '') {
							songPanel.searchOff();
						}
					}
				} else if (key == '/') {
					// toggle main display
					if (isMainWindow && player.playSongId == '') {
						// cancel if play song id is empty
					} else {
						presenter.showMainWindow();
					}
				} else if (key == '-') {
					player.setVolumeDown();
				} else if (key == '+') {
					player.setVolumeUp();
				} else if (e.keyCode == 83 || (!isMainWindow && key == '*')) {
					// S - sebesség állítás
					if (!isSearch && !fnKey) {
						player.changePlaySpeed();
					}
				} else if (key == '*' && songPanel.selectedNumber == '') {
					if (songBook.isBookOpen()) {
						songBook.bookSelectUp();
					} else if (panel.isPanelOpen()) {
						panel.selectUp();
						songBook.bookSelectClick();
					} else {
						panel.selectClick();
					}
				} else if (key == 'up' || key == 'down' || key == '*') {
					if (!isSearch) {
						if (isMainWindow) {
							var isFel = key == 'up';
							var playModeSel = songPanel.getPlayMode();
							if (playModeSel != '') {
								// change play mode
								var playModeArray = [];
								for (var i = 0; i < songPanel.playModeOptions.length; i++) {
									if (document.getElementById(songPanel.playModeOptions[i]).className.indexOf('disabled') == -1) {
										playModeArray.push(songPanel.playModeOptions[i]);
									}
								}
								for (i = 0; i < playModeArray.length; i++) {
									if (playModeSel == playModeArray[i]) {
										document.getElementById(playModeSel).className = 'button';
										if (isFel) {
											i--;
											if (i < 0) {
												i = playModeArray.length - 1;
											}
										} else {
											i++;
											if (i >= playModeArray.length) {
												i = 0;
											}
										}
										document.getElementById(playModeArray[i]).className = 'button selected';
										break;
									}
								}
							} else {
								// change variation
								if (songPanel.selectedSongId != '' && song[songPanel.selectedSongId] != undefined) {
									songVariations = songData.getSongVariations(songPanel.selectedSongId);
									if (songVariations.length > 1) {
										for (var i = 0; i < songVariations.length; i++) {
											if (songPanel.selectedSongId == songVariations[i][1]) {
												i++;
												if (i > songVariations.length - 1) {
													i = 0;
												}
												songPanel.selectSongUpdate(songVariations[i][1], true);
												break;
											}
										}
									}
								}
							}
						}
					}
				} else if (key == 'left') {
					// balra nyíl
					if (!isSearch) {
						if (isMainWindow) {
							// énekválasztó képernyőn
							
							/*
							if (songPanel.selectedSongId != '' && song[songPanel.selectedSongId] != undefined) {
								songVariations = songData.getSongVariations(songPanel.selectedSongId);
								if (songVariations.length > 1) {
									for (var i = 0; i < songVariations.length; i++) {
										if (songPanel.selectedSongId == songVariations[i][1]) {
											i--;
											if (i < 0) {
												i = songVariations.length - 1;
											}
											songPanel.selectSongUpdate(songVariations[i][1]);
											break;
										}
									}
								}
							}
							*/
							player.previous();
							
						} else {
							// szöveges képernyőn
							player.previous();
						}
					}
				} else if (key == 'right') {
					// jobbra nyíl
					if (!isSearch) {
						if (isMainWindow) {
							// énekválasztó képernyőn
							
							/*
							if (songPanel.selectedSongId != '' && song[songPanel.selectedSongId] != undefined) {
								songVariations = songData.getSongVariations(songPanel.selectedSongId);
								if (songVariations.length > 1) {
									for (var i = 0; i < songVariations.length; i++) {
										if (songPanel.selectedSongId == songVariations[i][1]) {
											i++;
											if (i > songVariations.length - 1) {
												i = 0;
											}
											songPanel.selectSongUpdate(songVariations[i][1]);
											break;
										}
									}
								}
							}
							*/
							player.next();
							
						} else {
							// szöveges képernyőn
							player.next();
						}
					}
				} else if (e.keyCode == 88) {
					// X - képernyő elsötétítése
					if (!isSearch && !fnKey) {
						screenSaver.showBlankScreen();
					}
				} else if (e.keyCode == 81) {
					// Q - következő téma
					if (!isSearch && !fnKey) {
						if (themePictureElement.selectedIndex + 1 < themePictureElement.options.length) {
							themePictureElement.selectedIndex++;
						} else {
							themePictureElement.selectedIndex = 0;
						}
						themePictureElement.onchange();
					}
				} else if (e.keyCode == 87) {
					// W - előző téma
					if (!isSearch && !fnKey) {
						if (themePictureElement.selectedIndex > 0) {
							themePictureElement.selectedIndex--;
						} else {
							themePictureElement.selectedIndex = themePictureElement.options.length - 1;
						}
						themePictureElement.onchange();
					}
				} else if (e.keyCode == 69) {
					// E - betű színe
					if (!isSearch && !fnKey) {
						if (themeTextElement.selectedIndex + 1 < themeTextElement.options.length) {
							themeTextElement.selectedIndex++;
						} else {
							themeTextElement.selectedIndex = 0;
						}
						themeTextElement.onchange();
					}
				} else if (e.keyCode == 82) {
					// R - véletlen téma
					if (!isSearch && !fnKey) {
						theme.setRandomTheme(1, 1);
					}
				} else if (e.keyCode == 84) {
					// T - téma nélkül
					if (!isSearch && !fnKey) {
						theme.setRandomTheme(0, 0);
					}
				} else if (e.keyCode == 80) {
					// P - pozíció lista
					if (!isSearch && !fnKey) {
						posListKey = true;
					}
				}
				break;
				
			case 'bible' :
				var isSearch = false;
				if (isMainWindow && (key == 'space' || (key == '0' && isNumpad && biblePanel.isSelectedInput(bibleBookInput2Element) && biblePanel.verse2.book == ''))) {
					// az "ig" részt kitölti a "tól" résszel
					biblePanel.setEqual();
				} else if (isMainWindow && key == 'enter' && biblePanel.isSelectedInput(bibleBookInputElement) && biblePanel.verse1.book == '' && biblePanel.verse1.chapter == '' && biblePanel.verse1.verse == '' && biblePanel.verse2.book == '' && biblePanel.verse2.chapter == '' && biblePanel.verse2.verse == '') {
					// entert nyomva a "tól" rész könyv input mezőjén úgy, hogy minden input üres
					biblePanel.submit();
				} else if (isMainWindow && key == 'enter' && biblePanel.isSelectedInput(bibleBookInput2Element) && biblePanel.verse1.book != '' && biblePanel.verse1.chapter != '' && biblePanel.verse1.verse != '' && biblePanel.verse2.book == '') {
					// entert nyomva az "ig" rész könyv input mezőjén úgy, hogy a "tól" rész inputjaiban van érték
					biblePanel.submit();
				} else if (isMainWindow && key == 'enter' && biblePanel.isSelectedNothing()) {
					biblePanel.startPlayMode();
				} else if (isMainWindow && key == 'del' && biblePanel.isSelectedNothing()) {
					// visszatörlést nyomva úgy, hogy egyik input sincs kiválasztva - ki fogunk választani egy inputot
					if (biblePanel.verse1.book == '' || biblePanel.verse1.chapter == '' || biblePanel.verse1.verse == '') {
						// a "tól" tész üres, a "tól" rész könyv inputját választjuk ki
						biblePanel.selectVerseSelector('book', 1);
					} else if (biblePanel.verse2.book == '' || biblePanel.verse2.chapter == '' || biblePanel.verse2.verse == '') {
						// az "ig" rész üres, az "ig" rész könyv inputját választjuk ki
						biblePanel.selectVerseSelector('book', 2);
					} else {
						// az "ig" rész utolsó inputját választjuk ki
						biblePanel.selectVerseSelector('verse', 2);
					}
				} else if (isMainWindow && !biblePanel.isSelectedNothing() && key == '*') {
					if (biblePanel.isBibleOpen()) {
						biblePanel.bibleSelectUp();
					} else if (panel.isPanelOpen()) {
						panel.selectUp();
						biblePanel.bibleSelectClick();
					} else {
						panel.selectClick();
					}
				} else if (isMainWindow && !biblePanel.isSelectedNothing() && (key == '-' || key == '+')) {
					// nothing - handled in onKeyDown event
				} else if (isMainWindow && !biblePanel.isSelectedNothing()) {
					
					// előbb a "tól" rész billentyűzet kezelése, és ha ott nem volt semmi, akkor az "ig" részre megyünk
					if (!biblePanel.verse1.keyPress(controlKey)) {
						biblePanel.verse2.keyPress(controlKey);
					}
					
				} else if (key == '/') {
					// toggle main display
					if (isMainWindow && biblePanel.playVerses.length == 0) {
						// cancel if play verses are empty
					} else {
						presenter.showMainWindow();
					}
				} else if (key == 'enter') {
					if (!isSearch) {
						if (!isMainWindow) {
							presenter.toggleFullScreen();
						}
					}
				} else if (key == 'del') {
					if (!isMainWindow) {
						presenter.showMainWindow();
					}
				} else if (biblePanel.isSelectedNothing() && (key == 'up' || key == 'down' || key == '*')) {
					if (!isSearch) {
						if (isMainWindow) {
							var isFel = key == 'up';
							biblePanel.changePlayMode(isFel);
						}
					}
				} else if (key == 'left') {
					if (!isSearch) {
						biblePanel.previous();
					}
				} else if (key == 'right') {
					if (!isSearch) {
						biblePanel.next();
					}
				}
				break;
		}
	}
}
