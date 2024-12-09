const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
const port = 8080;
const path = require('path');
const fs = require('fs');

app.use(cors());
app.use(express.json());

const { json } = require('express/lib/response');
const { process_params } = require('express/lib/router');
let test_email = '';
let test_password = '';
const baseURL = 'https://dev-nakama.winterpixel.io/v2';

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
    console.log(json);
    return res.json();
  });
}

async function updateToken() {
  try {
    const authResponse = await axios.post(
      'https://dev-nakama.winterpixel.io/v2/account/authenticate/email?create=false',
      JSON.stringify({
        email: test_email,
        password: test_password,
        vars: { client_version: '99999' },
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic OTAyaXViZGFmOWgyZTlocXBldzBmYjlhZWIzOTo=',
        },
      },
    );

    const token = authResponse.data.token;

    if (!token) {
      throw new Error('No token received');
    }

    return token;
  } catch (error) {
    throw new Error(
      `Error fetching token: ${
        error.response ? JSON.stringify(error.response.data) : error.message
      }`,
    );
  }
}

async function deleteAccounts(token) {
  return await fetch(`${baseURL}/account`, {
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
    // body:
    method: 'DELETE',
  }).then(function (res) {
    return res.json();
  });
}
async function getAccount(token) {
  return await fetch(`${baseURL}/account`, {
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
    // body:
    method: 'GET',
  }).then(function (res) {
    return res.json();
  });
}
async function main() {
  let token = await updateToken();
  let deleteAccount = await deleteAccounts(token);
  console.log(token);
  console.log(deleteAccount)
}
main();

