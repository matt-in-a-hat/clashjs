var utils = require('../lib/utils.js')

var ammo

var Potato = {
  info: {
    name: 'Potato',
    style: 0,
    handicap: 1
  },
  ai: (playerState, enemiesStates, gameEnvironment) => {
    if (playerState.ammo > 0 && utils.canKill(playerState, enemiesStates)) {
      return 'shoot'
    }

    if (playerState.ammo > 0) {
      var players = enemiesStates
        .filter(function(player) {
          return player.isAlive
        })
        .map(function (player) {
          return {
            distance: utils.getDistance(playerState.position, player.position),
            player: player
          }
        })
        .sort(function(a, b) {
          return a.distance - b.distance
        })

      var enemy = players[0].player

      var enemyDirection = utils.getDirection(playerState.position, enemy.position)

      if (enemyDirection !== playerState.direction) {
        return enemyDirection
      } else {
        return 'move'
      }
    }

    var ammoStillExists = ammo && gameEnvironment.ammoPosition.some(function (x){
      return x[0] === ammo[0] && x[1] === ammo[1]
    })

    if (!ammoStillExists) {
      var ammos = gameEnvironment.ammoPosition
        .map(function (ammo) {
          return {
            distance: utils.getDistance(playerState.position, ammo),
            ammo: ammo
          }
        })
        .sort(function(a, b) {
          return a.distance - b.distance
        })

      if (ammos.length === 0 ) {
        return utils.safeRandomMove()
      }

      if (ammos.length > 1) {
        if (ammos[0].distance < 5) {
          ammo = ammos[0]
        } else {
          ammo = ammos[1].ammo
        }
      }
      else if (ammos.length === 1) {
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
