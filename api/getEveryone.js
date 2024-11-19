let test_email = 'qwerty12345@gmail.com';
let test_password = 'Dumboy101';
const axios = require('axios');
const fs = require('fs')
const { json } = require('express/lib/response');
async function getConfig(token) {
  return await fetch(
    'https://dev-nakama.winterpixel.io/v2/rpc/winterpixel_get_config',
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    },
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.text(); // Parse response as JSON
    })
    .catch((error) => {
      console.error(`Error in fetch: ${error.message}`);
    });
}


async function main() {
    const token = await updateToken(); // Fetch valid token  
    try {
      const response = await getConfig(token);
      const jsonData = JSON.parse(response);
      const payload1  = JSON.parse(jsonData.payload);  
      console.log(payload1["awards"][])
    
    } catch (error) {
      console.error(error.message);
    }
  }
main()
