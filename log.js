let util = require('util');
let moment = require('moment');

let levels = ['silly', 'debug', 'verbose', 'info', 'warn', 'error', 'critical'];

function defaultLog() {
	let time = moment().format('YYYY-MM-DD HH:mm:ss');
	if (levels.indexOf(arguments[0]) > -1) {
		console.log(arguments[0] + " " + time + ": %s", util.format.apply(util, Array.prototype.slice.call(arguments, 1)));
	} else {
		console.log("info " + time + ": %s", util.format.apply(util, Array.from(arguments)));
	}
}

module.exports = defaultLog;