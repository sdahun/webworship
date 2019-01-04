var BIBLES_VERSION = 'none';
var DEFAULT_BIBLE = '';
var bible = {};

app.addEvent('changeLanguage', function(){
	for (var bibleId in bible) {
		bibleData.updateBookInfo(bibleId);
	}
	biblePanel.verse1.showSelectorBlock();
	biblePanel.verse2.showSelectorBlock();
});

var bibleData;

function BibleData() {
	var loadList = {};
	
	var _this = this;
	
	var books = {
		1: { name: 'Genesis', short: 'Gen', color: '#adf' },
		2: { name: 'Exodus', short: 'Ex', color: '#adf' },
		3: { name: 'Leviticus', short: 'Lev', color: '#adf' },
		4: { name: 'Numbers', short: 'Num', color: '#adf' },
		5: { name: 'Deuteronomy', short: 'Deut', color: '#adf' },
		6: { name: 'Joshua', short: 'Josh', color: '#fc8' },
		7: { name: 'Judges', short: 'Judg', color: '#fc8' },
		8: { name: 'Ruth', short: 'Ruth', color: '#fc8' },
		9: { name: '1Samuel', short: '1Sam', color: '#fc8' },
		10: { name: '2Samuel', short: '2Sam', color: '#fc8' },
		11: { name: '1Kings', short: '1Kings', color: '#fc8' },
		12: { name: '2Kings', short: '2Kings', color: '#fc8' },
		13: { name: '1Chronicles', short: '1Chron', color: '#fc8' },
		14: { name: '2Chronicles', short: '2Chron', color: '#fc8' },
		15: { name: 'Ezra', short: 'Ezra', color: '#fc8' },
		16: { name: 'Nehemiah', short: 'Neh', color: '#fc8' },
		17: { name: 'Esther', short: 'Est', color: '#fc8' },
		18: { name: 'Job', short: 'Job', color: '#9f9' },
		19: { name: 'Psalms', short: 'Ps', color: '#9f9' },
		20: { name: 'Proverbs', short: 'Prov', color: '#9f9' },
		21: { name: 'Ecclesiastes', short: 'Eccles', color: '#9f9' },
		22: { name: 'SongOfSongs', short: 'Song', color: '#9f9' },
		23: { name: 'Isaiah', short: 'Isa', color: '#f9f' },
		24: { name: 'Jeremiah', short: 'Jer', color: '#f9f' },
		25: { name: 'Lamentations', short: 'Lam', color: '#f9f' },
		26: { name: 'Ezekiel', short: 'Ezek', color: '#f9f' },
		27: { name: 'Daniel', short: 'Dan', color: '#f9f' },
		28: { name: 'Hosea', short: 'Hos', color: '#ffa' },
		29: { name: 'Joel', short: 'Joel', color: '#ffa' },
		30: { name: 'Amos', short: 'Amos', color: '#ffa' },
		31: { name: 'Obadiah', short: 'Obad', color: '#ffa' },
		32: { name: 'Jonah', short: 'Jonah', color: '#ffa' },
		33: { name: 'Micah', short: 'Mic', color: '#ffa' },
		34: { name: 'Nahum', short: 'Nah', color: '#ffa' },
		35: { name: 'Habakkuk', short: 'Hab', color: '#ffa' },
		36: { name: 'Zephaniah', short: 'Zeph', color: '#ffa' },
		37: { name: 'Haggai', short: 'Hag', color: '#ffa' },
		38: { name: 'Zechariah', short: 'Zech', color: '#ffa' },
		39: { name: 'Malachi', short: 'Mal', color: '#ffa' },
		40: { name: 'Matthew', short: 'Matt', color: '#f80' },
		41: { name: 'Mark', short: 'Mark', color: '#f80' },
		42: { name: 'Luke', short: 'Luke', color: '#f80' },
		43: { name: 'John', short: 'John', color: '#f80' },
		44: { name: 'Acts', short: 'Acts', color: '#8af' },
		45: { name: 'Romans', short: 'Rom', color: '#ff2' },
		46: { name: '1Corinthians', short: '1Cor', color: '#ff2' },
		47: { name: '2Corinthians', short: '2Cor', color: '#ff2' },
		48: { name: 'Galatians', short: 'Gal', color: '#ff2' },
		49: { name: 'Ephesians', short: 'Eph', color: '#ff2' },
		50: { name: 'Philippians', short: 'Phil', color: '#ff2' },
		51: { name: 'Colossians', short: 'Col', color: '#ff2' },
		52: { name: '1Thessalonians', short: '1Thess', color: '#ff2' },
		53: { name: '2Thessalonians', short: '2Thess', color: '#ff2' },
		54: { name: '1Timothy', short: '1Tim', color: '#ff2' },
		55: { name: '2Timothy', short: '2Tim', color: '#ff2' },
		56: { name: 'Titus', short: 'Titus', color: '#ff2' },
		57: { name: 'Philemon', short: 'Philem', color: '#ff2' },
		58: { name: 'Hebrews', short: 'Heb', color: '#2f2' },
		59: { name: 'James', short: 'James', color: '#2f2' },
		60: { name: '1Peter', short: '1Pet', color: '#2f2' },
		61: { name: '2Peter', short: '2Pet', color: '#2f2' },
		62: { name: '1John', short: '1John', color: '#2f2' },
		63: { name: '2John', short: '2John', color: '#2f2' },
		64: { name: '3John', short: '3John', color: '#2f2' },
		65: { name: 'Jude', short: 'Jude', color: '#2f2' },
		66: { name: 'Revelation', short: 'Rev', color: '#8af' }
	};
	
	var defaultBookTranslation = {
		"Genesis": { title: "Genesis", short: "Gen." },
		"Exodus": { title: "Exodus", short: "Ex." },
		"Leviticus": { title: "Leviticus", short: "Lev." },
		"Numbers": { title: "Numbers", short: "Num." },
		"Deuteronomy": { title: "Deuteronomy", short: "Deut." },
		"Joshua": { title: "Joshua", short: "Josh." },
		"Judges": { title: "Judges", short: "Judg." },
		"Ruth": { title: "Ruth", short: "Ruth" },
		"1Samuel": { title: "1 Samuel", short: "1 Sam." },
		"2Samuel": { title: "2 Samuel", short: "2 Sam." },
		"1Kings": { title: "1 Kings", short: "1 Kings" },
		"2Kings": { title: "2 Kings", short: "2 Kings" },
		"1Chronicles": { title: "1 Chronicles", short: "1 Chron." },
		"2Chronicles": { title: "2 Chronicles", short: "2 Chron." },
		"Ezra": { title: "Ezra", short: "Ezra" },
		"Nehemiah": { title: "Nehemiah", short: "Neh." },
		"Esther": { title: "Esther", short: "Est." },
		"Job": { title: "Job", short: "Job" },
		"Psalms": { title: "Psalms", short: "Ps." },
		"Proverbs": { title: "Proverbs", short: "Prov." },
		"Ecclesiastes": { title: "Ecclesiastes", short: "Eccles." },
		"SongOfSongs": { title: "Song of Songs", short: "Song" },
		"Isaiah": { title: "Isaiah", short: "Isa." },
		"Jeremiah": { title: "Jeremiah", short: "Jer." },
		"Lamentations": { title: "Lamentations", short: "Lam." },
		"Ezekiel": { title: "Ezekiel", short: "Ezek." },
		"Daniel": { title: "Daniel", short: "Dan." },
		"Hosea": { title: "Hosea", short: "Hos." },
		"Joel": { title: "Joel", short: "Joel" },
		"Amos": { title: "Amos", short: "Amos" },
		"Obadiah": { title: "Obadiah", short: "Obad." },
		"Jonah": { title: "Jonah", short: "Jonah" },
		"Micah": { title: "Micah", short: "Mic." },
		"Nahum": { title: "Nahum", short: "Nah." },
		"Habakkuk": { title: "Habakkuk", short: "Hab." },
		"Zephaniah": { title: "Zephaniah", short: "Zeph." },
		"Haggai": { title: "Haggai", short: "Hag." },
		"Zechariah": { title: "Zechariah", short: "Zech." },
		"Malachi": { title: "Malachi", short: "Mal." },
		"Matthew": { title: "Matthew", short: "Matt." },
		"Mark": { title: "Mark", short: "Mark" },
		"Luke": { title: "Luke", short: "Luke" },
		"John": { title: "John", short: "John" },
		"Acts": { title: "Acts", short: "Acts" },
		"Romans": { title: "Romans", short: "Rom." },
		"1Corinthians": { title: "1 Corinthians", short: "1 Cor." },
		"2Corinthians": { title: "2 Corinthians", short: "2 Cor." },
		"Galatians": { title: "Galatians", short: "Gal." },
		"Ephesians": { title: "Ephesians", short: "Eph." },
		"Philippians": { title: "Philippians", short: "Phil." },
		"Colossians": { title: "Colossians", short: "Col." },
		"1Thessalonians": { title: "1 Thessalonians", short: "1 Thess." },
		"2Thessalonians": { title: "2 Thessalonians", short: "2 Thess." },
		"1Timothy": { title: "1 Timothy", short: "1 Tim." },
		"2Timothy": { title: "2 Timothy", short: "2 Tim." },
		"Titus": { title: "Titus", short: "Titus" },
		"Philemon": { title: "Philemon", short: "Philem." },
		"Hebrews": { title: "Hebrews", short: "Heb." },
		"James": { title: "James", short: "James" },
		"1Peter": { title: "1 Peter", short: "1 Pet." },
		"2Peter": { title: "2 Peter", short: "2 Pet." },
		"1John": { title: "1 John", short: "1 John" },
		"2John": { title: "2 John", short: "2 John" },
		"3John": { title: "3 John", short: "3 John" },
		"Jude": { title: "Jude", short: "Jude" },
		"Revelation": { title: "Revelation", short: "Rev." }
	};
	
	this.booksByName = {};
	for (var bookId in books) {
		this.booksByName[books[bookId].name] = books[bookId];
	}
	
	function loadBibleIndicator(onLoadFn) {
		var loadCount = 0;
		var loadDone = 0;
		var loadError = [];
		for (var bibleId in loadList) {
			loadCount++;
			if (loadList[bibleId] === true) {
				loadDone++;
			} else if (loadList[bibleId] === false) {
				loadDone++;
				loadError.push(bibleId);
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
				html += '<span style="color: #f00;">' + tr('LoadingBibleError');
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
	
	this.updateBookInfo = function(bibleId) {
		var bookTranslation = tr(['BOOKS', defaultBookTranslation]);
		if (bible[bibleId].cover.book == undefined) {
			bible[bibleId].cover.book = {};
		}
		for (var bookId in bookTranslation) {
			//if (bible[bibleId].cover.book[bookId] == undefined && bible[bibleId].content[bookId] != undefined) {
				bible[bibleId].cover.book[bookId] = objectClone(bookTranslation[bookId]);
			//}
		}
	}
	
	this.loadBible = function(bibleId, onLoadFn) {
		if (bibleId === '') {
			for (var bId in bible) {
				if (bId != '' && loadList[bId] === undefined && bible[bId].init == undefined) {
					loadList[bId] = null;
				}
			}
		} else if (Array.isArray(bibleId)) {
			for (var i = 0; i < bibleId.length; i++) {
				if (bibleId[i] != '' && loadList[bibleId[i]] === undefined && bible[bibleId[i]].init == undefined) {
					loadList[bibleId[i]] = null;
				}
			}
		} else {
			if (loadList[bibleId] === undefined && bible[bibleId].init == undefined) {
				loadList[bibleId] = null;
			}
		}
		loadBibleIndicator(onLoadFn);
		for (var bibleId in loadList) {
			if (loadList[bibleId] === null) {
				app.loadScript('bible/' + bibleId + '.content', function(isSuccess, bibleId){
					_this.updateBookInfo(bibleId);
					if (isSuccess) {
						loadList[bibleId] = true;
						bible[bibleId].init = true;
						biblePanel.updateBibleList();
						
						loadBibleIndicator(onLoadFn);
					} else {
						loadList[bibleId] = false;
						
						loadBibleIndicator(onLoadFn);
					}
				}, bibleId);
			}
		}
	}
	
	function bibleCoverOnLoad(bibleId, isSuccess) {
		bible[bibleId].coverInit = isSuccess;
		app.fireEvent('loadBibleCover');
		
		for (var bId in bible) {
			if (bible[bId].coverInit == undefined) {
				return;
			}
		}
		/*if (panel.getSelected() == 'bible') {
			biblePanel.updateBiblePanel();
		}*/
		panel.updatePanel('bible');
	}
	
	this.formatText = function(str) {
		// info: https://www.mysword.info/modules-format#Bibletags
		str = str.replace(/\<RF\>/g, '<span class="bibleRf">').replace(/\<RF\>/g, '</span>');
		str = str.replace(/\<FI\>/g, '<span class="bibleI">').replace(/\<Fi\>/g, '</span>');
		str = str.replace(/\<FR\>/g, '<span class="bibleR">').replace(/\<Fr\>/g, '</span>');
		str = str.replace(/\<TS\>/g, '<span class="bibleTs">').replace(/\<Ts\>/g, '</span>');
		str = str.replace(/\<CM\>/g, '<span class="bibleCM"></span>');
		
		str = str.replace(/\<WH([^>]+)\>/g, '<span class="WH" onclick="WH(\'H$1\')">H$1</span>');
		str = str.replace(/\<WG([^>]+)\>/g, '<span class="WG" onclick="WG(\'G$1\')">G$1</span>');
	
		/*var p = 0, pp;
		while (true) {
			p = strpos(str, '<WH', p);
			if (p == -1) {
				break;
			}
			pp = strpos(str, '>', p + 3);
			if (pp != -1) {
				str = 
			} else {
				p += 3;
			}
		}*/
		
		return str;
	}
	
	if (!extended.isDisplayMode()) {
		app.loadScript('bible/_bibles', function(isSuccess) {
			if (isSuccess) {
				for (var bibleId in bible) {
					app.loadScript('bible/' + bibleId + '.cover', function(isSuccess, onLoadBibleId) {
						bibleCoverOnLoad(onLoadBibleId, isSuccess);
					}, bibleId);
				}
			}
		});
	}
}
