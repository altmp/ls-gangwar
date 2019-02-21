import alt from 'alt';
import chat from 'chat';

const vehicles = {
  ballas: [
    'chino2',
    'buccaneer2',
    'buccaneer',
    'faction'
  ],
  families: [
    'faction2',
    'blade',
    'gauntlet',
    'impaler'
  ],
  vagos: [
    'hermes',
    'ellie',
    'chino',
    'dukes'
  ]
};

function jhash(key){
  var keyLowered = key.toLowerCase();
  var length = keyLowered.length;
  var hash, i;

  for (hash = i = 0; i < length; i++){
      hash += keyLowered.charCodeAt(i);
      hash += (hash << 10);
      hash ^= (hash >>> 6);
  }

  hash += (hash << 3);
  hash ^= (hash >>> 11);
  hash += (hash << 15);

  return convertToUnsigned(hash);
}

function convertToUnsigned(value){
  return (value >>> 0);
}

const weapons = {
  WEAPON_KNIFE: 'Knife',
  WEAPON_BAT: 'Bat',
  WEAPON_BOTTLE: 'Bottle',
  WEAPON_WRENCH: 'Wrench',
  WEAPON_PISTOL: 'Pistol',
  WEAPON_HEAVYPISTOL: 'Heavy pistol',
  WEAPON_REVOLVER: 'Revolver',
  WEAPON_MICROSMG: 'Micro-SMG',
  WEAPON_SMG: 'SMG',
  WEAPON_COMBATPDW: 'Combat PDW',
  WEAPON_ASSAULTRIFLE: 'Assault Rifle',
  WEAPON_CARBINERIFLE: 'Carbin Rifle',
  WEAPON_PUMPSHOTGUN: 'Pump Shotgun',
  WEAPON_GRENADE: 'Grenade',
};

const weaponHashes = {};

for(let w in weapons) {
  weaponHashes[jhash(w)] = weapons[w];
}

const colors = {
  ballas: {
    rgba: { r: 196, g: 0, b: 171, a: 150 },
    hex: 'C400AB'
  },
  families: {
    rgba: { r: 0, g: 127, b: 0, a: 150 },
    hex: '008000'
  },
  vagos: {
    rgba: { r: 255, g: 191, b: 0, a: 150 },
    hex: 'FFBF00'
  }
};

const positions = {
  vagos: {
    spawns: [
      { x: 334.6681, y: -2052.6726, z: 20.8212 },
      { x: 341.7890, y: -2051.3669, z: 21.3267 },
      { x: 345.7582, y: -2044.6812, z: 21.6300 },
      { x: 342.3955, y: -2040.3560, z: 21.5626 },
      { x: 351.2835, y: -2043.2043, z: 22.0007 }
    ],
    weapon: { x: 359.5912, y: -2060.6110, z: 21.4952 },
    vehicle: { x: 330.9758, y: -2036.6241, z: 20.9897 }
  },
  ballas: {
    spawns: [
      { x: 88.6285, y: -1959.3890, z: 20.7370 },
      { x: 109.3054, y: -1955.8022, z: 20.7370 },
      { x: 117.7318, y: -1947.7583, z: 20.7200 },
      { x: 118.9186, y: -1934.2681, z: 20.7707 },
      { x: 105.7318, y: -1923.4154, z: 20.7370 }
    ],
    weapon: { x: 84.9890, y: -1958.6241, z: 21.1076 },
    vehicle: { x: 105.7186, y: -1941.5867, z: 20.7875 }
  },
  families: {
    spawns: [
      { x: -196.4439, y: -1607.0505, z: 34.1494 },
      { x: -174.3560, y: -1609.9780, z: 33.7281 },
      { x: -175.0681, y: -1623.1647, z: 33.5596 },
      { x: -191.1692, y: -1641.4813, z: 33.4080 },
      { x: -183.5736, y: -1587.5999, z: 34.8234 }
    ],
    weapon: { x: -210.7648, y: -1606.8132, z: 34.8571 },
    vehicle: { x: -183.5736, y: -1587.5999, z: 34.8234 }
  }
};

