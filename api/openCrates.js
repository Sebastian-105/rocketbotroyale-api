const axios = require('axios');
const colors = require('colors');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Variables
let logText = '';
let username = '';
let password = '';
let amount = 0;
let token = ''; // Do not touch this variable
let failCount = 0;
let successCount = 0;

// Input prompts
rl.question(colors.magenta('Enter email: '), (userInput) => {
    username = userInput;
    rl.question(colors.cyan('Enter password: '), (passInput) => {
        password = passInput;
        rl.question(colors.yellow('Enter amount: '), (amountInput) => {
            amount = parseInt(amountInput);
            rl.question(`These actions are irreversible, and you're taking a risk by opening ${colors.red('BASIC')}${colors.yellow(' crates.')} Press enter to continue, close the program to cancel.\n`, () => {
                getToken().then((result) => {
                    token = result;
                    openCrates(amount).then(() => {
                        fs.appendFileSync('logs.txt', colors.green(`Got ${successCount} new items.\n`));
                        fs.appendFileSync('logs.txt', colors.red(`Wasted ${failCount} crate opportunities.\n`));
                        console.log(colors.white('Finished task. Refer to logs.txt inside the directory to see what you got.'));
                        rl.close();
                    });
                });
            });
        });
    });
});

// Get token
async function getToken() {
    try {
        const response = await axios.post('https://dev-nakama.winterpixel.io/v2/account/authenticate/email?create=false', {
            email: username,
            password: password,
            vars: {
                client_version: '99999'
            }
        }, {
            headers: {
                authorization: 'Basic OTAyaXViZGFmOWgyZTlocXBldzBmYjlhZWIzOTo='
            }
        });
        return response.data.token;
    } catch (error) {
        console.error('Error fetching token:', error.response.data);
        process.exit(1); // Exit if error occurs
    }
}

// Open crates
async function openCrates(amount) {
    for (let i = 0; i < amount; i++) {
        try {
            const response = await axios.post('https://dev-nakama.winterpixel.io/v2/rpc/tankkings_consume_lootbox', {
                unique: false
            }, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });

            const resData = response.data;
            if (resData.payload && resData.payload.includes('true')) {
                const tank = JSON.parse(resData.payload).award_id;
                if (tank.includes('trail')) {
                    logText = `Unlocked the new trail ${tank.split('_')[1]}`;
                } else {
                    logText = `Unlocked the new tank ${tank}`;
                }
                console.log(colors.green(logText));
                fs.appendFileSync('logs.txt', logText + '\n');
                successCount++;
            } else {
                failCount++;
                console.log(colors.red(`${failCount}x fail(s) so far.`));
            }
        } catch (error) {
            console.error('Error opening crate:', error.response.data);
            failCount++;
        }
        await new Promise((resolve) => setTimeout(resolve, 200)); // sleep for 200ms
    }
}
