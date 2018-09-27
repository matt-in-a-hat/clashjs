import * as utils from '../lib/utils.js'

export const info = {
  name: 'Atilla',
  style: 8
}

function canMoveInDir(direction, player, map) {
  let canDo = false
  if (direction === 'move') {
    direction = player.direction
  }
  switch (direction) {
    case 'north':
      canDo = player.position[0] > 0
      break
    case 'east':
      canDo = player.position[1] < map.gridSize
      break
    case 'south':
      canDo = player.position[0] < map.gridSize - 1
      break
    case 'west':
      canDo = player.position[1] > 0
      break
    default:
      break
  }
  return canDo
}

function shouldMoveForAmmo(player, enemies, map) {
  // move for any ammo
  const ammo = map.ammoPosition

  if (!ammo.length) {
    return false
  }

  let closest = utils.getClosestAmmo(player, ammo)
  let direction = utils.getDirection(player.position, closest)

  if (direction !== player.direction) {
    return direction
  }

  return 'move'
}

let actionStore

function isReachable(playerPosition, enemyPosition, playerDirection) {
  if (playerPosition[0] === enemyPosition[0] || playerPosition[0] === enemyPosition[0]) {
    actionStore = utils.getDirection(playerPosition, enemyPosition)
    return true
  }
}

function couldKill(player, enemies) {
  // determine if could kill with one turn
  return enemies.some(
    (enemy) =>
      enemy.isAlive &&
        isReachable(
          player.position,
          enemy.position,
          player.direction
        )
  )
}

let nextAction

export default function(player, enemies, map) {

  if (utils.canKill(player, enemies) && player.ammo) {
    return 'shoot'
  }

  if (couldKill(player, enemies) && player.ammo) {
    nextAction = actionStore
    actionStore = null
  }

  if (nextAction) {
    let tmp = nextAction
    nextAction = null
    return tmp
  }

  // if there is a move for ammo
  let moveForAmmo = shouldMoveForAmmo(player, enemies, map)
  if (moveForAmmo) {
    return moveForAmmo
  }

  // try chase move, unless it involves driving into wall
  let chaseMove = utils.chaseEnemy(player, enemies, map)
  if (chaseMove && canMoveInDir(chaseMove, player, map)) {
    return chaseMove
  }

  return utils.goToCenter(player, map)
}
