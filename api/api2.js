const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const { json } = require('express/lib/response');
const fs = require('fs');
const { process_params } = require('express/lib/router');
const res = require('express/lib/response');
let test_email = 'testsubject105@gmail.com';
let test_password = 'password';
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
// async function isOnline(id, token) {
// 	return await getProfile(id, token).then(function (str) {
// 		return str.split('\\"online\\":')[1].split(',')[0];
// 	});
// }
// async function killstreaks(id, token) {
// 	let display_name = await getDisplayName(id, token);
// 	return await getProfile(id, token).then(function (str) {
// 		let triples = str.split('\\"triple_kills\\":')[1].split(',')[0];
// 		let doubles = str.split('\\"double_kills\\":')[1].split(',')[0];
// 		let quads = str.split('\\"quad_kills\\":')[1].split(',')[0];
// 		let allContent = `User ${display_name} has \n ${triples} triples \n ${doubles} doubles \n ${quads} quads`;
// 		return allContent;
// 	});
// }
// async function getDisplayName(id, token) {
// 	return await getProfile(id, token).then(function (str) {
// 		return str.split('\\"display_name\\":\\"')[1].split('\\",')[0];
// 	});
// }

async function api() {
  let token = await updateToken();
  // let profile = await getProfile(playerID, token); 
  console.log('Got user data');
  app.post('/v2/account/getProfile', async (req, res) => {
    const { playerID } = req.body; 
    try {
      let profile = await getProfile(playerID, token);
      res.json(profile); 
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error'); // Handle errors
    }
  });
  app.get('/', (res) => {
    res.sendFile(__dirname + '/index.html');
  })
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
if (require.main === module) {
  api();
  console.log('This only runs when file1.js is executed directly');
}

module.exports = { getProfile, updateToken };
