var bibleSelectElement = document.getElementById('bibleSelect');
var bibleButtonsElement = document.getElementById('bibleButtons');
var bibleVerseSeparatorOnElement = document.getElementById('bibleVerseSeparatorOn');
var bibleVerseSeparatorOffElement = document.getElementById('bibleVerseSeparatorOff');
var bibleVerseHorizontalParalelOnElement = document.getElementById('bibleVerseHorizontalParalelOn');
var bibleVerseHorizontalParalelOffElement = document.getElementById('bibleVerseHorizontalParalelOff');

app.addEvent('loadBibleCover', function(){
	biblePanel.updateBibleList();
});

app.addEvent('changeView', function(){
	biblePanel.verse1.showSelectorBlock();
	biblePanel.verse2.showSelectorBlock();
});

// set book
function sb(part, bookId) {
	if (part == 1) {
		biblePanel.verse1.book = bookId;
		//biblePanel.verse1.keyPress({keyCode: 13, key: 'Enter', setBookText: true}, 'enter');
		biblePanel.verse1.keyPress({key: 'enter', setBookText: true});
	} else if (part == 2) {
		biblePanel.verse2.book = bookId;
		//biblePanel.verse2.keyPress({keyCode: 13, key: 'Enter', setBookText: true}, 'enter');
		biblePanel.verse2.keyPress({key: 'enter', setBookText: true});
	}
}

// set chapter
function sc(part, chapterId) {
	if (part == 1) {
		biblePanel.verse1.chapter = chapterId;
		//biblePanel.verse1.keyPress({keyCode: 13, key: 'Enter'}, 'enter');
		biblePanel.verse1.keyPress({key: 'enter'});
	} else if (part == 2) {
		biblePanel.verse2.chapter = chapterId;
		//biblePanel.verse2.keyPress({keyCode: 13, key: 'Enter'}, 'enter');
		biblePanel.verse2.keyPress({key: 'enter'});
	}
}

// set verse
function ss(part, verseId) {
	if (part == 1) {
		biblePanel.verse1.verse = verseId;
		/*biblePanel.verse1.keyPress({keyCode: 13, key: 'Enter', doneFn: function(){
			biblePanel.submit();
		}}, 'enter');*/
		biblePanel.verse1.keyPress({key: 'enter', doneFn: function(){
			biblePanel.submit();
		}});
	} else if (part == 2) {
		biblePanel.verse2.verse = verseId;
		//biblePanel.verse2.keyPress({keyCode: 13, key: 'Enter'}, 'enter');
		biblePanel.verse2.keyPress({key: 'enter'});
	}
}

function WH(strongNumber) {
	if (!hasClass(bodyElement, 'hideMouse')) {
		presenter.setTxtClickCancel();
		infoBox.show('Strong number: ' + strongNumber + '<br>Under constructrion...');
	}
}

var biblePanel;

