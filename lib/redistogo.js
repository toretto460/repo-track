var redis = require('redis'),
		url = require('url');

exports.createClient = function() {
	redis_to_go_url = process.env.REDISTOGO_URL;
	
	if(redis_to_go_url) {
		rtg = url.parse(redis_to_go_url);
		redistogo = redis.createClient(rtg.port, rtg.hostname);
		redistogo.auth(rtg.auth.split(':')[1]);
		return redistogo;
	} else {
		r = redis.createClient('6379', 'localhost');
		r.auth("");
		return r;
	}	
}