const checkpoints = {
  ballas: {
    vehicle: null,
    weapon: null
  },
  families: {
    vehicle: null,
    weapon: null
  },
  vagos: {
    vehicle: null,
    weapon: null
  }
};

for(let i in positions) {
  checkpoints[i].vehicle = alt.createCheckpoint(45, positions[i].vehicle.x, positions[i].vehicle.y, positions[i].vehicle.z - 1.1, 5, 1, colors[i].rgba.r, colors[i].rgba.g, colors[i].rgba.b, 255);
  checkpoints[i].weapon = alt.createCheckpoint(45, positions[i].weapon.x, positions[i].weapon.y, positions[i].weapon.z - 1.1, 1, 1, colors[i].rgba.r, colors[i].rgba.g, colors[i].rgba.b, 255);
}

const currentTurfPoints = {
  ballas: 0,
  families: 0,
  vagos: 0
};

class Turf {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  between(min, p, max){
    let result = false;
  
    if (min < max){
      if (p > min && p < max)
        result = true;
    }
  
    if ( min > max ){
      if (p > max && p < min)
        result = true
    }
  
    if (p == min || p == max)
      result = true;
    return result;
  }
  
  contains(x, y){
    let result = false;
    if (this.between(this.x1, x, this.x2) && this.between(this.y1, y, this.y2))
      result = true;
    return result;
  }
}

let turfs = [];
let currentTurf = null;

const xStartTurf = -404.1889;
const yStartTurf = -1221.2967;


for(let i = 0; i < 5; ++i) {
  for(let j = 0; j < 5; ++j) {
    const x1 = xStartTurf + 200 * i;
    const y1 = yStartTurf - 200 * j;
    turfs.push(new Turf(x1, y1, x1 + 200, y1 - 200));
  }
}

function startCapture() {
  currentTurfPoints.ballas = 0;
  currentTurfPoints.families = 0;
  currentTurfPoints.vagos = 0;

  currentTurf = turfs[Math.round(Math.random() * (turfs.length - 1))];
  alt.emitClient(null, 'captureStateChanged', true);
  alt.emitClient(null, 'startCapture', JSON.stringify({
    x1: currentTurf.x1, y1: currentTurf.y1, x2: currentTurf.x2, y2: currentTurf.y2
  }));
  alt.emitClient(null, 'updateTeamPoints', JSON.stringify(currentTurfPoints));
}

function stopCapture() {
  currentTurfPoints.ballas = 0;
  currentTurfPoints.families = 0;
  currentTurfPoints.vagos = 0;
  currentTurf = null;
  alt.emitClient(null, 'captureStateChanged', false);
  alt.emitClient(null, 'stopCapture');
}

setInterval(() => {
  if(alt.players.length > 0) {
    if(currentTurf == null) {
      startCapture();
    }
    else {
      for(let p of alt.players) {
        const pTeam = p.getMeta('team');
        if(!pTeam)
          continue;

        if(currentTurf.contains(p.pos.x, p.pos.y)) {
          currentTurfPoints[pTeam]++;
          if(currentTurfPoints[pTeam] >= 1000) {
            chat.broadcast(`{${colors[pTeam].hex}} ${pTeam} {FFFFFF}got this turf. Next capture started`);
            stopCapture();
            return;
          }
        }
      }
      alt.emitClient(null, 'updateTeamPoints', JSON.stringify(currentTurfPoints));
    }
  }
  else if(currentTurf != null) {
    stopCapture();
  }
}, 1000);

alt.on('playerConnect', (player) => {
  alt.emitClient(player, 'showTeamSelect');
  player.setMeta('checkpoint', 0);
  player.setMeta('vehicle', null);
});

alt.on('playerDisconnect', (player) => {
  const veh = player.getMeta('vehicle');
  if(veh) {
    alt.removeEntity(veh);
  }
})

