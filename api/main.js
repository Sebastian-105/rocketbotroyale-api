const fs = require('fs');
const axios = require('axios');

const CLIENT_VERSION = "999999";
const BASE_URL = "https://dev-nakama.winterpixel.io/v2";
const BASE_HEADERS = {
  "accept": "application/json",
  "authorization": "Basic OTAyaXViZGFmOWgyZTlocXBldzBmYjlhZWIzOTo=",
  "origin": "https://rocketbotroyale2.winterpixel.io",
  "referer": "https://rocketbotroyale2.winterpixel.io/",
  "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "content-type": "application/json"
};
const accounts = [
  { email: '', password: '' },
  { email: 'testsubject105@gmail.com', password: 'password' }, // Max, hopefully; if he lets me
  // Add more accounts as needed
];

// Function to read accounts from a JSON file (if needed later)

// Function to send requests using axios
async function sendReq(data, url, auth, isGet) {
  try {
    const config = {
      headers: {
        'Authorization': auth
      }
    };
    const response = isGet ? await axios.get(url, config) : await axios.post(url, data, config);
    return response.data;
  } catch (err) {
    console.error('Error sending request:', err);
    throw err; // Re-throw the error to handle it at the top level
  }
}

// Function to get user info using the token
async function getUserInfo(token) {
  
  const res = await sendReq({}, 'https://dev-nakama.winterpixel.io/v2/rpc/collect_timed_bonus', token);
    if (!res) {
      console.error(`Could not collect bonus for ${email}.`);
      return;
  }
  const accountData = await sendReq(
    null,
    `${BASE_URL}/account`,
    token,
    true
  );
}
async function getUserInfo1(email, password) {
  try {
    const token = 'Bearer ' + await getToken(email, password);
    if (!token || token.split('Bearer ')[1] === 'undefined') {
      console.error(`Could not log into account with email ${email}.`);
      return;
    }

    const res = await sendReq({}, 'https://dev-nakama.winterpixel.io/v2/rpc/collect_timed_bonus', token);
    if (!res) {
      console.error(`Could not collect bonus for ${email}.`);
      return;
    }

    const accountData = await sendReq(null, 'https://dev-nakama.winterpixel.io/v2/account', token, true);
    const wallet = JSON.parse(accountData.wallet);
    console.log(`Bonus collected for ${accountData.user.display_name}. Current coins: ${wallet.coins}`);
  } catch (err) {
    console.error('Error collecting bonus:', err);
    throw err; // Re-throw the error to handle it at the top level
  }
}

// Function to get token by providing email and password
async function getToken(email, password) {
  try {
    const data = {
      email,
      password,
      vars: { client_version: '99999' }
    };
    const response = await axios.post(
      'https://dev-nakama.winterpixel.io/v2/account/authenticate/email?create=false&=',
      data,
      {
        headers: {
          'Authorization': 'Basic OTAyaXViZGFmOWgyZTlocXBldzBmYjlhZWIzOTo='
        }
      }
    );
    return response.data.token;
  } catch (err) {
    console.error('Error getting token:', err);
    throw err; // Re-throw the error to handle it at the top level
  }
}


// Assuming you have the email and password available
const email = 'testsubject105@gmail.com';
const password = 'password';
module.exports.handler = async (event, context) => {
  try {
    const requests = accounts.map(account => getUserInfo1(account.email, account.password));
    await Promise.all(requests);
    console.log(`Claimed coins for ${accounts.length} accounts.`);
    return { statusCode: 200, body: 'Cron job executed successfully.' }; // Return success response
  } catch (err) {
    
    console.error('Error processing accounts:', err);
    return { statusCode: 500, body: 'Error executing cron job.' }; // Return error response
  }
};