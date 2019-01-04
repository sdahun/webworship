var presenterElement = document.getElementById('presenter');
var backgroundElement = document.getElementById('background');
var themeWindowElement = document.getElementById('themeWindow');
var themePictureElement = document.getElementById('themePicture');
var themeTextElement = document.getElementById('themeText');
var themePictureSelectElement = document.getElementById('themePictureSelect');
var themeDarkTextButtonElement = document.getElementById('themeDarkTextButton');
var themeLightTextButtonElement = document.getElementById('themeLightTextButton');

var PICTURES_VERSION = 'none';
var picture = {};

var theme;

function Theme() {
	this.highlightedColor = '#ff0';
	
	var themeDarkTextButtonOrigClass = themeDarkTextButtonElement.className;
	var themeLightTextButtonOrigClass = themeLightTextButtonElement.className;
	
	var _this = this;
	
	this.show = function() {
		themeWindowElement.style.display = '';
		var html = '';
		var themePic = themePictureElement.value;
		for (var pictureId in picture) {
			var src = 'pictures/' + pictureId + '-ic.jpg';
			html += '<img src="' + src + '" alt="' + pictureId + '" style="float: left; box-shadow: ' + (pictureId == themePic ? '0 0 2px 3px #e00' : '0 0 4px #000') + '; margin: 5px; width: 160px; height: 120px; cursor: pointer;" onclick="theme.setPicture(\'' + pictureId + '\')">';
		}
		html += '<div class="clear"></div>';
		themePictureSelectElement.innerHTML = html;
		
		var themeTxt = themeTextElement.value;
		themeDarkTextButtonElement.className = themeDarkTextButtonOrigClass + (themeTxt == 'sotet' ? ' selected' : '');
		themeLightTextButtonElement.className = themeLightTextButtonOrigClass + (themeTxt == 'vilagos' ? ' selected' : '');
	}

	this.close = function() {
		themeWindowElement.style.display = 'none';
	}

	this.setPicture = function(pictureId) {
		themePictureElement.value = pictureId;
		this.changeTheme('pic');
		this.show();
	}

	this.setDarkText = function() {
		themeTextElement.value = 'sotet';
		this.changeTheme('txt');
		this.show();
	}

	this.setLightText = function() {
		themeTextElement.value = 'vilagos';
		this.changeTheme('txt');
		this.show();
	}

	function setBackgroundAndStyle(options) {
	
		/* defaults:
		{
			szoveg: '#fff',
			kiemelt: '#ff0',
			hatter: '#444',
			kep: '',
			alfa: 1,
			mainWindow: '#753'
		}
		{
			szoveg: '#000',
			kiemelt: '#880',
			hatter: '#fff',
			kep: '',
			alfa: 1,
			mainWindow: '#753'
		}
		*/
	
		textContentElement.style.color = options.szoveg;
		infoContentElement.style.color = options.szoveg;
		_this.highlightedColor = options.kiemelt;
		
		//bodyElement.style.background = options.hatter;
		//backgroundColorElement.style.background = options.hatter;
		presenterElement.style.background = options.hatter;
		textContentElement.style.textShadow = options.kep == '' ? '' : '0 0 50px ' + options.hatter;
		//mainWindowElement.style.backgroundColor = options.mainBgColor;
		
		mainWindowPanelElement.style.opacity = options.kep == '' ? 1 : 0.8;
		
		backgroundElement.style.backgroundColor = '';
		backgroundElement.style.backgroundImage = options.kep;
		backgroundElement.style.opacity = options.kep == '' ? 1 : options.alfa;
	}

	function setTheme(dark, image) {
		var options = {};
		if (dark) {
			options.szoveg = '#fff';
			options.kiemelt = '#ff0';
		} else {
			options.szoveg = '#000';
			options.kiemelt = '#880';
		}
		if (image == '') {
			options.hatter = dark ? '#444' : '#fff';
			options.kep = '';
			options.alfa = 1;
			//options.mainBgColor = '#753';
		} else {
			options.hatter = dark ? '#000' : '#fff';
			options.kep = 'url(pictures/' + image + '.jpg)';
			options.alfa = dark ? 0.5 : 0.5;
			//options.mainBgColor = '';
		}
		setBackgroundAndStyle(options);
		app.fireEvent('changeTheme');
	}

	this.changeTheme = function(element) {
		var themePic = themePictureElement.value;
		var themeTxt = themeTextElement.value;
		if (element == 'pic') {
			storage.set('themePic', themePic);
			storage.set('themeTxt', themeTxt);
		} else if (element == 'txt') {
			storage.set('themeTxt', themeTxt);
		}
		setTheme(themeTxt == 'sotet' ? false : true, themePic);
	}

	// true: random, nem ment
	// false: nem állítja át, nem ment
	// 1: random, ment
	// 0: none, ment
	this.setRandomTheme = function(changePic, changeTxt) {
		if (changePic !== false) {
			var themePic;
			if (changePic === 0) {
				themePic = 0;
			} else if (changePic) {
				themePic = Math.floor(Math.random() * (themePictureElement.options.length - 1)) + 1;
			}
			themePictureElement.options.selectedIndex = themePic;
			if (changePic === 0) {
				storage.set('themePic', '[none]');
			} else if (changePic === 1) {
				storage.set('themePic', '');
			}
		}
		if (changeTxt !== false) {
			var themeTxt;
			if (changeTxt === 0) {
				themeTxt = 0;
			} else if (changeTxt) {
				themeTxt = Math.floor(Math.random() * (themeTextElement.options.length));
			}
			themeTextElement.options.selectedIndex = themeTxt;
			if (changeTxt === 0) {
				storage.set('themeTxt', '[none]');
			} else if (changeTxt === 1) {
				storage.set('themeTxt', '');
			}
		}
		this.changeTheme();
	}

	this.setup = function() {
		// téma beállítása
		var themePic = storage.get('themePic');
		var themeTxt = storage.get('themeTxt');
		if (themePic == '') {
			themePic = true; // random, nem ment
		} else {
			if (themePic != '[none]') {
				themePictureElement.value = themePic;
			}
			themePic = false; // nem állítja át, nem ment
		}
		if (themeTxt == '') {
			themeTxt = true; // random, nem ment
		} else {
			if (themeTxt != '[none]') {
				themeTextElement.value = themeTxt;
			}
			themeTxt = false; // nem állítja át, nem ment
		}
		this.setRandomTheme(themePic, themeTxt);
	}
	
	
	// loading background pictures
	app.loadScript('pictures/_pictures', function(isSuccess){
		// init options of background pictures
		for (var pictureId in picture) {
			var option = document.createElement('option');
			option.value = pictureId;
			option.innerHTML = pictureId;
			themePictureElement.appendChild(option);
		}
		
		// setup last theme
		_this.setup();
	});

}
