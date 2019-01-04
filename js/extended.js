var extendedButtonElement = document.getElementById('extendedButton');
var txtBlockElement = document.getElementById('txtBlock');

var extended;

function Extended(sendStatusFn, receiveStatusFn, receiveMessageFn) {
	var windowMode = 0;
	var idle = '?';
	var msgBuffer = [];
	var msgSender = false;
	var extendedWindow = false;
	
	var extendedButtonOrigClass = extendedButtonElement.className;
	
	this.isSingleMode = function() {
		return windowMode == 0;
	}
	
	this.isControllerMode = function() {
		return windowMode == 1;
	}
	
	this.isDisplayMode = function() {
		return windowMode == 2;
	}
	
	this.setSingleMode = function() {
		windowMode = 0;
	}
	
	this.setControllerMode = function() {
		windowMode = 1;
	}
	
	this.setDisplayMode = function() {
		windowMode = 2;
	}
	
	this.isIdle = function() {
		return idle == '1';
	}
	
	this.getIdleValue = function() {
		return idle;
	}
	
	this.setIdleValue = function(idleVal) {
		idle = idleVal;
	}
	
	function getMsg() {
		return storage.get('msg');
	}

	function setMsg(value) {
		storage.set('msg', value);
	}

	function startMessageSender() {
		msgSender = setInterval(function(){
			sendStatusFn();
			if (msgBuffer.length > 0) {
				var msg = getMsg();
				if (msg == '') {
					setMsg(msgBuffer[0]);
					var a = [];
					for (var i = 1; i < msgBuffer.length; i++) {
						a.push(msgBuffer[i]);
					}
					msgBuffer = a;
				}
			}
		}, 10);
	}
	
	function stopMessageSender() {
		if (msgSender !== false) {
			clearInterval(msgSender);
			msgSender = false;
		}
	}
	
	this.startMessageReceiver = function() {
		setMsg('');
		setInterval(function(){
			var msg = getMsg();
			if (msg != '') {
				try {
					msg = JSON.parse(msg);
				} catch(e) {
					msg = {
						cmd: '',
						params: {}
					};
				}
				receiveMessageFn(msg);
				setMsg('');
			}
			receiveStatusFn();
		}, 10);
	}
	
	this.show = function() {
		stopMessageSender();
		if (this.isControllerMode()) {
			if (extendedWindow) {
				extendedWindow.close();
			}
			this.setSingleMode();
			presenter.resizeDisplay();
			presenter.refresh();
			extendedButtonElement.className = extendedButtonOrigClass;
			return;
		}
		extendedButtonElement.className = extendedButtonOrigClass + ' selected';
		this.setControllerMode();
		presenter.resizeDisplay();
		presenter.refresh();
		extendedWindow = window.open('?mode=extended', 'hel_extended', 
			'left=0,top=0,width=640,height=480' + 
			',menubar=no,scrollbars=no,titlebar=no,status=no,resizable=yes,toolbar=no,location=no,channelmode=no,directories=no,fullscreen=no');
		startMessageSender();
	}

	this.sendMessage = function(cmd, params) {
		msgBuffer.push(JSON.stringify({
			cmd: cmd,
			params: params
		}));
	}
	
	if (window.location.search.indexOf('mode=extended') != -1) {
		this.setDisplayMode();
	}
}

function extendedSendStatus() {
	// send info row content
	var infoStr = infoContentElement.style.display == 'none' ? '' : infoContentElement.innerHTML;
	if (storage.get('scrInfo') != infoStr) {
		storage.set('scrInfo', infoStr);
	}
	
	// send song text content
	if (storage.get('scrTxt') != textContentElement.innerHTML) {
		storage.set('scrTxt', textContentElement.innerHTML);
	}
	
	// send song text opacity
	if (storage.get('scrTxtOpacity') != textContentElement.style.opacity + '') {
		storage.set('scrTxtOpacity', textContentElement.style.opacity);
	}
	
	// send theme background
	if (storage.get('scrThemePic') != themePictureElement.value) {
		storage.set('scrThemePic', themePictureElement.value);
	}
	
	// send theme text color
	if (storage.get('scrThemeTxt') != themeTextElement.value) {
		storage.set('scrThemeTxt', themeTextElement.value);
	}
	
	// send pause status
	if (storage.get('scrContinue') != continueButtonElement.style.display) {
		storage.set('scrContinue', continueButtonElement.style.display);
	}
	
	// send pause text
	if (storage.get('scrContinueTxt') != continueButtonTxtElement.innerHTML) {
		storage.set('scrContinueTxt', continueButtonTxtElement.innerHTML);
	}
	
	// send idle status
	var idleValue = (player.musicEnabled && player.track == -1) || (!player.musicEnabled && player.onBlankPage) ? '1' : '0';
	if (storage.get('scrIdle') != idleValue) {
		storage.set('scrIdle', idleValue);
	}
}

function extendedReceiveStatus() {
	// receive info row content
	if (infoContentElement.innerHTML != storage.get('scrInfo')) {
		infoContentElement.innerHTML = storage.get('scrInfo');
	}
	
	// receive song text content
	if (textContentElement.innerHTML != storage.get('scrTxt')) {
		textContentElement.innerHTML = storage.get('scrTxt');
		presenter.autoTxtSize();
	}
	
	// receive song text opacity
	if (textContentElement.style.opacity != parseFloat(storage.get('scrTxtOpacity'))) {
		textContentElement.style.opacity = parseFloat(storage.get('scrTxtOpacity'));
	}
	
	// receive theme background
	if (themePictureElement.value != storage.get('scrThemePic')) {
		themePictureElement.value = storage.get('scrThemePic');
		theme.changeTheme();
	}
	
	// receive theme text color
	if (themeTextElement.value != storage.get('scrThemeTxt')) {
		themeTextElement.value = storage.get('scrThemeTxt');
		theme.changeTheme();
	}
	
	// receive pause status
	if (continueButtonElement.style.display != storage.get('scrContinue')) {
		continueButtonElement.style.display = storage.get('scrContinue');
		continueButtonElement.style.visibility = 'visible';
		continueButtonElement.style.fontSize = textContentElement.style.fontSize;
	}
	
	// receive pause text
	if (continueButtonTxtElement.innerHTML != storage.get('scrContinueTxt')) {
		continueButtonTxtElement.innerHTML = storage.get('scrContinueTxt');
	}
	
	// receive idle status
	if (extended.getIdleValue() != storage.get('scrIdle')) {
		extended.setIdleValue(storage.get('scrIdle'));
		if (extended.isIdle()) {
			if (blankScreenElement.style.display == 'none') {
				screenSaver.setBlankScreenTimeout();
			}
		} else {
			screenSaver.setBlankScreenTimeout(false);
		}
	}
}

function extendedReceiveMessage(msg) {
	if (msg.cmd == 'blankScreen') {
		// show blank screen
		if (blankScreenElement.style.display == 'none') {
			screenSaver.showBlankScreen();
		} else {
			screenSaver.setBlankScreenTimeout();
		}
	} else if (msg.cmd == 'background') {
		// show background
		if (txtBlockElement.style.display != 'none' || blankScreenElement.style.display != 'none') {
			screenSaver.showBackground();
		} else {
			screenSaver.exitBackground();
			screenSaver.setBlankScreenTimeout();
		}
	} else if (msg.cmd == 'start') {
		// activity --> exit from background and blank screen
		if (txtBlockElement.style.display == 'none') {
			screenSaver.exitBackground();
		}
		screenSaver.setBlankScreenTimeout(false);
	}
}
