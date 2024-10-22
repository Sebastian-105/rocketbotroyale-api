const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const path = require('path');


app.use(cors());
app.use(express.json());

const { json } = require('express/lib/response');
const fs = require('fs');
const { process_params } = require('express/lib/router');
let test_email = 'testsubject105@gmail.com';
let test_password = 'password';
const baseURL = 'https://dev-nakama.winterpixel.io/v2';
const playerID = process.argv.slice(2);

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
		return res.json();
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
async function getDisplayName(id, token) { //unused
	return await getProfile(id, token).then(function (str) {
		return str.split('\\"display_name\\":\\"')[1].split('\\",')[0];
	});
}
async function isOnline(id, token) {
	return await getProfile(id, token).then(function (str) {
		
		let online = str.split('\\"online\\":')[1].split(',')[0];
		if (online == "true") {
			return true;
		} else if (online == "false") {
			return false
		}
	});
}
async function getStatus(id, token) {
	let displayName = await getDisplayName(id, token);
	let online = await isOnline(id, token);
	return await getProfile(id, token).then(function (str1) {
		let userID = str1.split('\\"user_id\\":\\"')[1].split('\\",')[0];
		let skin = str1.split('\\"skin\\":\\"')[1].split('\\",')[0];
		let friendCode = str1.split('\\"friend_code\\":\\"')[1].split('\\",')[0];
		const contenta = {"User":displayName, "Online":online,"userID":userID, "Skin":skin, "Friend Code": friendCode}
		return contenta;
	});
}

async function api() {
	app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, 'public', 'index.html'));
	});
	app.get('/v2/account/getProfile', async (req, res) => {
    const { id } = req.query; // Get playerID from query params
  
    if (!id) {
      return res.status(400).json({ error: 'playerID is required' });
    }
  
    try {
      const token = await updateToken(); // Assume updateToken fetches the required token
      const playerData = await getProfile(id, token); // Assume getProfile fetches user data
      res.json(playerData);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch player data' });
    }
  });
	
	app.get('/v2/account/getSimpleProfile', async (req, res) => {
    const { id } = req.query; // Get playerID from query params
  
    if (!id) {
      return res.status(400).json({ error: 'id is required' });

    }
  
    try {
      const token = await updateToken(); 
			const content = await getStatus(id, token);
      res.json(content);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch player data' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
  
  
}
if (require.main === module) {
	api()
	console.log("This only runs when file1.js is executed directly");
}


module.exports = { getProfile, updateToken };
