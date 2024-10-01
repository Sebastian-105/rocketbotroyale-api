const { getProfile, updateToken } = require('./api');
const { json } = require('express/lib/response');
const { process_params } = require('express/lib/router');
const fs = require('fs');
const user_id1 = process.argv.slice(2);
const baseURL = 'https://dev-nakama.winterpixel.io/v2';
// Use presets to target people, fr
const presetUsers = [
  "19c33df9-1225-4c79-b4d7-3ed3988a315e", //Envixity
  "",
  "",

]
async function getDisplayName(id, token) { //unused
	return await getProfile(id, token).then(function (str) {
		return str.split('\\"display_name\\":\\"')[1].split('\\",')[0];
	});
}
async function getSkins(id, token) {
	let displayName = await getDisplayName(id, token);
  return await getProfile(id, token).then(function (str) {
		let skin =  str.split('\\"skin\\":\\"')[1].split('\\",')[0];
    let all = `User ${displayName} is currently using ${skin}`
    return all;
  })
}

async function Skin105() {
	let token = await updateToken();

	let Skins = await getSkins(presetUsers[0], token);
	console.log(Skins);
}
if (require.main === module) {
  Skin105();
	console.log("This only runs when file1.js is executed directly");
}
