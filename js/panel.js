var panelSelectElement = document.getElementById('panelSelect');
var menuElement = document.getElementById('menu');

var panel;

function Panel() {
	var selectedPanel = DEFAULT_PANEL;
	
	var panels = {
		hymnal: {
			translationTitle: 'PanelHymnal',
			id: 'panelHymnal',
			update: function() {
				songPanel.updateSongPanel();
				songBook.loadBook('', function(){
					songPanel.updateSongPanel(true);
				});
			}
		},
		bible: {
			translationTitle: 'PanelBible',
			id: 'panelBible',
			update: function() {
				biblePanel.updateBiblePanel();
			}
		}
	};
	
	var isOpen = false;
	var selectClickCancel = false;
	
	var _this = this;
	
	this.isPanelOpen = function() {
		return isOpen;
	}
	
	this.titleClick = function() {
		this.selectUp();
		songBook.bookSelectUp();
		songPanel.searchOff();
		songPanel.titleListSelectUp();
		biblePanel.bibleSelectUp();
	}
	
	this.getSelected = function() {
		return selectedPanel;
	}
	
	this.updatePanel = function(panelId) {
		if (panelId != undefined && panelId != '' && panelId != this.getSelected()) {
			return;
		}
		panels[this.getSelected()].update();
	}
	
	this.setPreviousPanel = function() {
		var prevId = false;
		for (var panelId in panels) {
			if (panelId == selectedPanel) {
				break;
			}
			prevId = panelId;
		}
		if (prevId !== false) {
			this.selectPanel(prevId, true);
		}
	}
	
	this.setNextPanel = function() {
		var nextId = false;
		var found = false;
		for (var panelId in panels) {
			if (panelId == selectedPanel) {
				found = true;
			} else if (found) {
				nextId = panelId;
				break;
			}
		}
		if (nextId !== false) {
			this.selectPanel(nextId, true);
		}
	}
	
	this.updateList = function(callUpdate) {
		if (callUpdate == undefined) {
			callUpdate = true;
		}
		var html = '';
		var panelCount = 0;
		if (/*selectedPanel != '' &&*/ panels[selectedPanel] != undefined) {
			html += '<div class="panel op selected" onclick="panel.selectCancel()">' + tr(panels[selectedPanel].translationTitle) + '</div>';
		}
		for (var panelId in panels) {
			html += '<div class="panel op' + (panelId == selectedPanel ? ' mark' : '') + '" onclick="panel.selectPanel(\'' + panelId + '\')">' + tr(panels[panelId].translationTitle) + '</div>';
			panelCount++;
		}
		var panelSelectDisable = panelCount < 2 && selectedPanel != '' && panels[selectedPanel] != undefined;
		panelSelectElement.innerHTML = '<div id="panelSelectInner">' + html + '</div>';
		
		var samplePanel = document.getElementById('samplePanel');
		var panelSelectInner = document.getElementById('panelSelectInner');
		
		if (isOpen) {
			var panelSelectSize = 14;
			if (panelSelectSize > panelCount + 1) {
				panelSelectSize = panelCount + 1;
			}
			panelSelectElement.style.overflow = 'auto';
			panelSelectElement.style.height = (samplePanel.clientHeight * panelSelectSize + 7) + 'px';
			panelSelectElement.className = 'open';
		} else {
			panelSelectElement.style.overflow = 'hidden';
			panelSelectElement.style.height = (samplePanel.clientHeight) + 'px';
			panelSelectElement.className = panelSelectDisable ? 'disable' : 'close';
		}
		
		for (var panelId in panels) {
			var display = panelId == selectedPanel ? 'table' : 'none';
			if (document.getElementById(panels[panelId].id).style.display != display) {
				document.getElementById(panels[panelId].id).style.display = display;
				if (callUpdate && display != 'none') {
					panels[panelId].update();
				}
			}
		}
	}
	
	this.selectCancel = function() {
		if (isOpen) {
			selectClickCancel = true;
			this.selectUp();
		}
	}
	
	this.selectPanel = function(panelId, changePanel) {
		if (changePanel == undefined) {
			changePanel = false;
		}
		if (isOpen) {
			if (!changePanel) {
				selectClickCancel = true;
			}
			var resize = false;
			if (selectedPanel != panelId) {
				selectedPanel = panelId;
				resize = true;
				storage.set('panel', panelId);
			}
			if (!changePanel) {
				this.selectUp();
			} else {
				this.updateList();
			}
			if (resize) {
				presenter.resizeDisplay();
			}
		}
	}	

	this.selectClick = function() {
		if (!isOpen) {
			if (selectClickCancel) {
				selectClickCancel = false;
			} else {
				this.selectDown();
			}
		}
	}
	this.selectDown = function() {
		if (!isOpen) {
			if (panelSelectElement.className != 'disable') {
				isOpen = true;
				this.updateList();
				
				songBook.bookSelectUp(false);
				songPanel.searchOff();
				songPanel.titleListSelectUp(false);
				songPanel.updateTitleList();
				
				biblePanel.bibleSelectUp();
			}
		}
	}
	this.selectUp = function() {
		if (isOpen) {
			isOpen = false;
			panelSelectElement.scrollTop = 0;
			this.updateList();
		}
	}
	
	this.showMenu = function() {
		if (menuElement.className.indexOf(' show') == -1) {
			if (presenter.getMobileView()) {
				menuElement.className = menuElement.className + ' show';
			}
		} else {
			_this.hideMenu();
		}
	}
	
	this.hideMenu = function() {
		if (menuElement.className.indexOf(' show') != -1) {
			menuElement.className = menuElement.className.replace(' show', '');
		}
	}
	
	if (!extended.isDisplayMode()) {
		var panelId = storage.get('panel');
		if (panelId != '' && panels[panelId] != undefined) {
			selectedPanel = panelId;
		}
	}
	
	this.updateList(false);
}
