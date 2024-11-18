// getToken.js
const axios = require('axios');
async function getProfile(id, token) {
  return await fetch(`https://dev-nakama.winterpixel.io/v2/rpc/rpc_get_users_with_profile`, {
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
async function getProfilef(id, token) {
  try {
    const response = await axios.post(
      `https://dev-nakama.winterpixel.io/v2/rpc/rpc_get_users_with_profile`, 
      // The payload is now a JSON object
      {
        ids: [id]
      },
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
        }
      }
    );
    
    return response.json(); // The response data from the API
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}

async function getToken(email, password) {
    try {
        const authResponse = await axios.post(
            'https://dev-nakama.winterpixel.io/v2/account/authenticate/email?create=false',
            JSON.stringify({
                email: email,
                password: password,
                vars: { client_version: "99999" }
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic OTAyaXViZGFmOWgyZTlocXBldzBmYjlhZWIzOTo='
                }
            }
        );

        const token = authResponse.data.token;

        if (!token) {
            throw new Error('No token received');
        }

        return token;
    } catch (error) {
        throw new Error(`Error fetching token: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
    }
}


async function main() {
  const email = "naitsabes105@gmail.com"
  const password = "FOUND105adopt"
  let token = await getToken(email, password);
  let profile = await getProfile("a708a73b-8ac7-4649-a752-917970737cc5", token)
  console.log(token)
  console.log(profile)
}
main()