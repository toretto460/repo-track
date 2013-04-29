var MD5 = require('MD5');

exports.hashify = function (str) {
	return MD5(str);
}