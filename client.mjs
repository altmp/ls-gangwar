import alt from 'alt';

let myTeam = null;

const weapons = [
  "WEAPON_KNIFE", "WEAPON_BAT", "WEAPON_BOTTLE", "WEAPON_WRENCH",
  "WEAPON_PISTOL", "WEAPON_HEAVYPISTOL", "WEAPON_REVOLVER",
  "WEAPON_MICROSMG", "WEAPON_SMG", "WEAPON_COMBATPDW",
  "WEAPON_ASSAULTRIFLE", "WEAPON_CARBINERIFLE",
  "WEAPON_PUMPSHOTGUN",
  "WEAPON_GRENADE"
];

function giveWeapons() {
  let ped = alt.PlayerPedId()

  for (const weapon of weapons) {
    alt.GiveWeaponToPed(ped, alt.GetHashKey(weapon), 9999, false, false)
  }
}

const clothes = {
  families: {
    1: {
      drawable: 51,
      texture: 5
    },
    2: {
      drawable: 8,
      texture: 1
    },
    3: {
      drawable: 1,
      texture: 0
    },
    4: {
      drawable: 15,
      texture: 13
    },
    6: {
      drawable: 9,
      texture: 4
    },
    8: {
      drawable: 0,
      texture: 240
    },
    11: {
      drawable: 14,
      texture: 6
    }
  },
  ballas: {
    1: {
      drawable: 51,
      texture: 6
    },
    2: {
      drawable: 10,
      texture: 4
    },
    3: {
      drawable: 5,
      texture: 0
    },
    4: {
      drawable: 88,
      texture: 23
    },
    6: {
      drawable: 9,
      texture: 3
    },
    8: {
      drawable: 0,
      texture: 240
    },
    11: {
      drawable: 17,
      texture: 3
    }
  },
  vagos: {
    1: {
      drawable: 51,
      texture: 8
    },
    2: {
      drawable: 10,
      texture: 3
    },
    3: {
      drawable: 5,
      texture: 0
    },
    4: {
      drawable: 88,
      texture: 19
    },
    6: {
      drawable: 9,
      texture: 11
    },
    8: {
      drawable: 0,
      texture: 240
    },
    11: {
      drawable: 17,
      texture: 2
    }
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

const mainView = new alt.WebView('http://resources/gangwar/client/html/index.html');

let weaponBlip = null;
let vehicleBlip = null;
alt.onServer('updateTeam', (team) => {
  myTeam = team;
  if(weaponBlip) {
    alt.RemoveBlip(weaponBlip);
  }
  weaponBlip = alt.AddBlipForCoord(positions[myTeam].weapon.x, positions[myTeam].weapon.y, positions[myTeam].weapon.z);
  alt.SetBlipSprite(weaponBlip, 110);
  alt.BeginTextCommandSetBlipName('STRING');
  alt.AddTextComponentSubstringPlayerName('Weapon provider');
  alt.EndTextCommandSetBlipName(weaponBlip);

  if(vehicleBlip) {
    alt.RemoveBlip(vehicleBlip);
  }
  vehicleBlip = alt.AddBlipForCoord(positions[myTeam].vehicle.x, positions[myTeam].vehicle.y, positions[myTeam].vehicle.z);
  alt.SetBlipSprite(vehicleBlip, 227);
  alt.BeginTextCommandSetBlipName('STRING');
  alt.AddTextComponentSubstringPlayerName('Vehicle provider');
  alt.EndTextCommandSetBlipName(vehicleBlip);
});

const colors = {
  ballas: 'C400AB',
  families: '008000',
  vagos: 'FFBF00'
};

alt.onServer('applyAppearance', (team) => {
  alt.setModel('mp_m_freemode_01');
  const components = clothes[team];
  for(let c in components) {
    alt.SetPedComponentVariation(alt.PlayerPedId(), c, components[c].drawable, components[c].texture, 0);
  }
});

alt.onServer('updateTeamPoints', (infoJson) => {
  const info = JSON.parse(infoJson);
  let myTeamPoints = info[myTeam];
  mainView.execJS(`setTeamPoints('${myTeam}', ${myTeamPoints});`);

  const teamsArray = [];
  for(let t in info) {
    teamsArray.push({
      team: t,
      scores: info[t]
    });
  }
  teamsArray.sort((a, b) => {
    return a.scores > b.scores ? 1 : -1;
  });

  const rightTeam = teamsArray[0].team == myTeam ? teamsArray[1] : teamsArray[0];

  const progressLeft = myTeamPoints / 1000;
  const progressRight = rightTeam.scores / 1000;
  const colorLeft = colors[myTeam];
  const colorRight = colors[rightTeam.team];

  mainView.execJS(`setProgress(${progressLeft}, ${progressRight}, '#${colorLeft}', '#${colorRight}');`);
});

alt.onServer('captureStateChanged', (state) => {
  if(state == false) {
    mainView.execJS(`hideProgress();`);
  } else {
    mainView.execJS(`showProgress();`);
  }
});

alt.onServer('playerKill', (jsonData) => {
  const data = JSON.parse(jsonData);
  mainView.execJS(`registerKill('${data.killerName}', '${data.killerGang}', '${data.victimName}', '${data.victimGang}', '${data.weapon}');`);
});

alt.onServer('showTeamSelect', () => {
  mainView.execJS(`showTeamSelect();`);
  mainView.focus();
  alt.showCursor(true);
});

mainView.on('teamSelected', (teamId) => {
  alt.emitServer('teamSelected', teamId);
  alt.showCursor(false);
});

alt.on('keydown', (key) => {
  if(key == 'E'.charCodeAt(0)) {
    alt.emitServer('action');
  }
});

alt.onServer('setintoveh', veh => {
  alt.SetPedIntoVehicle(alt.PlayerPedId(), veh.getScriptID(), -1);
});

alt.onServer('giveAllWeapons', () => {
  giveWeapons();
});

const drawBoxCoords = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0
};

let drawBox = false;
let captureBlip = null;

alt.onServer('startCapture', (jsonInfo) => {
  const info = JSON.parse(jsonInfo);
  const x1 = info.x1;
  const y1 = info.y1;
  const x2 = info.x2;
  const y2 = info.y2;
  drawBoxCoords.x1 = x1;
  drawBoxCoords.y1 = y1;
  drawBoxCoords.x2 = x2;
  drawBoxCoords.y2 = y2;
  drawBox = true;
  if(captureBlip != null) {
    alt.RemoveBlip(captureBlip);
    captureBlip = null;
  }

  captureBlip = alt.AddBlipForCoord((x1 + x2) / 2, (y1 + y2) /2, 0);
  alt.SetBlipSprite(captureBlip, 84);
  alt.SetBlipFlashTimer(captureBlip, 500);
  alt.SetBlipFlashInterval(captureBlip, 500);
  alt.SetBlipColour(captureBlip, 1);
  alt.SetBlipFlashes(captureBlip, true);
  alt.BeginTextCommandSetBlipName('STRING');
  alt.AddTextComponentSubstringPlayerName('Turf War');
  alt.EndTextCommandSetBlipName(captureBlip);
});

alt.onServer('stopCapture', () => {
  drawBox = false;
  if(captureBlip) {
    alt.RemoveBlip(captureBlip);
    captureBlip = null;
  }
});

alt.on('update', () => {
  if(drawBox) {
    const color = 70 + 50 * Math.sin(((Date.now() / 10) / 180) * Math.PI);
    alt.DrawBox(drawBoxCoords.x1, drawBoxCoords.y1, 0, drawBoxCoords.x2, drawBoxCoords.y2, 2000, 255, 0, 0, color);
  }
});
