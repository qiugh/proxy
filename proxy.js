class Proxy {
	constructor(options) {
		this.source = options.source;
		this.protocol = options.protocol || 'http';
		this.user = options.user;
		this.password = options.password;
		this.ip = options.ip;
		this.port = options.port;
	}
	toString() {
		if (!this.password || !this.user) {
			return this.protocol + '://' + this.ip + ':' + this.port;
		}
		return this.protocol + '://' + this.user + ':' + this.password + '@' + this.ip + ':' + this.port;
	}
}

module.exports = Proxy;