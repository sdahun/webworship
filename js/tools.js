function strTrim(s) {
	while (s.length > 0 && (s.charAt(0) == ' ' || s.charAt(0) == '\n' || s.charAt(0) == '\r' || s.charAt(0) == '\t')) {
		s = s.substr(1, s.length - 1);
	}
	while (s.length > 0 && (s.charAt(s.length - 1) == ' ' || s.charAt(s.length - 1) == '\n' || s.charAt(s.length - 1) == '\r' || s.charAt(s.length - 1) == '\t')) {
		s = s.substr(0, s.length - 1);
	}
	return s;
}

function strRTrim(s) {
	while (s.length > 0 && (s.charAt(s.length - 1) == ' ' || s.charAt(s.length - 1) == '\n' || s.charAt(s.length - 1) == '\r' || s.charAt(s.length - 1) == '\t')) {
		s = s.substr(0, s.length - 1);
	}
	return s;
}

function stripTags(html) {
	return html.replace(/<\/?[^>]+(>|$)/g, '');
}

function arrayClone(a) {
	b = [];
	for (var i = 0; i < a.length; i++) {
		b.push(a[i]);
	}
	return b;
}

function objectClone(a) {
	b = {};
	for (var i in a) {
		b[i] = a[i];
	}
	return b;
}

function hasClass(elementObject, className) {
	return (' ' + elementObject.className + ' ').indexOf(className) != -1;
}

function addClass(elementObject, className) {
	if (!hasClass(elementObject, className)) {
		elementObject.className = elementObject.className + ' ' + className;
	}
}

function removeClass(elementObject, className) {
	if (hasClass(elementObject, className)) {
		elementObject.className = strTrim((' ' + elementObject.className + ' ').replace(' ' + className + ' ', ' '));
	}
}
