const fs = require('fs');
const axios = require('axios');

// Define accounts directly in an array
const accounts = [
  { un: 'testsubject105@gmail.com', pw: 'password' }, // Blaze
  // Add more accounts as needed
];

const timerDelay = 60000; // Example delay, adjust as needed
let failAmount = 0;
let message;

async function sendReq(data, url, auth, get) {
  console.log('Sending data:', JSON.stringify(data));
  try {
    const config = {
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json' // Ensure the content type is set to JSON
      }
    };
    
    let response;
    if (get) {
      response = await axios.get(url, config);
    } else {
      // Check that data is in the correct format expected by the API
      response = await axios.post(url, JSON.stringify(data), config); // Ensure data is stringified correctly
    }

    return response.data;
  } catch (err) {
    console.error('Error in sendReq:', err.response ? err.response.data : err.message);
    return; // Handle the error as needed
  }
}

async function getToken(email, password) {
  const data = { "email": email, "password": password, "vars": { "client_version": "99999" } };
  try {
    let response = await axios.post(
      `https://dev-nakama.winterpixel.io/v2/account/authenticate/email?create=false&=`,
      data,
      { headers: { 'Authorization': `Basic OTAyaXViZGFmOWgyZTlocXBldzBmYjlhZWIzOTo=` } }
    );
    return response.data.token;
  } catch (err) {
    console.error(`Error in getToken: ${err.response ? err.response.data : err.message}`);
    return null;
  }
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function collectBonus(email, password) {
  const token = "Bearer " + await getToken(email, password);
  if (!token || token.split("Bearer ")[1] === "undefined") {
    failAmount++;
    console.log(`Could not log into account with email ${email}.`);
    return;
  }
  
  const res = await sendReq({}, "https://dev-nakama.winterpixel.io/v2/rpc/collect_timed_bonus", token);
  
  // Get current coins
  const accountData = await sendReq(null, "https://dev-nakama.winterpixel.io/v2/account", token, 1);
  if (!accountData) {
    failAmount++;
    console.log(`Failed to fetch account data for ${email}.`);
    return;
  }

  const wallet = JSON.parse(accountData.wallet);
  const user = accountData.user;
  
  if (!res) {
    failAmount++;
    console.log(`Could not collect ${user.display_name}'s time bonus. Current Coins: ${wallet.coins}`);
    return;
  }

  console.log(`Bonus collected for ${user.display_name}. Current coins: ${wallet.coins}`);
}

async function index() {
  failAmount = 0;
  let requests = accounts.map(account => collectBonus(account.un, account.pw));
  await Promise.all(requests);
  console.log(`Claimed coins for ${accounts.length - failAmount} accounts.`);
  process.exit();  // Terminate the script after completion
}

index().catch(err => {
  console.error(err);
  process.exit(1);  // Exit with an error code if something goes wrong
});
