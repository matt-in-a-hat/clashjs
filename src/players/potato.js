var utils = require('../lib/utils.js');

var Potato = {
  info: {
    name: 'Potato',
    style: 0
  },
  ai: (playerState, enemiesStates, gameEnvironment) => {
    console.log('Potato will kick your arse')

    if (playerState.ammo > 0 && utils.canKill(playerState, enemiesStates)) {
      return 'shoot'
    }

    var ammos = gameEnvironment.ammoPosition
      .map(function (ammo) {
        return {
          distance: utils.getDistance(playerState.position, ammo),
          ammo: ammo
        }
      })
      .sort(function(a, b) {
        return a - b
      })


    if (ammos.length === 0 ) {
      return utils.safeRandomMove()
    }

    var ammo = ammos[0].ammo

    var ammoDirection = utils.getDirection(playerState.position, ammo)

    if (ammoDirection !== playerState.direction) {
      return ammoDirection
    }

    return 'move'
  }
};

module.exports = Potato;
