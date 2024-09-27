const axios = require('axios');

// Configurations
const accounts = [
  { email: '', password: '' },
  { email: '', password: '' }, // Max, hopefully; if he lets me
  { email: '28schapfel105@gmail.com', password: '28address' }, // Blaze
  { email: '29stu137@lexingtonma.org', password: '123654789' }, // [KAG] ThunderTOAD
  { email: 'sebastian105schapfel@gmail.com', password: 'HELP179coup' }, // 105 | Sebastian
  // Add more accounts as needed
];
const timerDelay = 60000; // milliseconds

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

async function getToken(email, password) {
  try {
    const data = {
      email,
      password,
      vars: { client_version: `65` }
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

async function collectBonus(email, password) {
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
async function main() {
      console.log("starting")

  try {
    const requests = accounts.map(account => collectBonus(account.email, account.password));
    await Promise.all(requests);
    console.log(`Claimed coins for ${accounts.length} accounts.`);
    return { statusCode: 200, body: 'Cron job executed successfully.' }; // Return success response
  } catch (err) {
    console.error('Error processing accounts:', err);
    return { statusCode: 500, body: 'Error executing cron job.' }; // Return error response
  }
}
main()