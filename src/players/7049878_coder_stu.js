import * as utils from '../lib/utils.js'

export const info = {
  name: 'coder_stu',
  style: 8
}

const nextRandomMove = () => {
  var moves = ['north', 'east', 'south', 'west']
  return Math.random() > 0.33 ?
    'move' :
    moves[Math.floor(Math.random() * moves.length)]
}

const nextSafeMove = (player, enemies, map) => {
  const isSafeHere = utils.isMovementSafe(nextRandomMove(), player, enemies, map)
  const isSafeToMove = utils.isMovementSafe('move', player, enemies, map)

  if (isSafeHere) {
    if (player.ammo) {
      return utils.turnToKill(player, enemies) || utils.chaseEnemy(player, enemies, map)
    }
  }
  if (isSafeToMove) {
    return 'move'
  }

  return
}

export default function (player, enemies, map) {
  if (utils.canKill(player, enemies) && player.ammo) {
    return 'shoot'
  }

  return utils.shouldMoveForAmmo(player, enemies, map) || nextSafeMove(player, enemies, map)
}
