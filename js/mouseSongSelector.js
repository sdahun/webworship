var mouseSongSelectorElement = document.getElementById('mouseSongSelector');
var mouseSongSelectorNumberElement = document.getElementById('mouseSongSelectorNumber');
var mouseSongSelectorTitleElement = document.getElementById('mouseSongSelectorTitle');
var mouseSongSelectorVersesElement = document.getElementById('mouseSongSelectorVerses');

var mouseSongSelector;

function MouseSongSelector() {
	this.enabled = false;
	this.lastScroll = false;
	this.songList = [];
	this.index = -1;
	this.verses = [];
	this.versesIndex = -1;
	
	var _this = this;
	
	this.show = function() {
		if (songBook.selectedBook != undefined && songBook.selectedBook != '' && book[songBook.selectedBook] != undefined) {
			mouseSongSelectorElement.style.display = '';
			mouseSongSelectorNumberElement.className = 'selected';
			
			this.songList = [];
			this.index = -1;
			for (var sr = 0; sr < songData.sorted.length; sr++) {
				var songId = songData.sorted[sr];
				if (song[songId].book != songBook.selectedBook) {
					continue;
				}
				if (this.index == -1 && song[songId].number == songPanel.selectedNumber) {
					this.index = this.songList.length;
				}
				this.songList.push([songId, song[songId].number]);
			}
			this.update();
			
			this.enabled = true;
		}
	}
	
	this.leftClick = function() {
		if (mouseSongSelectorNumberElement.className == 'selected') {
			if (this.index != -1) {
				mouseSongSelectorNumberElement.className = '';
				if (this.verses.length > 0) {
					this.versesIndex = 0; // go to first verse label
				} else {
					this.versesIndex = true; // go to Play label
				}
				this.updateVerses();
			}
		} else {
			if (this.versesIndex === true) {
				var n = 0;
				for (var i in this.verses) {
					if (this.verses[i][1]) {
						n++;
					}
				}
				if (n == 0) {
					for (var i in this.verses) {
						this.verses[i][1] = true;
					}
					this.updateVerses();
				}
				var selectedVerses = [];
				for (var i in this.verses) {
					if (this.verses[i][1]) {
						selectedVerses.push(this.verses[i][0]);
					}
				}
				setTimeout(function(){
					_this.hide();
					
					// PLAY
					if (_this.index != -1) {
						songPanel.selectedNumber = _this.songList[_this.index][1];
						songPanel.selectedSongId = _this.songList[_this.index][0];
						songPanel.selectedVerses = selectedVerses;
						songPanel.songNumberWriteEnabled = false;
						songPanel.updateSongPanel(true);
						songPanel.searchOff();
						
						for (var i = 0; i < songPanel.playModeOptions.length; i++) {
							if (document.getElementById(songPanel.playModeOptions[i]).className.indexOf('selected') != -1) {
								songPanel.playModeClick(songPanel.playModeOptions[i]);
								break;
							}
						}
					}
					
				}, 200);
			} else if (this.versesIndex >= 0 && this.versesIndex < this.verses.length) {
				this.verses[this.versesIndex][1] = !this.verses[this.versesIndex][1];
				if (this.verses[this.versesIndex][1]) {
					this.versesIndex++;
					if (this.versesIndex >= this.verses.length) {
						this.versesIndex = true;
					}
				}
				this.updateVerses();
			}
		}
	}
	
	this.rightClick = function() {
		if (mouseSongSelectorNumberElement.className == 'selected') {
			setTimeout(function(){
				_this.hide();
			}, 10);
		} else {
			this.versesIndex = -1;
			this.updateVerses();
			
			mouseSongSelectorNumberElement.className = 'selected';
		}
	}
	
	this.hide = function() {
		if (this.enabled) {
			mouseSongSelectorElement.style.display = 'none';
			mouseSongSelectorNumberElement.className = '';
			mouseSongSelectorNumberElement.innerHTML = '';
			mouseSongSelectorTitleElement.innerHTML = '';
			mouseSongSelectorVersesElement.innerHTML = '';
			this.enabled = false;
		}
	}
	
	this.updateVerses = function() {
		var html = '';
		for (var i in this.verses) {
			var isSelected = this.versesIndex !== true && this.versesIndex == i;
			var isMarked = this.verses[i][1];
			html += ' <span class="v' + (isSelected ? ' selected' : '') + (isMarked ? ' marked' : '') + '">' + this.verses[i][0] + '.</span> ';
		}
		if (html == '') {
			if (this.index != -1) {
				html = ' <span class="v">' + tr('FullSong') + '</span>';
			} else {
				html = ' <span class="v">&nbsp;</span>';
			}
		}
		if (this.index != -1) {
			html += ' <br> <span class="v' + (this.versesIndex === true ? ' selected' : '') + '">' + tr('PlayButton') + '</span> ';
		} else {
			html += ' <br> <span class="v">&nbsp;</span>';
		}
		mouseSongSelectorVersesElement.innerHTML = html;
	}
	
	this.autoTxtSize = function() {
		var minSize = 10;
		var maxSize = 4000;
		
		// legnagyobb betűméret megkeresése, ami még kifér 
		
		// felezéses keresés
		var x = 100; // számláló biztonság kedvéért, hogy semmiképpen se ragadhasson be
		while (x--) {
			var middle = minSize + Math.ceil((maxSize - minSize) / 2);
			mouseSongSelectorElement.style.fontSize = middle + '%';
			if (mouseSongSelectorElement.clientHeight > window.innerHeight || mouseSongSelectorElement.clientWidth > window.innerWidth) {
				// nem fér ki
				maxSize = middle - 1;
			} else {
				// kifér
				minSize = middle;
			}
			if (minSize == maxSize) {
				if (middle != minSize) {
					mouseSongSelectorElement.style.fontSize = minSize + '%';
				}
				break;
			}
		}
	}
	
	this.update = function() {
		if (this.index != -1 && this.songList[this.index] != undefined) {
			mouseSongSelectorNumberElement.innerHTML = this.songList[this.index][1];
			mouseSongSelectorTitleElement.innerHTML = songData.getSongTitle(this.songList[this.index][0]);
			if (!songData.isPlayable(this.songList[this.index][0])) {
				mouseSongSelectorTitleElement.className = 'onlyText';
			} else {
				mouseSongSelectorTitleElement.className = '';
			}
		} else {
			mouseSongSelectorNumberElement.innerHTML = '---';
			mouseSongSelectorTitleElement.innerHTML = '&nbsp;';
			mouseSongSelectorTitleElement.className = '';
		}
		
		this.verses = [];
		this.versesIndex = -1;
		if (this.index != -1 && this.songList[this.index] != undefined) {
			var songId = this.songList[this.index][0];
			if (songData.isMusicOneFile(songId)) {
			} else {
				for (var i in song[songId]) {
					if (i > 0) {
						this.verses.push([i, false]);
					}
				}
			}
		}
		this.updateVerses();
		
		this.autoTxtSize();
	}
	
	this.isEnabled = function() {
		return this.enabled;
	}
	
	this.inc = function() {
		if (this.songList.length > 0) {
			if (mouseSongSelectorNumberElement.className == 'selected') {
				var dt = new Date();
				var t = dt.getTime();
				if (this.index == -1) {
					this.index = 0;
				} else {
					var speed = this.lastScroll !== false ? t - this.lastScroll : 1000;
					if (speed < 50 && this.songList.length > 10) {
						this.index += 10;
					} else {
						this.index++;
					}
				}
				this.lastScroll = t;
				
				while (this.index >= this.songList.length) {
					this.index -= this.songList.length;
				}
				
				this.update();
			} else {
				if (this.versesIndex === true) {
					if (this.verses.length > 0) {
						this.versesIndex = this.verses.length - 1;
						this.updateVerses();
					}
				} else if (this.versesIndex > 0) {
					this.versesIndex--;
					this.updateVerses();
				}
			}
		}
	}
	
	this.dec = function() {
		if (this.songList.length > 0) {
			if (mouseSongSelectorNumberElement.className == 'selected') {
				var dt = new Date();
				var t = dt.getTime();
				if (this.index == -1) {
					this.index = this.songList.length - 1;
				} else {
					var speed = this.lastScroll !== false ? t - this.lastScroll : 1000;
					if (speed < 50 && this.songList.length > 10) {
						this.index -= 10;
					} else {
						this.index--;
					}
				}
				this.lastScroll = t;
				
				while (this.index < 0) {
					this.index += this.songList.length;
				}
				
				this.update();
			} else {
				if (this.versesIndex !== true) {
					this.versesIndex++;
					if (this.versesIndex >= this.verses.length) {
						this.versesIndex = true;
					}
					this.updateVerses();
				}
			}
		}
	}
}
