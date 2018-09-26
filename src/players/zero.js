import {
  randomMove,
  getDirection,
  isVisible,
  canKill,
  safeRandomMove,
  fastGetDirection,
  turn,
  getDistance
} from '../lib/utils.js'

const PLAYER_NAME = 'ZERO'

const PLAYER_STYLE = 6

const chooseMove = (playerState, enemiesStates, gameEnvironment) => {
  const shouldShootPlayer =
    canKill(playerState, enemiesStates) && playerState.ammo
  if (shouldShootPlayer) {
    return 'shoot'
  }

  const ammoExists = gameEnvironment.ammoPosition.length > 0
  var arrayDistanceToAmmo = []

  if (ammoExists) {
    gameEnvironment.ammoPosition.forEach(function(element) {
      arrayDistanceToAmmo.push(
        Math.pow(playerState.position[0] - element[0], 2) +
          Math.pow(playerState.position[1] - element[1], 2)
      )
    })

    var minDis = Math.min(arrayDistanceToAmmo)
    var indexOfMin = arrayDistanceToAmmo.indexOf(minDis)

    console.log(`ammo dis ${arrayDistanceToAmmo}`)

    const directionToAmmo = fastGetDirection(
      playerState.position,
      gameEnvironment.ammoPosition[indexOfMin]
    )
    const facingAmmo = directionToAmmo === playerState.direction
    const directiontToFirstEnemy = enemiesStates[0].position
    console.log('direction to first enemy :' + directiontToFirstEnemy)
    if (!facingAmmo) {
      return directionToAmmo
    }

    return 'move'
  }

  return safeRandomMove()
}

export default {
  info: {
    name: PLAYER_NAME,
    style: PLAYER_STYLE
  },
  ai: chooseMove
}
