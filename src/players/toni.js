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

const PLAYER_NAME = 'Toni'

const PLAYER_STYLE = 7

const chooseMove = (playerState, enemiesStates, gameEnvironment) => {
  const shouldShootPlayer =
    canKill(playerState, enemiesStates) && playerState.ammo > 0
  if (shouldShootPlayer) {
    return 'shoot'
  }

  const ammoExists = gameEnvironment.ammoPosition.length > 0
  if (ammoExists && playerState.ammo < 1) {
    const directionToAmmo = fastGetDirection(
      playerState.position,
      gameEnvironment.ammoPosition[0]
    )
    const facingAmmo = directionToAmmo === playerState.direction

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
