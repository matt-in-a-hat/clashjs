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

const PLAYER_NAME = 'Dinky'

const PLAYER_STYLE = 4

const chooseMove = (playerState, enemiesStates, gameEnvironment) => {
  // const shouldHide = canKill(enemiesStates, playerState) && !playerState.ammo
  // if (shouldHide) {
  //   return safeRandomMove()
  // }

  const shouldShootPlayer =
    canKill(playerState, enemiesStates) && playerState.ammo
  if (shouldShootPlayer) {
    return 'shoot'
  }

  const ammoExists = gameEnvironment.ammoPosition.length > 0
  if (ammoExists) {
    randomMove()
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
