var utils = require('../lib/utils.js');

function ai(player, enemies, game) {
  var directionToAmmo;

  if (utils.canKill(player, enemiesStates) && player.ammo) {
    return 'shoot';
  }

  if (gameEnvironment.ammoPosition.length) {
    directionToAmmo = utils.fastGetDirection(player.position, gameEnvironment.ammoPosition[0]);

    if (directionToAmmo !== player.direction) return directionToAmmo;
    return utils.safeRandomMove();
  }

  return 'move';
}

module.exports = {
  info: {
    name: 'Stayradiated',
    style: 2,
  },
  ai: ai,
};
