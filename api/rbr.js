const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const { profile } = require('console');

let test_email = 'testsubject105@gmail.com';
let test_password = 'password';
let test_id = '0c4fde5f-3b14-4377-ace1-9446c702d873';

const baseURL = 'https://dev-nakama.winterpixel.io/v2';

// Get profile
async function fcToID(fc, token) {
  const data = `\"{\\"friend_code\\":\\"${fc}\\"}\"`;
  console.log('Sending request with data:', data);

  return await fetch(
    `https://dev-nakama.winterpixel.io/v2/rpc/winterpixel_query_user_id_for_friend_code`,
    {
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
      body: data,
      method: 'POST',
    },
  )
    .then(function (res) {
      console.log('Response status:', res.status);
      return res.text();
    })
    .catch((err) => {
      console.error('Fetch error:', err);
    });
}
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
  return await fetch(
    `https://dev-nakama.winterpixel.io/v2/account/authenticate/custom?create=true&`,
    {
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
      body: `{"email":"${test_email}","password":"${test_password}","id":"${test_id}","vars":{"client_version":"67","platform":"HTML5"}}`,
      method: 'POST',
    },
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (json) {
      console.log(json);
      return json['token'];
    });
}

async function getStatus(id, token) {
  const token1 = await updateToken();
  const content = await getProfile(id, token1);

  let parsedContent = JSON.parse(content);
  let userID = parsedContent.user_id;
  let skin = parsedContent.skin;
  let friendCode = parsedContent.friend_code;
  let display_name = parsedContent.display_name;
  let online = parsedContent.online;

  const contenta = {
    User: display_name,
    Online: online,
    userID: userID,
    Skin: skin,
    'Friend Code': friendCode,
  };

  return contenta;
}

async function getLeaderboard(season, token) {
  return await fetch(
    'https://dev-nakama.winterpixel.io/v2/rpc/query_leaderboard',
    {
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
      body: `\"{\\\"leaderboard\\\":\\\"tankkings_trophies\\\",\\\"season\\\":${season}}\"`,
      method: 'POST',
    },
  ).then(function (res) {
    return res.json();
  });
}

exports.handler = async (event, context) => {
  try {
    const { info, type } = event.queryStringParameters;

    if (!info || !type) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            "Invalid request, please ensure 'info' and 'type' are provided.",
        }),
      };
    }

    let newInfo = info.split(',');
    const token = await updateToken();
    let content = [];

    if (type === 'leaderboard') {
      for (let e = 0; e < newInfo.length; e++) {
        const leaderboardData = await getLeaderboard(newInfo[e], token);
        content.push(leaderboardData);
      }
    } else if (type === 'profile') {
      for (let e = 0; e < newInfo.length; e++) {
        const profileData = await getProfile(newInfo[e], token);
        content.push(profileData);
      }
    } else if (type === 'getUserID') {
      for (let e = 0; e < newInfo.length; e++) {
        const userID = await fcToID(newInfo[e], token);
        content.push(userID);
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid type parameter' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: JSON.stringify(content),
    };
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
