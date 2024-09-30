const { getProfile, updateToken } = require('./api');
const { json } = require('express/lib/response');
const { process_params } = require('express/lib/router');
const fs = require('fs');
const user_id = process.argv.slice(2);
const baseURL = 'https://dev-nakama.winterpixel.io/v2';

async function isOnline(id, token) {
	return await getProfile(id, token).then(function (str) {
		return str.split('\\"online\\":')[1].split(',')[0];
	});
}

async function getDisplayName(id, token) {
	return await getProfile(id, token).then(function (str) {
		return str.split('\\"display_name\\":\\"')[1].split('\\",')[0];
	});
}
async function killstreaks(id, token) {
	let display_name = await getDisplayName(id, token);
	return await getProfile(id, token).then(function (str) {
		let triples = str.split('\\"triple_kills\\":')[1].split(',')[0];
		let doubles = str.split('\\"double_kills\\":')[1].split(',')[0];
		let quads = str.split('\\"quad_kills\\":')[1].split(',')[0];
		let online = str.split('\\"online\\":')[1].split(',')[0];
    var status = online ? "online" : "offline";

		let allContent = `User ${display_name} (${online}) has \n ${triples} triples \n ${doubles} doubles \n ${quads} quads`;
		return allContent;
	});
}
async function mainG() {
	let token = await updateToken(updateToken());
	let ks = await killstreaks(user_id, token);
  console.log(ks)
}
mainG()