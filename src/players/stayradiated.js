var utils = require('../lib/utils.js');

const LOOK_INTO_THE_FUTURE = 6;

// [y, x] coords? not today!
function fixPos(player) {
  const [y, x] = player.position;
  player.position = [x, y];
  return player;
}

const min = Math.min;
const max = Math.max;

function north(map, [x, y]) {
  if (y === 0) { return -1; }
  return map[x][y - 1];
}
function south(map, [x, y]) {
  if (y >= map.length - 1) { return -1; }
  return map[x][y + 1];
}
function east(map, [x, y]) {
  if (x === 0) { return -1; }
  return map[x - 1][y];
}
function west(map, [x, y]) {
  if (x >= map.length - 1) { return -1; }
  return map[x + 1][y];
}
function getPos(map, direction, position) {
  switch (direction) {
  case 'north':
    return north(map, position);
  case 'south':
    return south(map, position);
  case 'east':
    return east(map, position);
  case 'west':
    return west(map, position);
  }
}

function whereToGo(map, player) {
  const {direction, position} = player;
  const [x, y] = position;

  const current = map[y][x];
  const ahead = getPos(map, direction, position);

  if (ahead > current) {
    return 'move';
  }

  const danger = [
    ['north', north(map, position)],
    ['south', south(map, position)],
    ['east', east(map, position)],
    ['west', west(map, position)]
  ];

  danger.sort((a, b) => b[1] - a[1]);
  if (danger[0][0] === current) {
    return '';
  }

  return danger[0][0];
}

function playerTurns(player, fn) {
  fn(Object.assign({}, player, {direction: 'north'}));
  fn(Object.assign({}, player, {direction: 'east'}));
  fn(Object.assign({}, player, {direction: 'south'}));
  fn(Object.assign({}, player, {direction: 'west'}));
}

function playerMove(ammo, gridSize, player) {
  const {direction, position} = player;
  let next = {direction, ammo: player.ammo};

  switch (direction) {
  case 'north':
    next.position = [position[0], max(position[1] - 1, 0)];
    break;
  case 'south':
    next.position = [position[0], min(position[1] + 1, gridSize - 1)];
    break;
  case 'east':
    next.position = [min(position[0] + 1, gridSize - 1), position[1]];
    break;
  case 'west':
    next.position = [max(position[0] - 1, 0), position[1]];
    break;
  }

  ammo.forEach(([y, x]) => {
    if (y === next.position[1] && x === next.position[0]) {
      next.ammo += 1;
    }
  });

  return next;
}

function printMap(map, player) {
  let block = [];
  for (let y = 0; y < map.length; y++) {
    let row = '';
    for (let x = 0; x < map.length; x++) {
      if (x === player.position[0] && y === player.position[1]) {
        switch (player.direction) {
        case 'east':
          row += '▶';
          break;
        case 'west':
          row += '◀';
          break;
        case 'north':
          row += '▲';
          break;
        case 'south':
          row += '▼';
          break;
        }
        continue;
      }

      const value = map[x][y];
      if (value === Infinity) {
        row += ' ';
        continue;
      }

      row += value;
    }
    block.push(row);
  }
  return '\n' + block.join('\n');
}

function mapLine(map, value, start, end) {
  const startX = min(start[0], end[0]);
  const startY = min(start[1], end[1]);
  const endX = max(start[0], end[0]);
  const endY = max(start[1], end[1]);

  for (let x = startX; x <= endX; x++) {
    for (let y = startY; y <= endY; y++) {
      map[x][y] = min(map[x][y], value);
    }
  }

  return map;
}

function mapEnemie(map, enemie, value) {
  const {position} = enemie;
  const gridSize = map.length;

  const [x, y] = position;
  const MIN = 0;
  const MAX = gridSize - 1;

  switch (enemie.direction) {
  case 'north':
    mapLine(map, value, [x, y], [x, MIN]);
    break;
  case 'south':
    mapLine(map, value, [x, y], [x, MAX]);
    break;
  case 'east':
    mapLine(map, value, [x, y], [MAX, y]);
    break;
  case 'west':
    mapLine(map, value, [x, y], [MIN, y]);
    break;
  default:
    console.log('WTF?');
  }

  return map;
}

function recursiveMapEnemie(ammo, map, enemie, value) {
  if (value > LOOK_INTO_THE_FUTURE) {
    return;
  }

  if (enemie.ammo > 0) {
    mapEnemie(map, enemie, value);
  }

  recursiveMapEnemie(
    ammo,
    map,
    playerMove(ammo, map.length, enemie),
    value + 1,
  );

  playerTurns(enemie, (enemieTurns) => {
    recursiveMapEnemie(
      ammo,
      map,
      playerMove(ammo, map.length, enemieTurns),
      value + 1,
    );
  });
}

function createMap(size, value = 0) {
  const BLANK = new Array(size).fill(value);

  let map = BLANK;
  map = map.map(() => BLANK.slice(0));
  return map;
}

function ai(player, enemies, game) {
  fixPos(player);

  if (utils.canKill(player, enemies) && player.ammo) {
    return 'shoot';
  }

  const map = createMap(game.gridSize, Infinity);

  enemies.forEach((enemie) => {
    fixPos(enemie);

    recursiveMapEnemie(game.ammoPosition, map, enemie, 1);
  });

  console.log(printMap(map, player));

  return whereToGo(map, player);

  /*
  let directionToAmmo;
  if (utils.canKill(player, enemies) && player.ammo) {
    return 'shoot';
  }

  if (game.ammoPosition.length) {
    directionToAmmo = utils.fastGetDirection(player.position, game.ammoPosition[0]);

    if (directionToAmmo !== player.direction) return directionToAmmo;
    return utils.safeRandomMove();
  }

  return 'move';
  */
}

module.exports = {
  info: {
    name: ':)',
    style: 2
  },
  ai,
  createMap,
  mapLine,
  mapEnemie,
  printMap,
  playerMove
};
