var HYMNAL_VERSION = 'none';
var DEFAULT_BOOK = '';

var category = {};
var song = {};

var songData;

function SongData() {
	this.sorted = [];

	this.songSearch = {};
	this.songSearchOrig = {};

	var variations = {};
	var songByMusic = {};
	
	//var connectMap = {};
	//var connectMapChanged = {};
	
	var _this = this;
	
	this.formatSongText = function(s) {
		return s.replace(/\n/g, '<br>');
	}

	this.createSubtitlesFromText = function(s) {
		var subtitlesArray = [];
		var p = 0;
		var lastTim = -1;
		do {
			var p1 = s.indexOf('<' + '!--', p);
			var p2 = s.indexOf('--' + '>', p + 1);
			if (p1 == -1 || p2 == -1) {
				break;
			}
			p = s.indexOf('<' + '!--', p2 + 3);
			if (p == -1) {
				p = s.length;
			}
			var par = s.substr(p1 + 4, p2 - p1 - 4);
			var a = par.split('|');
			var tim = a[0];
			var inf = a.length > 1 ? strTrim(a[1]) : '';
			tim = tim.split(':');
			if (tim.length > 1) {
				tim = parseFloat(tim[0]) * 60 + parseFloat(tim[1]);
			} else {
				tim = parseFloat(tim[0]);
			}
			str = strTrim(s.substr(p2 + 3, p - p2 - 3));
			if (!isNaN(tim)) {
				if (tim > lastTim) {
					lastTim = tim;
					subtitlesArray.push([tim, inf, str]);
				}
			}
		} while (true);
		return subtitlesArray;
	}
	
	this.isMusicOneFile = function(songId) {
		return songId != '' && song[songId] != undefined && song[songId].music != undefined && song[songId].music != '' && song[songId].music.indexOf('*') == -1;
	}

	this.getSongName = function(songId, kiegeszites, bookAbbreviation) {
		if (songId == '' || song[songId] == undefined) {
			var a = songId.split('/');
			return a[a.length - 1];
		}
		/*if (song[songId].ownText) {
			return song[songId].title != '' ? song[songId].title : 'Saját szöveg';
		}*/
		
		var abbreviation = '';
		if (bookAbbreviation && song[songId].book != undefined && book[song[songId].book] != undefined && book[song[songId].book].abbreviation != undefined && book[song[songId].book].abbreviation != '') {
			abbreviation = book[song[songId].book].abbreviation + ' / ';
		}
		
		var number = song[songId].number;
		var bookId = song[songId].book;
		var num = parseInt(number, 10);
		var songStr = number;
		if (!isNaN(num) && num > 0 && variations[bookId] != undefined && variations[bookId][num] != undefined && variations[bookId][num].length > 1) {
			var str = number.length > (num + '').length ? number.substr((num + '').length, number.length - (num + '').length) : 'a';
			if (str != 'a') {
				songStr = num + '/' + str;
			}
		}
		
		if (kiegeszites != undefined) {
			songStr = kiegeszites.replace('\%', songStr);
		}
		
		return abbreviation + songStr;
	}
	
	this.getSongTitle = function(songId) {
		if (songId != '' && song[songId] != undefined) {
			return song[songId].title;
		}
		return '';
	}
	
	this.getSongVariations = function(songId) {
		var number = song[songId].number;
		var bookId = song[songId].book;
		var num = parseInt(number, 10);
		if (!isNaN(num) && num > 0) {
			num += '';
			if (variations[bookId] != undefined && variations[bookId][num] != undefined) {
				return variations[bookId][num];
			}
		}
		return [];
	}
	
	this.getSongArtist = function(songId) {
		if (songId != '' && song[songId] != undefined && song[songId].artist != undefined && song[songId].artist != '') {
			return '<div style="font-size: 20%; font-weight: normal; line-height: 1.2em;"><b>' + tr('Artist') + ':</b><br>' + song[songId].artist + '</div>';
		}
		return '';
	}

	// lapozható az ének?
	this.isPlayable = function(singId) {
		return song[singId] != undefined && song[singId].music != undefined && song[singId].music != '';
	}
	
	this.normalizeSearch = function(s) {
		s = stripTags(s);
		s = s.toLowerCase();
		//s = s.replace(/\<i\>/g, '').replace(/\<\/i\>/g, '');
		//.replace(/\./g, '').replace(/\,/g, '').replace(/\:/g, '').replace(/\;/g, '').replace(/\!/g, '').replace(/\?/g, '').replace(/\'/g, '').replace(/\"/g, '');
		return s;
	}
	
	function normalizeSearchOrig(s) {
		s = stripTags(s);
		//s = s.replace(/\<i\>/g, '').replace(/\<\/i\>/g, '');
		//.replace(/\./g, '').replace(/\,/g, '').replace(/\:/g, '').replace(/\;/g, '').replace(/\!/g, '').replace(/\?/g, '').replace(/\'/g, '').replace(/\"/g, '');
		return s;
	}
	
	function setSongTitle(songId) {
		var title = '';
		
		if (song[songId].title == undefined) {
			var words = song[songId][1];
			if (words == undefined) {
				for (var i in song[songId]) {
					if (i > 0) {
						words = song[songId][i];
						break;
					}
				}
			}
			if (words == undefined) {
				words = '';
			}
			
			var per = words.indexOf('/');
			if (per != -1) {
				words = words.substr(0, per);
			}
			
			words = words.split(' ');
			for (var i = 0; i < 10; i++) {
				if (i >= words.length || (title + words[i]).length > 28) {
					break;
				}
				title += words[i] + ' ';
			}
			title = title.substr(0, title.length - 1);
			title = title.replace(/\<i\>/g, '').replace(/\<\/i\>/g, '');
			var map = '.,:;!?\'" ';
			while (title.length > 0 && map.indexOf(title.charAt(title.length - 1)) != -1) {
				title = title.substr(0, title.length - 1);
			}
			title += '...';
			song[songId].title = title;
		} else {
			title = song[songId].title;
		}
		
		song[songId].titleSearch = _this.normalizeSearch(title);
		
		for (var v in song[songId]) {
			if (v > 0 || v == 'refrain' || v == 'refrain2' || v == 'final') {
				if (_this.songSearch[songId] == undefined) {
					_this.songSearch[songId] = {};
					_this.songSearchOrig[songId] = {};
				}
				_this.songSearch[songId][v] = _this.normalizeSearch(song[songId][v]);
				_this.songSearchOrig[songId][v] = normalizeSearchOrig(song[songId][v]);
			}
		}
	}	

	function addVariation(songId) {
		var number = song[songId].number;
		var bookId = song[songId].book;
		var num = parseInt(number, 10);
		if (!isNaN(num) && num > 0) {
			var str = number.length > (num + '').length ? number.substr((num + '').length, number.length - (num + '').length) : 'a';
			if (variations[bookId] == undefined) {
				variations[bookId] = {};
			}
			if (variations[bookId][num] == undefined) {
				variations[bookId][num] = [];
			}
			var hozzaadva = false;
			if (variations[bookId][num].length > 0) {
				var a = [];
				for (var i = 0; i < variations[bookId][num].length; i++) {
					if (!hozzaadva && str.toLowerCase() < variations[bookId][num][i][0].toLowerCase()) {
						a.push([str, songId]);
						hozzaadva = true;
					}
					a.push(variations[bookId][num][i]);
				}
				if (hozzaadva) {
					variations[bookId][num] = a;
				}
			}
			if (!hozzaadva) {
				variations[bookId][num].push([str, songId]);
			}
		}
	}
	
	this.updateSongData = function() {
		// init songs
		for (var songId in song) {
			if (song[songId].init == undefined) {
				song[songId].init = true;
				
				// init parameters
				var a = songId.split('/');
				song[songId].book = a.length > 1 ? a[0] : '';
				song[songId].number = a[a.length - 1];
				if (song[songId].refrain != undefined && song[songId].refrain != '') {
					for (var i in song[songId]) {
						if (i > 0) {
							song[songId][i] += ' <i>' + song[songId].refrain + '</i>';
						}
					}
				}
				if (song[songId].music != undefined && song[songId].music != '') {
					if (song[songId].music.indexOf('/') == -1) {
						song[songId].music = song[songId].book + '/' + song[songId].music;
					}
					
					// ugyan olyan zenéjű énekek összekapcsolása - jó bonyolult!
					var music = song[songId].music;
					if (songByMusic[music] == undefined) {
						songByMusic[music] = [];
					}
					for (var i = 0; i < songByMusic[music].length; i++) {
						if (songByMusic[music][i] != songId) {
							var connSongId = songByMusic[music][i];
							if (songBook.connectIdBySongId[connSongId] != undefined && songBook.connectIdBySongId[songId] != undefined) {
								// ha megegyezik a connectId-juk, akkor nincs teendő, egyébképnt pedig...
								if (songBook.connectIdBySongId[connSongId] != songBook.connectIdBySongId[songId]) {
									// összevonás
									var connId = songBook.connectIdBySongId[songId];
									var delConnId = songBook.connectIdBySongId[connSongId];
									console.log('Concat ' + connId + ' ' + delConnId);
									console.log(connections[connId]);
									console.log(connections[delConnId]);
									for (var j = 0; j < connections[delConnId].length; j++) {
										var moveSongId = connections[delConnId][j];
										if (connections[connId].indexOf(moveSongId) == -1) {
											connections[connId].push(moveSongId);
										}
										songBook.connectIdBySongId[moveSongId] = connId;
									}
									connections[delConnId] = [];
								}
							} else if (songBook.connectIdBySongId[connSongId] != undefined) {
								// az előzőleg hozzáadott ének már bent van a kapcoslatok között, hozzá tesszük ezt is
								var connId = songBook.connectIdBySongId[connSongId];
								if (connections[connId].indexOf(songId) == -1) {
									connections[connId].push(songId);
								}
								songBook.connectIdBySongId[songId] = connId;
							} else if (songBook.connectIdBySongId[songId] != undefined) {
								// ez az ének már bent van a kapcsolatok között, de az előzőleg hozzáadott még nem volt, betesszük azt is
								var connId = songBook.connectIdBySongId[songId];
								if (connections[connId].indexOf(connSongId) == -1) {
									connections[connId].push(connSongId);
								}
								songBook.connectIdBySongId[connSongId] = connId;
							} else {
								// még nincs köztük kapcsolat
								var connId = connections.length;
								connections.push([connSongId, songId]);
								songBook.connectIdBySongId[connSongId] = connId;
								songBook.connectIdBySongId[songId] = connId;
							}
						}
					}
					songByMusic[music].push(songId);
					
				}
				
				setSongTitle(songId);
				addVariation(songId);
								
				/*
				// find connections by song
				if (true) { // @todo
					if (song[songId].connect != undefined && song[songId].connect != '') {
						if (connectMap[song[songId].connect] == undefined) {
							connectMap[song[songId].connect] = [];
						}
						connectMap[song[songId].connect].push(songId);
						connectMapChanged[song[songId].connect] = true;
					}
				}
				*/
			}
		}
		
		/*
		// set connections by song
		for (var connect in connectMap) {
			if (connectMapChanged[connect]) {
				connectMapChanged[connect] = false;
				
				var music = '';
				for (var i = 0; i < connectMap[connect].length; i++) {
					var songId = connectMap[connect][i];
					if (song[songId].music != undefined && song[songId].music != '') {
						music = song[songId].music;
						break;
					}
				}
				if (music != '') {
					for (var i = 0; i < connectMap[connect].length; i++) {
						var songId = connectMap[connect][i];
						if (song[songId].music == undefined || song[songId].music == '') {
							song[songId].music = music;
						}
					}
				}
			}
		}
		*/
		
		// set connections by array
		for (var i = 0; i < connections.length; i++) {
			var music = '';
			for (var j = 0; j < connections[i].length; j++) {
				var songId = connections[i][j];
				if (song[songId] != undefined && song[songId].music != undefined && song[songId].music != '') {
					music = song[songId].music;
					break;
				}
			}
			if (music != '') {
				for (var j = 0; j < connections[i].length; j++) {
					var songId = connections[i][j];
					if (song[songId] != undefined && (song[songId].music == undefined || song[songId].music == '')) {
						song[songId].music = music;
					}
				}
			}
		}
		
		// sort songs
		this.sorted = [];
		for (var songId in song) {
			if (song[songId].sort == undefined) {
				var sort = song[songId].number;
				var sign = sort.indexOf('*') != -1;
				sort = sort.replace(/\*/g, '');
				var num = parseInt(sort, 10);
				if (!isNaN(num) && num > 0) {
					num = num + '';
					sort = sort.length > num.length ? sort.substr(num.length, sort.length - num.length) : 'a';
					sort = sort.replace(/\//g, '');
					sort = sort.toLowerCase();
					while (num.length < 4) {
						num = '0' + num;
					}
					sort = num + sort;
				}
				if (sign) {
					sort = '~' + sort;
				}
				song[songId].sort = sort;
			}
			this.sorted.push(song[songId].sort + ' ' + songId);
		}
		this.sorted.sort();
		for (var i = 0; i < this.sorted.length; i++) {
			var a = this.sorted[i].split(' ');
			this.sorted[i] = a[1];
		}
	}
	
	this.getSongSpeeds = function(songId) {
		var availableSpeeds = [];
		var playSpeed = false;
		if (songId != '' && song[songId] != undefined) {
			var thisSong = song[songId];
			var songBook = song[songId].book != undefined ? song[songId].book : '';
			
			if (thisSong.music != undefined && thisSong.music != '') {
				var a = thisSong.music.split('/');
				if (a.length == 2 && a[0] != '' && book[a[0]] != undefined) {
					songBook = a[0];
				}
			}
			
			if (book[songBook] != undefined) {
				var thisBook = book[songBook];
				if (thisBook.speed != undefined && thisBook.speed.length > 0) {
					availableSpeeds = arrayClone(thisBook.speed);
					if (thisSong.speed != undefined) {
						if (thisSong.speed === true) {
							if (thisBook.markedSpeed != undefined && availableSpeeds.indexOf(thisBook.markedSpeed) != -1) {
								playSpeed = thisBook.markedSpeed;
							}
						} else if (thisSong.speed != 0) {
							if (availableSpeeds.indexOf(thisSong.speed) != -1) {
								playSpeed = thisSong.speed;
							} else if (thisBook.markedSpeed != undefined && availableSpeeds.indexOf(thisBook.markedSpeed) != -1) {
								playSpeed = thisBook.markedSpeed;
							}
						}
					}
				}
				if (playSpeed === false) {
					if (thisBook.defaultSpeed != undefined && availableSpeeds.indexOf(thisBook.defaultSpeed) != -1) {
						playSpeed = thisBook.defaultSpeed;
					}
				}
			}
		}
		if (playSpeed === false) {
			playSpeed = 0;
		}
		return {
			available: availableSpeeds,
			play: playSpeed
		};
	}
	
	// init
	this.updateSongData();
}
