import * as utils from '../lib/utils.js'

export const info = {
  name: 'Horror',
  style: 1
}

export default function(playerState, enemiesStates, gameEnvironment) {
  var directionToAmmo

  if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
    return 'shoot'
  }

  if (gameEnvironment.ammoPosition.length) {
    directionToAmmo = utils.fastGetDirection(
      playerState.position,
      gameEnvironment.ammoPosition[0]
    )

    if (directionToAmmo !== playerState.direction) return directionToAmmo
    return 'move'
  }
  return utils.safeRandomMove()
}