function BiblePanel() {	
	this.selectedBible = '';
	this.clearOption = true;
	
	this.playBible = '';
	this.playBook = '';
	this.playChapter = 0;
	this.playVerse = 0;
	this.playBook2 = '';
	this.playChapter2 = 0;
	this.playVerse2 = 0;
	this.playVerses = [];
	this.playIndex = 0;
	
	this.playPaging = false;
	this.playItemOnPage = 1;
	
	this.playModeOptions = [
		'biblePlayFew',
		'biblePlayMedium',
		'biblePlayMuch',
		'biblePlay1',
		'biblePlay2',
		'biblePlay3',
		'biblePlayAll'
	];
	
	var bibleOpen = false;
	var bibleSelectClickCancel = false;
	var bibleParalelClickCancel = false;
	
	this.paralelBibleList = [];
	this.isHorizontalParalel = true;
	this.isVerseSeparator = true;
	
	var _this = this;

	this.updateBibleList = function() {
		var html = '';
		var bibleCount = 0;
		if (bible[this.selectedBible] != undefined) {
			if (this.paralelBibleList.length > 0) {
				var paralelHtml = '';
				
				var abbreviation = bible[this.selectedBible].cover.abbreviation != undefined && bible[this.selectedBible].cover.abbreviation != '' ? bible[this.selectedBible].cover.abbreviation : this.selectedBible;
				paralelHtml += abbreviation /*+ (bible[this.selectedBible].cover.lang != undefined ? ':' + bible[this.selectedBible].cover.lang : '')*/;
				
				for (var i = 0; i < this.paralelBibleList.length; i++) {
					var bibleId = this.paralelBibleList[i];
					abbreviation = bible[bibleId].cover.abbreviation != undefined && bible[bibleId].cover.abbreviation != '' ? bible[bibleId].cover.abbreviation : bibleId;
					paralelHtml += ' | ' + abbreviation /*+ (bible[bibleId].cover.lang != undefined ? ':' + bible[bibleId].cover.lang : '')*/;
				}
				
				if (bible[this.selectedBible].cover.description != undefined && bible[this.selectedBible].cover.description != '') {
					paralelHtml += '<div class="description" style="visibility: hidden;">' + bible[this.selectedBible].cover.description + '</div>';
				}
				
				html += 
					'<div class="bible op selected' + (bible[this.selectedBible].init ? '' : ' unloaded') + '" onclick="biblePanel.selectBibleCancel()">' + 
						paralelHtml +
					'</div>';
			} else {
				var langTitle = bible[this.selectedBible].cover.lang != undefined && bible[this.selectedBible].cover.lang != '' && lang[bible[this.selectedBible].cover.lang] != undefined ? lang[bible[this.selectedBible].cover.lang]['LANGUAGE'] : '';
				var abbreviation = bible[this.selectedBible].cover.abbreviation != undefined && bible[this.selectedBible].cover.abbreviation != '' ? ' (' + bible[this.selectedBible].cover.abbreviation + ')' : '';
				html += 
					'<div class="bible op selected' + (bible[this.selectedBible].init ? '' : ' unloaded') + '" onclick="biblePanel.selectBibleCancel()">' + 
						'<span class="lang" title="' + langTitle + '">' + (bible[this.selectedBible].cover.lang != undefined ? bible[this.selectedBible].cover.lang : '') + '</span>' +
						bible[this.selectedBible].cover.title + abbreviation +
						(bible[this.selectedBible].cover.description != undefined && bible[this.selectedBible].cover.description != '' ? '<div class="description">' + bible[this.selectedBible].cover.description + '</div>' : '') +
					'</div>';
			}
		}
		var langLine = false;
		for (var part = 1; part <= 2; part++) {
			for (var bibleId in bible) {
				if (bible[bibleId].cover != undefined) {
					if ((part == 1 && bible[bibleId].cover.lang == language.getLang()) || (part == 2 && bible[bibleId].cover.lang != language.getLang())) {
						
						if (part == 2 && !langLine) {
							langLine = true;
							html += '<div style=\"border-bottom: 1px solid #000; line-height: 0; font-size: 0; padding-top: 2px; margin-bottom: 3px;\"></div>';
						}
						
						var paralelHtml = '';
						if (bibleId == this.selectedBible) {
							paralelHtml += '<span class="selectedParalel">&nbsp;&#x2713;&nbsp;</span>';
							//paralelHtml += '<span class="selectedParalel">&nbsp;&#x2714;&nbsp;</span>';
							//paralelHtml += '<span class="selectedParalel">&nbsp;&#x2611;&nbsp;</span>';
						} else if (this.paralelBibleList.indexOf(bibleId) == -1) {
							paralelHtml += '<span class="addParalel" onclick="biblePanel.addParalelBible(\'' + bibleId + '\')">&nbsp;+&nbsp;</span>';
						} else {
							paralelHtml += '<span class="removeParalel" onclick="biblePanel.removeParalelBible(\'' + bibleId + '\')">&nbsp;×&nbsp;</span>';
						}
						
						var langTitle = bible[bibleId].cover.lang != undefined && bible[bibleId].cover.lang != '' && lang[bible[bibleId].cover.lang] != undefined ? lang[bible[bibleId].cover.lang]['LANGUAGE'] : '';
						var abbreviation = bible[bibleId].cover.abbreviation != undefined && bible[bibleId].cover.abbreviation != '' ? ' (' + bible[bibleId].cover.abbreviation + ')' : '';
						html += 
							'<div class="bible op' + (bibleId == this.selectedBible || this.paralelBibleList.indexOf(bibleId) != -1 ? ' mark' : '') + (bible[bibleId].init ? '' : ' unloaded') + '" onclick="biblePanel.selectBible(\'' + bibleId + '\')">' + 
								paralelHtml +
								'<span class="info" onclick="biblePanel.bibleInfo(\'' + bibleId + '\')">&nbsp;i&nbsp;</span>' +
								'<span class="lang" title="' + langTitle + '">' + (bible[bibleId].cover.lang != undefined ? bible[bibleId].cover.lang : '') + '</span>' +
								bible[bibleId].cover.title + abbreviation +
								(bible[bibleId].cover.description != undefined && bible[bibleId].cover.description != '' ? '<div class="description">' + bible[bibleId].cover.description + '</div>' : '') +
							'</div>';
						bibleCount++;
					}
				}
			}
		}
		var bibleSelectDisable = bibleCount < 2 && this.selectedBible != '' && bible[this.selectedBible] != undefined;
		bibleSelectElement.innerHTML = '<div id="bibleSelectInner">' + html + '</div>';
		
		var sampleBible = document.getElementById('sampleBible');
		var bibleSelectInner = document.getElementById('bibleSelectInner');
		
		if (bibleOpen) {
			var bibleSelectSize = 8;
			if (bibleSelectSize > bibleCount + 1) {
				bibleSelectSize = bibleCount + 1;
			}
			bibleSelectElement.style.overflow = 'auto';
			bibleSelectElement.style.height = ((sampleBible.clientHeight * 1.45) * bibleSelectSize + 7 + 6) + 'px';
			bibleSelectElement.className = 'open';
		} else {
			bibleSelectElement.style.overflow = 'hidden';
			bibleSelectElement.style.height = (sampleBible.clientHeight) + 'px';
			bibleSelectElement.className = bibleSelectDisable ? 'disable' : 'close';
		}
	}
	
	this.isBibleOpen = function() {
		return bibleOpen;
	}
	
	this.setPreviousBible = function() {
		var prevId = false;
		for (var part = 1; part <= 2; part++) {
			for (var bibleId in bible) {
				if (bible[bibleId].cover != undefined) {
					if ((part == 1 && bible[bibleId].cover.lang == language.getLang()) || (part == 2 && bible[bibleId].cover.lang != language.getLang())) {
						if (bibleId == this.selectedBible) {
							part = 2;
							break;
						}
						prevId = bibleId;
					}
				}
			}
		}
		if (prevId !== false) {
			this.selectBible(prevId, true);
		}
	}
	
	this.setNextBible = function() {
		var nextId = false;
		var found = false;
		for (var part = 1; part <= 2; part++) {
			for (var bibleId in bible) {
				if (bible[bibleId].cover != undefined) {
					if ((part == 1 && bible[bibleId].cover.lang == language.getLang()) || (part == 2 && bible[bibleId].cover.lang != language.getLang())) {
						if (bibleId == this.selectedBible) {
							found = true;
						} else if (found) {
							nextId = bibleId;
							part = 2;
							break;
						}
					}
				}
			}
		}
		if (nextId !== false) {
			this.selectBible(nextId, true);
		}
	}
		
	this.selectBibleCancel = function() {
		if (bibleOpen) {
			bibleSelectClickCancel = true;
			this.bibleSelectUp();
		}
	}
	
	this.addParalelBible = function(bibleId) {
		if (bibleOpen) {
			bibleParalelClickCancel = true;
			if (this.paralelBibleList.indexOf(bibleId) == -1) {
				this.paralelBibleList.push(bibleId);
			}
			this.updateBibleList();
		}
	}
	
	this.removeParalelBibleItem = function(bibleId) {
		var removeIndex = this.paralelBibleList.indexOf(bibleId);
		if (removeIndex != -1) {
			var a = [];
			for (var i = 0; i < this.paralelBibleList.length; i++) {
				if (i != removeIndex) {
					a.push(this.paralelBibleList[i]);
				}
			}
			this.paralelBibleList = arrayClone(a);
		}
	}
	
	this.replaceParalelBibleItem = function(bibleId, newBibleId) {
		var removeIndex = this.paralelBibleList.indexOf(bibleId);
		if (removeIndex != -1) {
			if (newBibleId == '' || this.paralelBibleList.indexOf(newBibleId) != -1) {
				this.removeParalelBibleItem(bibleId);
			} else {
				this.paralelBibleList[removeIndex] = newBibleId;
			}
		}
	}
	
	this.removeParalelBible = function(bibleId) {
		if (bibleOpen) {
			bibleParalelClickCancel = true;
			this.removeParalelBibleItem(bibleId);
			this.updateBibleList();
		}
	}
	
	this.bibleInfo = function(bibleId) {
		if (bibleOpen) {
			bibleParalelClickCancel = true;
			var version = [];
			if (bible[bibleId].cover.version != undefined && bible[bibleId].cover.version != '') {
				version.push(bible[bibleId].cover.version);
			}
			if (bible[bibleId].cover.versionDate != undefined && bible[bibleId].cover.versionDate != '') {
				version.push(bible[bibleId].cover.versionDate);
			}
			infoBox.show(
				'<div style="text-align: left; font-size: 70%; font-weight: normal; max-height: ' + (window.innerHeight * 0.95) + 'px; overflow: auto;">' +
					'<div style="font-weight: bold; font-size: 120%;">' + bible[bibleId].cover.title + '</div>' +
					'<div>' + bible[bibleId].cover.abbreviation + '</div>' +
					'<div>' + bible[bibleId].cover.description + '</div>' +
					
					(version.length > 0 ? '<div><b>Version:</b> ' + version.join(' | ') + '</div>' : '') +
					
					(bible[bibleId].cover.publishDate != undefined && bible[bibleId].cover.publishDate != '' ? '<div><b>Publish date:</b> ' + bible[bibleId].cover.publishDate + '</div>' : '') +
					
					(bible[bibleId].cover.source != undefined && bible[bibleId].cover.source != '' ? '<div><b>Source:</b> ' + bible[bibleId].cover.source + '</div>' : '') +
					
					(bible[bibleId].cover.license != undefined && bible[bibleId].cover.license != '' ? '<div><b>License:</b> ' + bible[bibleId].cover.license + '</div>' : '') +
					
					(bible[bibleId].cover.comments != undefined && bible[bibleId].cover.comments != '' ? '<div style="border-top: 1px solid #000; padding-top: 5px; margin-top: 5px;">' + bible[bibleId].cover.comments + '</div>' : '') +
				'</div>', 0, true);
		}
	}
	
	this.selectBible = function(bibleId, changeBible) {
		if (changeBible == undefined) {
			changeBible = false;
		}
		if (bibleOpen) {
			if (bibleParalelClickCancel) {
				bibleParalelClickCancel = false;
			} else {
				this.replaceParalelBibleItem(bibleId, this.selectedBible);
				
				if (!changeBible) {
					bibleSelectClickCancel = true;
					this.bibleSelectUp();
				} else {
					biblePanel.updateBibleList();
				}
				if (this.selectedBible != bibleId) {
					this.selectedBible = bibleId;
					bibleData.loadBible(bibleId, function(){
						_this.updateBibleList();
						_this.verse1.showSelectorBlock();
						_this.verse2.showSelectorBlock();
					});
				}
			}
		}
	}

	this.bibleSelectClick = function() {
		if (!bibleOpen) {
			if (bibleSelectClickCancel) {
				bibleSelectClickCancel = false;
			} else {
				this.bibleSelectDown();
			}
		}
	}
	
	this.bibleSelectDown = function() {
		if (!bibleOpen) {
			if (bibleSelectElement.className != 'disable') {
				bibleOpen = true;
				biblePanel.updateBibleList();
			}
		}
	}
	
	this.bibleSelectUp = function() {
		if (bibleOpen) {
			bibleOpen = false;
			bibleSelectElement.scrollTop = 0;
			biblePanel.updateBibleList();
		}
	}
	
	this.isSelectedInput = function(element) {
		return element.className.indexOf(' selected') != -1;
	}
	
	this.selectInput = function(element, select) {
		if (select) {
			if (!this.isSelectedInput(element)) {
				element.className += ' selected';
			}
		} else {
			if (this.isSelectedInput(element)) {
				element.className = element.className.replace(' selected', '');
			}
		}
	}
	
	this.alertInput = function(inputElement) {
		/*if (inputElement.className.indexOf(' alert') == -1) {
			inputElement.className += ' alert';
			setTimeout(function(){
				if (inputElement.className.indexOf(' alert') != -1) {
					inputElement.className = inputElement.className.replace(' alert', '');
				}
			}, 1000);
		}*/
		if (inputElement.className.indexOf(' alert') == -1) {
			inputElement.className += ' alert';
		}
		var alertCounter = 0;
		var alertInterval = setInterval(function(){
			if (inputElement.className.indexOf(' alert') == -1) {
				inputElement.className += ' alert';
			} else {
				inputElement.className = inputElement.className.replace(' alert', '');
			}
			alertCounter++;
			if (alertCounter == 3) {
				clearInterval(alertInterval);
				if (inputElement.className.indexOf(' alert') != -1) {
					inputElement.className = inputElement.className.replace(' alert', '');
				}
			}
		}, 100);
	}
	
	this.selectVerseSelector = function(input, part, click) {
		if (click) {
			if (
				(part == 1 && input == 'book' && this.isSelectedInput(bibleBookInputElement)) ||
				(part == 1 && input == 'chapter' && this.isSelectedInput(bibleChapterInputElement)) ||
				(part == 1 && input == 'verse' && this.isSelectedInput(bibleVerseInputElement)) ||
				(part == 2 && input == 'book' && this.isSelectedInput(bibleBookInput2Element)) ||
				(part == 2 && input == 'chapter' && this.isSelectedInput(bibleChapterInput2Element)) ||
				(part == 2 && input == 'verse' && this.isSelectedInput(bibleVerseInput2Element))
			) {
				input = '';
				part = 0;
			}
		}
		
		if (part == 1 && input == 'chapter' && this.verse1.book == '') {
			this.alertInput(bibleChapterInputElement);
			return;
		}
		if (part == 1 && input == 'verse' && this.verse1.chapter == '') {
			this.alertInput(bibleVerseInputElement);
			return;
		}
		
		if (part == 2 && input == 'book' && this.verse1.verse == '') {
			this.alertInput(bibleBookInput2Element);
			return;
		}
		if (part == 2 && input == 'chapter' && this.verse2.book == '') {
			this.alertInput(bibleChapterInput2Element);
			return;
		}
		if (part == 2 && input == 'verse' && this.verse2.chapter == '') {
			this.alertInput(bibleVerseInput2Element);
			return;
		}
		
		biblePanel.clearOption = true;
		
		this.selectInput(bibleBookInputElement, part == 1 && input == 'book');
		this.selectInput(bibleChapterInputElement, part == 1 && input == 'chapter');
		this.selectInput(bibleVerseInputElement, part == 1 && input == 'verse');
		this.selectInput(bibleBookInput2Element, part == 2 && input == 'book');
		this.selectInput(bibleChapterInput2Element, part == 2 && input == 'chapter');
		this.selectInput(bibleVerseInput2Element, part == 2 && input == 'verse');
		selectorBlockElement.style.visibility = part == 0 ? 'hidden' : 'visible';
		bibleButtons.style.display = part == 0 ? 'block' : 'none';
		
		if (part == 1) {
			this.verse1.showSelectorBlock();
		}
		if (part == 2) {
			this.verse2.showSelectorBlock();
		}
	}
	
	this.isSelectedNothing = function() {
		var nothing = 
			!this.isSelectedInput(bibleBookInputElement) && !this.isSelectedInput(bibleChapterInputElement) && !this.isSelectedInput(bibleVerseInputElement) &&
			!this.isSelectedInput(bibleBookInput2Element) && !this.isSelectedInput(bibleChapterInput2Element) && !this.isSelectedInput(bibleVerseInput2Element);
		return nothing;
	}
	
	this.setEqual = function() {
		if (this.verse1.book != '' && this.verse1.chapter != '' && this.verse1.verse != '') {
			this.selectVerseSelector('book', 2);
			this.verse2.book = this.verse1.book;
			//biblePanel.verse2.keyPress({keyCode: 13, key: 'Enter', setBookText: true}, 'enter');
			biblePanel.verse2.keyPress({key: 'enter', setBookText: true});
			this.verse2.chapter = this.verse1.chapter;
			//biblePanel.verse2.keyPress({keyCode: 13, key: 'Enter'}, 'enter');
			biblePanel.verse2.keyPress({key: 'enter'});
			this.verse2.verse = this.verse1.verse;
			//biblePanel.verse2.keyPress({keyCode: 32, key: ' '}, ' ');
			biblePanel.verse2.keyPress({key: ' '});
		}
	}
	
	this.clearVerse2 = function() {
		this.verse2.book = '';
		this.verse2.chapter = '';
		this.verse2.verse = '';
		this.verse2.updateFromVariable();
		if (this.isSelectedInput(bibleBookInput2Element) || this.isSelectedInput(bibleChapterInput2Element) || this.isSelectedInput(bibleVerseInput2Element)) {
			this.selectVerseSelector('', 0);
		}
	}
	
	this.selectorBlockAutoSize = function() {
		if (document.getElementById('selectorBlockInner')) {
			var inner = document.getElementById('selectorBlockInner');
			
			var minSize = 1;
			var maxSize = 400;
			var txtHeight = selectorBlockElement.clientHeight;
			
			// legnagyobb betűméret megkeresése, ami még kifér 
			
			// felezéses keresés
			var x = 100; // számláló biztonság kedvéért, hogy semmiképpen se ragadhasson be
			while (x--) {
				var middle = minSize + Math.ceil((maxSize - minSize) / 2);
				selectorBlockElement.style.fontSize = middle + 'px';
				if (inner.clientHeight > txtHeight) {
					// nem fér ki
					maxSize = middle - 1;
				} else {
					// kifér
					minSize = middle;
				}
				if (minSize == maxSize) {
					if (middle != minSize) {
						selectorBlockElement.style.fontSize = minSize + 'px';
					}
					break;
				}
			}
			
		} else {
			selectorBlockElement.style.fontSize = '5px';
		}
	}
	
	this.submit = function() {
		//this.selectVerseSelector('book', 1);
		this.selectVerseSelector('', 0);
		//selectorBlockElement.style.visibility = 'hidden';
		
		// show verse on presenter
		// ...
	}
	
	this.playModeClick = function(sel) {
		if (!hasClass(document.getElementById(sel), 'disabled')) {
		
			for (var i = 0; i < this.playModeOptions.length; i++) {
				if (this.playModeOptions[i] == sel) {
					addClass(document.getElementById(this.playModeOptions[i]), 'selected');
				} else {
					removeClass(document.getElementById(this.playModeOptions[i]), 'selected');
				}
			}
		
			if (extended.isControllerMode()) {
				this.startPlayMode();
			} else {
				//setTimeout(function(){
					_this.startPlayMode();
				//}, 500);
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
				addClass(document.getElementById(this.playModeOptions[i]), 'disabled');
				removeClass(document.getElementById(this.playModeOptions[i]), 'selected');
			} else {
				removeClass(document.getElementById(this.playModeOptions[i]), 'disabled');
				if (this.playModeOptions[i] == sel) {
					if (sel !== null) {
						addClass(document.getElementById(this.playModeOptions[i]), 'selected');
					}
				} else {
					if (sel !== null) {
						removeClass(document.getElementById(this.playModeOptions[i]), 'selected');
					}
				}
			}
		}
	}
	
	this.getPlayMode = function() {
		for (var i = 0; i < this.playModeOptions.length; i++) {
			if (hasClass(document.getElementById(this.playModeOptions[i]), 'selected')) {
				return this.playModeOptions[i];
			}
		}
		return '';
	}
	
	this.changePlayMode = function(isFel) {
		var playModeSel = this.getPlayMode();
		var playModeArray = [];
		for (var i = 0; i < this.playModeOptions.length; i++) {
			if (!hasClass(document.getElementById(this.playModeOptions[i]), 'disabled')) {
				playModeArray.push(this.playModeOptions[i]);
			}
		}
		for (i = 0; i < playModeArray.length; i++) {
			if (playModeSel == playModeArray[i]) {
				removeClass(document.getElementById(playModeSel), 'selected');
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
				addClass(document.getElementById(playModeArray[i]), 'selected');
				break;
			}
		}
	}
	
	this.startPlayMode = function() {
		if (this.paralelBibleList.length > 0) {
			bibleData.loadBible(this.paralelBibleList, function(){
				_this.startPlayModeCase();
			});
		} else {
			this.startPlayModeCase();
		}
	}
	
	this.startPlayModeCase = function() {
		switch (this.getPlayMode()) {
			case 'biblePlayFew' :
				this.start({paging: true, itemOnPage: 0, characterOnPage: 200});
				break;
			case 'biblePlayMedium' :
				this.start({paging: true, itemOnPage: 0, characterOnPage: 400});
				break;
			case 'biblePlayMuch' :
				this.start({paging: true, itemOnPage: 0, characterOnPage: 800});
				break;
			case 'biblePlay1' :
				this.start({paging: true, itemOnPage: 1, characterOnPage: 0});
				break;
			case 'biblePlay2' :
				this.start({paging: true, itemOnPage: 2, characterOnPage: 0});
				break;
			case 'biblePlay3' :
				this.start({paging: true, itemOnPage: 3, characterOnPage: 0});
				break;
			case 'biblePlayAll' :
				this.start({paging: false, itemOnPage: 0, characterOnPage: 0});
				break;
		}
	}
	
	this.setVerseSeparator = function(value, refresh) {
		if (refresh == undefined) {
			refresh = true;
		}
		this.isVerseSeparator = value;
		if (value) {
			addClass(bibleVerseSeparatorOnElement, 'selected');
			removeClass(bibleVerseSeparatorOffElement, 'selected');
		} else {
			removeClass(bibleVerseSeparatorOnElement, 'selected');
			addClass(bibleVerseSeparatorOffElement, 'selected');
		}
		if (refresh) {
			presenter.refresh();
			storage.set('verseSeparator', this.isVerseSeparator ? '1' : '0');
		}
	}
	
	this.setHorizontalParalel = function(value, refresh) {
		if (refresh == undefined) {
			refresh = true;
		}
		this.isHorizontalParalel = value;
		if (value) {
			addClass(bibleVerseHorizontalParalelOnElement, 'selected');
			removeClass(bibleVerseHorizontalParalelOffElement, 'selected');
		} else {
			removeClass(bibleVerseHorizontalParalelOnElement, 'selected');
			addClass(bibleVerseHorizontalParalelOffElement, 'selected');
		}
		if (refresh) {
			presenter.refresh();
			storage.set('horizontalParalel', this.isHorizontalParalel ? '1' : '0');
		}
	}
	
	this.getNextVerse = function(bibleId, book, chapter, verse) {
		var lastBook = book;
		var lastChapter = chapter;
		var lastVerse = verse;
		
		verse++;
		
		// verse over, next chaptert, verse #1
		if (bible[bibleId].content[book][chapter][verse] == undefined) {
			verse = 1;
			chapter++;
		}
		
		// chapter over, next book, chapter #1
		var isOver = false;
		if (bible[bibleId].content[book][chapter] == undefined) {
			chapter = 1;
			var state = 0;
			for (var bookId in bible[bibleId].content) {
				if (state == 0 && bookId == book) {
					state = 1;
				} else if (state == 1) {
					book = bookId;
					state = 2;
					break;
				}
			}
			if (state != 2) {
				isOver = true;
				book = lastBook;
				chapter = lastChapter;
				verse = lastVerse;
			}
		}
		return {
			book: book,
			chapter: chapter,
			verse: verse,
			isOver: isOver
		};
	}
	
	this.getPreviousVerse = function(bibleId, book, chapter, verse) {
		var lastBook = book;
		var lastChapter = chapter;
		var lastVerse = verse;
		
		verse--;
		
		// verse over, next chaptert, verse #1
		if (bible[bibleId].content[book][chapter][verse] == undefined) {
			verse = false;
			chapter--;
		}
		
		// chapter over, next book, chapter #1
		var isOver = false;
		if (bible[bibleId].content[book][chapter] == undefined) {
			chapter = false;
			var lastBookId = false;
			for (var bookId in bible[bibleId].content) {
				if (bookId == book) {
					break;
				}
				lastBookId = bookId;
			}
			if (lastBookId === false) {
				isOver = true;
				book = lastBook;
				chapter = lastChapter;
				verse = lastVerse;
			} else {
				book = lastBookId;
			}
		}
		
		if (chapter === false) {
			for (var chapterId in bible[bibleId].content[book]) {
				chapter = chapterId;
			}
		}
		
		if (verse === false) {
			for (var verseId in bible[bibleId].content[book][chapter]) {
				verse = verseId;
			}
		}
		
		return {
			book: book,
			chapter: chapter,
			verse: verse,
			isOver: isOver
		};
	}
	
	this.getPageVerses = function(bibleId, book, chapter, verse, toBook, toChapter, toVerse, itemOnPage, characterOnPage, isUnlimited, isReverse) {
		var verses = [];
		//chapter = parseInt(chapter, 10);
		//verse = parseInt(verse, 10);
		if (bibleId != '' && book != '' && !isNaN(chapter) && chapter > 0 && !isNaN(verse) && verse > 0) {
			var bf = [];
			var blockLength = 0;
			while (true) {
				var verseLength = bible[bibleId].content[book][chapter][verse].length;
				blockLength += verseLength;
				
				if (itemOnPage > 0 && bf.length >= itemOnPage) {
					if (isUnlimited) {
						return [bf];
					}
					verses.push(bf);
					bf = [];
					blockLength = verseLength;
				} else if (characterOnPage > 0) {
					if (bf.length > 0 && blockLength > characterOnPage) {
						if (isUnlimited) {
							return [bf];
						}
						verses.push(bf);
						bf = [];
						blockLength = verseLength;
					}
				}
				
				if (isReverse) {
					bf.unshift([book, chapter, verse]);
				} else {
					bf.push([book, chapter, verse]);
				}
				/*if (!isUnlimited) {
					if (toBook == '' || toChapter == '' || toVerse == '') {
						break;
					}
					if (book == toBook && chapter == toChapter && verse == toVerse) {
						break;
					}
				}*/
				if (toBook != '' && toChapter != '' && toVerse != '' && book == toBook && chapter == toChapter && verse == toVerse) {
					break;
				}
				
				// next verse
				var nextVerse;
				if (isReverse) {
					nextVerse = this.getPreviousVerse(bibleId, book, chapter, verse);
				} else {
					nextVerse = this.getNextVerse(bibleId, book, chapter, verse);
				}
				book = nextVerse.book;
				chapter = nextVerse.chapter;
				verse = nextVerse.verse;
				if (nextVerse.isOver) {
					// book over, exit
					break;
				}

			}
			if (bf.length > 0) {
				if (isUnlimited) {
					return [bf];
				}
				verses.push(bf);
			}
		}
		return verses;
	}
	
	this.incDecSelectedBook = function(bookPart, add) {
		if (bookPart != 0 && this.selectedBible != undefined && bible[this.selectedBible] != undefined && bible[this.selectedBible].cover != undefined && bible[this.selectedBible].cover.book != undefined) {
			var selBook = bookPart == 1 ? this.verse1.book : this.verse2.book;
			var firstBook = false;
			var lastBook = false;
			var prevBook = false;
			var nextBook = false;
			var found = 0;
			for (var bookId in bible[this.selectedBible].cover.book) {
				if (firstBook === false) {
					firstBook = bookId;
				}
				if (bookId == selBook) {
					found = 1;
				} else if (found < 2) {
					if (found == 1) {
						nextBook = bookId;
						found = 2;
					} else {
						prevBook = bookId;
					}
				}
				lastBook = bookId;
			}
			if (found == 0) {
				nextBook = firstBook;
			}
			if (prevBook === false) {
				prevBook = lastBook;
			}
			if (nextBook === false) {
				nextBook = firstBook;
			}
			if (nextBook !== false && prevBook !== false) {
				if (bookPart == 1) {
					this.verse1.book = add ? nextBook : prevBook;
					//this.verse1.keyPress({keyCode: 0, key: '', setBookText: true}, '');
					this.verse1.keyPress({key: '', setBookText: true});
				} else {
					this.verse2.book = add ? nextBook : prevBook;
					//this.verse2.keyPress({keyCode: 0, key: '', setBookText: true}, '');
					this.verse2.keyPress({key: '', setBookText: true});
				}
			}
		}
	}
	
	this.incDecSelectedChapter = function(chapterPart, add) {
		if (chapterPart != 0 && this.selectedBible != undefined && bible[this.selectedBible] != undefined && bible[this.selectedBible].content != undefined) {
			var selBook = chapterPart == 1 ? this.verse1.book : this.verse2.book;
			var selChapter = chapterPart == 1 ? this.verse1.chapter : this.verse2.chapter;
			if (bible[this.selectedBible].content[selBook] != undefined) {
				var firstChapter = false;
				var lastChapter = false;
				var prevChapter = false;
				var nextChapter = false;
				var found = 0;
				for (var chapter in bible[this.selectedBible].content[selBook]) {
					if (firstChapter === false) {
						firstChapter = chapter;
					}
					if (chapter == selChapter) {
						found = 1;
					} else if (found < 2) {
						if (found == 1) {
							nextChapter = chapter;
							found = 2;
						} else {
							prevChapter = chapter;
						}
					}
					lastChapter = chapter;
				}
				if (found == 0) {
					nextChapter = firstChapter;
				}
				if (prevChapter === false) {
					prevChapter = lastChapter;
				}
				if (nextChapter === false) {
					nextChapter = firstChapter;
				}
				if (nextChapter !== false && prevChapter !== false) {
					if (chapterPart == 1) {
						this.verse1.chapter = add ? nextChapter : prevChapter;
						//this.verse1.keyPress({keyCode: 0, key: ' '}, ' ');
						this.verse1.keyPress({key: ' '});
					} else {
						this.verse2.chapter = add ? nextChapter : prevChapter;
						//this.verse2.keyPress({keyCode: 0, key: ' '}, ' ');
						this.verse2.keyPress({key: ' '});
					}
				}
			}
		}
	}
	
	this.incDecSelectedVerse = function(versePart, add) {
		if (versePart != 0 && this.selectedBible != undefined && bible[this.selectedBible] != undefined && bible[this.selectedBible].content != undefined) {
			var selBook = versePart == 1 ? this.verse1.book : this.verse2.book;
			var selChapter = versePart == 1 ? this.verse1.chapter : this.verse2.chapter;
			var selVerse = versePart == 1 ? this.verse1.verse : this.verse2.verse;
			if (bible[this.selectedBible].content[selBook] != undefined && bible[this.selectedBible].content[selBook][selChapter] != undefined) {
				var firstVerse = false;
				var lastVerse = false;
				var prevVerse = false;
				var nextVerse = false;
				var found = 0;
				for (var verse in bible[this.selectedBible].content[selBook][selChapter]) {
					if (firstVerse === false) {
						firstVerse = verse;
					}
					if (verse == selVerse) {
						found = 1;
					} else if (found < 2) {
						if (found == 1) {
							nextVerse = verse;
							found = 2;
						} else {
							prevVerse = verse;
						}
					}
					lastVerse = verse;
				}
				if (found == 0) {
					nextVerse = firstVerse;
				}
				if (prevVerse === false) {
					prevVerse = lastVerse;
				}
				if (nextVerse === false) {
					nextVerse = firstVerse;
				}
				if (nextVerse !== false && prevVerse !== false) {
					if (versePart == 1) {
						this.verse1.verse = add ? nextVerse : prevVerse;
						//this.verse1.keyPress({keyCode: 0, key: ' '}, ' ');
						this.verse1.keyPress({key: ' '});
					} else {
						this.verse2.verse = add ? nextVerse : prevVerse;
						//this.verse2.keyPress({keyCode: 0, key: ' '}, ' ');
						this.verse2.keyPress({key: ' '});
					}
				}
			}
		}
	}
	
	this.start = function(options) {
		
		if (this.verse1.book == '' || this.verse1.chapter == '' || this.verse1.verse == '') {
			return;
		}
		
		presenter.playPanel = 'bible';
		
		if (this.verse2.book == '' || this.verse2.chapter == '' || this.verse2.verse == '') {
			this.verse2.book = '';
			this.verse2.chapter = '';
			this.verse2.verse = '';
			this.verse2.updateFromVariable();
		}
		
		this.playBible = this.selectedBible;
		
		this.playBook = this.verse1.book;
		this.playChapter = parseInt(this.verse1.chapter, 10);
		if (isNaN(this.playChapter)) {
			this.playChapter = 0;
		}
		this.playVerse = parseInt(this.verse1.verse, 10);
		if (isNaN(this.playVerse)) {
			this.playVerse = 0;
		}
		
		this.playBook2 = this.verse2.book;
		this.playChapter2 = parseInt(this.verse2.chapter, 10);
		if (isNaN(this.playChapter2)) {
			this.playChapter2 = 0;
		}
		this.playVerse2 = parseInt(this.verse2.verse, 10);
		if (isNaN(this.playVerse2)) {
			this.playVerse2 = 0;
		}
		
		this.playVerses = [];
		this.playIndex = 0;
		
		this.playPaging = options.paging ? true : false;
		this.playItemOnPage = options.itemOnPage > 0 ? options.itemOnPage : 0;
		this.playCharacterOnPage = options.characterOnPage > 0 ? options.characterOnPage : 0;
		if (!this.playPaging) {
			this.playItemOnPage = 0;
			this.playCharacterOnPage = 2000;
		}
		
		var isUnlimited = this.isUnlimitedPaging();
		if (isUnlimited) {
			this.playPaging = false;
		}
		
		this.playVerses = this.getPageVerses(this.playBible,
			this.playBook, this.playChapter, this.playVerse,
			this.playBook2, this.playChapter2, this.playVerse2,
			this.playItemOnPage, this.playCharacterOnPage,
			isUnlimited, false);
		
		// if too mutch data in one page at not paging mode: switch to paging mode
		if (!this.playPaging && this.playVerses.length > 1) {
			this.playPaging = true;
		}
		
		if (!extended.isControllerMode()) {
			presenter.toggleFullScreen(true);
		}
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
		
		//pauseButtonElement.style.display = '';
		//pauseButtonElement.style.visibility = _this.musicEnabled ? 'visible' : 'hidden';
		infoContentElement.style.display = '';
		//continueButtonElement.style.visibility = 'visible';
		
		presenter.refresh();
		presenter.resizeDisplay();
	}
	
	this.isUnlimitedPaging = function() {
		return this.playBook2 == '' && this.playChapter2 == 0 && this.playVerse2 == 0;
	}
	
	this.previous = function(toggleFullScreenAtFirstPage) {
		if (this.isUnlimitedPaging()) {
			var previousVerse = this.getPreviousVerse(this.playBible, this.playBook, this.playChapter, this.playVerse);
			if (!previousVerse.isOver) {
				this.playVerses = this.getPageVerses(this.playBible,
					previousVerse.book, previousVerse.chapter, previousVerse.verse,
					'', 0, 0,
					this.playItemOnPage, this.playCharacterOnPage,
					true, true);
				this.playBook = this.playVerses[0][0][0];
				this.playChapter = this.playVerses[0][0][1];
				this.playVerse = this.playVerses[0][0][2];
				this.updateSelectorPosFromPlayPos();
				presenter.refresh();
			}
		} else {
			if (this.playIndex > 0) {
				this.playIndex--;
				presenter.refresh();
			} else if (toggleFullScreenAtFirstPage) {
				presenter.toggleFullScreen();
			}
		}
	}
	
	this.next = function() {
		if (this.isUnlimitedPaging()) {
			var bf = this.playVerses[this.playVerses.length - 1];
			var book2 = bf[bf.length - 1][0];
			var chapter2 = bf[bf.length - 1][1];
			var verse2 = bf[bf.length - 1][2];;
			var nextVerse = this.getNextVerse(this.playBible, book2, chapter2, verse2);
			if (!nextVerse.isOver) {
				this.playBook = nextVerse.book;
				this.playChapter = nextVerse.chapter;
				this.playVerse = nextVerse.verse;
				this.playVerses = this.getPageVerses(this.playBible,
					this.playBook, this.playChapter, this.playVerse,
					'', 0, 0,
					this.playItemOnPage, this.playCharacterOnPage,
					true, false);
				this.updateSelectorPosFromPlayPos();
				presenter.refresh();
			}
		} else {
			if (this.playIndex < this.playVerses.length) {
				this.playIndex++;
				presenter.refresh();
			}
		}
	}
	
	this.updateSelectorPosFromPlayPos = function() {
		this.verse1.book = this.playBook;
		this.verse1.chapter = this.playChapter != 0 ? this.playChapter : '';
		this.verse1.verse = this.playVerse != 0 ? this.playVerse : '';
		this.verse1.updateFromVariable();
		
		this.verse2.book = this.playBook2;
		this.verse2.chapter = this.playChapter2 != 0 ? this.playChapter2 : '';
		this.verse2.verse = this.playVerse2 != 0 ? this.playVerse2 : '';
		this.verse2.updateFromVariable();
	}
	
	this.setDefaultBible = function() {
		if (DEFAULT_BIBLE !== false && DEFAULT_BIBLE != '' && bible[DEFAULT_BIBLE] != undefined) {
			this.selectedBible = DEFAULT_BIBLE;
			return;
		}
		for (var bibleId in bible) {
			if (bible[bibleId].cover != undefined && bible[bibleId].cover.lang != undefined && bible[bibleId].cover.lang == language.getLang()) {
				this.selectedBible = bibleId;
				return;
			}
		}
		for (var bibleId in bible) {
			if (bible[bibleId].cover.lang == 'en') {
				this.selectedBible = bibleId;
				return;
			}
		}
		for (var bibleId in bible) {
			this.selectedBible = bibleId;
			return;
		}
		this.selectedBible = '';
	}
	
	this.updateBiblePanel = function() {
		if (this.selectedBible == '') {
			this.setDefaultBible();
		}
		this.updateBibleList();
		if (this.selectedBible != '') {
			bibleData.loadBible(this.selectedBible, function(){
				_this.updateBibleList();
				_this.verse1.showSelectorBlock();
				_this.verse2.showSelectorBlock();
			});
		}
		
		this.setVerseSeparator(this.isVerseSeparator, false);
		this.setHorizontalParalel(this.isHorizontalParalel, false);
	}
	
	this.updateBibleList();
	
	this.verse1 = new BibleSelector(1, bibleBookElement, bibleBookInputElement, bibleChapterElement, bibleChapterInputElement, bibleVerseElement, bibleVerseInputElement, function(){
		// done: go book of second part
		_this.selectInput(bibleBookInput2Element, true);
		_this.verse2.showSelectorBlock();
	}, function(){
		// back:
	});
	
	this.verse2 = new BibleSelector(2, bibleBook2Element, bibleBookInput2Element, bibleChapter2Element, bibleChapterInput2Element, bibleVerse2Element, bibleVerseInput2Element, function(){
		// done: go book of first part
		//_this.selectInput(bibleBookInputElement, true);
		//_this.verse1.showSelectorBlock();
		_this.submit();
	}, function(){
		// back: go verse of first part
		_this.selectVerseSelector('verse', 1);
	});
	
	this.selectInput(bibleBookInputElement, true);
	
	var lastVerseSeparator = storage.get('verseSeparator');
	if (lastVerseSeparator === '0') {
		this.isVerseSeparator = false;
	} else if (lastVerseSeparator === '1') {
		this.isVerseSeparator = true;
	}
	
	var lastHorizontalParalel = storage.get('horizontalParalel');
	if (lastHorizontalParalel === '0') {
		this.isHorizontalParalel = false;
	} else if (lastHorizontalParalel === '1') {
		this.isHorizontalParalel = true;
	}
	
}
