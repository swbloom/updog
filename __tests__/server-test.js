const request = require('../utils/request.js');
const config = require('../config.js');

const getPets = () => {
	return request(`${config.api_url}/pets`, config.api_port);
}

it('returns an array of pets', async () => {
	const pets = await getPets();
	expect(JSON.parse(pets)).toBeInstanceOf(Array);
});