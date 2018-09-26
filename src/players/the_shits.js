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

const PLAYER_NAME = 'The Shits'

const PLAYER_STYLE = 3

const getNextPosition = (currentPosition, direction) => {
  let [x, y] = currentPosition

  switch (direction) {
    case 'north':
      x = x - 1 < 0 ? 0 : x - 1
      break
    case 'south':
      x = x + 1 > 12 ? 12 : x + 1
      break
    case 'east':
      y = y - 1 < 0 ? 0 : y - 1
      break
    case 'west':
      y = y + 1 > 12 ? 12 : y + 1
      break
  }

  return [x, y]
}

const shouldGtfo = (playerState, enemiesStates) =>
  enemiesStates.some((enemy) => {
    if (!enemy.ammo) return false

    const iAmInLineOfFire = isVisible(
      enemy.position,
      playerState.position,
      enemy.direction
    )

    const nextPosition = getNextPosition(
      playerState.position,
      playerState.direction
    )

    const iWillBeInLineOfFireIfIMove = isVisible(
      enemy.position,
      nextPosition,
      enemy.direction
    )

    return iAmInLineOfFire || iWillBeInLineOfFireIfIMove
  })

const getClosestEnemy = (playerState, enemyStates) => {
  const { position } = playerState
  return enemyStates.reduce((closestEnemy, currentEnemy) => {
    if (!closestEnemy) return (closestEnemy = currentEnemy)
    return (closestEnemy =
      getDistance(position, currentEnemy.position) >
      getDistance(position, closestEnemy.position)
        ? closestEnemy
        : currentEnemy)
  })
}

const getClosestAmmo = (playerState, gameEnvironment) => {
  const { position } = playerState
  const { ammoPosition } = gameEnvironment

  return ammoPosition.reduce((closestAmmo, currentAmmo) => {
    if (!closestAmmo) return (closestAmmo = currentAmmo)

    return (closestAmmo =
      getDistance(position, currentAmmo.position) >
      getDistance(position, closestAmmo.position)
        ? closestAmmo
        : currentAmmo)
  })
}

const chooseMove = (playerState, enemiesStates, gameEnvironment) => {
  const shouldShootPlayer =
    canKill(playerState, enemiesStates) && playerState.ammo
  if (shouldShootPlayer) {
    return 'shoot'
  }

  const hasAmmo = playerState.ammo > 0
  if (hasAmmo) {
    const closestEnemy = getClosestEnemy(playerState, enemiesStates)
    const directionToEnemy = fastGetDirection(
      playerState.position,
      closestEnemy.position
    )
    const facingEnemy = directionToEnemy === playerState.direction

    if (!facingEnemy) {
      return directionToEnemy
    }

    return 'move'
  }

  // if (shouldGtfo(playerState, enemiesStates)) return 'move'

  const ammoExists = gameEnvironment.ammoPosition.length > 0
  if (ammoExists) {
    const directionToAmmo = fastGetDirection(
      playerState.position,
      getClosestAmmo(playerState, gameEnvironment)
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
