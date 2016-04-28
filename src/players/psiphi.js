var utils = require('../lib/utils.js');

var movingToAmmo = -1;

module.exports = {
  info: {
    name: 'Ψ',
    style: 10
  },
  ai: (playerState, enemiesStates, gameEnvironment) => { /* Siegfried */
    var directionToAmmo;

    if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
      return 'shoot';
    }

    if (gameEnvironment.ammoPosition.length) {
      directionToAmmo = utils.getDirection(playerState.position, findClosestAmmo(gameEnvironment.ammoPosition));

      if (directionToAmmo !== playerState.direction) return directionToAmmo;
      return 'move';
    }
    return utils.randomMove();

    function findClosestAmmo(ammos) {
      var min = 0;
      ammos.forEach((a, i) => {
        if (utils.getDistance(playerState, a) < utils.getDistance(playerState, ammos[min])) {
          min = i;
        }
      });
      return ammos[min];
    }
  }
};
