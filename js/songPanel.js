var songSelectorElement = document.getElementById('songSelector');
var verseSelectorElement = document.getElementById('verseSelector');
var searchInputElement = document.getElementById('searchInput');

app.addEvent('changeLanguage', function(){
	if (book[''] != undefined) {
		book['']['title'] = tr('AllBookTitle');
		book['']['description'] = tr('AllBookDescription');
	}
});

var songPanel;

function SongPanel() {
	
	this.disabledAddToList = false;
	this.delNumberOnWrite = false;
	this.songNumberWriteEnabled = true;
	this.verseNumber10 = false;
	this.playModeOptions = [
		'modePlay',
		'modeWithoutIntro',
		'modeAddToList',
		'modeOnlyText',
		'modeOnlyTextInOne'
	];

	this.selectedNumber = '';
	this.selectedSongId = '';
	this.selectedVerses = [];

	var audioAktivalas = true;
	var titleListOpen = false;
	var titleListSelectUpRight = false;
	var titleListSelectClickCancel = false;
	var setListaOp = true;
	var searchTimeout = false;
	var searchStr = '';
	
	var _this = this;
	
	this.isTitleListOpen = function() {
		return titleListOpen;
	}

	function updateSongSelectInfo() {
		var html = '';

		var ures = true;
		for (var bookId in book) {
			if (bookId != '') {
				ures = false;
				break;
			}
		}
		if (ures) {
			html = '<div style="text-align: center; color: #f00;">' + tr('SongDataNotFound') + '</div>';
		} else {
			html = tr('Song') + ': ' + songData.getSongName(_this.selectedSongId) + '&nbsp';
			if (songData.isMusicOneFile(_this.selectedSongId)) {
				html += ' <span style="font-size: 75%;">' + tr('FullSong') + '</span>';
			} else {
				if (_this.selectedVerses.length > 0) {
					html += ' <span style="font-size: 75%;">' + tr('Verses') + ': ';
					for (var i = 0; i < _this.selectedVerses.length; i++) {
						if (i > 0) {
							html += ' ';
						}
						html += '<span>' + (_this.selectedVerses[i] == 0 ? tr('pause') : _this.selectedVerses[i] + '.') + '</span>';
					}
					if (_this.verseNumber10) {
						if (_this.selectedVerses.length > 0) {
							html += ' ';
						}
						html += '<span style="color: #f80;">1_</span>';
					}
					html += '</span>';
				}
			}
		}
		document.getElementById('songSelectInfo').innerHTML = html;
	}
	
	function updateVerseSelector() {
		var html = '';
		//var playModeCurrent = _this.getPlayMode();
		var voltBr = false;
		if (_this.selectedSongId != '' && song[_this.selectedSongId] != undefined) {
			songVariations = songData.getSongVariations(_this.selectedSongId);
			if (songVariations.length > 1) {
				for (var i = 0; i < songVariations.length; i++) {
					html += '<span class="var' + (_this.selectedSongId == songVariations[i][1] ? ' sel' : '') + ' noselect" onclick="songPanel.selectSongUpdate(\''+ songVariations[i][1] + '\')">&nbsp;' + /*songVariations[i][0]*/ songData.getSongName(songVariations[i][1]) + '&nbsp;</span>';
				}
				html += '<span class="varSpacer">&nbsp;</span>';
			}
			
			if (songData.isMusicOneFile(_this.selectedSongId)) {
				html += '<span class="vv van noselect">' + tr('FullSong') + '</span>';
				html += '<span style="font-size: 80%;"><br><br></span>';
				voltBr = true;
				html += '<span class="vv vv09 disabled noselect">' + tr('Pause') + '</span>';
				html += '<span class="vv vv09 disabled noselect" style="white-space: nowrap; line-height: 100%;">&#8678; ' + tr('Del') + '</span>';
			} else {
				for (var i in song[_this.selectedSongId]) {
					if (i > 0) {
						i = parseInt(i, 10);
						var marVan = false;
						for (var j = 0; j < _this.selectedVerses.length; j++) {
							if (_this.selectedVerses[j] == i) {
								marVan = true;
								break;
							}
						}
						/*if (i == 11) {
							html += '<span style="font-size: 80%;"><br><br></span>';
							voltBr = true;
						}*/
						if (marVan) {
							html += '<span class="vv' + (i < 10 ? ' vv09' : '') + ' van noselect">' + i + '</span>';
						} else {
							html += '<span class="vv' + (i < 10 ? ' vv09' : '') + ' noselect" onclick="songPanel.writeVerseNumber('+ i + ')">' + i + '</span>';
						}
					}
				}
				
				if (true) {
					html += '<span style="font-size: 80%;"><br><br></span>';
					voltBr = true;
				}

				if (songData.isPlayable(_this.selectedSongId)) {
					html += '<span class="vv vv09 noselect" onclick="songPanel.writeVerseNumber(0)">' + tr('Pause') + '</span>';
				} else {
					html += '<span class="vv vv09 disabled noselect">' + tr('Pause') + '</span>';
				}
				
				html += '<span class="vv vv09 noselect" onclick="songPanel.writeVerseNumber(-1)" style="white-space: nowrap; line-height: 100%;">&#8678; ' + tr('Del') + '</span>';
			}
		}
		if (html == '') {
			html += '<span class="vv" style="visibility: hidden;">&nbsp;</span>';
		}
		if (!voltBr) {
			html += '<span style="font-size: 80%;"><br><br></span><span class="vv" style="visibility: hidden;">&nbsp;</span>';
		}
		
		verseSelectorElement.innerHTML = html;
	}
	
	function updatePlayMode(playModeBeallit) {
		var playModeDisabled = [];
		var playModeSel = null;
		if (_this.selectedSongId != '' && song[_this.selectedSongId] != undefined) {
			playModeSel = 'modePlay';
			if (_this.selectedVerses.length > 0 && parseInt(_this.selectedVerses[0], 10) > 1) {
				playModeSel = 'modeWithoutIntro';
			}
			if (songData.isMusicOneFile(_this.selectedSongId)) {
				playModeDisabled.push('modeWithoutIntro');
				playModeSel = 'modePlay';
			}
			if (!songData.isPlayable(_this.selectedSongId)) {
				playModeDisabled.push('modePlay');
				playModeDisabled.push('modeWithoutIntro');
				playModeDisabled.push('modeAddToList');
				playModeSel = 'modeOnlyText';
			}
		} else {
			playModeDisabled.push('modePlay');
			playModeDisabled.push('modeWithoutIntro');
			playModeDisabled.push('modeAddToList');
			playModeDisabled.push('modeOnlyText');
			playModeDisabled.push('modeOnlyTextInOne');
		}
		
		if (!playModeBeallit) {
			playModeSel = null;
		}
		if (_this.songNumberWriteEnabled) {
			playModeSel = '';
		}
		_this.setPlayMode(playModeSel, playModeDisabled);
	}

	// ének- és versszakválasztó képernyő tartalmának frissítése
	this.updateSongPanel = function(playModeBeallit) {
		updateSongSelectInfo();
		updateVerseSelector();
		updatePlayMode(playModeBeallit);
		
		if (this.songNumberWriteEnabled) {
			mainWindowElement.className = 'songSelection';
		} else {
			mainWindowElement.className = 'verseSelection';
		}
		
		this.updateTitleList();
	}
	
	// ének választásnál szám írása
	this.writeSongNumber = function(i) {
		//this.audioAktivalasFn();
		this.songNumberWriteEnabled = true;
		if (this.delNumberOnWrite) {
			this.selectSong('');
			this.delNumberOnWrite = false;
			this.updateSongPanel(true);
		}
		if (this.selectedNumber == '' && i == 0) {
			return;
		}
		if (i == -1) {
			// visszatörlés
			if (this.selectedNumber.length > 0) {
				// ha van a végén betű, azt eldobjuk
				this.selectedNumber = parseInt(this.selectedNumber, 10);
				if (isNaN(this.selectedNumber)) {
					this.selectedNumber = 0;
				}
				this.selectedNumber += '';

				this.selectedNumber = this.selectedNumber.substr(0, this.selectedNumber.length - 1);
			}
		} else {
			if (this.selectedNumber.length < 13) {
				this.selectedNumber += (i + '');
			}
		}
		this.selectedSongId = this.selectedNumber != '' ? songBook.selectedBook + '/' + this.selectedNumber : '';
		this.selectedVerses = [];
		this.updateSongPanel(true);
		this.searchOff();
	}

	// versszak választásnál szám írása
	this.writeVerseNumber = function(i) {
		this.songNumberWriteEnabled = false;
		this.delNumberOnWrite = false;
		if (i == -1) {
			this.selectedVerses.pop();
		} else {
			if (i == 0 && this.selectedSongId != '' && !songData.isPlayable(this.selectedSongId)) {
				// ha nincs pozíció az énekhez, akkor nem lehet szünetet berakni
			} else {
				var marVan = false;
				if (i == 0) {
					if (this.selectedVerses.length == 0 || this.selectedVerses[this.selectedVerses.length - 1] == i) {
						marVan = true;
					}
				} else {
					for (var j = 0; j < this.selectedVerses.length; j++) {
						if (this.selectedVerses[j] == i) {
							marVan = true;
							break;
						}
					}
				}
				if (!marVan) {
					if (this.selectedSongId != '' && song[this.selectedSongId] != undefined && (i == 0 || song[this.selectedSongId][i] != undefined)) {
						this.selectedVerses.push(i);
					}
				}
			}
		}
		this.updateSongPanel(i != -1);
		this.searchOff();
		presenter.resizeDisplay();
	}
	
	// ének indítási módra kattintás
	this.audioAktivalasFn = function() {
		// egyes eszközön és böngészőben az audio csak felhasználói eseményre aktiválódik
		if (audioAktivalas) {
			audioAktivalas = false;
			for (var i = 0; i <= 3; i++) {
				audioElement[i].play();
				audioElement[i].pause();
				audioElement[i].currentTime = 0;
			}
		}
	}
	
	this.playModeClick = function(sel) {
		if (document.getElementById(sel).className.indexOf('disabled') == -1) {
		
			this.audioAktivalasFn();
		
			for (var i = 0; i < this.playModeOptions.length; i++) {
				if (this.playModeOptions[i] == sel) {
					if (document.getElementById(this.playModeOptions[i]).className.indexOf('selected') == -1) {
						document.getElementById(this.playModeOptions[i]).className = 'button selected';
					}
				} else if (document.getElementById(this.playModeOptions[i]).className.indexOf('selected') != -1) {
					document.getElementById(this.playModeOptions[i]).className = 'button';
				}
			}

			switch (sel) {
				case 'modePlay' :
					player.setup({intro: true, zene: true, lapozas: true});
					break;
				case 'modeWithoutIntro' :
					player.setup({intro: false, zene: true, lapozas: true});
					break;
				case 'modeAddToList' :
					if (!this.disabledAddToList) {
						player.setup({intro: true, zene: true, lapozas: true, listara: true});
					}
					break;
				case 'modeOnlyText' :
					player.setup({intro: true, zene: false, lapozas: true});
					break;
				case 'modeOnlyTextInOne' :
					player.setup({intro: true, zene: false, lapozas: false});
					break;
			}
		}
	}
	
	// lejátszás kijelölés
	this.setPlayMode = function(sel, disabled) {
		if (disabled == undefined) {
			disabled = [];
		}
		for (var i = 0; i < this.playModeOptions.length; i++) {
			var isDisabled = false;
			for (var j = 0; j < disabled.length; j++) {
				if (this.playModeOptions[i] == disabled[j]) {
					isDisabled = true;
					break;
				}
			}
			if (isDisabled) {
				document.getElementById(this.playModeOptions[i]).className = 'button disabled';
			} else if (this.playModeOptions[i] == sel) {
				if (sel !== null) {
					document.getElementById(this.playModeOptions[i]).className = 'button selected';
				}
			} else {
				if (sel !== null) {
					document.getElementById(this.playModeOptions[i]).className = 'button';
				}
			}
		}
	}
	
	this.getPlayMode = function() {
		for (var i = 0; i < this.playModeOptions.length; i++) {
			if (document.getElementById(this.playModeOptions[i]).className.indexOf('selected') != -1) {
				return this.playModeOptions[i];
			}
		}
		return '';
	}
	
	this.updateSearch = function() {
		if (searchTimeout !== false) {
			clearTimeout(searchTimeout);
		}
		searchTimeout = setTimeout(function(){
			searchTimeout = false;
			var str = strTrim(searchInputElement.value);
			if (searchStr != str) {
				searchStr = str;
				if (document.getElementById('songSelectorInner')) {
					document.getElementById('songSelectorInner').innerHTML = '<div style="text-align: center; padding: 10px;">' + tr('Search') + '...' + '</div>';
				}
				setTimeout(function(){
					_this.updateTitleList();
				}, 1);
			}
		}, 500);
	}

	this.updateTitleList = function() {
		songBook.updateBookList();
		
		html = '';
		var firstDone = false;
		var separatorDiv = false;
		if (this.selectedSongId == '' || song[this.selectedSongId] == undefined) {
			html += '<div class="kategoria">&nbsp;</div>';
			html += '<div class="song op" onclick="songPanel.op(\'\')">&nbsp;</div>';
			firstDone = true;
		}
		var kat = '';
		var wasData = false;
		var wasSearch = false;
		
		var ugyanazokArray = [];
		if (this.selectedSongId != '' && song[this.selectedSongId] != undefined) {
			/*// similar songs by music
			if (song[this.selectedSongId].music != undefined && song[this.selectedSongId].music != '') {
				for (var songId in song) {
					if (songId != this.selectedSongId && song[songId].music != undefined && song[songId].music == song[this.selectedSongId].music) {
						ugyanazokArray.push(songId);
					}
				}
			}*/
			// similar songs by connections
			if (songBook.connectIdBySongId[this.selectedSongId] != undefined) {
				var connectId = songBook.connectIdBySongId[this.selectedSongId];
				for (var i = 0; i < connections[connectId].length; i++) {
					var songId = connections[connectId][i];
					if (songId != this.selectedSongId) {
						ugyanazokArray.push(songId);
					}
				}
			}
		}
		
		var search = false;
		if (document.getElementById('search').style.display != 'none') {
			search = songData.normalizeSearch(searchInputElement.value);
			while (true) {
				var l = search.length;
				search = search.replace(/  /g, ' ');
				if (search.length == l) {
					break;
				}
			}
			while (search.length > 0 && search.charAt(0) == ' ') {
				search = search.substr(1, search.length - 1);
			}
			while (search.length > 0 && search.charAt(search.length - 1) == ' ') {
				search = search.substr(0, search.length - 1);
			}
			if (search != '') {
				search = search.split(' ');
				// kell legalább X karakteres szóra keresni
				var lengthOk = false;
				for (var i = 0; i < search.length; i++) {
					// allow when text length min 2 or it is a number
					if (search[i].length >= 2 || parseInt(search[i], 10) > 0) {
						lengthOk = true;
						break;
					}
					
				}
				if (!lengthOk) {
					search = [];
				}
				if (search.length > 0) {
					// kereső szavak sorba rendezése
					var s = search;
					var hatravan = s.length;
					search = [];
					
					// leghosszabb kikeresése
					var len = -1;
					for (var i = 0; i < s.length; i++) {
						if (len < s[i].length) {
							len = s[i].length;
						}
					}
					
					while (hatravan > 0 && len > 0) {
						for (var i = 0; i < s.length; i++) {
							if (s[i].length == len) {
								if (search.indexOf(s[i]) == -1) {
									// duplázódás szűrése
									search.push(s[i]);
								}
								hatravan--;
							}
						}
						len--;
					}
				}
			} else {
				search = [];
			}
		}
		
		var num = 0;
		if (this.selectedSongId != '' && song[this.selectedSongId] != undefined) {
			num = parseInt(song[this.selectedSongId].number, 10);
		}
		num = !isNaN(num) && num > 0 ? num + '' : '';
		var songId;
		
		var emptyCategory = true;
		if (category[songBook.selectedBook] != undefined) {
			for (var i in category[songBook.selectedBook]) {
				emptyCategory = false;
				break;
			}
		}
		
		var allSong = songBook.selectedBook == '';
		for (var part = 0; part < 2; part++) {
			if (search !== false && part == 1) {
				break;
			}
			if (part == 1 && player.list.length > 0) {
				// lejátszási lista
				html += '<div style="background: #cfc; border-radius: 8px;">';
				html += '<div class="kategoria" style="color: #0c0;">Lejátszási lista</div>';
				for (var i = 0; i < player.list.length; i++) {
					songId = player.list[i][0];
					var versszakok = player.list[i][1];
					var torolIkon = '<span style="line-height: 1.2em; float: right; background: #f00; color: #fff; font-weight: bold; padding: 0 8px; border-radius: 5px;" title="Törlés a listáról" onclick="songPanel.listDel(' + i + ')">×</span>';
					var playIkon = (player.listIndex == i ? '<span style="line-height: 1.2em; float: left; background: #080; color: #fff; font-weight: bold; padding: 0 6px; border-radius: 5px; margin-right: 8px;" title="Lista lejátszása innen" onclick="songPanel.audioAktivalasFn();songPanel.listPlay(' + i + ');">&#9654;</span>' : '');
					html += '<div class="song op" onclick="songPanel.listPos(' + i + ')">' + torolIkon + playIkon + songData.getSongName(songId, tr('SongNoShort'), allSong || (song[songId] != undefined && song[songId].book != songBook.selectedBook)) + ' ' + songData.getSongTitle(songId) + '</div>';
					html += '<div class="posDesc">' + tr('Verses') + ': ';
					if (songData.isMusicOneFile(songId)) {
						html += '<b>' + tr('FullSong') + '</b>';
					} else {
						for (var j = 0; j < versszakok.length; j++) {
							if (j != 0) {
								html += ' ';
							}
							html += '<b>' + (versszakok[j] == 0 ? tr('pause') : versszakok[j] + '.') + '</b>';
						}
					}
					html += '</div>';
				}
				html += '</div>';
			}
			kat = songBook.selectedBook != '' && book[songBook.selectedBook] != undefined ? book[songBook.selectedBook].title : '&nbsp;';
			var showKat = '';
			var showKatLast = '----';
			for (var sr = 0; sr < songData.sorted.length; sr++) {
				songId = songData.sorted[sr];
				var isSameTone = ugyanazokArray.indexOf(songId) != -1;
				if (search !== false) {
					isSameTone = false;
				}
				
				if (!allSong && song[songId].book != songBook.selectedBook && !isSameTone) {
					continue;
				}
				
				var number = song[songId].number;
				var n = parseInt(number, 10);
				if (songBook.selectedBook == '') {
					showKat = '<div class="kategoria">' + kat + '</div>';
				} else {
					if (!isNaN(n) && n > 0 && song[songId].book == songBook.selectedBook && category[songBook.selectedBook] != undefined && category[songBook.selectedBook][n] != undefined) {
						kat = category[songBook.selectedBook][n];
					}
					if (song[songId].book == songBook.selectedBook) {
						showKat = '<div class="kategoria">' + kat + '</div>';
					} else {
						showKat = '<div class="kategoria">' + book[song[songId].book].title + '</div>';
					}
				}
				var songTitle = songData.getSongTitle(songId);
				
				// kiválasztott éneket előre vesszük a listában
				if ((part == 0 && /*number == this.selectedNumber*/ songId == this.selectedSongId) || (part == 1 && /*number != this.selectedNumber*/ songId != this.selectedSongId) || search !== false) {
					var posHtml = '';
					
					var ok = false;
					if (search !== false) {
						ok = true;
						
						var posArray = [];
						var wordPositions = {};
						var pFrame = 20;
						for (var i = 0; i < search.length; i++) {
							//var p = songData.songSearch[songId].indexOf(search[i]);
							var okV = false;
							for (var v in songData.songSearch[songId]) {
								var pos = 0;
								var p = songData.songSearch[songId][v].indexOf(search[i], pos);
								while (p != -1) {
									if (wordPositions[v] == undefined) {
										wordPositions[v] = [];
									}
									wordPositions[v].push([p, p + search[i].length - 1]);
									pos = p + search[i].length;
								
									okV = true;
									
									// a találatnál lévő szövegrész kikeresése
									
									// szó végének keresése
									var p2 = p;
									while (p2 < p + 20 && p2 + 1 < songData.songSearch[songId][v].length && songData.songSearch[songId][v].charAt(p2 + 1) != ' ') {
										p2++;
									}
									
									// szövegkörnyezettel kiegészítés
									p2 += pFrame;
									// egész szó legyen
									var j = 20;
									while (j > 0 && p2 + 1 < songData.songSearch[songId][v].length && songData.songSearch[songId][v].charAt(p2 + 1) != ' ') {
										p2++;
										j--;
									}
									if (p2 > songData.songSearch[songId][v].length - 1) {
										p2 = songData.songSearch[songId][v].length - 1;
									}
									
									// szövegkörnyezettel kiegészítés
									p -= pFrame;
									// egész szó legyen
									var j = 20;
									while (j > 0 && p - 1 >= 0 && songData.songSearch[songId][v].charAt(p - 1) != ' ') {
										p--;
										j--;
									}
									if (p < 0) {
										p = 0;
									}
									// összefolyó talált szövegrészek összevonása
									var isNew = true;
									for (var j = 0; j < posArray.length; j++) {
										if (posArray[j][2] == v) {
											if (p >= posArray[j][0] && p <= posArray[j][1]) {
												if (posArray[j][1] < p2) {
													posArray[j][1] = p2;
												}
												isNew = false;
												break;
											} else if (p2 >= posArray[j][0] && p2 <= posArray[j][1]) {
												if (posArray[j][0] > p) {
													posArray[j][0] = p;
												}
												isNew = false;
												break;
											}
										}
									}
									if (isNew) {
										posArray.push([p, p2, v]);
									}
									
									// következő találat keresése ugyan abban a versszakban
									p = songData.songSearch[songId][v].indexOf(search[i], pos);
								}
							}
							if (song[songId].titleSearch.indexOf(search[i]) != -1) {
								okV = true;
							}
							if (song[songId].number.replace('/', '').indexOf(search[i]) != -1) {
								okV = true;
							}
							if (!okV) {
								ok = false;
							}
						}
						if (ok && posArray.length > 0) {
							var vv = 0;
							for (var i = 0; i < posArray.length; i++) {
								if (posHtml != '') {
									posHtml += ' ';
								}
								var v = posArray[i][2];
								if (vv != v) {
									vv = v;
									posHtml += '[' + v + '] ';
								}
								if (posArray[i][0] > 0) {
									posHtml += '...';
								}
								
								//posHtml += songData.songSearchOrig[songId][v].substr(posArray[i][0], posArray[i][1] - posArray[i][0] + 1);
								var b = false;
								var bx;
								for (var p = posArray[i][0]; p <= posArray[i][1]; p++) {
									bx = false;
									if (wordPositions[v] != undefined) {
										for (var j = 0; j < wordPositions[v].length; j++) {
											if (wordPositions[v][j][0] == p) {
												if (!b) {
													posHtml += '<b>';
												}
												b = true;
											}
											if (wordPositions[v][j][1] == p) {
												bx = true;
											}
										}
									}
									posHtml += songData.songSearchOrig[songId][v].charAt(p);
									if (bx) {
										posHtml += '</b>';
										b = false;
									}
								}
								
								if (posArray[i][1] < songData.songSearchOrig[songId][v].length - 1) {
									posHtml += '...';
								}
							}
						}
					} else {
						if (this.selectedNumber == '' || (/*(number.indexOf(this.selectedNumber) != -1 && songBook.selectedBook != '') ||*/ number == this.selectedNumber) || isSameTone || (!isNaN(n) && n > 0 && n + '' == num)) {
							ok = true;
						}
					}
					if (ok) {
						if (firstDone && !separatorDiv) {
							separatorDiv = true;
							html += '<div id="selectInnerMore">';
						}
					
						if (showKatLast != showKat) {
							showKatLast = showKat;
							html += showKat;
						}
						var error = song[songId].error != undefined && song[songId].error != '' ? ' error' : '';
						var title = song[songId].error != undefined && song[songId].error != '' ? song[songId].error : '';
						var withOutMusic = !songData.isPlayable(songId) ? ' withOutMusic' : '';
						var egybenIkon = songData.isMusicOneFile(songId) ? ' <span style="line-height: 1em;" title="' + tr('FullSongTitle') + '">&#9200;</span>' : '';
						//var showBook = allSong || song[songId].book != songBook.selectedBook;
						var showBook = allSong;
						if (isSameTone) {
							title = this.selectedNumber + '. ének dallamával' + (title != '' ? ' | ' + title : '');
							html += '<div class="song op same' + error + withOutMusic + '" onclick="songPanel.op(\'' + songId + '\')" title="' + title + '">' + songData.getSongName(songId, tr('SongNoShort'), showBook) + (/*song[songId].ownText ? '' :*/ ' ' + songTitle) + egybenIkon + ' &#9835;</div>';
						} else {
							html += '<div class="song op' + error + withOutMusic + '" onclick="songPanel.op(\'' + songId + '\')"' + (title != '' ? ' title="' + title + '"' : '') + '>' + songData.getSongName(songId, tr('SongNoShort'), showBook) + (/*song[songId].ownText ? '' :*/ ' ' + songTitle) + egybenIkon + '</div>';
						}
						if (song[songId].error != undefined && song[songId].error != '') {
							html += '<div class="errorDesc">' + song[songId].error + '</div>';
						}
						if (posHtml != '') {
							html += '<div class="posDesc">' + posHtml + '</div>';
						}
						wasData = true;
						firstDone = true;
					} else {
						wasSearch = true;
					}
				}
			}
		}
		if (wasData && wasSearch) {
			html += '<div class="song op" style="text-align: center;" onclick="songPanel.op(\'all\')">Összes listázása...</div>';
		}
		if (separatorDiv) {
			html += '</div>';
		}
		songSelectorElement.innerHTML = '<div id="songSelectorInner">' + html + '</div>';
		
		var sampleItem = document.getElementById('sampleItem');
		var songSelectorInner = document.getElementById('songSelectorInner');
		
		if (titleListOpen) {
			songSelectorElement.style.overflow = 'auto';
			songSelectorElement.style.height = (sampleItem.clientHeight * 7) + 'px';
			songSelectorElement.className = 'open';
			
			document.getElementById('titleListSelectDown').style.display = 'none';
			document.getElementById('titleListSelectUp').style.display = '';
			if (document.getElementById('selectInnerMore')) {
				document.getElementById('selectInnerMore').style.display = '';
			}
		} else {
			songSelectorElement.style.overflow = 'hidden';
			songSelectorElement.style.height = (sampleItem.clientHeight) + 'px';
			songSelectorElement.className = 'close';
			
			document.getElementById('titleListSelectDown').style.display = '';
			document.getElementById('titleListSelectUp').style.display = 'none';
			if (document.getElementById('selectInnerMore')) {
				document.getElementById('selectInnerMore').style.display = 'none';
			}
		}
		//document.getElementById('titleListSelectDown').style.display = 'none';
		//document.getElementById('titleListSelectUp').style.display = 'none';
		
		if (titleListSelectUpRight === false) {
			titleListSelectUpRight = document.getElementById('titleListSelectUp').style.right;
		}
		if (songSelectorInner.clientHeight > songSelectorElement.clientHeight) {
			document.getElementById('titleListSelectUp').style.right = '20px';
		} else {
			document.getElementById('titleListSelectUp').style.right = titleListSelectUpRight;
		}
	}

	this.selectSong = function(songId, setBook) {
		this.selectedSongId = '';
		this.selectedNumber = '';
		if (songId != '' && song[songId] != undefined) {
			this.selectedSongId = songId;
			this.selectedNumber = song[songId].number;
			if (setBook && songBook.selectedBook != '') {
				songBook.selectedBook = song[songId].book;
			}
		}
	}
	
	this.op = function(songId) {
		if (titleListOpen) {
			titleListSelectClickCancel = true;
			var keresesVolt = false;
			if (document.getElementById('search').style.display != 'none') {
				this.searchOff();
				keresesVolt = true;
			}
			
			if (songId == 'all') {
				songId = '';
			} else {
				titleListOpen = false;
			}
			this.selectSong(songId, true);
			songSelectorElement.scrollTop = 0;
			
			//this.songNumberWriteEnabled = true;
			this.selectedVerses = [];
			//if (keresesVolt) {
			//	this.songNumberWriteEnabled = false;
			//}
			this.songNumberWriteEnabled = false;
			this.updateSongPanel(true);
		}
	}

	this.selectSongUpdate = function(songId, songNrWrEnabled) {
		this.selectSong(songId, true);
		this.selectedVerses = [];
		if (songNrWrEnabled) {
			this.songNumberWriteEnabled = true;
		} else {
			this.songNumberWriteEnabled = false;
		}
		this.delNumberOnWrite = false;
		this.updateSongPanel(true);
	}

	this.listPos = function(pos) {
		setTimeout(function() {
			if (setListaOp) {
				player.listIndex = pos;
				_this.updateTitleList();
				presenter.refresh();
				
				_this.selectSong(player.list[player.listIndex][0] + '', true);
				_this.selectedVerses = arrayClone(player.list[player.listIndex][1]);
				_this.songNumberWriteEnabled = false;
				_this.delNumberOnWrite = true;
				_this.updateSongPanel(true);
			}
			setListaOp = true;
		}, 200);
	}
	
	this.listDel = function(pos) {
		setListaOp = false;
		var old = player.list;
		player.list = [];
		for (var i = 0; i < old.length; i++) {
			if (i != pos) {
				player.list.push(old[i]);
			}
		}
		this.listSave();
		if (player.listIndex != -1) {
			if (player.listIndex == pos) {
				player.listIndex = -1;
			} else if (player.listIndex > pos) {
				player.listIndex--;
			}
		}
		this.updateTitleList();
		presenter.refresh();
	}
	
	this.listPlay = function(pos) {
		if (pos != undefined) {
			player.listIndex = pos;
			this.updateTitleList();
		}
		
		this.selectSong(player.list[player.listIndex][0] + '', true);
		this.selectedVerses = arrayClone(player.list[player.listIndex][1]);
		this.songNumberWriteEnabled = false;
		this.updateSongPanel(true);
		
		player.setup({intro: true, zene: true, lapozas: true, listPlay: true});
	}
	
	this.listSave = function() {
		storage.set('playlist', JSON.stringify(player.list));
	}
	
	this.titleListSelectClick = function() {
		if (!titleListOpen) {
			if (titleListSelectClickCancel) {
				titleListSelectClickCancel = false;
			} else {
				this.titleListSelectDown();
			}
		}
	}
	
	this.titleListSelectDown = function() {
		if (!titleListOpen) {
			titleListOpen = true;
			songBook.bookSelectUp(false);
			this.updateTitleList();
		}
	}
	
	this.titleListSelectUp = function(update) {
		if (titleListOpen) {
			titleListOpen = false;
			songSelectorElement.scrollTop = 0;
			if (update !== false) {
				this.updateTitleList();
			}
		}
	}

	this.searchOn = function() {
		if (document.getElementById('search').style.display == 'none') {
			document.getElementById('songSelectInfo').style.display = 'none';
			document.getElementById('search').style.display = '';
			searchInputElement.focus();

			this.selectSong('');
			this.selectedVerses = [];
			this.updateSongPanel(true);
			
			songBook.bookSelectUp(false);
			this.titleListSelectDown();
		}
	}

	this.searchOff = function() {
		if (document.getElementById('search').style.display != 'none') {
			document.getElementById('songSelectInfo').style.display = '';
			document.getElementById('search').style.display = 'none';
			searchInputElement.value = '';
			
			this.titleListSelectUp();
		}
	}
	
	this.updateSongPanel();

	var d = new Date();
	document.getElementById('changelog').href += '?' + d.getTime();
	document.getElementById('changelog').innerHTML = VERSION;
}
