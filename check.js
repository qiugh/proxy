let Crawler = require('crawler');
let schedule = require('node-schedule');
let Proxy = require('./proxy.js');
let dbUtil = require('./dbUtil.js');
let moment = require('moment');

let lastCheckTime = new Date();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
let crawler = new Crawler({ retries: 5, jquery: false, maxConnections: 5 });

start();

function start() {
    crawler.on('drain', function () {
        if ((new Date() - lastCheckTime) > 5 * 24 * 3600 * 1000) {
            lastCheckTime = new Date();
            checkAll(1);
        } else {
            checkAll(0);
        }
    });
    dbUtil.connect().then(() => {
        console.log('mongodb connect success, start checking.');
        checkAll(0);
    });
}

function checkAll(type) {
    dbUtil.findAll(type ? {} : { able: null }).then(docs => {
        for (let doc of docs) {
            let proxy = new Proxy(doc).toString();
            checkProxy(proxy).then(succ => {
                doc.cts = time();
                if (succ) {
                    console.log('校验通过 ' + proxy);
                    doc.able = 1;
                    dbUtil.update(doc);
                    return;
                }
                console.log('校验失败 ' + proxy);
                doc.able = 0;
                if (type) {
                    dbUtil.clean(doc);
                } else {
                    dbUtil.update(doc);
                }
            });
        }
    });
}

function checkProxy(proxy) {
    return new Promise(function (resolve) {
        crawler.queue({
            uri: 'http://www.baidu.com/',
            proxy: proxy,
            callback: function (err, res, done) {
                done();
                if (res.body && res.body.match(/百度/)) {
                    resolve(1);
                } else {
                    resolve(0);
                }
            }
        });
    });
}

function time() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}