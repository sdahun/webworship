var ownTextWindowElement = document.getElementById('ownTextWindow');
var ownTextContentElement = document.getElementById('ownTextContent');

var ownText;

function OwnText() {
	this.show = function() {
		ownTextWindowElement.style.display = '';
		if (ownTextContentElement.value == '') {
			ownTextContentElement.value = tr([
				'OwnTextSample', 
				
				'Title\n\n' +
				'Text of first screen.\n\n' +
				'Text of second screen.\n\n' +
				'Text of third screen.'
			]);
		}
	}

	this.close = function() {
		ownTextWindowElement.style.display = 'none';
	}

	this.start = function() {
		ownTextWindowElement.style.display = 'none';
		var txt = ownTextContentElement.value + '';
		if (strTrim(txt) != '') {
			txt = strRTrim(txt);
			txt = txt.replace(/\r\n/g, '\n');
			txt = txt.replace(/\r/g, '\n');
			txt = txt.split('\n\n');
			
			var max = 0;
			for (var songId in song) {
				if (song[songId].book == 'OWN-TEXT') {
					var n = parseInt(song[songId].number, 10);
					if (max < n) {
						max = n;
					}
				}
			}
			max++;
			max += '';
			
			if (book['OWN-TEXT'] == undefined) {
				book['OWN-TEXT'] = {
					title: tr('OwnText'),
					abbreviation: '',
					publisher: '',
					year: '',
					lang: '',
					description: '',
					init: true
				};
			}
			if (songBook.selectedBook != 'OWN-TEXT') {
				songBook.selectedBook = 'OWN-TEXT';
				bookSelectUp();
			}
			
			songPanel.selectedNumber = max;
			songPanel.selectedSongId = 'OWN-TEXT/' + songPanel.selectedNumber;
			
			if (strTrim(txt[0]) == '') {
				txt[0] = 'Saját szöveg';
			}
			song[songPanel.selectedSongId] = {
				title: txt[0],
				book: 'OWN-TEXT',
				number: songPanel.selectedNumber,
				ownText: true
			};
			for (var i = 1; i < txt.length; i++) {
				var str = strTrim(txt[i]);
				song[songPanel.selectedSongId][i] = str;
			}
			songData.sorted.push(songPanel.selectedSongId);
			
			songPanel.selectedVerses = [];
			for (var i in song[songPanel.selectedSongId]) {
				if (i > 0) {
					i = parseInt(i, 10);
					songPanel.selectedVerses.push(i);
				}
			}
			songPanel.songNumberWriteEnabled = false;
			songPanel.updateSongPanel(true);
			player.setup({intro: true, zene: false, lapozas: true});
		}
	}
}

app.addEvent('changeLanguage', function(){
	if (book['OWN-TEXT'] != undefined) {
		book['OWN-TEXT']['title'] = tr('OwnText');
	}
});
