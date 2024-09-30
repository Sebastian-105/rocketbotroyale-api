const { json } = require('express/lib/response');
const fs = require('fs');
let test_email = 'testsubject105@gmail.com';
let test_password = 'password';
let playerID = `7bb4cb45-b858-491e-9904-95018460f586`;
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
	}).then(function (res) {
		return res.text();
	});
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
			return json['token'];
		});
}
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

module.exports = { getProfile, updateToken }
