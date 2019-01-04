var bookSelectElement = document.getElementById('bookSelect');

var book = {};
var connections = [];

var songBook;

function SongBook(callbackFn) {
	var loadList = {};
	
	var bookOpen = false;
	var bookSelectClickCancel = false;
	
	var bookSelectUpRight = false;

	this.connectIdBySongId = {};
	this.selectedBook = '';
	
	var _this = this;
	
	function loadBookIndicator(onLoadFn) {
		var loadCount = 0;
		var loadDone = 0;
		var loadError = [];
		for (var bookId in loadList) {
			loadCount++;
			if (loadList[bookId] === true) {
				loadDone++;
			} else if (loadList[bookId] === false) {
				loadDone++;
				loadError.push(bookId);
			}
		}
		var inProgress = loadDone < loadCount;
		
		if (loadCount > 0) {
			var html = '';
			if (inProgress || loadCount == 1) {
				html += tr('Loading');
			} else {
				html += tr('Done');
			}
			if (loadCount > 1) {
				html += '<br><span style="font-size: 50%;">';
				for (var i = 0; i < loadCount; i++) {
					var bg = i < loadDone ? '#0a0' : '#bbb';
					html += '<span style="background: ' + bg + '; margin: 1px; border-radius: 7px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>';
				}
				html += '</span>';
			}
			html += '<br>';
			if (loadError.length > 0) {
				if (loadCount == 1) {
					html = '';
				}
				html += '<span style="color: #f00;">' + tr('LoadingBookError');
				for (var i = 0; i < loadError.length; i++) {
					html += '<br>' + loadError[i];
				}
				html += '</span>';
			}
			infoBox.show(html, inProgress || loadError.length > 0 ? false : 200);
		}
		
		if (!inProgress) {
			loadList = {};
			if (onLoadFn != undefined) {
				onLoadFn();
			}
		}
	}
	
	this.loadBook = function(bookId, onLoadFn) {
		if (bookId === '') {
			for (var bId in book) {
				if (bId != '' && loadList[bId] === undefined && book[bId].init == undefined) {
					loadList[bId] = null;
				}
			}
		} else if (Array.isArray(bookId)) {
			for (var i = 0; i < bookId.length; i++) {
				if (bookId[i] != '' && loadList[bookId[i]] === undefined && book[bookId[i]].init == undefined) {
					loadList[bookId[i]] = null;
				}
			}
		} else {
			if (loadList[bookId] === undefined && book[bookId].init == undefined) {
				loadList[bookId] = null;
			}
		}
		loadBookIndicator(onLoadFn);
		for (var bookId in loadList) {
			if (loadList[bookId] === null) {
				app.loadScript('hymnal/' + bookId, function(isSuccess, bookId){
					if (isSuccess) {
						loadList[bookId] = true;
						book[bookId].init = true;
						songData.updateSongData();
						_this.updateBookList();
						
						loadBookIndicator(onLoadFn);
					} else {
						loadList[bookId] = false;
						
						loadBookIndicator(onLoadFn);
					}
				}, bookId);
			}
		}
	}
	
	this.updateBookList = function() {
		var html = '';
		var bookCount = 0;
		if (/*this.selectedBook != '' &&*/ book[this.selectedBook] != undefined) {
			var langTitle = book[this.selectedBook].lang != undefined && book[this.selectedBook].lang != '' && lang[book[this.selectedBook].lang] != undefined ? lang[book[this.selectedBook].lang]['LANGUAGE'] : '';
			var abbreviation = book[this.selectedBook].abbreviation != undefined && book[this.selectedBook].abbreviation != '' ? ' (' + book[this.selectedBook].abbreviation + ')' : '';
			html += 
				'<div class="book op selected' + (book[this.selectedBook].init ? '' : ' error') + '" onclick="songBook.selectBookCancel()">' + 
				'<span class=\"lang\" title=\"' + langTitle + '\">' + (book[this.selectedBook].lang != undefined ? book[this.selectedBook].lang : '') + '</span>' +
				book[this.selectedBook].title + abbreviation + 
			'</div>';
		}
		var langLine = false;
		for (var part = 1; part <= 2; part++) {
			for (var bookId in book) {
				if ((part == 1 && book[bookId].lang == language.getLang()) || (part == 2 && book[bookId].lang != language.getLang())) {
					
					if (part == 2 && !langLine) {
						langLine = true;
						html += '<div style=\"border-bottom: 1px solid #000; line-height: 0; font-size: 0; padding-top: 2px; margin-bottom: 3px;\"></div>';
					}
					
					var langTitle = book[bookId].lang != undefined && book[bookId].lang != '' && lang[book[bookId].lang] != undefined ? lang[book[bookId].lang]['LANGUAGE'] : '';
					var abbreviation = book[bookId].abbreviation != undefined && book[bookId].abbreviation != '' ? ' (' + book[bookId].abbreviation + ')' : '';
					html += 
						'<div class="book op' + (bookId == this.selectedBook ? ' mark' : '') + (book[bookId].init ? '' : ' error') + '" onclick="songBook.selectBook(\'' + bookId + '\')">' + 
						'<span class=\"lang\" title=\"' + langTitle + '\">' + (book[bookId].lang != undefined ? book[bookId].lang : '') + '</span>' +
						book[bookId].title + abbreviation + 
						'</div>';
					bookCount++;
				}
			}
		}
		var bookSelectDisable = bookCount < 2 && this.selectedBook != '' && book[this.selectedBook] != undefined;
		bookSelectElement.innerHTML = '<div id="bookSelectInner">' + html + '</div>';
		
		var sampleBook = document.getElementById('sampleBook');
		var bookSelectInner = document.getElementById('bookSelectInner');
		
		if (bookOpen) {
			var bookSelectSize = 14;
			if (bookSelectSize > bookCount + 1) {
				bookSelectSize = bookCount + 1;
			}
			bookSelectElement.style.overflow = 'auto';
			bookSelectElement.style.height = (sampleBook.clientHeight * bookSelectSize + 7 + 6) + 'px';
			bookSelectElement.className = 'open';
			
			document.getElementById('bookSelectDown').style.display = 'none';
			document.getElementById('bookSelectUp').style.display = '';
			/*if (document.getElementById('selectInnerMore')) {
				document.getElementById('selectInnerMore').style.display = '';
			}*/
		} else {
			bookSelectElement.style.overflow = 'hidden';
			bookSelectElement.style.height = (sampleBook.clientHeight) + 'px';
			bookSelectElement.className = bookSelectDisable ? 'disable' : 'close';
			
			document.getElementById('bookSelectDown').style.display = bookSelectDisable ? 'none' : '';
			document.getElementById('bookSelectUp').style.display = 'none';
			/*if (document.getElementById('selectInnerMore')) {
				document.getElementById('selectInnerMore').style.display = 'none';
			}*/
		}
		document.getElementById('bookSelectDown').style.display = 'none';	
		document.getElementById('bookSelectUp').style.display = 'none';	
		
		if (bookSelectUpRight === false) {
			bookSelectUpRight = document.getElementById('bookSelectUp').style.right;
		}
		if (bookSelectInner.clientHeight > bookSelectElement.clientHeight) {
			document.getElementById('bookSelectUp').style.right = '20px';
		} else {
			document.getElementById('bookSelectUp').style.right = bookSelectUpRight;
		}
	}
	
	this.isBookOpen = function() {
		return bookOpen;
	}
	
	this.setPreviousBook = function() {
		var prevId = false;
		/*for (var bookId in book) {
			if (bookId == this.selectedBook) {
				break;
			}
			prevId = bookId;
		}*/
		for (var part = 1; part <= 2; part++) {
			for (var bookId in book) {
				if ((part == 1 && book[bookId].lang == language.getLang()) || (part == 2 && book[bookId].lang != language.getLang())) {
					if (bookId == this.selectedBook) {
						part = 2;
						break;
					}
					prevId = bookId;
				}
			}
		}
		if (prevId !== false) {
			this.selectBook(prevId, true);
		}
	}
	
	this.setNextBook = function() {
		var nextId = false;
		var found = false;
		/*for (var bookId in book) {
			if (bookId == this.selectedBook) {
				found = true;
			} else if (found) {
				nextId = bookId;
				break;
			}
		}*/
		for (var part = 1; part <= 2; part++) {
			for (var bookId in book) {
				if ((part == 1 && book[bookId].lang == language.getLang()) || (part == 2 && book[bookId].lang != language.getLang())) {
					if (bookId == this.selectedBook) {
						found = true;
					} else if (found) {
						nextId = bookId;
						part = 2;
						break;
					}
				}
			}
		}
		if (nextId !== false) {
			this.selectBook(nextId, true);
		}
	}	
	
	this.selectBookCancel = function() {
		if (bookOpen) {
			bookSelectClickCancel = true;
			this.bookSelectUp();
		}
	}
	
	this.selectBook = function(bookId, changeBook) {
		if (changeBook == undefined) {
			changeBook = false;
		}
		if (bookOpen) {
			if (!changeBook) {
				bookSelectClickCancel = true;
				this.bookSelectUp();
			} else {
				if (!bookOpen) {
					songPanel.updateTitleList();
				}
			}
			if (this.selectedBook != bookId) {
				this.selectedBook = bookId;
				songPanel.selectSong('');
				songPanel.selectedVerses = [];
				songPanel.songNumberWriteEnabled = true;
				songBook.loadBook(bookId, function(){
					songPanel.updateSongPanel(true);
				});
			}
		}
	}	

	this.bookSelectClick = function() {
		if (!bookOpen) {
			if (bookSelectClickCancel) {
				bookSelectClickCancel = false;
			} else {
				this.bookSelectDown();
			}
		}
	}
	
	this.bookSelectDown = function() {
		if (!bookOpen) {
			if (bookSelectElement.className != 'disable') {
				bookOpen = true;
				songPanel.searchOff();
				songPanel.titleListSelectUp(false);
				songPanel.updateTitleList();
			}
		}
	}
	
	this.bookSelectUp = function(update) {
		if (bookOpen) {
			bookOpen = false;
			bookSelectElement.scrollTop = 0;
			if (update !== false) {
				songPanel.updateTitleList();
			}
		}
	}

	if (!extended.isDisplayMode()) {
		app.loadScript('hymnal/_books', function(isBookLoadSuccess){
			
			if (DEFAULT_BOOK === false) {
				_this.selectedBook = '';
				for (var bookId in book) {
					if (book[bookId].lang != undefined && book[bookId].lang == language.getLang()) {
						_this.selectedBook = bookId;
						break;
					}
				}
			} else {
				_this.selectedBook = DEFAULT_BOOK;
			}
			book[''] = {
				title: tr('AllBookTitle'),
				abbreviation: '&Sigma;',
				publisher: '',
				year: '',
				lang: '',
				description: tr('AllBookDescription'),
				init: true
			};
			
			document.getElementById('dataVersion').innerHTML = HYMNAL_VERSION;
			
			app.loadScript('hymnal/_connections', function(isConnectLoadSuccess){
				for (var i = 0; i < connections.length; i++) {
					for (var j = 0; j < connections[i].length; j++) {
						var songId = connections[i][j];
						_this.connectIdBySongId[songId] = i;
					}
				}
				callbackFn();
			});
		});
	} else {
		setTimeout(function(){
			callbackFn();
		}, 1);
	}
}
