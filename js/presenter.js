var continueButtonElement = document.getElementById('continueButton');
var continueButtonTxtElement = document.getElementById('continueButtonTxt');

var presenter;

function Presenter() {
	var fullScreen = false;
	var isMobile = false;
	
	this.subtitles = false;
	this.subtitleIndex = -1;
	this.playPanel = '';
	
	this.txtClickCancel = false;
	
	var _this = this;
		
	// megjeleníti a versszak szövegét és az infó sort
	this.refresh = function() {
		if (extended.isDisplayMode()) {
			this.autoTxtSize();
			return;
		}
		
		switch (this.playPanel) {
			
			case 'hymnal' :
				var showIndex = player.index;
				var showIntro = player.playingIntro;
				if (player.showForward) {
					if (showIntro) {
						showIntro = false;
					} else if (showIndex < player.playVersesList.length - 1) {
						showIndex++;
					}
				}
				var showVers = player.playVersesList[showIndex];

				// footer info row
				if (player.playSongId != '') {
					var a = [];
					var s1, s2;
					for (var i = 0; i < player.playVersesList.length; i++) {
						if (showIndex == i && player.pagingEnabled && !player.onBlankPage) {
							s1 = '<b><u>';
							s2 = '</u></b>';
						} else {
							s1 = '';
							s2 = '';
						}
						if (player.playVersesList[i] == 0) {
							a.push(s1 + tr('pause') + s2);
						} else {
							a.push(s1 + player.playVersesList[i] + s2 + '.');
						}
					}
					if (song[player.playSongId].ownText) {
						infoContentElement.innerHTML = song[player.playSongId].title;
					} else {
						infoContentElement.innerHTML = songData.getSongName(player.playSongId, tr('SongNo'), true);
					}
					if (!player.isPlayableWithTracks && songData.isMusicOneFile(player.playSongId)) {
						a = [];
						if (player.musicEnabled) {
							infoContentElement.innerHTML += ' &nbsp; <span id="position">' + player.getPosition() + '</span>';
						} else if (this.subtitles !== false && player.pagingEnabled) {
							fInd = tr('intro');
							fCnt = 0;
							for (var i = 0; i < this.subtitles.length; i++) {
								if (this.subtitles[i][2] != '') {
									fCnt++;
									if (i == this.subtitleIndex) {
										fInd = tr('pageNo').replace('%', fCnt);
									}
								}
							}
							infoContentElement.innerHTML += ' &nbsp; <span id="position">(' + (player.onBlankPage ? tr('end') : fInd) + ' / ' + fCnt + ' ' + tr('page') + ')</span>';
						}
					};
					if (a.length > 0) {
						if (player.pagingEnabled) {
							if (!player.onBlankPage) {
								var verseStr = showVers;
								if (song[player.playSongId].ownText) {
									verseStr = tr('VerseNoShort').replace('%', verseStr);
								} else {
									verseStr = tr('VerseNo').replace('%', verseStr);
								}
								infoContentElement.innerHTML += ', ' + verseStr;
							}
						}
						infoContentElement.innerHTML += ' &nbsp; (' + a.join(' ') + ')';
					}
				} else {
					if (extended.isDisplayMode()) {
						infoContentElement.innerHTML = '';
					} else {
						infoContentElement.innerHTML = tr('BackToMain');
					}
				}
				if (demo.isEnabled()) {
					infoContentElement.innerHTML += ' &nbsp; ' + tr('Demo');
				} else if (player.listEnabled) {
					infoContentElement.innerHTML += ' &nbsp; ' + tr('PlayList');
					if (player.listIndex != -1 && player.list.length > 0) {
						infoContentElement.innerHTML += ': ' + tr('playlistNo').replace('%', (player.listIndex + 1)) + ' / ' + player.list.length;
					}
				}

				// song text
				if (player.playSongId == '' || showVers == 0 || song[player.playSongId][showVers] == undefined) {
					textContentElement.innerHTML = '<div id="inner" class="noselect" style="padding: 1%;"></div>';
				} else if (player.onBlankPage) {
					textContentElement.innerHTML = '<div id="inner" class="noselect" style="padding: 1%;"></div>';
				} else if (this.subtitles !== false) {
					var feliratSzoveg = '';
					if (player.musicEnabled || player.pagingEnabled) {
						textContentElement.innerHTML = '<div id="inner" class="noselect" style="padding: 1% 0%;">' + this.getCurrentSubtitle() + '</div>';
					} else {
						// teljes szöveg egy képernyőn
						feliratSzoveg =
							'<div><span class="kiemelt" style="color: ' + theme.highlightedColor + ';">' + songData.getSongName(player.playSongId, tr('SongNo')) + ':</span> ' + 
							song[player.playSongId].title + '</div>';
						for (var i = 0; i < this.subtitles.length; i++) {
							if (this.subtitles[i][2] != '') {
								feliratSzoveg += '<br><div>';
								if (this.subtitles[i][1] != '') {
									feliratSzoveg += '<span class="kiemelt szam" style="color: ' + theme.highlightedColor + ';">' + this.subtitles[i][1] + '</span> ';
								}
								feliratSzoveg += songData.formatSongText(this.subtitles[i][2]) + '</div>';
							}
						}
						textContentElement.innerHTML = '<div id="inner" class="noselect" style="padding: 1%;">' + feliratSzoveg + '</div>';
					}
				} else if (showIntro || !player.pagingEnabled) {
					var title = songData.getSongTitle(player.playSongId);
					
					if (player.pagingEnabled) {
						if (song[player.playSongId].ownText) {
							textContentElement.innerHTML = '<div id="inner" class="noselect" style="padding: 1%;"><br><span class="kiemelt" style="color: ' + theme.highlightedColor + ';">' + song[player.playSongId].title + '</span><br><br>' + songData.getSongArtist(player.playSongId) + '</div>';
						} else {
							var vName = songData.getSongName(player.playSongId, tr('SongNo'));
							textContentElement.innerHTML = 
								'<div id="inner" class="noselect" style="padding: 1%;"><br>' +
									'<span class="kiemelt" style="color: ' + theme.highlightedColor + ';">' + 
										songData.getSongName(player.playSongId, tr( showIndex > 0 ? 'ContinueSongNo' : 'SongNo' )) +
									'</span><br>' +
									title + '<br><br>' + songData.getSongArtist(player.playSongId) + 
								'</div>';
						}
					} else {
						var html = '<div id="inner" class="noselect" style="padding: 1% 0%;">';
						//html += '<br>';
						var separator = false;
						for (var i in player.playVersesList) {
							if (separator) {
								html += '<div>&nbsp;</div>';
							} else {
								separator = true;
							}
							if (player.playVersesList[i] == 0) {
								html += '<div><span class="kiemelt" style="color: ' + theme.highlightedColor + ';">- ' + tr('pause') + ' -</span></div>';
							} else {
								html += '<div>' + 
									(song[player.playSongId].ownText ? '' : '<span class="kiemelt szam" style="color: ' + theme.highlightedColor + ';">' + tr('VerseNoInHighlightedText').replace('%', player.playVersesList[i]) + '</span> ') + 
									songData.formatSongText(song[player.playSongId][player.playVersesList[i]]) + 
									'</div>';
							}
						}
						html += '</div>';
						textContentElement.innerHTML = html;
					}
				} else {
					textContentElement.innerHTML = '<div id="inner" class="noselect" style="padding: 1% 0%;">' + (song[player.playSongId].ownText ? '' : '<span class="kiemelt szam" style="color: ' + theme.highlightedColor + ';">' + tr('VerseNoInHighlightedText').replace('%', showVers) + '</span> ') + songData.formatSongText(song[player.playSongId][showVers]) + '</div>';
				}
				
				// automatikus szöveg méret
				this.autoTxtSize();

				// folytatás gomb
				if (player.playSongId != '') {
					if (pauseButtonElement.style.display == 'none') {
						if (textContentElement.className != 'paused') {
							textContentElement.className = 'paused';
						}
						textContentElement.innerHTML += '<div class="noselect" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: #000; opacity: 0.5;"></div>';
						var pauseFontSize = textContentElement.style.fontSize;
						if (parseInt(pauseFontSize, 10) > 150) {
							pauseFontSize = '150px';
						}
						continueButtonElement.style.fontSize = pauseFontSize;
						if (mainWindowElement.style.display != 'none') {
							continueButtonElement.style.visibility = 'hidden';
						}
						continueButtonElement.style.display = '';
					} else {
						if (textContentElement.className == 'paused') {
							textContentElement.className = '';
						}
						continueButtonElement.style.display = 'none';
					}
				} else {
					continueButtonElement.style.display = 'none';
				}
				
				// betöltés kijelzés
				if (player.loading || player.androidHackAlert) {
					textContentElement.innerHTML += 
						'<table id="loading" class="noselect" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; color: #fff;">' +
						'<tr><td style="text-align: center; vertical-align: top; height: 67%;">' +
							'&nbsp;' +
						'</td></tr>' +
						'<tr><td style="text-align: center; vertical-align: top; height: 33%;">' +
							(player.androidHackAlert ? 
							
								'<div style="padding: 20px 30px; background: #eb8; color: #000; border-radius: 40px; opacity: 0.8; font-size: 50px; text-shadow: 0 0 0; line-height: 1.2em;">' + tr('AudioActivation') + '</div>' :
								
								'<span style="padding: 10px 30px; background: #eb8; color: #000; border-radius: 40px; opacity: 0.8; font-size: 50px; text-shadow: 0 0 0;">' + tr('Loading') + '</span>'
							) +
						'</td></tr>' +
						'</table>';
					/*if (document.getElementById('loading')) {
						document.getElementById('loading').style.fontSize = (parseInt(textContentElement.style.fontSize) * 0.5) + 'px';
					}*/
				}
				break;
				
			case 'bible' :
				var info = bible[biblePanel.playBible].cover.title;
				if (bible[biblePanel.playBible].cover.abbreviation != undefined && bible[biblePanel.playBible].cover.abbreviation != '') {
					info += ' (' + bible[biblePanel.playBible].cover.abbreviation + ')';
				}
				if (bible[biblePanel.playBible].cover.lang != undefined && bible[biblePanel.playBible].cover.lang != '') {
					info += ' ' + bible[biblePanel.playBible].cover.lang;
				}
				var selectedVersesStr = '';
				if (biblePanel.playVerses.length > 0) {
					info += ' / ';
					
					var pBook = biblePanel.playVerses[0][0][0];
					var pChapter = biblePanel.playVerses[0][0][1];
					var pVerse = biblePanel.playVerses[0][0][2];
					
					var bf = biblePanel.playVerses[biblePanel.playVerses.length - 1];
					var pBook2 = bf[bf.length - 1][0];
					var pChapter2 = bf[bf.length - 1][1];
					var pVerse2 = bf[bf.length - 1][2];
						
					selectedVersesStr += bible[biblePanel.playBible].cover.book[pBook].title + ' ' + pChapter + ':' + pVerse;
					if (pBook != pBook2 || pChapter != pChapter2 || pVerse != pVerse2) {
						selectedVersesStr += ' &ndash; ';
						if (pBook2 != pBook) {
							selectedVersesStr += bible[biblePanel.playBible].cover.book[pBook2].title + ' ' + pChapter2 + ':' + pVerse2;
						} else if (pChapter2 != pChapter) {
							selectedVersesStr += pChapter2 + ':' + pVerse2;
						} else if (pVerse2 != pVerse) {
							selectedVersesStr += pVerse2;
						}
					}
					
					info += selectedVersesStr;
					if (biblePanel.playPaging) {
						var n = biblePanel.playIndex + 1;
						info += ' &nbsp; (' + (n > biblePanel.playVerses.length ? 'vége' : n + '.') + ' / ' + biblePanel.playVerses.length + ')';
					}
				}
				infoContentElement.innerHTML = info;
				
				var html = '<div id="inner" class="noselect" style="padding: 1% 0%;">';
				
				var verses = [];
				if (biblePanel.playPaging) {
					if (biblePanel.playIndex < biblePanel.playVerses.length) {
						for (var itemIndex = 0; itemIndex < biblePanel.playVerses[biblePanel.playIndex].length; itemIndex++) {
							verses.push(biblePanel.playVerses[biblePanel.playIndex][itemIndex]);
						}
					}
				} else {
					for (var pageIndex = 0; pageIndex < biblePanel.playVerses.length; pageIndex++) {
						for (var itemIndex = 0; itemIndex < biblePanel.playVerses[pageIndex].length; itemIndex++) {
							verses.push(biblePanel.playVerses[pageIndex][itemIndex]);
						}
					}
				}
				if (verses.length > 0) {
					html += '<table style="width: 100%; height: 100%; border-spacing: 0; border-collapse: separate; padding: 0;">';
					
					var isHorizontalParalel = biblePanel.isHorizontalParalel;
					var isSeparator = biblePanel.isVerseSeparator;
					
					var bibleArray = [biblePanel.playBible];
					for (var i = 0; i < biblePanel.paralelBibleList.length; i++) {
						bibleArray.push(biblePanel.paralelBibleList[i]);
					}
					var tdWidth = Math.round(100 / bibleArray.length * 100) / 100;
					
					var pBook = verses[0][0];
					var pChapter = verses[0][1];
					var pVerse = verses[0][2];
					var titleHtml = '<span class="kiemelt szam" style="color: ' + theme.highlightedColor + ';">';
					if (biblePanel.playPaging) {
						titleHtml += bible[biblePanel.playBible].cover.book[pBook].short + ' ' + pChapter;
						if (verses.length == 1) {
							titleHtml += ':' + pVerse;
						}
					} else {
						titleHtml += selectedVersesStr;
					}
					if (bibleArray.length == 1 && bible[biblePanel.playBible].cover.abbreviation != undefined && bible[biblePanel.playBible].cover.abbreviation != '') {
						titleHtml += ' (' + bible[biblePanel.playBible].cover.abbreviation + ')';
					}
					titleHtml += '</span>';
					html += '<tr><td' + (isHorizontalParalel ? ' colspan="' + (bibleArray.length * 2 - 1) + '"' : '') + ' style="height:0.001%;">' + titleHtml + '</td></tr>';
					
					var smallSeparatorHtml = '<div style="font-size: 25%; line-height: 1em;">&nbsp;</div>';
					var separatorHtml = '<div style="font-size: 50%; line-height: 1em;">&nbsp;</div>';
					var separatorEmptyHtml = '<div style="font-size: 0; line-height: 0;"></div>';
					var abbreviationSeparator = '';
					if (isHorizontalParalel) {
						if (!isSeparator) {
							separatorHtml = ' ';
						}
					} else {
						if (bibleArray.length > 1) {
							smallSeparatorHtml = '';
							separatorHtml = separatorEmptyHtml;
							abbreviationSeparator = ': ';
						}
						if (!isSeparator) {
							separatorHtml = ' ';
						}
					}
					
					html += '<tr>';
					for (var bibleIndex = 0; bibleIndex < bibleArray.length; bibleIndex++) {
						if (bibleIndex > 0 || (!isHorizontalParalel && bibleArray.length > 1)) {
							if (isHorizontalParalel) {
								html += '<td style="width: 0.001%; background: ' + textContentElement.style.color + '; padding: 1px;"></td>';
							} else {
								html += '</tr><tr><td style="width: 0.001%; background: ' + textContentElement.style.color + '; padding: 1px;"></td></tr><tr>';
							}
						}
						var bibleId = bibleArray[bibleIndex];
						var blockHtml = '';
						
						var pBookLast = '', pChapterLast = '', pVerseLast = '';
						for (var i = 0; i < verses.length; i++) {
							pBook = verses[i][0];
							pChapter = verses[i][1];
							pVerse = verses[i][2];
							if (i == 0) {
								/*titleHtml = '<span class="kiemelt szam" style="color: ' + theme.highlightedColor + ';">';
								if (biblePanel.playPaging) {
									titleHtml += bible[bibleId].cover.book[pBook].short + ' ' + pChapter;
									if (verses.length == 1) {
										titleHtml += ':' + pVerse;
									}
								} else {
									titleHtml += selectedVersesStr;
								}
								if (bible[bibleId].cover.abbreviation != undefined && bible[bibleId].cover.abbreviation != '') {
									titleHtml += ' (' + bible[bibleId].cover.abbreviation + ')';
								}
								titleHtml += '</span>';*/
								
								if (bibleArray.length > 1) {
									titleHtml = '<span class="kiemelt szam" style="color: ' + theme.highlightedColor + ';">';
									if (bible[bibleId].cover.abbreviation != undefined && bible[bibleId].cover.abbreviation != '') {
										titleHtml += bible[bibleId].cover.abbreviation + abbreviationSeparator;
									}
									titleHtml += '</span>';
									blockHtml += titleHtml;
								}
								
								if (verses.length == 1) {
									pBookLast = pBook;
									pChapterLast = pChapter;
									pVerseLast = pVerse;
								} else {
									pBookLast = pBook;
									pChapterLast = pChapter;
								}
								
								blockHtml += smallSeparatorHtml;
							} else {
								blockHtml += separatorHtml;
							}
							if (pBookLast != pBook) {
								blockHtml += '<span class="kiemelt szam" style="color: ' + theme.highlightedColor + ';">' + bible[bibleId].cover.book[pBook].short + ' ' + pChapter + ':' + pVerse + '</span> ';
								pBookLast = pBook;
								pChapterLast = pChapter;
								pVerseLast = pVerse;
							} else if (pChapterLast != pChapter) {
								blockHtml += '<span class="kiemelt szam" style="color: ' + theme.highlightedColor + ';">' + pChapter + ':' + pVerse + '</span> ';
								pChapterLast = pChapter;
								pVerseLast = pVerse;
							} else if (pVerseLast != pVerse) {
								blockHtml += '<span class="kiemelt szam" style="color: ' + theme.highlightedColor + ';">' + pVerse + '</span> ';
								pVerseLast = pVerse;
							}
							blockHtml += bibleData.formatText(bible[bibleId].content[pBook][pChapter][pVerse]);
						}
						
						html += '<td style="width: ' + tdWidth +'%; vertical-align: top; text-align: center; padding: 0;">' + blockHtml + '</td>';
					}
					
					html += '</tr></table>';
				}
				
				html += '</div>';
				textContentElement.innerHTML = html;
				
				// automatikus szöveg méret
				this.autoTxtSize();
				break;
				
		}
	}

	this.autoTxtSize = function() {
		if (document.getElementById('inner')) {
			var inner = document.getElementById('inner');
			
			var minSize = 10;
			var maxSize = 400;
			var txtHeight = textContentElement.clientHeight - infoContentElement.clientHeight;
			var txtWidth = textContentElement.clientWidth;
			
			// legnagyobb betűméret megkeresése, ami még kifér 
			
			// felezéses keresés
			var x = 100; // számláló biztonság kedvéért, hogy semmiképpen se ragadhasson be
			while (x--) {
				var middle = minSize + Math.ceil((maxSize - minSize) / 2);
				textContentElement.style.fontSize = middle + 'px';
				if (inner.clientHeight > txtHeight || textContentElement.scrollWidth > txtWidth) {
					// nem fér ki
					maxSize = middle - 1;
				} else {
					// kifér
					minSize = middle;
				}
				if (minSize == maxSize) {
					if (middle != minSize) {
						textContentElement.style.fontSize = minSize + 'px';
					}
					break;
				}
			}
			
		} else {
			textContentElement.style.fontSize = '10px';
		}
	}
	
	this.getCurrentSubtitle = function() {
		var subtitle;
		if (this.subtitleIndex == -1) {
			subtitle = //'<div id="inner" class="noselect" style="padding: 1%;">' +
				'<br><span class="kiemelt" style="color: ' + theme.highlightedColor + ';">' + 
				songData.getSongName(player.playSongId, tr('SongNo')) + '</span><br>' + 
				song[player.playSongId].title + '<br><br>' + songData.getSongArtist(player.playSongId) +
				//'</div>'
				'';
		} else {
			subtitle = songData.formatSongText(this.subtitles[this.subtitleIndex][2]);
			if (this.subtitles[this.subtitleIndex][1] != '') {
				subtitle = '<span class="kiemelt szam" style="color: ' + theme.highlightedColor + ';">' + this.subtitles[this.subtitleIndex][1] + '</span> ' + subtitle;
			}
		}
		return subtitle;
	}
	
	// váltás énekválasztó és versszak szöveg képernyő között
	this.showMainWindow = function() {
		if (mainWindowElement.style.display == 'none') {
			if (extended.isDisplayMode()) {
				return;
			}
			// énekválasztó megjelenítése
			mainWindowElement.style.display = '';
			textContentElement.style.visibility = 'hidden';
			continueButtonElement.style.visibility = 'hidden';
			this.updateMainWindow();
			screenSaver.setBlankScreenTimeout();
			this.resizeDisplay();
			songPanel.updateTitleList();
		} else {
			// énekválasztó elrejtése
			mainWindowElement.style.display = 'none';
			textContentElement.style.visibility = 'visible';
			continueButtonElement.style.visibility = 'visible';
			this.updateMainWindow();
			informationsWindowElement.style.display = 'none'; // információk eltüntetése, ha meg lenne nyitva
			screenSaver.setBlankScreenTimeout();
		}
		this.refresh();
	}
	
	this.clickInfoContent = function() {
		//if (!hasClass(bodyElement, 'hideMouse')) {
			this.showMainWindow();
		//}
	}

	this.updateMainWindow = function() {
		if (mainWindowElement.style.display == 'none') {
			infoContentElement.title = tr('BackToMain');
		} else {
			infoContentElement.title = tr('BackToPresenter');
		}
	}

	this.toggleFullScreen = function(onlyFullScreen) {
		
		// event object in onlyFullScreen variable
		if (onlyFullScreen !== undefined && onlyFullScreen !== true && onlyFullScreen !== false) {
			var e = onlyFullScreen;
			if (!e) {
				e = window.event;
			}
			
			var middleClick = false;
			if (e.which) middleClick = (e.which == 2);
			else if (e.button) middleClick = (e.button == 1);
			if (middleClick) {
				// avoid fullscreen at middle button click
				return;
			}
			
			onlyFullScreen = false;
		}
		
		if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
			if (document.documentElement.requestFullScreen) {
				document.documentElement.requestFullScreen();
			} else if (document.documentElement.msRequestFullscreen) {
				document.documentElement.msRequestFullscreen();
			} else if (document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullScreen) {
				document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			}
			fullScreen = true;
		} else if (!onlyFullScreen) {
			if (document.cancelFullScreen) {
				document.cancelFullScreen();
			} else if (document.msCancelFullScreen) {
				document.msCancelFullScreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
			fullScreen = false;
		}
		
		setTimeout(function(){
			_this.refresh();
		}, 200);
	}
	
	this.isFullScreen = function() {
		return fullScreen;
	}

	this.setTxtClickCancel = function() {
		this.txtClickCancel = true;
	}

	// e (event) paramterer required for avoid fullscreen at middle button click
	this.txtClick = function(e) {
		if (this.txtClickCancel) {
			this.txtClickCancel = false;
		} else {
			switch (panel.getSelected()) {
				case 'hymnal' :
					if (!player.musicEnabled && player.pagingEnabled) {
						player.previous();
					} else {
						this.toggleFullScreen(e);
					}
					break;
				case 'bible' :
					biblePanel.previous(true);
					break;
			}
		}
	}
	
	this.txtRightClick = function() {
		switch (panel.getSelected()) {
			case 'hymnal' :
				if (!player.musicEnabled && player.pagingEnabled) {
					player.next();
				} else if (player.musicEnabled) {
					player.changePlaySpeed();
				}
				break;
			case 'bible' :
				biblePanel.next();
				break;
		}
	}

	this.setMobileView = function(setView) {
		isMobile = setView;
		this.resizeDisplay();
		panel.hideMenu();
		app.fireEvent('changeView');
	}
	
	this.getMobileView = function() {
		return isMobile;
	}
	
	this.txtPagingRestore = function() {
		player.showForward = false;
		if (this.playPanel == 'hymnal') {
			if (textContentElement.style.opacity != 1) {
				textContentElement.style.opacity = 1;
			}
		}
	}

	// átméretezés
	this.resizeDisplay = function() {
		var viewClass = '';
		if (isMobile) {
			//var winW = document.body.clientWidth;
			//var winH = document.body.clientHeight;
			var winW = window.innerWidth;
			var winH = window.innerHeight;
			if (winW > winH) {
				viewClass = 'mobile landscape';
			} else {
				viewClass = 'mobile portrait';
			}
		} else {
			viewClass = 'desktop';
			if (extended.isControllerMode()) {
				viewClass += ' thumb';
			}
		}
		if (hasClass(bodyElement, 'hideMouse')) {
			viewClass += ' hideMouse';
		}
		if (bodyElement.className != viewClass) {
			bodyElement.className = viewClass;
		}
		
		// it must be set twice
		for (var i = 0; i < 2; i++) {
			infoContentElement.style.paddingRight = infoContentElement.clientHeight + 'px';
			infoContentElement.style.width = (txtBlockElement.clientWidth - parseInt(infoContentElement.style.paddingLeft, 10) - parseInt(infoContentElement.style.paddingRight, 10)) + 'px';
		}
		
		var buttonSize = (infoContentElement.clientHeight + 1) + 'px';
		if (pauseButtonElement.style.height != buttonSize) {
			pauseButtonElement.style.height = buttonSize;
			pauseButtonElement.style.width = pauseButtonElement.style.height;
			pauseButtonElement.style.lineHeight = pauseButtonElement.style.height;
			
			playButtonElement.style.height = pauseButtonElement.style.height;
			playButtonElement.style.width = pauseButtonElement.style.width;
			playButtonElement.style.lineHeight = pauseButtonElement.style.lineHeight;
		}
		
		mainWindowElement.style.height = (window.innerHeight - infoContentElement.clientHeight) + 'px';
		
		mainWindowPanelElement.style.zoom = 1;
		mainWindowPanelElement.style['-moz-transform'] = 'scale(1)';
		//mainWindowPanelElement.style.marginBottom = (infoContentElement.clientHeight) + 'px';
		var panelW = mainWindowPanelElement.clientWidth;
		var panelH = mainWindowPanelElement.clientHeight;
		
		//var winW = document.body.clientWidth;
		//var winH = document.body.clientHeight;
		var winW = window.innerWidth;
		var winH = window.innerHeight;

		winH -= infoContentElement.clientHeight;
		if (extended.isControllerMode()) {
			winW -= 320;
		}
		var r1 = winW / panelW;
		var r2 = winH / panelH;
		var r = r1 > r2 ? r2 : r1;
		var z = 0.95; // kis képernyőn a képernyőkitöltés
		if (isMobile) {
			z = 0.99;
		} else {
			if (winH > winW) {
				// álló képernyőn a szélességéig húzzuk -- nem módosítjuk az "r" értékét
			} else if (r > z) {
				// nagy képernyőn a képernyőkitöltés
				if (r * 0.7 > z) {
					z = 0.7;
				} else {
					r = z;
				}
			}
		}
		mainWindowPanelElement.style.zoom = r * z;
		mainWindowPanelElement.style['-moz-transform'] = 'scale(' + (r * z) + ')';
		mainWindowPanelElement.style['-moz-transform-origin'] = 'top center';
		/*if (mainWindowPanelElement.scale) {
			mainWindowPanelElement.scale(r * z);
		}*/
		
		mouseSongSelector.autoTxtSize();
	}	
	
	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf('android') != -1 || ua.indexOf('ipad;') != -1 || ua.indexOf('iphone;') != -1) {
		isMobile = true;
	}

	window.onresize = function() {
		_this.resizeDisplay();
		_this.refresh();
		infoBox.position();
	}
	document.body.onload = function() {
		_this.resizeDisplay();
	}

	this.resizeDisplay();
	
	app.addEvent('changeTheme', function() {
		presenter.refresh();
	});
	
	if (extended.isDisplayMode()) {
		if (mainWindowElement.style.display != 'none') {
			this.showMainWindow();
		}
		infoContentElement.title = '';
		infoContentElement.style.display = '';
		infoContentElement.style.cursor = '';
		infoContentElement.className = 'noselect';
		infoContentElement.onclick = function() {
			_this.txtClick();
		};
		continueButtonTxtElement.style.cursor = '';
		blankScreenElement.style.cursor = 'default';
		if (!window.localStorage) {
			app.message(tr('ExtendedSupportError'));
		}
		extended.startMessageReceiver();
	} else {
		/*songBook.loadBook(songBook.selectedBook, function(){
			songPanel.updateSongPanel(true);
		});*/
		/*songBook.loadBook('', function(){
			songPanel.updateSongPanel(true);
		});*/
		panel.updatePanel();
	}
}
