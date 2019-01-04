var demoWindowElement = document.getElementById('demoWindow');
var demoAllLangButtonElement = document.getElementById('demoAllLangButton');
var demoCurrentLangButtonElement = document.getElementById('demoCurrentLangButton');

var demo;

function Demo() {
	var enabled = false;
	var versesNum = 1;
	var onlyCurrentLang = true; // only current language
	var lastThemePic = false;
	var lastThemeTxt = false;
	var playedList = [];
	
	var _this = this;
	
	this.isEnabled = function() {
		return enabled;
	}

	this.enable = function() {
		enabled = true;
	}
	
	this.disable = function() {
		enabled = false;
	}
	
	this.setOnlyCurrentLang = function() {
		onlyCurrentLang = true;
		this.show();
	}

	this.setAllLang = function() {
		onlyCurrentLang = false;
		this.show();
	}

	this.show = function() {
		demoWindowElement.style.display = '';
		
		demoAllLangButtonElement.className = 'button tr_AllLanguage' + (!onlyCurrentLang ? ' selected' : '');
		demoCurrentLangButtonElement.className = 'button tr_LANGUAGE' + (onlyCurrentLang ? ' selected' : '');
	}

	this.close = function() {
		demoWindowElement.style.display = 'none';
	}

	this.play = function(setVersesNum) {
		if (!enabled) {
			lastThemePic = themePictureElement.value;
			lastThemeTxt = themeTextElement.value;
		}
		
		if (setVersesNum != undefined) {
			versesNum = setVersesNum;
		}
		if (demoWindowElement.style.display != 'none') {
			demoWindowElement.style.display = 'none';
		}

		var n;
		for (var part = 0; part < 2; part++) {
			n = 0;
			for (var songId in song) {
				if (songData.isPlayable(songId) && song[songId].error == undefined && (!onlyCurrentLang || book[song[songId].book].lang == language.getLang()) && playedList.indexOf(songId) == -1) {
					n++;
				}
			}
			if (part == 0 && playedList.length > 0 && n == 0) {
				playedList = [];
			} else {
				break;
			}
		}
		if (n > 0) {
			var rnd = Math.floor(Math.random() * n);
			n = 0;
			for (var songId in song) {
				if (songData.isPlayable(songId) && song[songId].error == undefined && (!onlyCurrentLang || book[song[songId].book].lang == language.getLang()) && playedList.indexOf(songId) == -1) {
					if (n == rnd) {
						playedList.push(songId);
						songPanel.selectSong(songId, true);
						songPanel.selectedVerses = [];
						if (versesNum === 'all') {
							for (var j in song[songPanel.selectedSongId]) {
								j = parseInt(j, 10);
								if (j > 0) {
									songPanel.selectedVerses.push(j);
								}
							}
						} else {
							for (var j = 1; j <= versesNum; j++) {
								if (song[songPanel.selectedSongId][j] != undefined) {
									songPanel.selectedVerses.push(j);
								}
							}
						}
						songPanel.songNumberWriteEnabled = false;
						songPanel.updateSongPanel(true);
						
						theme.setRandomTheme(true, true);
						
						player.setup({intro: true, zene: true, lapozas: true, demo: true});
						break;
					}
					n++;
				}
			}
		} else {
			infoBox.show(tr('NoPlayableSong'));
		}
	}

	this.start = function(setVersesNum) {
		var demoBookList = [];
		for (var bookId in book) {
			if (bookId != '' && book[bookId].init == undefined && (!onlyCurrentLang || book[bookId].lang == language.getLang())) {
				demoBookList.push(bookId);
			}
		}
		playedList = [];
		if (demoBookList.length > 0) {
			songBook.loadBook(demoBookList, function(){
				_this.play(setVersesNum);
			});
		} else {
			this.play(setVersesNum);
		}
	}

	this.stop = function() {
		if (enabled) {
			enabled = false;
			if (lastThemePic !== false && lastThemeTxt !== false) {
				themePictureElement.value = lastThemePic;
				themeTextElement.value = lastThemeTxt;
				theme.changeTheme();
			}
			player.playSongId = '';
			player.playVersesList = [];
			infoContentElement.style.display = 'none';
			presenter.refresh();
			if (mainWindowElement.style.display == 'none') {
				presenter.showMainWindow();
			}
		}
	}
}
