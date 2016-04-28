var utils = require('../lib/utils.js');

function ai(player, enemies, game) {
  var directionToAmmo;

  if (utils.canKill(player, enemiesStates) && player.ammo) {
    return 'shoot';
  }

  if (game.ammoPosition.length) {
    directionToAmmo = utils.fastGetDirection(player.position, game.ammoPosition[0]);

    if (directionToAmmo !== player.direction) return directionToAmmo;
    return utils.safeRandomMove();
  }

  return 'move';
}

module.exports = {
  info: {
    name: ':)',
    style: 2
  },
  ai: ai
};
