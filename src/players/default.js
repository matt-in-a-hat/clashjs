import { canKill, safeRandomMove, fastGetDirection } from '../lib/utils.js'

const PLAYER_NAME = 'COM1'

const PLAYER_STYLE = 3

const chooseMove = (playerState, enemiesStates, gameEnvironment) => {
  const shouldShootPlayer =
    canKill(playerState, enemiesStates) && playerState.ammo
  if (shouldShootPlayer) {
    return 'shoot'
  }

  const ammoExists = gameEnvironment.ammoPosition.length > 0
  if (ammoExists) {
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
