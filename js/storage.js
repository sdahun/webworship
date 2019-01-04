var storage;

function Storage() {
	this.set = function(par, val) {
		if (window.localStorage != undefined) {
			localStorage['hel_' + par] = val;
		}
	}

	this.get = function(par) {
		if (window.localStorage != undefined) {
			if (localStorage['hel_' + par] == undefined) {
				return '';
			}
			return localStorage['hel_' + par];
		}
		return '';
	}
}
