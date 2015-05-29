'use strict';

var getDomPathTokens = require('../libs/get-dom-path-tokens');

function Video(el, opts) {
	this.containerEl = el;
	this.id = el.getAttribute('data-n-video-id');
	this.el;
	this.domPathTokens = getDomPathTokens(this.containerEl);
	this.domPath = this.domPathTokens.reverse().join(' | ');

	this.containerEl.setAttribute('data-n-video-js', '')
}

Video.prototype.init = function () {
	return Promise.resolve(this);
};

module.exports = Video;