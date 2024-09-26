const fs = require('fs');
const axios = require('axios');
const express = require('express');

const CLIENT_VERSION = "99999";
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
    if (err.response) {
      // Log more details from the error response
      console.error('Error in sendReq:', {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data,
      });
    } else {
      // Handle network or other errors
      console.error('Error in sendReq:', err.message);
    }
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

  if (accountData) {
    const wallet = JSON.parse(accountData.wallet);
    const user = accountData.user;
    console.log('User Info:', user, 'Wallet:', wallet);
  } else {
    console.log('Failed to retrieve user info');
  }
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
const email = 'naitsabes105@gmail.com';
const password = 'FOUND105adopt';

// Main function to execute the flow
async function main() {
  const token = await getToken(email, password);
  console.log('Token:', token);
  if (token) {
    await getUserInfo(token);
  }
}

main(); // Call the main function to execute the code
