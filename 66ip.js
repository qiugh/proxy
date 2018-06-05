let logger = require('./log.js');
let dbUtil = require('./dbUtil.js');
let moment = require('moment');
let name = 'doubleSix';

module.exports = {
	name: name,
	cron: '0 * * * * *',
	url: 'http://www.66ip.cn/mo.php?sxb=&tqsl=10&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea=',
	callback: function (err, res, done) {
		if (err) {
			logger('error', name, err);
			return done();
		}
		if (res.statusCode != 200) {
			logger('error', name, 'wrong code:' + res.statusCode, res.body);
			return done();
		}
		let proxies = [];
		res.body.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+/g).forEach(line => {
			let info = line.trim().split(':');
			proxies.push({
				ip: info[0], port: info[1], source: name, ts: time()
			});
		});
		logger('double six total get ', proxies);
		if (proxies.length) {
			dbUtil.insert(proxies);
		}
		done();
	}
}

function time() {
	return moment().format('YYYY-MM-DD HH:mm:ss');
}