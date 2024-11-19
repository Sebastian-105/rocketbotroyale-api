const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 8083;
const path = require('path');
const fs = require('fs');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const { json } = require('express/lib/response');
const { process_params } = require('express/lib/router');
let test_email = 'testsubject105@gmail.com';
let test_password = 'password';
let test_id = '52839799-0bad-4786-879b-8d5d9924d5cb';

const baseURL = 'https://dev-nakama.winterpixel.io/v2';

// Get profile
async function fcToID(fc, token) {
  const data = `\"{\\\"friend_code\\\":\\\"${fc}\\\"}\"`;
  console.log('Sending request with data:', data);

  return await fetch(
    `https://dev-nakama.winterpixel.io/v2/rpc/winterpixel_query_user_id_for_friend_code`,
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
      },
      body: data,
      method: 'POST',
    },
  )
    .then(function (res) {
      console.log('Response status:', res.status);
      return res.json();
    })
    .catch((err) => {
      console.error('Fetch error:', err);
    });
}
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
    return res.json();
  });
}

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


async function config() {
    const token = await updateToken(); // Fetch valid token  
    try {
      const response = await getConfig(token);
      const jsonData = JSON.parse(response);
      const payload1  = JSON.parse(jsonData.payload);  
      let skins = payload1["awards"];
      clientVerison = payload1["client_version"]
      console.log(clientVerison)
    
    } catch (error) {
      console.error(error.message);
    }
  }
 config()
