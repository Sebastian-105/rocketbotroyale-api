const fs = require("fs");
let test_email = 'testsubject105@gmail.com'
let test_password = 'password'
const baseURL = 'https://dev-nakama.winterpixel.io/v2';

// Get profile
async function getProfile(id, token) {
  return await fetch(`${baseURL}/rpc/rpc_get_users_with_profile`, {
   headers: {
			accept: 'application/json',
			'accept-language': 'en-US,en;q=0.9',
			authorization: `Bearer ${token}`,
			priority: 'u=1, i',
			'sec-ch-ua': '"Chromium";v="127", "Not)A;Brand";v="99"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"Linux"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'same-site',
			Referer: 'https://rocketbotroyale.winterpixel.io/',
			'Referrer-Policy': 'strict-origin-when-cross-origin',
		},
		body: `\"{\\\"ids\\\":[\\\"${id}\\\"]}\"`,
		method: 'POST',
	}).then(function(res) {
    return res.text()
  })
}
async function updateToken() {
	return await fetch(`${baseURL}/account/authenticate/email?create=false&`, {
		headers: {
			accept: 'application/json',
			'accept-language': 'en-US,en;q=0.9',
			authorization: 'Basic OTAyaXViZGFmOWgyZTlocXBldzBmYjlhZWIzOTo=',
			priority: 'u=1, i',
			'sec-ch-ua': '"Chromium";v="127", "Not)A;Brand";v="99"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"Linux"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'same-site',
			Referer: 'https://rocketbotroyale.winterpixel.io/',
			'Referrer-Policy': 'strict-origin-when-cross-origin',
		},
		body: `{\"email\":\"${test_email}\",\"password\":\"${test_password}\",\"vars\":{\"client_version\":\"66\",\"platform\":\"HTML5\"}}`,
		method: 'POST',
	})
		.then(function (res) {
			// console.log(res);
			return res.json();
		})
		.then(function (json) {
			console.log(json);
			return json['token'];
		});
}
// weapons kills
async function getWeaponKills(id, token) {
  return await getProfile(id, token).then(function(res) {
    // this is probably very in-effective
    let flaksUsed = res.split('\\"flaks_used\\":\\"')[1].split('\\",')[0];
    let flakKills = res.split('\\"kills_using_flak\\":\\"')[1].split('\\",')[0];
    let grenadesUsed = res.split('\\"grenades_used\\":\\"')[1].split('\\",')[0]
    let grenadeKills = res.split('\\"kills_using_grenade\\":\\"')[1].split('\\",')[0]
    let drillsUsed = res.split('\\"drills_used\\":\\"')[1].split('\\",')[0]
    let drillKills = res.split('\\"kills_using_drills\\":\\"')[1].split('\\",')[0]
    let homingsUsed = res.split('\\"homings_used\\":\\"')[1].split('\\",')[0]
    let homingKills = res.split('\\"kills_using_homing\\":\\"')[1].split('\\",')[0]
    let minesUsed = res.split('\\"mines_used\\":\\"')[1].split('\\",')[0]
    let mineKills = res.split('\\"kills_using_mine\\":\\"')[1].split('\\",')[0]
    let laserUsed = res.split('\\"lasers_used\\":\\"')[1].split('\\",')[0]
    let laserKills = res.split('\\"kills_using_laser\\":\\"')[1].split('\\",')[0]
    let nukeUsed = res.split('\\"nukes_used\\":\\"')[1].split('\\",')[0]
    let nukeKills = res.split('\\"kills_using_nuke\\":\\"')[1].split('\\",')[0]
    let poisonsUsed = res.split('\\"poisons_used\\":\\"')[1].split('\\",')[0]
    let poisonKills = res.split('\\"kills_using_poison\\":\\"')[1].split('\\",')[0]
    let shieldsUsed = res.split('\\"shields_used\\":\\"')[1].split('\\",')[0]
    let shieldBlocks = res.split('\\"blocks_using_shield\\":\\"')[1].split('\\",')[0]
    let shieldKills = res.split('\\"kills_using_shields\\":\\"')[1].split('\\",')[0]
    let missilesFired = res.split('\\"missiles_fired\\":\\"')[1].split('\\",')[0]
    let missileKills = res.split('\\"kills_using_\\":\\"')[1].split('\\",')[0]
    let rapidUsed = res.split('\\"triple-shots_used\\":\\"')[1].split('\\",')[0]
    let rapidKills = res.split('\\"kills_using_triple-shot\\":\\"')[1].split('\\",')[0]
    let whirlwindsUsed = res.split('\\"whirlwinds_used\\":\\"')[1].split('\\",')[0]
    let dunkedTanks = res.split('\\"dunk_tanks\\":\\"')[1].split('\\",')[0]
    
  })
}

// Main function
async function main() {
	let token = await updateToken();
	let profile = await getProfile(`7bb4cb45-b858-491e-9904-95018460f586`, token);
	console.log(profile)
}

main();