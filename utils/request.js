const http	= require('http');

const request = (url, port) => {
	return new Promise(resolve => {
		http.get({path: url, port}, response => {
			let data = '';
			response.on('data', _data => data += _data);
			response.on('end', () => resolve(data));
		});
	});
}

module.exports = request;