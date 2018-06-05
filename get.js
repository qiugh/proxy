let moment = require('moment');
let logger = require('./log.js');
let Crawler = require('crawler');
let dbUtil = require('./dbUtil.js');
let schedule = require('node-schedule');
let doubleSix = require('./66ip.js');
let zhandaye = require('./zhandaye.js');

let websites = [doubleSix, zhandaye];

let crawler = new Crawler({
	retries: 0
});

start();

function start() {
	dbUtil.connect().then(() => {
		logger('mongodb connect success.');
		websites.forEach(website => {
			logger(website.cron)
			schedule.scheduleJob(website.cron, function () {
				logger(time() + ' ' + website.name + ' start fetching.')
				crawler.queue({
					uri: (typeof website.url === 'function') ? website.url() : website.url,
					callback: website.callback
				})
			});
		})
	})
}

function time() {
	return moment().format('YYYY-MM-DD HH:mm:ss');
}