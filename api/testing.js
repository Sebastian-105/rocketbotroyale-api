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

// Function to read accounts from a JSON file (if needed later)
function fetchAccounts() {
  try {
    const data = fs.readFileSync('json/accounts.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading accounts from file:', error);
    process.exit(1);
  }
}

// Function to send requests using axios
async function sendReq(data, url, token, isGet = false) {
  const headers = {
    Authorization: `Bearer ${token}`,
    ...BASE_HEADERS,
  };

  try {
    const response = isGet
      ? await axios.get(url, { headers })
      : await axios.post(url, data, { headers });
      
    return response.data;
  } catch (err) {
    console.error(
      `Error in sendReq: ${err.response ? err.response.data.message : err.message}`
    );
    return null;
  }
}

// Function to get user info using the token
async function getUserInfo(token) {
  const accountData = await sendReq(
    null,
    `${BASE_URL}/account`,
    token,
    true
  );
}

// Function to get token by providing email and password
async function getToken(email, password) {
  const data = {
    email: email,
    password: password,
    vars: { client_version: CLIENT_VERSION },
  };
  try {
    let response = await axios.post(
      `${BASE_URL}/account/authenticate/email?create=false&=`,
      data,
      {
        headers: {
          Authorization: `Basic OTAyaXViZGFmOWgyZTlocXBldzBmYjlhZWIzOTo=`,
        },
      }
    );
    return response.data.token;

  } catch (err) {
    console.error(
      `Error in getToken: ${err.response ? err.response.data : err.message}`
    );
    return null;
  }
}

// Assuming you have the email and password available
const email = '28schapfel105@gmail.com';
const password = '28address';

// Main function to execute the flow
async function main() {
  // Read the token from the file if it exists
  let token;
  console.log(token)
  if (token) {
    token = await getToken(email, password);
    if (!token) {
      console.log('Failed to retrieve token');
      return;
    }
  }
  
  console.log('Token:', token);
  await getUserInfo(token);  // Passing token to getUserInfo function
}

main(); // Call the main function to execute the code

