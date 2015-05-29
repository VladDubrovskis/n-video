/* global describe, it, beforeEach, afterEach, sinon */
'use strict';

var Brightcove = require('../../src/models/brightcove');
var brightcoveResponse = require('../fixtures/brightcove.json');

describe('Brightcove', function () {

	var containerEl;
	var server;

	beforeEach(function () {
		containerEl = document.createElement('div');
		containerEl.setAttribute('data-n-video-id', '4084879507001');
		document.body.appendChild(containerEl);
		server = sinon.fakeServer.create();
		server.autoRespond = true;
		server.respondWith(JSON.stringify(brightcoveResponse));
	});

	afterEach(function () {
		document.body.removeChild(containerEl);
		server.restore();
	});

	it('should exist', function () {
		Brightcove.should.exist;
	});

	it('should be able to instantiate', function () {
		var brightcove = new Brightcove(containerEl);
		brightcove.should.exist;
	});

	it('should return a Promise on `init`', function () {
		var brightcove = new Brightcove(containerEl);
		brightcove.init().should.be.an.instanceOf(Promise);
	});

	it('should return the Brightcove instance on `init`', function () {
		var brightcove = new Brightcove(containerEl);
		brightcove.init().should.eventually.equal(brightcove);
	});

	it('should create a video element on `init`', function () {
		var brightcove = new Brightcove(containerEl);
		return brightcove
			.init()
			.then(function () {
				var videoEl = containerEl.querySelector('video');
				videoEl.getAttribute('poster').should.equal(
					'https://bcsecure01-a.akamaihd.net/13/47628783001/201502/2470/47628783001_4085962850001_MAS-VIDEO-AuthersNote-stock-market.jpg?pubId=47628783001'
				);
				videoEl.getAttribute('src').should.equal(
					'http://brightcove.vo.llnwd.net/v1/uds/pd/47628783001/201502/3842/47628783001_4085577901001_A-hated-rally.mp4'
				);
			});
	});

	it('should throw error if can\'t init', function () {
		var brightcove = new Brightcove(containerEl);
		server.respondWith([404, {}, '']);
		return brightcove.init().should.be.rejectedWith('Brightcove responded with a 404 (Not Found) for id 4084879507001');
	});

	it('should return the progress as a percentage', function () {
		var brightcove = new Brightcove(containerEl);
		return brightcove
			.init()
			.then(function () {
				// TODO: mock different values
				brightcove.getProgress().should.equal(0);
			});
	});

});