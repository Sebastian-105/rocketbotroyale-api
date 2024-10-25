const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const path = require('path');
const fs = require('fs');

app.use(cors());
app.use(express.json());

const { json } = require('express/lib/response');
const { process_params } = require('express/lib/router');
let test_email = 'testsubject105@gmail.com';
let test_password = 'password';
let user_id = '51f07406-fc78-4614-be50-aca39e3393a5'; // This has to be the user's custom id not their user id
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
      body: `{"email":"${test_email}","password":"${test_password}","id":"${user_id}","vars":{"client_version":"67","platform":"HTML5"}}`,
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

async function deleteAccounts(token) {
  return await fetch(`${baseURL}/account`, {
    headers: {
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      authorization: `Bearer ${token}`,
      // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJmOTFkZTY1Ni05NGU0LTRjOTQtOWY5NS1hMWZjMGM4ZjYwM2MiLCJ1c24iOiJXUUdjWElwbE5PIiwidnJzIjp7ImNsaWVudF92ZXJzaW9uIjoiNjciLCJwbGF0Zm9ybSI6IkhUTUw1In0sImV4cCI6MTcyOTg2NDk1N30.2Dj1qYsspBDeudu5VD_pmVGsR2B1gPQokbVhSoNYKxw
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
async function getAccount() {
  return await fetch(`${baseURL}/account`, {
    headers: {
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI4YTZlNzVhOS04NDI1LTQ3ZjAtODYzNS04MjIyMTNiM2ZmZGMiLCJ1c24iOiJBa29VSkRCZEpPIiwidnJzIjp7ImNsaWVudF92ZXJzaW9uIjoiNjciLCJwbGF0Zm9ybSI6IkhUTUw1In0sImV4cCI6MTcyOTg2NTE2MH0.U0HisDtmkntgCpkWrQCv_EqdX8VYRnld5jLpqltCcck`,
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
  // let profile = await getProfile()
  let fetchAccount = await getAccount();
  // console.log(token);
  console.log(deleteAccount);
  // console.log(fetchAccount)
}
main();

// just insert someones pass and email then user their custom id