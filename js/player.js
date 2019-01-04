// html5 audio: https://www.w3schools.com/tags/ref_av_dom.asp
// icons: https://www.flaticon.com/search

var pauseButtonElement = document.getElementById('pauseButton');
var playButtonElement = document.getElementById('playButton');

var audioElement = [];
audioElement[0] = document.getElementById('audio0');
audioElement[1] = document.getElementById('audio1');
audioElement[2] = document.getElementById('audio2');
audioElement[3] = document.getElementById('audio3');

var player;

function Player() {
	var hideSpdTimeout = false;
	var hideVolTimeout = false;

	var loadingCounter = 0;
	var disablePlayFix = false;
	var myEnded = 0;
	var volume = 1;
	var playSpeed = 0;
	
	// start song
	var introEnabled = true;
	var lastSetupOptions = false;
	var startPosition = 0;
	var startIndex = 0;

	var androidHackCounter = 0;
	this.androidHackAlert = false;
	this.androidHackFired = false;
	this.loading = false;

	this.musicEnabled = true;
	this.pagingEnabled = true;
	this.isPlayableWithTracks = false;
	this.playSongId = '';
	this.playingIntro = true;
	this.playVersesList = [];
	this.index = 0;
	this.track = -1;
	this.onBlankPage = false;
	this.showForward = false;

	this.list = [];
	this.listIndex = -1;
	this.listEnabled = false;
	
	var feliratFade = 1;
	var feliratFadeTimer = false;
	var feliratFadeEnd = false;

	var _this = this;
	
	function canPlayMP3() {
		var a = audioElement[0];
		return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
	}
	
	/*
		mp3-mak felépítése:
		- bejátszás
		- 1. versszak (kezdő versszakhoz)
		- 2. versszak (folyamatban lévő versszakhoz)
		- 3. versszak (lezáró versszakhoz)
	*/
	
	// megfelelő hangsáv indítása
	// startWhenCanPlay: true --> oncanplay eseményre induljon
	// startWithPause: true --> track kiválasztás, de egyből pause-vel induljon; 
	//                 > 1 --> track kiválasztás, de nem indul egyből, hanem ennyi ms múlva
	function playTrack(startWhenCanPlay, startWithPause) {
		myEnded = 0;
		if (_this.track != -1) {
			audioElement[_this.track].pause();
			audioElement[_this.track].currentTime = 0.000001;
		}
		if (_this.playingIntro) {
			// bejátszásnál a bejátszás sáv
			_this.track = 0;
		} else if (_this.index == _this.playVersesList.length - 1) {
			// utolsó versszaknál a bejefező sáv
			_this.track = 3;
		} else if (_this.index == 0) {
			// első versszaknál a kezdő sáv
			_this.track = 1;
		} else {
			// egyébként a középső sáv
			_this.track = 2;
		}
		/*if (audioElement[_this.track].duration > 0) {
			audioElement[_this.track].currentTime = 0;
		}*/
		if (startWhenCanPlay) {
		
			/*// ilyenkor is el kell indítani, mert valamelyik böngésző nem támogatja az oncanplay eseményt
			if (!startWithPause) {
				if (startPosition > 0) {
					audioElement[_this.track].currentTime = audioElement[_this.track].duration * startPosition;
					startPosition = 0;
				}
				audioElement[_this.track].play();
			}*/

			audioElement[_this.track].oncanplay = function() {
				audioElement[_this.track].oncanplay = function() { };
				if (startWithPause) {
					//audioElement[_this.track].currentTime = 0;
					if (startWithPause > 1) {
						disablePlayFix = true;
						audioElement[_this.track].pause();
						setTimeout(function(){
							audioElement[_this.track].play();
							disablePlayFix = false;
						}, startWithPause);
					} else {
						_this.pause();
					}
				} else {
					//if (audioElement[_this.track].paused) { // ha nem indult még el, akkor elindítjuk
						if (startPosition > 0) {
							audioElement[_this.track].currentTime = audioElement[_this.track].duration * startPosition;
							startPosition = 0;
						}
						audioElement[_this.track].play();
					//}
				}
			};
		} else {
			if (startWithPause) {
				//audioElement[_this.track].currentTime = 0;
				if (startWithPause > 1) {
					disablePlayFix = true;
					audioElement[_this.track].pause();
					setTimeout(function(){
						audioElement[_this.track].play();
						disablePlayFix = false;
					}, startWithPause);
				} else {
					_this.pause();
				}
			} else {
				if (startPosition > 0) {
					audioElement[_this.track].currentTime = audioElement[_this.track].duration * startPosition;
					startPosition = 0;
				}
				audioElement[_this.track].play();
			}
		}
	}

	// lejátszás indítás
	function start(setSongId, setVerses, setIntro, setMusic, setPaging) {
		_this.playSongId = setSongId;
		_this.playVersesList = arrayClone(setVerses);
		introEnabled = setIntro;
		_this.musicEnabled = setMusic;
		_this.pagingEnabled = setPaging;
		_this.isPlayableWithTracks = songData.isPlayable(_this.playSongId);
		if (startIndex > 0) {
			_this.index = startIndex;
			startIndex = 0;
		} else {
			_this.index = 0;
		}
		
		presenter.subtitles = false;
		presenter.subtitleIndex = -1;
		feliratFadeEnd = false;
		if (songData.isMusicOneFile(_this.playSongId)) {
			//_this.pagingEnabled = false;
			_this.isPlayableWithTracks = false;
			presenter.subtitles = '';
			for (var i in song[_this.playSongId]) {
				if (i > 0) {
					presenter.subtitles += song[_this.playSongId][i] + '\n';
				}
			}
			if (song[_this.playSongId][1].indexOf('<!--') != -1) {
				// feliratos vetítési mód
				presenter.subtitles = songData.createSubtitlesFromText(presenter.subtitles);
			} else {
				presenter.subtitles = [[5, '', presenter.subtitles]];
			}
		}
		
		var ap = -1;
		if (_this.musicEnabled) {
			if (introEnabled) {
				ap = 0;
			} else if (_this.index == _this.playVersesList.length - 1) {
				ap = 3;
			} else if (_this.index == 0) {
				ap = 1;
			} else {
				ap = 2;
			}
		}
		audioElement[0].autoplay = ap == 0;
		audioElement[1].autoplay = ap == 1;
		audioElement[2].autoplay = ap == 2;
		audioElement[3].autoplay = ap == 3;
		
		var mp3 = song[_this.playSongId] != undefined && song[_this.playSongId].music != undefined ? song[_this.playSongId].music.replace('*', '') : '';
		mp3 = mp3.split('/');
		if (playSpeed != 0) {
			mp3[0] += '-' + playSpeed;
		}
		mp3 = mp3.join('/');
		
		if (!_this.musicEnabled) {
			audioElement[0].src = 'resources/blank.mp3';
			audioElement[0].load();
			
			audioElement[1].src = 'resources/blank.mp3';
			audioElement[1].load();
			
			audioElement[2].src = 'resources/blank.mp3';
			audioElement[2].load();
			
			audioElement[3].src = 'resources/blank.mp3';
			audioElement[3].load();
		} else if (_this.isPlayableWithTracks) {
			audioElement[0].src = 'hymnal/' + mp3 + '_0.mp3';
			audioElement[0].load();

			audioElement[1].src = 'hymnal/' + mp3 + '_1.mp3';
			audioElement[1].load();

			audioElement[2].src = 'hymnal/' + mp3 + '_2.mp3';
			audioElement[2].load();

			audioElement[3].src = 'hymnal/' + mp3 + '_3.mp3';
			audioElement[3].load();
		} else {
			audioElement[0].src = 'hymnal/' + mp3 + '.mp3';
			audioElement[0].load();
			
			audioElement[1].src = 'resources/blank.mp3';
			audioElement[1].load();
			
			audioElement[2].src = 'resources/blank.mp3';
			audioElement[2].load();
			
			audioElement[3].src = 'resources/blank.mp3';
			audioElement[3].load();
		}

		pauseButtonElement.style.display = '';
		pauseButtonElement.style.visibility = _this.musicEnabled ? 'visible' : 'hidden';
		infoContentElement.style.display = '';
		continueButtonElement.style.visibility = 'visible';
		
		_this.playingIntro = introEnabled;
		_this.onBlankPage = false;
		_this.loading = false;
		presenter.txtPagingRestore();
		presenter.refresh();
		presenter.resizeDisplay();
		if (_this.musicEnabled) {
			playTrack(true);
		}
	}
	
	// sebesség kijelzés
	function showSpeed() {
		document.getElementById('speed').style.display = '';
		//document.getElementById('speedTxt').innerHTML = (100 + playSpeed) + '%';
		document.getElementById('speedTxt').innerHTML = playSpeed == 0 ? 'normál' : ((playSpeed > 0 ? '+' : '') + playSpeed + '%');
		if (hideSpdTimeout !== false) {
			clearTimeout(hideSpdTimeout);
			hideSpdTimeout = false;
		}
		hideSpdTimeout = setTimeout(function(){
			hideSpdTimeout = false;
			document.getElementById('speed').style.display = 'none';
		}, 2000);
	}
	
	this.setup = function(options) {
		lastSetupOptions = objectClone(options);
		var setIntro = options.intro;
		var setMusic = options.zene;
		var setPaging = options.lapozas;
		var setAddToList = options.listara;
		var setListEnabled = options.listPlay;
		var setDemo = options.demo;
		
		var startTimeout = 500;
		if (options.startNow) {
			startTimeout = 1;
		}
		startPosition = 0;
		if (options.position > 0) {
			startPosition = options.position;
		}	
		startIndex = 0;
		if (options.index > 0) {
			startIndex = options.index;
		}
		/*if (options.intro != undefined) {
			setIntro = options.intro;
		}*/
		
		var showPlaySpeed = false;
		if (options.speed != undefined) {
			playSpeed = options.speed;
		} else {
			var speeds = songData.getSongSpeeds(songPanel.selectedSongId);
			playSpeed = speeds.play;
			if (playSpeed != 0) {
				showPlaySpeed = true;
			}
		}
		
		if (songPanel.selectedSongId != '' && song[songPanel.selectedSongId] != undefined) {
			if (songPanel.selectedVerses.length == 0) {
				for (var i in song[songPanel.selectedSongId]) {
					if (i > 0) {
						i = parseInt(i, 10);
						songPanel.selectedVerses.push(i);
					}
				}
			}
			
			while (songPanel.selectedVerses.length > 0 && songPanel.selectedVerses[songPanel.selectedVerses.length - 1] == 0) {
				songPanel.selectedVerses.pop();
			}
			
			songPanel.updateSongPanel();
			if (setAddToList) {
				songPanel.disabledAddToList = true;
				this.list.push([songPanel.selectedSongId, songPanel.selectedVerses]);
				songPanel.listSave();
				//titleListOpen = true;
				setTimeout(function(){
					infoBox.show(tr('AddedToPlayList') + '<br>' + songData.getSongName(songPanel.selectedSongId, tr('SongNo'), true));
					songPanel.songNumberWriteEnabled = true;
					songPanel.delNumberOnWrite = false;
					songPanel.selectSong('');
					songPanel.selectedVerses = [];
					songPanel.updateSongPanel(true);
					songPanel.disabledAddToList = false;
				}, 500);
			} else {
				presenter.playPanel = 'hymnal';
				
				this.listEnabled = false;
				if (setListEnabled) {
					this.listEnabled = true;
				}
				demo.disable();
				if (setDemo) {
					demo.enable();
				}
				if (!extended.isControllerMode()) {
					presenter.toggleFullScreen(true);
				}
				songPanel.delNumberOnWrite = true;
				setTimeout(function(){
					if (!extended.isControllerMode() || mainWindowElement.style.display == 'none') {
						mainWindowElement.style.display = 'none';
						infoContentElement.title = tr('BackToMain');
						textContentElement.style.visibility = 'visible';
					} else {
						textContentElement.style.visibility = 'hidden';
					}
					txtBlockElement.style.display = '';
					if (extended.isControllerMode()) {
						extended.sendMessage('start');
					}
					start(songPanel.selectedSongId, songPanel.selectedVerses, setIntro, setMusic, setPaging);
					
					if (showPlaySpeed) {
						showSpeed();
					}
				}, startTimeout);
			}
		}
	}
	
	this.changePlaySpeed = function() {
		var speeds = songData.getSongSpeeds(this.playSongId);
		
		if (speeds.available.length > 0) {
			var newPlaySpeed = playSpeed;
			if (playSpeed == 0) {
				newPlaySpeed = speeds.available[0];
			} else {
				var i = speeds.available.indexOf(playSpeed);
				if (i != -1) {
					i++;
					if (i < speeds.available.length) {
						newPlaySpeed = speeds.available[i];
					} else {
						newPlaySpeed = 0;
					}
				} else {
					newPlaySpeed = 0;
				}
			}
			if (playSpeed != newPlaySpeed) {
				playSpeed = newPlaySpeed;
				if (this.musicEnabled && this.track != -1 && lastSetupOptions !== false) {
					// be kell állítani, hogy mindenképpen az előző lejátszás maradjon
					songPanel.selectSong(this.playSongId);
					songPanel.selectedVerses = arrayClone(this.playVersesList);

					var options = objectClone(lastSetupOptions);
					if (audioElement[this.track].duration > 0) {
						options.position = audioElement[this.track].currentTime / audioElement[this.track].duration;
					}
					options.startNow = true;
					options.index = this.index;
					options.intro = this.playingIntro;
					options.speed = playSpeed;
					this.setup(options);
				}
				showSpeed();
			}
		}
	}

	// lejátszás szünet
	this.pause = function() {
		if (extended.isDisplayMode()) {
			return;
		}
		if (pauseButtonElement.style.display != 'none') {
			pauseButtonElement.style.display = 'none';
			if (this.musicEnabled && this.track != -1) {
				audioElement[this.track].pause();
			}
			presenter.refresh();
			
			demo.stop();
		}
	}

	// lejátszás folytatás
	this.continue = function() {
		if (extended.isDisplayMode()) {
			return;
		}
		if (pauseButtonElement.style.display == 'none') {
			pauseButtonElement.style.display = '';
			presenter.refresh();
			if (this.musicEnabled && this.track != -1) {
				audioElement[this.track].play();
			}
		}
	}
	
	// előző versszak
	this.previous = function() {
		if (this.playSongId != '' && pauseButtonElement.style.display != 'none' && this.pagingEnabled) {
			if (presenter.subtitles !== false) {
				do {
					if (this.musicEnabled && presenter.subtitleIndex == -1) {
						return;
					}
					if (this.onBlankPage) {
						if (this.musicEnabled) {
							return;
						}
						// csak szövegnél a végén van üres oldal, ahonnan vissza lehet lapozni
						this.onBlankPage = false;
					} else {
						presenter.subtitleIndex--;
						if (presenter.subtitleIndex < -1) {
							presenter.subtitleIndex = -1;
						}
					}
				} while (presenter.getCurrentSubtitle() == '' && presenter.subtitleIndex != -1);
				presenter.refresh();
				if (this.musicEnabled && this.track != -1) {
					audioElement[this.track].currentTime = presenter.subtitleIndex > 0 ? presenter.subtitles[presenter.subtitleIndex][0] : 0.000001;
				}
			} else {
				if (this.onBlankPage) {
					if (this.musicEnabled) {
						return;
					}
					// csak szövegnél a végén van üres oldal, ahonnan vissza lehet lapozni
					this.onBlankPage = false;
				} else if (this.index > 0) {
					this.index--;
					this.playingIntro = false;
				} else if (!this.playingIntro && introEnabled) {
					this.playingIntro = true;
				} else {
					return;
				}
				var verseNum = this.playVersesList[this.index];
				if (verseNum == 0) {
					this.index--;
					//verseNum = this.playVersesList[this.index];
				}
				presenter.txtPagingRestore();
				presenter.refresh();
				if (this.musicEnabled) {
					playTrack();
				}
			}
		}
	}
	
	// követkeő versszak
	this.next = function() {
		if (this.playSongId != '' && pauseButtonElement.style.display != 'none' && this.pagingEnabled) {
			if (presenter.subtitles !== false) {
				var maxIndex = 0;
				for (var i = 0; i < presenter.subtitles.length; i++) {
					if (presenter.subtitles[i][2] != '') {
						maxIndex = i;
					}
				}
				do {
					if (this.musicEnabled && presenter.subtitleIndex == maxIndex) {
						return;
					}
					presenter.subtitleIndex++;
					if (presenter.subtitleIndex > presenter.subtitles.length - 1) {
						presenter.subtitleIndex = presenter.subtitles.length - 1;
						this.onBlankPage = true;
					}
				} while (presenter.getCurrentSubtitle() == '' && !this.onBlankPage);
				presenter.refresh();
				if (this.musicEnabled && this.track != -1) {
					audioElement[this.track].currentTime = presenter.subtitles[presenter.subtitleIndex][0];
				}
			} else {
				if (this.playingIntro) {
					this.playingIntro = false;
				} else if (this.index < this.playVersesList.length - 1) {
					this.index++;
				} else {
					if (!this.onBlankPage && !this.musicEnabled) {
						// csak szövegnél a végén van üres oldal
						this.onBlankPage = true;
					} else {
						return;
					}
				}
				var verseNum = this.playVersesList[this.index];
				if (verseNum == 0) {
					this.index++;
					//verseNum = this.playVersesList[this.index];
				}
				presenter.txtPagingRestore();
				presenter.refresh();
				if (this.musicEnabled) {
					playTrack();
				}
			}
		}
	}
	
	// hangerő kijelzés
	function showVolume() {
		document.getElementById('vol').style.display = '';
		document.getElementById('volValue').style.width = Math.round(audioElement[0].volume * 100) + '%';
		document.getElementById('volValueTxt').innerHTML = audioElement[0].volume > 0 ? Math.round(audioElement[0].volume * 100) + '%' : 'Némítva';
		if (audioElement[0].volume == 0) {
			document.getElementById('vol').className = 'mute';
		} else {
			document.getElementById('vol').className = '';
		}
		if (hideVolTimeout !== false) {
			clearTimeout(hideVolTimeout);
			hideVolTimeout = false;
		}
		if (audioElement[0].volume > 0) {
			hideVolTimeout = setTimeout(function(){
				hideVolTimeout = false;
				document.getElementById('vol').style.display = 'none';
			}, 2000);
		}
	}
	
	// hangerő csökkentés
	this.setVolumeDown = function() {
		if (extended.isDisplayMode()) {
			return;
		}
		var s = 0.05;
		if (volume > s) {
			volume = Math.round((volume - s) * 100) / 100;
		} else {
			volume = 0;
		}
		audioElement[0].volume = volume;
		audioElement[1].volume = volume;
		audioElement[2].volume = volume;
		audioElement[3].volume = volume;
		showVolume();
	}

	// hangerő növelés
	this.setVolumeUp = function() {
		if (extended.isDisplayMode()) {
			return;
		}
		var s = 0.05;
		if (volume < 1 - s) {
			volume = Math.round((volume + s) * 100) / 100;
		} else {
			volume = 1;
		}
		audioElement[0].volume = volume;
		audioElement[1].volume = volume;
		audioElement[2].volume = volume;
		audioElement[3].volume = volume;
		showVolume();
	}	
	
	this.getPosition = function() {
		var position = '';
		if (this.track != -1 && audioElement[this.track].duration > 0) {
			var p = audioElement[this.track].currentTime;
			var sec2 = (Math.floor(p * 1000) % 1000) + '';
			while (sec2.length < 3) {
				sec2 = '0' + sec2;
			}
			p = Math.floor(p);
			var sec = p % 60;
			sec = (sec < 10 ? '0' : '') + sec;
			var min = Math.floor(p / 60);
			position = '(' + min + ':' + sec;
			if (!presenter.isFullScreen() && !extended.isControllerMode()) {
				position += '<span style="font-size: 75%;">.' + sec2 + '</span>';
			}
			position += ' / ';

			p = Math.floor(audioElement[this.track].duration);
			sec = p % 60;
			sec = (sec < 10 ? '0' : '') + sec;
			min = Math.floor(p / 60);
			position += min + ':' + sec + ')';
		}
		return position;
	}
	
	// státusz sor frissítés és lejátszás vezérlése pozíciók szerint
	function timeUpdate() {
		
		/*if (audioElement[_this.track].duration > 0) {
			var c = document.getElementById("posCanvas");
			var ctx = c.getContext("2d");
			
			ctx.lineWidth = 3;
			ctx.strokeStyle = '#880';
			ctx.beginPath();
			ctx.arc(20, 20, 10, 0, Math.PI * 2);
			ctx.stroke();
			
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#000';
			ctx.beginPath();
			ctx.arc(20, 20, 10, Math.PI * 1.5, Math.PI * (1.5 + (audioElement[_this.track].currentTime / audioElement[_this.track].duration) * 2));
			ctx.stroke();
		}*/
		
		var isEnabledHymnal = presenter.playPanel == 'hymnal';
		
		if (_this.musicEnabled && _this.track != -1) {
			if (!_this.isPlayableWithTracks) {
				if (document.getElementById('position')) {
					var currentPosition = _this.getPosition();
					if (document.getElementById('position').innerHTML != currentPosition) {
						document.getElementById('position').innerHTML = currentPosition;
					}
				}
				if (presenter.subtitles !== false) {
					// feliratos vetítés
					var pos = audioElement[_this.track].currentTime + SUBTITLE_FADE_PRE_TIME + SUBTITLE_FADE_SHOW_FORWARD;
					if (audioElement[_this.track].currentTime > 5 && audioElement[_this.track].duration > 5 && !feliratFadeEnd) {
						// legvégén az utolsó szövegrész elhalványítása
						feliratFadeEnd = true;
						presenter.subtitles.push([audioElement[_this.track].duration - SUBTITLE_FADE_OUT_END, '', '']);
					}
					for (var i = presenter.subtitleIndex + 1; i < presenter.subtitles.length; i++) {
						if (pos >= presenter.subtitles[i][0]) {
							if (feliratFadeTimer !== false) {
								clearInterval(feliratFadeTimer);
								if (isEnabledHymnal) {
									presenter.refresh();
								}
							}
							
							presenter.subtitleIndex = i;
							
							feliratFade = 1;
							if (isEnabledHymnal) {
								textContentElement.style.opacity = feliratFade;
							}
							
							feliratFadeTimer = setInterval(function(){
								feliratFade -= SUBTITLE_FADE_OUT_STEP; // elhalványodás
								if (feliratFade <= 0) {
									feliratFade = 0;
									if (isEnabledHymnal) {
										textContentElement.style.opacity = feliratFade;
									}
									
									if (isEnabledHymnal) {
										presenter.refresh();
									}
									
									clearInterval(feliratFadeTimer);
									feliratFadeTimer = setInterval(function(){
										feliratFade += SUBTITLE_FADE_IN_STEP; // világosodás
										if (feliratFade >= 1) {
											feliratFade = 1;
											clearInterval(feliratFadeTimer);
											feliratFadeTimer = false;
										}
										if (isEnabledHymnal) {
											textContentElement.style.opacity = feliratFade;
										}
									}, SUBTITLE_FADE_IN_INTERVAL); // világosodás
								}
								if (isEnabledHymnal) {
									textContentElement.style.opacity = feliratFade;
								}
							}, SUBTITLE_FADE_OUT_INTERVAL); // elhalványdás
							
						}
					}
				}
			}
			
			if (audioElement[_this.track].ended || myEnded == 2) {
				myEnded = 0;
				var ended = false;
				if (_this.isPlayableWithTracks) {
					if (_this.playingIntro) {
						_this.playingIntro = false;
					} else if (_this.index < _this.playVersesList.length - 1) {
						_this.index++;
					} else {
						ended = true;
					}
					if (!ended) {
						var verseNum = _this.playVersesList[_this.index];
						var goPause = false;
						if (verseNum == 0) {
							_this.index++;
							//verseNum = _this.playVersesList[_this.index];
							goPause = true;
							if (introEnabled) {
								_this.playingIntro = true;
							}
						}
						presenter.txtPagingRestore();
						if (isEnabledHymnal) {
							presenter.refresh();
						}
						if (goPause) {
							playTrack(false, true);
						} else {
							if (PLAY_NEXT_SILENT > 0) {
								playTrack(false, PLAY_NEXT_SILENT); // késleltetve indulás
							} else {
								playTrack();
							}
						}
					}
					
					// ha mobilon a touch lapozás közben váltódna következő versszakra, akkor nullázzuk a lapozást, különben kint maradna a nyíl
					if (isEnabledHymnal) {
						controls.clearTouchInfo();
					}
				} else {
					ended = true;
				}
				if (ended) {
					_this.track = -1;
					/*if (isEnabledHymnal) {
						//textContentElement.innerHTML = ''; 
					}*/
					pauseButtonElement.style.visibility = 'hidden';
					_this.onBlankPage = true;
					presenter.txtPagingRestore();
					if (isEnabledHymnal) {
						presenter.refresh();
					}
					
					if (demo.isEnabled()) {
						if (isEnabledHymnal) {
							screenSaver.exitBackground();
							screenSaver.setBlankScreenTimeout(false);
						}
						setTimeout(function(){
							demo.play();
						}, 1000);
					} else if (_this.listEnabled) {
						if (_this.listIndex != -1 && _this.listIndex + 1 < _this.list.length) {
							if (isEnabledHymnal) {
								screenSaver.exitBackground();
								screenSaver.setBlankScreenTimeout(false);
							}
							songPanel.listPlay(_this.listIndex + 1);
						} else {
							_this.listEnabled = false;
							_this.listIndex = -1;
							songPanel.updateTitleList();
							if (isEnabledHymnal) {
								screenSaver.setBlankScreenTimeout();
								presenter.refresh();
							}
						}
					} else {
						if (isEnabledHymnal) {
							screenSaver.setBlankScreenTimeout();
						}
					}
				}
			} else {
				if (_this.isPlayableWithTracks) {
					if (audioElement[_this.track].duration > 0 && audioElement[_this.track].currentTime > 5) {
						if (isEnabledHymnal && VERSE_CHANGE_FADE > 0) {
							var fadeOutSub = 0.1; // ennyivel gyorsab lesz a fade és több lesz amíg nem látszik a szöveg
							var txtFadeOut = audioElement[_this.track].duration - audioElement[_this.track].currentTime - VERSE_SHOW_FORWARD;
							var txtFadeIn = audioElement[_this.track].currentTime + VERSE_SHOW_FORWARD - audioElement[_this.track].duration;
							if (txtFadeOut < VERSE_CHANGE_FADE && txtFadeOut >= 0) {
								//textContentElement.style.opacity = txtFadeOut / VERSE_CHANGE_FADE * 1;
								txtFadeOut -= fadeOutSub;
								textContentElement.style.opacity = txtFadeOut <= 0 ? 0 : txtFadeOut / (VERSE_CHANGE_FADE - fadeOutSub) * 1;
							} else if (txtFadeIn <= VERSE_CHANGE_FADE && txtFadeIn >= 0) {
								if (_this.index < _this.playVersesList.length - 1 || _this.playingIntro) {
									textContentElement.style.opacity = txtFadeIn / VERSE_CHANGE_FADE * 1;
								}
							} else if (textContentElement.style.opacity != 1) {
								if (_this.index < _this.playVersesList.length - 1 || _this.playingIntro) {
									textContentElement.style.opacity = 1;
								}
							}
						}
						if (VERSE_SHOW_FORWARD > 0) {
							if (audioElement[_this.track].duration - audioElement[_this.track].currentTime < VERSE_SHOW_FORWARD && !_this.showForward) {
								_this.showForward = true;
								if (isEnabledHymnal) {
									presenter.refresh();
								}
							}
						}
					}
				}
			}
			
			if (_this.track != -1) {
				var fadeInValue = FADE_IN; // ennyi mp-et halkít az elején
				var fadeOutValue = FADE_OUT; // ennyi mp-et halkít a végén
				var fadeRate = FADE_RATE; // ennyire halkítja le (1 = teljesen)
				if (fadeInValue > 0 || fadeOutValue > 0) {
					var fadeOut = audioElement[_this.track].duration - audioElement[_this.track].currentTime;
					var fadeIn = audioElement[_this.track].currentTime;
					if (fadeOut < fadeOutValue && fadeOut >= 0) {
						audioElement[_this.track].volume = ((fadeOut / fadeOutValue) * fadeRate + (1 - fadeRate)) * volume;
					} else if (fadeIn < fadeInValue && fadeIn >= 0) {
						audioElement[_this.track].volume = ((fadeIn / fadeInValue) * fadeRate + (1 - fadeRate)) * volume;
					} else if (player.volume != volume) {
						audioElement[_this.track].volume = volume; 
					}
				}
			}
			
		}
		
		// play gomb az énekválasztó képernyőre szünetkor
		var playDisplay = _this.musicEnabled && _this.track != -1 /*&& mainWindowElement.style.display != 'none'*/ && mainWindowPanelElement.style.display != 'none' && infoContentElement.style.display != 'none' && (pauseButtonElement.style.display == 'none' || pauseButtonElement.style.visibility == 'hidden') ? 'block' : 'none';
		if (playButtonElement.style.display != playDisplay) {
			playButtonElement.style.display = playDisplay;
		}
	}
	
	function fixOnAndroidAndLoading() {
		// nem minden böngésző állítja be az ended-et, ezért külön figyelünk rá
		if (_this.musicEnabled && _this.track != -1 && pauseButtonElement.style.display != 'none') {
			if (!myEnded && !audioElement[_this.track].ended && !audioElement[_this.track].paused && audioElement[_this.track].duration > 3 && audioElement[_this.track].currentTime > audioElement[_this.track].duration - 2) {
				// a vége felé tartott a lejátszás
				myEnded = 1;
			}
			if (myEnded == 1 && !audioElement[_this.track].ended && !audioElement[_this.track].paused && audioElement[_this.track].duration > 3 && audioElement[_this.track].currentTime == 0) {
				// visszament az elejére és leállt
				myEnded = 2;
			}
		}
		
		// ha magától nem akarna elindulni, akkor megpróbáljuk elindítani
		if (_this.musicEnabled && _this.track != -1 
			&& !audioElement[_this.track].ended && myEnded == 0 && ((audioElement[_this.track].duration > 0 && audioElement[_this.track].currentTime == 0) || audioElement[_this.track].paused)
			&& pauseButtonElement.style.display != 'none'
			&& !disablePlayFix
		) {
			audioElement[_this.track].play();
		}
		
		// betöltés kijelzése, ha több ideig tartana
		if (_this.musicEnabled && _this.track != -1) {
			if (!(audioElement[_this.track].duration > 0) && !_this.loading) {
				loadingCounter++;
				if (loadingCounter >= 5) {
					_this.loading = true;
					presenter.refresh();
					loadingCounter = 0;
				}
			}
			
			if (_this.playSongId != '' && pauseButtonElement.style.display != 'none' && audioElement[_this.track].currentTime > 0 && !_this.loading && _this.androidHackAlert) {
				// valamelyik androidos böngészőn valamikor beakad a 0-nál a currentTime egy ideig
				androidHackCounter = 0;
				_this.androidHackAlert = false;
				presenter.refresh();
			}
			//if (_this.loading && audioElement[_this.track].duration === 0 && enek != '' && pauseButtonElement.style.display != 'none' && !_this.androidHackAlert && !_this.androidHackFired) {
			if (_this.playSongId != '' && pauseButtonElement.style.display != 'none' && audioElement[_this.track].currentTime == 0 && !_this.loading && !_this.androidHackAlert /*&& !_this.androidHackFired*/) {
				androidHackCounter++;
				if (androidHackCounter >= 15) {
					_this.androidHackAlert = true;
					presenter.refresh();
				}
			} else {
				androidHackCounter = 0;
			}
			
			if (audioElement[_this.track].duration > 0 && _this.loading) {
				_this.loading = false;
				presenter.refresh();
				loadingCounter = 0;
			}
		} else if (androidHackCounter != 0) {
			androidHackCounter = 0;
		}
	}
	
	//player.ontimeupdate = function() {timeUpdate(); };	
	setInterval(timeUpdate, 1);
	setInterval(fixOnAndroidAndLoading, 100);

	if (!canPlayMP3()) {
		app.message(tr('MP3SupportError'));
	}
		
	// lejátszási lista betöltése
	var getLista = storage.get('playlist');
	if (getLista != '') {
		try {
			this.list = JSON.parse(getLista);
		} catch(e) {
			this.list = [];
		}
		if (!Array.isArray(this.list)) {
			this.list = [];
		}
	}	
}
