var utils = require('../lib/utils.js');

var ammo

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

    if (playerState.ammo > 2) {
      return utils.safeRandomMove()
    }

    var ammoStillExists = ammo && gameEnvironment.ammoPosition.some(function (x){
      return x[0] === ammo[0] && x[1] === ammo[1]
    })

    console.log('ammoStillExists: ', ammoStillExists)
    if (!ammoStillExists) {
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

      if (ammos.length > 1) {
        ammo = ammos[1].ammo
      }

      if (ammos.length === 1) {
        ammo = ammos[0].ammo
      }
    }

    var ammoDirection = utils.getDirection(playerState.position, ammo)

    if (ammoDirection !== playerState.direction) {
      return ammoDirection
    }

    return 'move'
  }
};

module.exports = Potato;
