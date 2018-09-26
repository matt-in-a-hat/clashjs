import * as utils from '../lib/utils.js'

export const info = {
  name: 'Deathstar',
  style: 7
}

export default function(playerState, enemiesState, gameEnvironment) {
  var directionToAmmo

  if (Math.random() > 0.9) return 'shoot'

  if (gameEnvironment.ammoPosition.length) {
    directionToAmmo = utils.getDirection(
      playerState.position,
      gameEnvironment.ammoPosition[0]
    )

    if (directionToAmmo !== playerState.direction) {
      return directionToAmmo
    }
    return 'move'
  }

  return utils.randomMove()
}
