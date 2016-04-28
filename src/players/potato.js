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

    if (enemiesStates.length > 5) {
      var dir = playerState.direction

      var x = playerState.position[1]
      var y = playerState.position[0]
      var limit = gameEnvironment.gridSize - 1

      if (x === 0 && y === 0 && dir !== 'east') {
        return 'east'
      }

      if (x === limit && y === 0 && dir !== 'south') {
        return 'south'
      }

      if (x === limit && y === limit && dir !== 'west') {
        return 'west'
      }

      if (x === 0 && y === limit && dir !== 'north') {
        return 'north'
      }

      /////

      if (x === 0 && dir === 'west') {
        return 'north'
      }

      if (y === 0 && dir === 'north') {
        return 'east'
      }

      if (y === limit && dir === 'south') {
        return 'west'
      }

      if (x === limit && dir === 'east') {
        return 'south'
      }

      return 'move'
    }

    if (playerState.ammo > 1) {
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
