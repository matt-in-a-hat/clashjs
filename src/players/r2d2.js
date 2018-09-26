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

const PLAYER_NAME = 'R2D2'

const PLAYER_STYLE = 1

var turn90 = (direction) => {
  if (direction == 'north') return 'east'
  if (direction == 'east') return 'south'
  if (direction == 'south') return 'west'
  if (direction == 'west') return 'north'
}
var isSameLine = (originalPosition = [], finalPosition = []) => {
  if (
    originalPosition[1] === finalPosition[1] ||
    (finalPosition[0] && originalPosition[1]) ||
    originalPosition[1] === finalPosition[1] ||
    originalPosition[0] === finalPosition[0]
  )
    return true
  return false
}

var nextMove = (playerState) => {
  var direction = playerState.direction
  var position = playerState.position
  //console.log(direction, position)
  if (direction == 'north') position[0]--
  if (direction == 'south') position[0]++
  if (direction == 'east') position[1]++
  if (direction == 'west') position[1]--

  if (position[0] < 0) position[0] = 0
  if (position[1] < 0) position[1] = 0

  return position
}

var canDie = (position = {}, enemiesStates = []) => {
  return enemiesStates.some((enemyObject) => {
    return (
      enemyObject.isAlive &&
      enemyObject.ammo > 0 &&
      isVisible(enemyObject.position, position, enemyObject.direction)
    )
  })
}

var canDieFuture = (position = {}, enemiesStates = []) => {
  return enemiesStates.some((enemyObject) => {
    return (
      enemyObject.isAlive &&
      enemyObject.ammo > 0 &&
      isVisible(nextMove(enemyObject), position, enemyObject.direction)
    )
  })
}

const chooseMove = (playerState, enemiesStates, gameEnvironment) => {
  const shouldShootPlayer =
    canKill(playerState, enemiesStates) && playerState.ammo
  if (shouldShootPlayer) {
    return 'shoot'
  }
  if (canDie(playerState.position, enemiesStates)) return 'move'
  if (canDie(nextMove(playerState), enemiesStates)) {
    //turn(playerState.position, 3)
    return
  }
  if (canDieFuture(nextMove(playerState), enemiesStates)) return

  return safeRandomMove()

  // console.log(canDie(playerState, enemiesStates))
  // console.log("NEXT" + nextMove(playerState))
  // const ammoExists = gameEnvironment.ammoPosition.length > 0
  // if (ammoExists) {
  //   const directionToAmmo = fastGetDirection(playerState.position, gameEnvironment.ammoPosition[0])
  //   const facingAmmo = directionToAmmo === playerState.direction

  //   if (!facingAmmo) {
  //     return directionToAmmo
  //   }
  //   fastGetDirection(playerState.position, [16,16])
  //   return 'move'
  // }

  // const test = canDie(enemiesStates, playerState)
  // console.log(test)
  //return safeRandomMove()
}

export default {
  info: {
    name: PLAYER_NAME,
    style: PLAYER_STYLE
  },
  ai: chooseMove
}
