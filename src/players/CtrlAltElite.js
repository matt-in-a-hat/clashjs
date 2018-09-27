import * as utils from '../lib/utils.js'

export const info = {
  name: 'CtrlAltElite',
  style: 7
}

function canMoveInDir(direction, player, map) {
  let canDo = false
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

export default function(player, enemies, map) {

  if (utils.canKill(player, enemies) && player.ammo) {
    return 'shoot'
  }

  // if there is a move for ammo
  let moveForAmmo = utils.shouldMoveForAmmo(player, enemies, map)
  if (moveForAmmo) {
    return moveForAmmo
  }

  let safestMove = utils.getSafestMove(player, enemies, map)
  if (safestMove) {
    return safestMove
  }

  return utils.goToCenter(player, map)
}
