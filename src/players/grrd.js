const utils = require('../lib/utils')

const grrd = {
  info: {
    name: 'grrd',
    style: 4
  },
  ai: function (playerState, enemiesStates, gameEnvironment) {
    const { position, direction, ammo, isAlive } = playerState
    const { gridSize, ammoPosition } = gameEnvironment
    let directionToAmmo

    if (utils.canKill(playerState, enemiesStates) && ammo) {
      return 'shoot'
    }

    if (ammoPosition.length) {
      directionToAmmo = utils.fastGetDirection(position, ammoPosition[0])

      if (direction !== directionToAmmo) return directionToAmmo
      return 'move'
    }

    return utils.safeRandomMove()
  }
}

module.exports = grrd
