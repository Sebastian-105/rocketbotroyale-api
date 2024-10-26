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
      body: `{"email":"${test_email}","password":"${test_password}","id":"${test_id}","vars":{"client_version":"67","platform":"HTML5"}}`,
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
      res.json(newData);
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
        try {
          newContent = JSON.parse(
            JSON.parse(JSON.stringify(content)).payload,
          )[0];
        } catch (error) {
        }

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
          Math.round((best_rankSkill1 + winrateSkill1 + kdSkill1) * 100) / 100;
        console.log(finalSkill);

        let contentFinal = `How it works:\nThis hopefully will semi-accurately guess an players skill based on their stats. Each stat is on a scale of 1-10, then I will average it out. But best rank is the most skill defining stat so it would mean more points. If best rank exceeds 1000, then it goes negative\nAs of now there is no cap for scoring, but 117.76 was the highest I could find, see if you can find anyone with a higher score (d02c1463-5960-46e2-8e6d-efafb1319db6)\n\n========================================\n\nUsername: ${display_name}\n\nTotal Score: ${finalSkill}\n\nBreakdown:\nBest Rank Points: ${best_rankSkill1} | Best Rank: ${rank}\nWinrate Points: ${winrateSkill1} | Winrate: ${winrate}\nKDR Points: ${kdSkill1} | KDR ${kd}`;
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
  console.log('This only runs when set file is is executed directly');
}

module.exports = { getProfile, updateToken };
