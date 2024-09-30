async function getWeaponKills(id, token) {
  return await getProfile(id, token).then(function(str) {
    function extractValue(key, str) {
      // Create a dynamic regex pattern using the key
      const regex = new RegExp(`\\"${key}\\":\\"?([^,\\}]*)\\"?`);
      const match = str.match(regex);
      return match ? match[1] : null;
  }

  let str = `your_string_here`; // Replace this with your actual string

  // Define the keys dynamically
  let flaksUsed = extractValue('flaks_used', str);
  let flakKills = extractValue('kills_using_flak', str);
  let grenadesUsed = extractValue('grenades_used', str);
  let grenadeKills = extractValue('kills_using_grenade', str);
  let drillsUsed = extractValue('drills_used', str);
  let drillKills = extractValue('kills_using_drills', str);
  let homingsUsed = extractValue('homings_used', str);
  let homingKills = extractValue('kills_using_homing', str);
  let minesUsed = extractValue('mines_used', str);
  let mineKills = extractValue('kills_using_mine', str);
  let laserUsed = extractValue('lasers_used', str);
  let laserKills = extractValue('kills_using_laser', str);
  let nukeUsed = extractValue('nukes_used', str);
  let nukeKills = extractValue('kills_using_nuke', str);
  let poisonsUsed = extractValue('poisons_used', str);
  let poisonKills = extractValue('kills_using_poison', str);
  let shieldsUsed = extractValue('shields_used', str);
  let shieldBlocks = extractValue('blocks_using_shield', str);
  let shieldKills = extractValue('kills_using_shields', str);
  let missilesFired = extractValue('missiles_fired', str);
  let missileKills = extractValue('kills_using_missile', str);  // Fixed key name
  let rapidUsed = extractValue('triple-shots_used', str);
  let rapidKills = extractValue('kills_using_triple-shot', str);
  let whirlwindsUsed = extractValue('whirlwinds_used', str);
  let dunkedTanks = extractValue('dunk_tanks', str);

  // Log some values for testing
  console.log(`Flaks Used: ${flaksUsed}`);
  console.log(`Flak Kills: ${flakKills}`);
  console.log(`Grenades Used: ${grenadesUsed}`);
  console.log(`Dunked Tanks: ${dunkedTanks}`);

  })
}