alt.onClient('teamSelected', (player, teamId) => {
  let team = 'families';
  if(teamId == 2)
    team = 'ballas';
  else if(teamId == 3)
    team = 'vagos';
  
  player.setMeta('team', team);

  const nextSpawns = positions[team].spawns;
  player.pos = nextSpawns[Math.round(Math.random() * (nextSpawns.length - 1))];
  alt.emitClient(player, 'applyAppearance', team);
  alt.emitClient(player, 'updateTeam', team);

  if(currentTurf != null) {
    alt.emitClient(null, 'captureStateChanged', true);
    alt.emitClient(null, 'startCapture', JSON.stringify({
      x1: Math.min(currentTurf.x1, currentTurf.x2), y1: Math.min(currentTurf.y1, currentTurf.y2), x2: Math.max(currentTurf.x1, currentTurf.x2), y2: Math.max(currentTurf.y1, currentTurf.y2)
    }));
    alt.emitClient(null, 'updateTeamPoints', JSON.stringify(currentTurfPoints));
  }
});

alt.onClient('action', (player) => {
  const cp = player.getMeta('checkpoint');
  if(cp == 1) {
    const pTeam = player.getMeta('team');
    const pos = player.pos;
    let curVeh = player.getMeta('vehicle');
    if(curVeh) {
      alt.removeEntity(curVeh);
      curVeh = null;
    }

    const nextModel = vehicles[pTeam][Math.round(Math.random() * (vehicles[pTeam].length - 1))];
    const vehColor = colors[pTeam].rgba;
    curVeh = alt.createVehicle(nextModel, pos.x, pos.y, pos.z, 0);
    curVeh.customPrimaryColor = { r: vehColor.r, g: vehColor.g, b: vehColor.b };
    curVeh.customSecondaryColor = { r: vehColor.r, g: vehColor.g, b: vehColor.b };
    
    for(let i = 0; i < 16; ++i) {
      curVeh.setExtra(i, 0);
    }

    setTimeout(() => {
      alt.emitClient(player, 'setintoveh', curVeh);
    }, 200);
    player.setMeta('vehicle', curVeh);
  }
  else if(cp == 2) {
    alt.emitClient(player, 'giveAllWeapons');
  }
});

alt.on('entityEnterCheckpoint', (cp, entity) => {
  if (entity instanceof alt.Player) {
    const pTeam = entity.getMeta('team');
    if(cp == checkpoints[pTeam].vehicle) {
      entity.setMeta('checkpoint', 1);
      alt.emitClient(entity, 'showInfo', '~INPUT_PICKUP~ to get car');
    }
    else if(cp == checkpoints[pTeam].weapon) {
      entity.setMeta('checkpoint', 2);
      alt.emitClient(entity, 'showInfo', '~INPUT_PICKUP~ to get weapons and ammo');
    }
  }
});

alt.on('entityLeaveCheckpoint', (cp, entity) => {
  if (entity instanceof alt.Player) {
    entity.setMeta('checkpoint', 0);
  }
});

alt.on('playerDead', (player, killer, weapon) => {
  console.log(weapon);
  let weaponName = 'Unknown';
  if(weapon in weaponHashes)
    weaponName = weaponHashes[weapon];

  const team = player.getMeta('team');
  const killerTeam = killer.getMeta('team');
  alt.emitClient(null, 'playerKill', JSON.stringify({killerName: killer.name, killerGang: killerTeam, victimName: player.name, victimGang: team, weapon: weaponName}));

  if(currentTurf != null && killer != player) {
    if(currentTurf.contains(player.pos.x, player.pos.y)) {
      const kTeam = killer.getMeta('team');
      currentTurfPoints[kTeam] += 50;
      if(currentTurfPoints[pTeam] >= 1000) {
        chat.broadcast(`{${colors[pTeam].hex} ${pTeam} {FFFFFF}got this turf. Next capture started`);
        stopCapture();
        return;
      }
    }
  }

});

alt.onClient('respawnMe', (player) => {
  const team = player.getMeta('team');
  const nextSpawns = positions[team].spawns;
  alt.log('Trying to respawn "' + player.name + '"');
  player.pos = nextSpawns[Math.round(Math.random() * (nextSpawns.length - 1))];
});