async function updateToken() {
    try {
        const authResponse = await axios.post(
            'https://dev-nakama.winterpixel.io/v2/account/authenticate/email?create=false',
            JSON.stringify({
                email: test_email,
                password: test_password,
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
async function addToken(email, password) {
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

async function getStatus(id, token) {
  const token1 = await updateToken();
  const content = await getProfile(id, token1);

  let parsedContent = JSON.parse(content);
  let userID = parsedContent.user_id;
  let skin = parsedContent.skin;
  let friendCode = parsedContent.friend_code;
  let display_name = parsedContent.display_name;
  let online = parsedContent.online;

  const contenta = {
    User: display_name,
    Online: online,
    userID: userID,
    Skin: skin,
    'Friend Code': friendCode,
  };

  return contenta;
}

async function getLeaderboard(season, token) {
  return await fetch(
    'https://dev-nakama.winterpixel.io/v2/rpc/query_leaderboard',
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
      },
      body: `\"{\\\"leaderboard\\\":\\\"tankkings_trophies\\\",\\\"season\\\":${season}}\"`,
      method: 'POST',
    },
  ).then(function (res) {
    return res.text();
  });
}

async function api() {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  
 app.get('/v2/account/json/getProfile', async (req, res) => {
    const { id } = req.query; // Get playerID from query params

    if (!id) {
      return res.status(400).json({ error: 'playerID is required' });
    }

    try {
      const token = await updateToken(); // Assume updateToken fetches the required token
      const playerData = await getProfile(id, token); // Assume getProfile fetches user data
      res.json(playerData);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch player data' });
    }
  });
  app.get('/v2/account/json/fcToID', async (req, res) => {
    const { fc } = req.query; // Get playerID from query params

    if (!fc) {
      return res.status(400).json({ error: 'friend code is required' });
    }

    const token = await updateToken(); // Assume updateToken fetches the required token
    const playerData = await fcToID(fc, token);
    try {
      let newData = JSON.parse(JSON.parse(JSON.stringify(playerData)).payload); 
      let realData = newData.user_id
      console.log(realData)
      res.write(realData);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch player data' });
    }
  });

  app.get('/v2/json/getLeaderboards', async (req, res) => {
    const { ssn } = req.query; // Get playerID from query params
    var tempUrl = ssn.replace(/%20/g, ' ');
    let ssnList = tempUrl.split(' ');
    if (!ssn) {
      return res.status(400).json({ error: 'Season Number is required' });
    }
    if (ssn.length > 3) {
      return res.status(400).json({ error: 'Season is required' });
    }

    try {
      const token = await updateToken();
      for (let index = 0; index < ssnList.length; index++) {
        const element = ssnList[index];
        const leaderboards1 = await getLeaderboard(ssn, token);
        res.json(leaderboards1);
        
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  });

  app.get('/v2/p/getLeaderboards', async (req, res) => {
    const { ssn } = req.query;
    var tempUrl = ssn.replace(/%20/g, ' ');
    let ssnList = tempUrl.split(' ');
    if (!ssn) {
      return res.status(400).json({ error: 'Season is required' });
    }
    if (ssn.length > 3) {
      return res.status(400).json({ error: 'Season is required' });
    }

    try {
      async function leaderboards(season) {
        let token = await updateToken();

        for (let index = 0; index < season.length; index++) {
          const element = season[index];
          let leaderboard = await getLeaderboard(element, token);
          const jsonData = JSON.parse(leaderboard);
          const payload = JSON.parse(jsonData.payload);

          payload.records.forEach((record) => {
            let content = `<strong>Username: ${record.username},</strong>\nRank: ${record.rank},\nScore: ${record.score}, \nUser ID: ${record.owner_id}\n<hr class="barrier"/>`;
            res.write(content);
          });
        }
        res.end(); // End the response once all records are sent
      }
      leaderboards(ssnList);
    } catch (err) {
      res.status(500).json({
        error: 'Failed to fetch leaderboard data',
        details: err.message,
      });
    }
  });
  app.get('/v2/getAllTop50', async (req, res) => {
    //Search user
    const allSSN = [
      10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
      29, 30, 31, 32, 33, 34, 35, 36,
    ];
    const { name, userID } = req.query;

    if (!name && !userID) {
      res.send('Use user ID or username');
    } else {
      newName = name ? name.toString().toLowerCase() : undefined;
      console.log(newName);
    }
    console.log(`Name: ${newName}\nUser ID: ${userID}`);

    try {
      async function leaderboards(season, searchName, searchID, res) {
        let token = await updateToken();
        for (let index = 0; index < season.length; index++) {
          const element = season[index];
          let leaderboard = await getLeaderboard(element, token);
          const jsonData = JSON.parse(leaderboard);
          const payload = JSON.parse(jsonData.payload);

          payload.records.forEach((record) => {
            if (!searchName && searchID) {
              if (record.owner_id.includes(searchID)) {
                let seasonNumber = record.leaderboard_id.split(
                  'tankkings_trophies_',
                )[1];
                let content = `Username: ${record.username}\nUser ID: ${record.owner_id}\nSeason: ${seasonNumber}\nRank: ${record.rank}\n<hr class="barrier"/>\n`;
                res.write(content);
              }
            } else if (!searchID && searchName) {
              newUsername = record.username
                ? record.username.toString().toLowerCase()
                : undefined;
              if (newUsername.includes(searchName)) {
                let seasonNumber = record.leaderboard_id.split(
                  'tankkings_trophies_',
                )[1];
                let content = `Username: ${record.username},\nUser ID: ${record.owner_id},\nSeason: ${seasonNumber},\nRank: ${record.rank},\n<hr class="barrier"/>\n`;
                res.write(content);
              }
            }
            if (record.username.includes(searchName)) {
              let seasonNumber = record.leaderboard_id.split(
                'tankkings_trophies_',
              )[1];
              let content = `Username: ${record.username},\nUser ID: ${record.owner_id},\nSeason: ${seasonNumber},\nRank: ${record.rank},\n<hr class="barrier"/>\n`;
              res.write(content);
            }
          });
        }
        res.end();
      }

      leaderboards(allSSN, newName, userID, res);
    } catch (err) {
      console.log(err.message);
    }
  });
  app.get('/v2/getAllPlacements', async (req, res) => {
    const allSSN = [
      11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
      30, 31, 32, 33, 34, 35, 36,
    ];
    const { place } = req.query;
    var tempUrl = place.replace(/%20/g, ' ');
    let placeList = tempUrl.split(' ');

    if (!place || place > 50) {
      return res.send('Invalid set of placements'); // Add return to prevent further execution
    }

    try {
      async function leaderboards(season, placement, res) {
        let token = await updateToken();
        for (let main = 0; main < placement.length; main++) {
          const newElement = placement[main];
          for (let index = 0; index < season.length; index++) {
            const element = season[index];
            let leaderboard = await getLeaderboard(element, token);
            const jsonData = JSON.parse(leaderboard);
            const payload = JSON.parse(jsonData.payload);

            payload.records.forEach((record) => {
              if (record.rank === Number(newElement)) {
                let seasonNumber = record.leaderboard_id.split(
                  'tankkings_trophies_',
                )[1];
                let content = `Username: ${record.username}\nUser ID: ${record.owner_id}\nSeason: ${seasonNumber}\nRank: ${record.rank}\n<hr class="barrier"/>\n`;
                res.write(content);
              }
            });
          }
        }
        res.end();
      }

      await leaderboards(allSSN, placeList, res);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('An error occurred while processing your request.');
    }
  });

  app.get('/v2/account/p/checkSkill', async (req, res) => {
    // prettier version of it
    const { id } = req.query; // Get playerID from query params
    const idList = id.split(' ');
    console.log(`Check Skill:\nIDs\n${idList}`);
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    try {
      res.write(
        `\n\nHow it works:\nThis hopefully will semi-accurately guess an players skill based on their stats. Each stat is on a scale of 1-10, then I will average it out. But best rank is the most skill defining stat so it would mean more points. If best rank exceeds 1000, then it goes negative\nAs of now there is no cap for scoring, but 117.76 was the highest I could find, see if you can find anyone with a higher score (d02c1463-5960-46e2-8e6d-efafb1319db6)\n\n<hr />\n\n`,
      );
      async function skillCheck(userID) {
        let token = await updateToken();
        for (let index = 0; index < userID.length; index++) {
          const element1 = userID[index];
          const acontent = await getProfile(element1, token);
          let newContent = JSON.parse(
            JSON.parse(JSON.stringify(acontent)).payload,
          )[0];
          let display_name = newContent.display_name;
          let wins = newContent.metadata.stats.games_won;
          let played = newContent.metadata.stats.games_played;
          let online = newContent.online;
          let rank = newContent.metadata.stats.best_rank;
          let totalkills = newContent.metadata.stats.total_kills;
          let player_kills = newContent.metadata.stats.player_kills;
          let deaths = newContent.metadata.stats.deaths;

          let level = newContent.metadata.progress.level;
          let exp = newContent.metadata.progress.xp;
          let winrate1 = played / wins;
          let kd1 = player_kills / deaths;
          let winrate = winrate1.toFixed(2);
          let kd = kd1.toFixed(2);

          let kdSkill = kd * kd + 2;
          console.log(`KD ${kdSkill}`);
          let winrateSkill = 15 - winrate;
          console.log(`Winrate ${winrateSkill}`);
          let best_rankSkill = (1000 - rank * rank) / 100;
          if (rank == 1) {
            best_rankSkill = 15;
          } else if (rank == 2) {
            best_rankSkill = 13;
          } else if (rank == 3) {
            best_rankSkill = 10;
          }

          console.log(`Best rank ${best_rankSkill}`);
          let best_rankSkill1 = Math.round(best_rankSkill * 3 * 100) / 100;
          let winrateSkill1 = Math.round(winrateSkill * 2.5 * 100) / 100;
          let kdSkill1 = Math.round(kdSkill * 2 * 100) / 100;
          let finalSkill =
            Math.round((best_rankSkill1 + winrateSkill1 + kdSkill1) * 100) /
            100;
          console.log(finalSkill);
          let contentFinal = `Username: ${display_name}\n\nTotal Score: ${finalSkill}\n\nBreakdown:\nBest Rank Points: ${best_rankSkill1} | Best Rank: ${rank}\nWinrate Points: ${winrateSkill1} | Winrate: ${winrate}\nKDR Points: ${kdSkill1} | KDR ${kd}\n\n<hr/>\n\n`;
          res.write(contentFinal);
        }

        res.end();
      }
      skillCheck(idList);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch player data', err });
    }
  });
  app.get('/v2/account/p/getProfile', async (req, res) => {
    // prettier version of ita
    const { id } = req.query; // Get playerID from query params
    var tempUrl = id.replace(/%20/g, ' ');
    const idList = tempUrl.split(' ');
    console.log(`Get Profile:\nIDs\n${idList}`);

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }
   

    try {
      async function getProfileP(userID) {
        let token = await updateToken();
        // let rawContent = JSON.parse(JSON.stringify(content)).payload;
        // console.log(`Raw content:${rawContent}`);
        for (let index = 0; index < userID.length; index++) {
          const element = userID[index];
          const content = await getProfile(element, token);
          let newContent = JSON.parse(
            JSON.parse(JSON.stringify(content)).payload,
          )[0];
          let ownerID = newContent.user_id;
          let skin = newContent.metadata.skin;
          let friendCode = newContent.metadata.friend_code;
          let display_name = newContent.display_name;
          let online = newContent.online;
          let createTime1 = newContent.create_time * 1000;
          const createTime = new Date(createTime1).toDateString('en-US', {
            timeZone: 'America/New_York',
          });
          const createTime2 = new Date(createTime1).toLocaleTimeString(
            'en-US',
            {
              timeZone: 'America/New_York',
            },
          );
          let accUpdateTime1 = newContent.update_time * 1000;
          const accUpdateTime2 = new Date(accUpdateTime1).toDateString(
            'en-US',
            {
              timeZone: 'America/New_York',
            },
          );
          const accUpdateTime = new Date(accUpdateTime1).toLocaleTimeString(
            'en-US',
            { timeZone: 'America/New_York' },
          );
          let dKills = newContent.metadata.stats.double_kills;
          let rank = newContent.metadata.stats.best_rank;
          let tKills = newContent.metadata.stats.triple_kills;
          let qKills = newContent.metadata.stats.quad_kills;
          let flak = newContent.metadata.stats.kills_using_flak;
          let drill = newContent.metadata.stats.kills_using_drill;
          let grenade = newContent.metadata.stats.kills_using_grenade;
          let homing = newContent.metadata.stats.kills_using_homing;
          let laser = newContent.metadata.stats.kills_using_laser;
          let mine = newContent.metadata.stats.kills_using_mine;
          let nuke = newContent.metadata.stats.kills_using_nuke;
          let poison = newContent.metadata.stats.kills_using_poison;
          let shield = newContent.metadata.stats.kills_using_shield;
          let rapid = newContent.metadata.stats['kills_using_triple-shot'];
          let dunks = newContent.metadata.stats.dunk_tanks;
          let totalkills = newContent.metadata.stats.total_kills;
          let level = newContent.metadata.progress.level;
          let exp = newContent.metadata.progress.xp;

          let contentFinal = `Display Name: ${display_name}\nOnline: ${online}\nUser ID: ${ownerID}\nFriend Code: ${friendCode}\nBest Rank: ${rank}\nLevel: ${level}\nTotal XP: ${exp}\n\n<hr class="barrier"/>\n\nTargetting:\n\nSkin: ${skin}\n\n<hr class="barrier"/>\n\nAdvanced:\n\nAccount Created (EST): ${createTime} | ${createTime2}\nLast Account Update (EST): ${accUpdateTime2} | ${accUpdateTime}\n\n<hr class="barrier"/>\n\nStats:\n\nDouble Kills: ${dKills}\nTriple Kills: ${tKills}\nQuad Kills: ${qKills}\n\n<hr class="barrier"/>\n\nKills using:\nMines: ${mine}\nDrills ${drill}\nNukes ${nuke}\nFlak ${flak}\nGrenade: ${grenade}\nHoming: ${homing}\nLaser: ${laser}\nPoison: ${poison}\nShield: ${shield}\nRapids: ${rapid}\nDunks: ${dunks}\nTotal Kills: ${totalkills}\n\n\n<hr />\n\n\n`;
          res.write(contentFinal);
        }
        res.end();
      }
      getProfileP(idList);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch player data', err });
    }
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
if (require.main === module) {
  api();
  console.log('This only runs when set file is is executed directly');
}

module.exports = { getProfile, updateToken };
