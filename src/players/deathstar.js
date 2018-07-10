var utils = require('../lib/utils.js');

var bot = {
  info: {
    name: 'Deathstar',
    style: 7
  },
  ai: (playerState, enemiesState, gameEnvironment) => {
    var directionToAmmo;

    if (Math.random() > 0.9) return 'shoot';

    if (gameEnvironment.ammoPosition.length) {
      directionToAmmo = utils.getDirection(
        playerState.position,
        gameEnvironment.ammoPosition[0]
      );

      if (directionToAmmo !== playerState.direction) {
        return directionToAmmo;
      }
      return 'move';
    }

    return utils.randomMove();
  }
};

module.exports = bot;
