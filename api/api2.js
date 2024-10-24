const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');

app.use(cors());
app.use(express.json());

const { json } = require('express/lib/response');
const { process_params } = require('express/lib/router');
let test_email = 'testsubject105@gmail.com';
let test_password = 'password';
const baseURL = 'https://dev-nakama.winterpixel.io/v2';

// Get profile
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
async function updateToken() {
  return await fetch(`${baseURL}/account/authenticate/email?create=false&`, {
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
    body: `{\"email\":\"${test_email}\",\"password\":\"${test_password}\",\"vars\":{\"client_version\":\"66\",\"platform\":\"HTML5\"}}`,
    method: 'POST',
  })
    .then(function (res) {
      // console.log(res);
      return res.json();
    })
    .then(function (json) {
      return json['token'];
    });
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

  app.get('/v2/json/getLeaderboards', async (req, res) => {
    const { ssn } = req.query; // Get playerID from query params

    if (!ssn) {
      return res.status(400).json({ error: 'Season Number is required' });
    }

    try {
      const token = await updateToken();
      const leaderboards1 = await getLeaderboard(ssn, token);
      res.json(leaderboards1);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  });

  app.get('/v2/p/getLeaderboards', async (req, res) => {
    const { ssn } = req.query;

    if (!ssn) {
      return res.status(400).json({ error: 'Season is required' });
    }

    try {
      async function leaderboards(season) {
        let token = await updateToken();

        let leaderboard = await getLeaderboard(season, token);

        try {
          const jsonData = JSON.parse(leaderboard);
          const payload = JSON.parse(jsonData.payload);

          // console.log('Next Cursor:', payload.next_cursor);

          payload.records.forEach((record) => {
            let content = `Username: ${record.username}, \nScore: ${record.score}, \nRank: ${record.rank}, \nUser ID: ${record.owner_id}\n===========================================================================================\n`;
            res.write(content); // Send each user's data without closing the response
          });

          res.end(); // End the response once all records are sent
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          res.status(500).json({ error: 'Error parsing JSON' });
        }
      }
      leaderboards(ssn);
    } catch (err) {
      res.status(500).json({
        error: 'Failed to fetch leaderboard data',
        details: err.message,
      });
    }
  });
  app.get('/v2/account/p/checkSkill', async (req, res) => {
    // prettier version of it
    const { id } = req.query; // Get playerID from query params

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    try {
      async function skillCheck(userID) {
        let token = await updateToken();
        const content = await getProfile(userID, token);
        let rawContent = JSON.parse(JSON.stringify(content)).payload;
        // console.log(`Raw content:${rawContent}`);

        let newContent = JSON.parse(
          JSON.parse(JSON.stringify(content)).payload,
        )[0];
        let ownerID = newContent.user_id;
        let skin = newContent.metadata.skin;
        let friendCode = newContent.metadata.friend_code;
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
        console.log(winrate);
        let kd = kd1.toFixed(2);
        console.log(kd);
        // Algorithm, hopefully, out of 10, this is written very primitively i know.
        let kdSkill = (kd * 2 + 2).toFixed(1);
        console.log(`KD ${kdSkill}`);
        let winrateSkill = (10 - winrate).toFixed(1);
        console.log(`Winrate ${winrateSkill}`);
        let best_rankSkill = (100 - rank) / 10;
        if (rank == 1) {
          best_rankSkill = 15;
        } else if (rank == 2) {
          best_rankSkill = 13;
        } else if (rank == 3) {
          best_rankSkill = 11;
        }

        console.log(`Best rank ${best_rankSkill}`);

        let finalSkill = best_rankSkill * 3 + winrateSkill * 2 + kdSkill * 1.5;
        let finalSkill1 = finalSkill.toFixed(2);
        console.log(finalSkill1);

        let contentFinal = `How it works:\nThis hopefully will semi-accurately guess an players skill based on their stats. Each stat is on a scale of 1-10, then I will average it out. But best rank is the most skill defining stat so it would mean more points. If best rank exceeds 500, then it goes negative\n\n========================================\n\nUsername: ${display_name}\n\nTotal Score: ${finalSkill1}\n\nBreakdown:\nBest Rank: ${best_rankSkill}\nWinrate Skill: ${winrateSkill}\nKDR Skill: ${kdSkill}`;
        res.write(contentFinal);
        res.end();
      }
      skillCheck(id);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch player data', err });
    }
  });
  app.get('/v2/account/p/getProfile', async (req, res) => {
    // prettier version of it
    const { id } = req.query; // Get playerID from query params

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    try {
      async function getProfileP(userID) {
        let token = await updateToken();
        const content = await getProfile(userID, token);
        let rawContent = JSON.parse(JSON.stringify(content)).payload;
        console.log(`Raw content:${rawContent}`);

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
        const createTime2 = new Date(createTime1).toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
        });
        let accUpdateTime1 = newContent.update_time * 1000;
        const accUpdateTime2 = new Date(accUpdateTime1).toDateString('en-US', {
          timeZone: 'America/New_York',
        });
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

        let contentFinal = `Display Name: ${display_name}\nOnline: ${online}\nUser ID: ${ownerID}\nFriend Code: ${friendCode}\nBest Rank: ${rank}\nLevel: ${level}\nTotal XP: ${exp}\n\n========================================\n\nTargetting:\n\nSkin: ${skin}\n\n========================================\n\nAdvanced:\n\nAccount Created (EST): ${createTime} | ${createTime2}\nLast Account Update (EST): ${accUpdateTime2} | ${accUpdateTime}\n\n========================================\n\nStats:\n\nDouble Kills: ${dKills}\nTriple Kills: ${tKills}\nQuad Kills: ${qKills}\n\n========================================\n\nKills using:\nMines: ${mine}\nDrills ${drill}\nNukes ${nuke}\nFlak ${flak}\nGrenade: ${grenade}\nHoming: ${homing}\nLaser: ${laser}\nPoison: ${poison}\nShield: ${shield}\nRapids: ${rapid}\nDunks: ${dunks}\nTotal Kills: ${totalkills}`;
        res.write(contentFinal);
        res.end();
      }
      getProfileP(id);
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
  console.log('This only runs when file1.js is executed directly');
}

module.exports = { getProfile, updateToken };
