const { getProfile, updateToken } = require('../api');
const { json } = require('express/lib/response');
const { process_params } = require('express/lib/router');
const fs = require('fs');
const user_id = process.argv.slice(2);
console.log(user_id);
const baseURL = 'https://dev-nakama.winterpixel.io/v2';

async function isOnline(id, token) {
  return await getProfile(id, token).then(function (str) {
    return str.split('\\"online\\":')[1].split(',')[0];
  });
}


async function killstreaks(id, token) {
  let displayName = await getDisplayName(id, token);
  return await getProfile(id, token).then(function (str) {
    let triples = str.split('\\"triple_kills\\":')[1].split(',')[0];
    let doubles = str.split('\\"double_kills\\":')[1].split(',')[0];
    let quads = str.split('\\"quad_kills\\":')[1].split(',')[0];
    let online = str.split('\\"online\\":')[1].split(',')[0];

    let allContent = `User ${displayName} (Online: ${online}) has \n ${triples} triples \n ${doubles} doubles \n ${quads} quads`;
    return allContent;
  });
}
async function getStatus(id, token) {
  return await getProfile(id, token).then(function (str1) {
    let newContent = JSON.parse(JSON.parse(JSON.stringify(str1)).payload)[0];
    let ownerID = newContent.user_id;
    let skin1 = newContent.metadata.skin;
    let friendCode1 = newContent.metadata.friend_code;
    let display_name = newContent.display_name;
    let online1 = newContent.online;
    // let userID = str1.split('\\"user_id\\":\\"')[1].split('\\",')[0];
    // let online = str1.split('\\"online\\":')[1].split(',')[0];
    // let skin = str1.split('\\"skin\\":\\"')[1].split('\\",')[0];
    // let friendCode = str1.split('\\"friend_code\\":\\"')[1].split('\\",')[0];
    let allContent = `User ${display_name} (Online: ${online1})\nUserID: ${ownerID}\nSkin: ${skin1}\nFriend Code: ${friendCode1}`;
    return allContent;
  });
  asdfa;
}
async function returnKillstreaks() {
  let token = await updateToken();
  let ks = await killstreaks(user_id, token);
  console.log(ks);
}
// returnKillstreaks()

async function returnStatus() {
  let token = await updateToken();
  for (let index = 0; index < user_id.length; index++) {
    const i = user_id.length - 1
    const element = user_id[index];
    let content = await getStatus(element, token);
    console.log(`${content}\n====================================================\n`);
  }
}
returnStatus();
