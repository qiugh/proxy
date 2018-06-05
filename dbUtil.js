let MongoClient = require('mongodb').MongoClient;


let connection = null;
let mongodb = 'mongodb://127.0.0.1:27017/proxy';

function connect() {
	return MongoClient.connect(mongodb).then((conn) => {
		connection = conn;
	});
}

function findAll(query) {
	return connection.collection('proxy').find(query).toArray();
}

function insert(proxies) {
	let bulk = connection.collection('proxy').initializeUnorderedBulkOp();
	proxies.forEach(proxy => {
		bulk.find({
			ip: proxy.ip,
			port: proxy.port
		}).upsert().update({
			$setOnInsert: {
				ts: new Date(),
				source: proxy.source
			}
		})
	});
	return bulk.execute();
}

function update(proxy) {
	connection.collection('proxy').updateOne({ ip: proxy.ip, port: proxy.port }, { $set: { able: proxy.able,cts:proxy.cts } });
}

function clean(proxy) {
	connection.collection('proxy').deleteOne({ ip: proxy.ip, port: proxy.port });
}

module.exports = {
	connect,
	insert,
	disable,
	clean,
	findAll
}