// flags: https://gallery.yopriceville.com/National-Flags

var flagElement = document.getElementById('flag');
var languageWindowElement = document.getElementById('languageWindow');
var languageSelectorElement = document.getElementById('languageSelector');

var lang = {};
var tr;

var language;

function Language(onLoadCallbackFn) {
	var selectedLang = '';
	var defaultLang = 'en';
	
	this.getLang = function() {
		return selectedLang;
	}

	this.tr = function(str) {
		var defaultText = undefined;
		if (Array.isArray(str)) {
			if (str.length > 1) {
				defaultText = str[1];
			}
			str = str[0];
		}
		if (selectedLang != '' && lang[selectedLang] != undefined && lang[selectedLang][str] != undefined) {
			return lang[selectedLang][str];
		}
		if (lang[defaultLang] != undefined && lang[defaultLang][str] != undefined) {
			return lang[defaultLang][str];
		}
		if (defaultText != undefined) {
			return defaultText;
		}
		return str;
	}
	
	window.tr = this.tr;

	function updateLangText(langId) {
		if (langId == undefined) {
			updateLangText(defaultLang);
			langId = selectedLang;
		}
		if (langId != '' && lang[langId] != undefined) {
			for (var trLangId in lang[langId]) {
				if (trLangId != 'BOOKS') {
					var items = document.getElementsByClassName('tr_' + trLangId);
					for (var i = 0; i < items.length; i++) {
						items[i].innerHTML = lang[langId][trLangId];
					}
					items = document.getElementsByClassName('tr_title_' + trLangId);
					for (var i = 0; i < items.length; i++) {
						items[i].title = lang[langId][trLangId];
					}
				}
			}
			
			flagElement.title = lang[langId]['LANGUAGE'] != undefined ? lang[langId]['LANGUAGE'] : langId;
			flagElement.src = 'languages/' + langId + '.png';
			if (lang[langId]['AppName'] != undefined) {
				document.title = lang[langId]['AppName'];
			}
		}
	}

	this.show = function() {
		languageWindowElement.style.display = '';
		var html = '';
		var first = true;
		for (var langId in lang) {
			var src = 'languages/' + langId + '.png';
			html += 
				'<div class="button' + (langId == selectedLang ? ' selected' : '') + '" style="margin-top: ' + (first ? 0 : 20) + 'px; text-align: left;" onclick="language.setLang(\'' + langId + '\')">' +
					'<img src="' + src + '" alt="' + langId + '" style="box-shadow: 0 0 4px #000; margin-right: 15px; vertical-align: middle;" >' +
					'<span style="vertical-align: middle;">' + lang[langId]['LANGUAGE'] + '</span>' +
				'</div>';
			first = false;
		}
		languageSelectorElement.innerHTML = html;
	}

	this.close = function() {
		languageWindowElement.style.display = 'none';
	}
	
	this.setLang = function(langId) {
		selectedLang = langId;
		this.show();
		var _this = this;
		setTimeout(function(){
			_this.close();
			updateLangText();
			app.fireEvent('changeLanguage');
			panel.updateList();
			songPanel.updateSongPanel();
			presenter.updateMainWindow();
			presenter.refresh();
			presenter.resizeDisplay();
		}, 200);
	}

	// init languages
	function langInit() {
		var navigatorLang = navigator.language;
		if (navigatorLang == undefined) {
			navigatorLang = '';
		}
		navigatorLang = navigatorLang.split('-');
		navigatorLang = navigatorLang[0].toLowerCase();
		
		for (var langId in lang) {
			if (lang[langId]['ISO'] == navigatorLang) {
				selectedLang = langId;
				break;
			}
		}
		if (selectedLang == '') {
			selectedLang = navigatorLang;
		}
		
		if (selectedLang == '' || lang[selectedLang] == undefined) {
			selectedLang = '';
			for (var langId in lang) {
				selectedLang = langId;
				break;
			}
		}
		
		updateLangText();
		
		onLoadCallbackFn();
	}

	function langLoadedCallback(isSuccess, loadedLangId) {
		lang[loadedLangId].init = isSuccess;
		for (var langId in lang) {
			if (lang[langId].init == undefined) {
				return;
			}
		}
		langInit();
	}

	function langLoading() {
		app.loadScript('languages/_languages', function(isSuccess){
			if (isSuccess) {
				for (var langId in lang) {
					app.loadScript('languages/' + langId, langLoadedCallback, langId);
				}
			} else {
				// No languages
				langInit();
			}
		});
	}
	
	langLoading();
}
