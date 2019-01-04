var bibleBookElement = document.getElementById('bibleBook');
var bibleBookInputElement = document.getElementById('bibleBookInput');

var bibleChapterElement = document.getElementById('bibleChapter');
var bibleChapterInputElement = document.getElementById('bibleChapterInput');

var bibleVerseElement = document.getElementById('bibleVerse');
var bibleVerseInputElement = document.getElementById('bibleVerseInput');

var bibleBook2Element = document.getElementById('bibleBook2');
var bibleBookInput2Element = document.getElementById('bibleBookInput2');

var bibleChapter2Element = document.getElementById('bibleChapter2');
var bibleChapterInput2Element = document.getElementById('bibleChapterInput2');

var bibleVerse2Element = document.getElementById('bibleVerse2');
var bibleVerseInput2Element = document.getElementById('bibleVerseInput2');

var selectorBlockElement = document.getElementById('selectorBlock');

function BibleSelector(selectorId, setBookElement, setBookInputElement, setChapterElement, setChapterInputElement, setVerseElement, setVerseInputElement, doneCallbackFn, prevCallbackFn) {
	var bookElement = setBookElement;
	var bookInputElement = setBookInputElement;
	
	var chapterElement = setChapterElement;
	var chapterInputElement = setChapterInputElement;
	
	var verseElement = setVerseElement;
	var verseInputElement = setVerseInputElement;
	
	var doneFn = doneCallbackFn;
	var prevFn = prevCallbackFn;
	
	var bookText = '';
	
	this.book = '';
	this.chapter = '';
	this.verse = '';
	
	this.keyPress = function(controlKey) {
		var key = controlKey.key;
		if (controlKey.event == undefined) {
			controlKey.event = {};
		}
		if (controlKey.event.key == undefined) {
			controlKey.event.key = '';
		}
		var isBackspace = key == 'del';
		if (bible[biblePanel.selectedBible] != undefined) {
			
			// book selection
			if (biblePanel.isSelectedInput(bookInputElement)) {
				if (controlKey.setBookText) {
					if (this.book == '') {
						bookText = '';
					} else {
						bookText = bible[biblePanel.selectedBible].cover.book[this.book].short.toLowerCase().replace(' ', '');
					}
				}
				var txt = bookText;
				var focusPrev = false;
				var focusChapter = false;
				var focusChapterReturn = true;
				var chr = controlKey.key.length == 1 ? controlKey.key : (controlKey.event.key.length == 1 ? controlKey.event.key : '');
				if (isBackspace) {
					
					/*if (biblePanel.clearOption) {
						bookText = '';
						txt = bookText;
						biblePanel.clearOption = false;
					}*/
					biblePanel.clearOption = false;
					
					if (txt.length > 0) {
						//txt = txt.substring(0, txt.length - 1);
						txt = '';
					} else {
						focusPrev = true;
					}
				} else if (key == 'left' || key == 'shiftTab') {
					focusPrev = true;
				} else if (key == 'enter' || key == 'tab' || key == 'right' || controlKey.event.key == ':' || controlKey.event.key == ',' || controlKey.event.key == '.' || controlKey.event.key == ';') {
					if (this.book != '') {
						focusChapter = true;
					}
				} else if (chr.length == 1) {
					
					if (biblePanel.clearOption) {
						bookText = '';
						txt = bookText;
						biblePanel.clearOption = false;
					}
					
					// van könyv kiválasztva és számot írtunk be
					if (this.book != '' && txt != '' && chr >= '0' && chr <= '9') {
						var txtNum = parseInt(txt, 10);
						// az eddig beírt szöveg nem numerikus
						if (isNaN(txtNum) || txtNum + '' !== txt) {
							focusChapter = true;
							focusChapterReturn = false;
						} else {
							// az eddig beírt szöveg numerikus, hozzáadjuk a most beírt számot
							txtNum = txtNum * 10 + parseInt(chr, 10);
							var bookNum = 0;
							for (var bookId in bible[biblePanel.selectedBible].cover.book) {
								bookNum++;
							}
							// ha a beírt érték nagyobb, mint az elérhető könyvek száma
							if (txtNum > bookNum) {
								focusChapter = true;
								focusChapterReturn = false;
							}
						}
					}
					
					if (!focusChapter) {
						txt += chr.toLowerCase();
					}
				}
				if (txt == '') {
					bookText = '';
					this.book = '';
					
					this.chapter = ''; 
					chapterElement.innerHTML = this.chapter;
					
					this.verse = '';
					verseElement.innerHTML = this.verse;
				} else {
					var found = false;
					for (var bookId in bible[biblePanel.selectedBible].cover.book) {
						if (
							bible[biblePanel.selectedBible].cover.book[bookId].short.toLowerCase().replace(' ', '').indexOf(txt) == 0 || 
							bible[biblePanel.selectedBible].cover.book[bookId].title.toLowerCase().replace(' ', '').indexOf(txt) == 0
						) {
							bookText = txt;
							this.book = bookId;
							found = true;
							break;
						}
					}
					if (!found) {
						var txtNum = parseInt(txt, 10);
						if (!isNaN(txtNum) && txtNum > 0 && txtNum + '' === txt) {
							var bookNum = 0;
							for (var bookId in bible[biblePanel.selectedBible].cover.book) {
								bookNum++;
								if (txtNum == bookNum) {
									bookText = txt;
									this.book = bookId;
									found = true;
									break;
								}
							}
						}
					}
					if (!found) {
						biblePanel.alertInput(bookInputElement);
					}
				}
				bookElement.innerHTML = this.book != '' ? bible[biblePanel.selectedBible].cover.book[this.book].short : bookText;
				if (focusPrev) {
					biblePanel.clearOption = true;
					prevFn();
					return true;
				} else if (focusChapter) {
					biblePanel.clearOption = true;
					biblePanel.selectInput(bookInputElement, false);
					biblePanel.selectInput(chapterInputElement, true);
					this.showSelectorBlock();
					if (focusChapterReturn) {
						return true;
					}
				} else {
					return true;
				}
			}
			
			// chapter selection
			if (biblePanel.isSelectedInput(chapterInputElement)) {
				var txt = this.chapter;
				var focusBook = false;
				var focusVerse = false;
				if (isBackspace) {
					biblePanel.clearOption = false;
					if (txt.length > 0) {
						txt = txt.substring(0, txt.length - 1);
					} else {
						focusBook = true;
					}
				} else if (key == 'left' || key == 'shiftTab') {
					focusBook = true;
				} else if (key == 'enter' || key == 'tab' || key == 'right' || controlKey.event.key == ':' || controlKey.event.key == ',' || controlKey.event.key == '.' || controlKey.event.key == ';') {
					if (this.chapter != '') {
						focusVerse = true;
					}
				} else if (key >= '0' && key <= '9') {
					
					if (biblePanel.clearOption) {
						this.chapter = '';
						txt = this.chapter;
						biblePanel.clearOption = false;
					}
					
					txt += key;
				}
				if (txt == '') {
					this.chapter = ''; 
					
					this.verse = '';
					verseElement.innerHTML = this.verse;
				} else {
					var found = false;
					if (this.book != '' && bible[biblePanel.selectedBible].cover.book[this.book] != undefined && bible[biblePanel.selectedBible].content[this.book][txt] != undefined) {
						//if (.title.toLowerCase().replace(' ', '').indexOf(txt) == 0) {
						this.chapter = txt;
						found = true;
					}
					if (!found) {
						biblePanel.alertInput(chapterInputElement);
					}
				}
				chapterElement.innerHTML = this.chapter;
				if (focusBook) {
					biblePanel.clearOption = true;
					biblePanel.selectInput(chapterInputElement, false);
					biblePanel.selectInput(bookInputElement, true);
					this.showSelectorBlock();
				} else if (focusVerse) {
					biblePanel.clearOption = true;
					biblePanel.selectInput(chapterInputElement, false);
					biblePanel.selectInput(verseInputElement, true);
					this.showSelectorBlock();
				}
				return true;
			}
			
			// verse selection
			if (biblePanel.isSelectedInput(verseInputElement)) {
				var txt = this.verse;
				var focusChapter = false;
				var focusDone = false;
				if (isBackspace) {
					biblePanel.clearOption = false;
					if (txt.length > 0) {
						txt = txt.substring(0, txt.length - 1);
					} else {
						focusChapter = true;
					}
				} else if (key == 'left' || key == 'shiftTab') {
					focusChapter = true;
				} else if (key == 'enter' || key == 'tab' || key == 'right' || controlKey.event.key == ':' || controlKey.event.key == ',' || controlKey.event.key == '.' || controlKey.event.key == ';') {
					if (this.verse != '') {
						focusDone = true;
					}
				} else if (key >= '0' && key <= '9') {
					
					if (biblePanel.clearOption) {
						this.verse = '';
						txt = this.verse;
						biblePanel.clearOption = false;
					}
					
					txt += key;
				}
				if (txt == '') {
					this.verse = ''; 
				} else {
					var found = false;
					if (this.book != '' && this.chapter != '' && bible[biblePanel.selectedBible].cover.book[this.book] != undefined && bible[biblePanel.selectedBible].content[this.book][this.chapter][txt] != undefined) {
						//if (.title.toLowerCase().replace(' ', '').indexOf(txt) == 0) {
						this.verse = txt;
						found = true;
					}
					if (!found) {
						biblePanel.alertInput(verseInputElement);
					}
				}
				verseElement.innerHTML = this.verse;
				if (focusChapter) {
					biblePanel.clearOption = true;
					biblePanel.selectInput(verseInputElement, false);
					biblePanel.selectInput(chapterInputElement, true);
					this.showSelectorBlock();
				}
				if (focusDone) {
					biblePanel.clearOption = true;
					biblePanel.selectInput(verseInputElement, false);
					this.showSelectorBlock();
					if (controlKey.doneFn != undefined) {
						controlKey.doneFn();
					} else {
						doneFn();
					}
				}
				return true;
			}
		}
		return false;
	}
	
	this.updateFromVariable = function() {
		if (this.book != '' && bible[biblePanel.selectedBible].cover.book[this.book] == undefined) {
			this.book = '';
		}
		bookText = this.book != '' ? bible[biblePanel.selectedBible].cover.book[this.book].short.toLowerCase().replace(' ', '') : '';
		bookElement.innerHTML = this.book != '' ? bible[biblePanel.selectedBible].cover.book[this.book].short : bookText;
		
		chapterElement.innerHTML = this.chapter;
		
		verseElement.innerHTML = this.verse;
	}
	
	this.showSelectorBlock = function() {
		if (bible[biblePanel.selectedBible] != undefined) {
			var html = false;
			
			// book selection
			if (biblePanel.isSelectedInput(bookInputElement)) {
				html = '';
				for (var bookId in bible[biblePanel.selectedBible].cover.book) {
					if (bookId == 'Matthew') {
						html += '<div class="clear"></div>';
					}
					var color = '';
					if (bibleData.booksByName[bookId] != undefined && bibleData.booksByName[bookId].color != '') {
						color = ' style="background: ' + bibleData.booksByName[bookId].color + ';"';
					}
					html += '<span' + color + ' onclick="sb(' + selectorId + ', \'' + bookId + '\')">' + bible[biblePanel.selectedBible].cover.book[bookId].short + '</span> ';
				}
			}
			
			// chapter selection
			if (biblePanel.isSelectedInput(chapterInputElement)) {
				html = '';
				if (this.book != '' && bible[biblePanel.selectedBible].content[this.book] != undefined) {
					for (var chapterId in bible[biblePanel.selectedBible].content[this.book]) {
						var chapterIdNum = parseInt(chapterId, 10);
						var n09 = !isNaN(chapterIdNum) && chapterIdNum > 0 && chapterIdNum < 10;
						html += '<span onclick="sc(' + selectorId + ', \'' + chapterId + '\')">' + (n09 ? '<u>00</u><i>' + chapterId + '</i>' : chapterId) + '</span> ';
					}
				}
			}
			
			// verse selection
			if (biblePanel.isSelectedInput(verseInputElement)) {
				html = '';
				if (this.book != '' && this.chapter != '' && bible[biblePanel.selectedBible].content[this.book][this.chapter] != undefined) {
					for (var verseId in bible[biblePanel.selectedBible].content[this.book][this.chapter]) {
						var verseIdNum = parseInt(verseId, 10);
						var n09 = !isNaN(verseIdNum) && verseIdNum > 0 && verseIdNum < 10;
						html += '<span onclick="ss(' + selectorId + ', \'' + verseId + '\')">' + (n09 ? '<u>00</u><i>' + verseId + '</i>' : verseId) + '</span> ';
					}
				}
			}
			
			if (html !== false) {
				selectorBlockElement.innerHTML = '<div id="selectorBlockInner">' + html + '<div class=\"clear\"></div></div>';
				biblePanel.selectorBlockAutoSize();
			}
		}
	}
}
