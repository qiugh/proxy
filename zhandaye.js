
let moment = require('moment');
let logger = require('./log.js');
let dbUtil = require('./dbUtil.js');

let pageIdx = 88152;
let name = 'zhandaye';
let startDate = '2018-06-04 18:00:00';

module.exports = {
    name: name,
    cron: '0 15 * * * *',
    url: function () {
        return 'http://ip.zdaye.com/dayProxy/ip/' + getPageIdex() + '.html';
    },
    callback: function (err, res, done) {
        if (err) {
            logger('error', name, err);
            return done();
        }
        if (res.statusCode != 200) {
            logger('error', name, 'wrong code:' + res.statusCode, res.body);
            return done();
        }
        let $ = res.$;
        let proxies = $('.cont').text().match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+/g);
        if (proxies) {
            dbUtil.insert(proxies.map(str => {
                let strs = str.split(':');
                return {
                    ip: strs[0].trim(),
                    port: strs[1].trim(),
                    source: name
                };
            }));
        }else{
            console.log(res.body);
        }
        done();
    }
}

function getPageIdex() {
    let gap = moment().subtract(1, 'hours') - moment(startDate);
    gap = Math.floor(gap / 3600000);
    return pageIdx + gap;
}