import * as utils from '../lib/utils.js'

export const info = {
  name: 'George',
  style: 1
}


export default function(player, enemies, map) {
  if (utils.canKill(player, enemies) && player.ammo) {
    return 'shoot'
  }

  if (player.ammo === 0) {
    const moveForAmmo = utils.shouldMoveForAmmo(player, enemies, map)
    if (moveForAmmo) {
      return moveForAmmo
    }
  }

  if (Math.random() > 0.9) {
    return utils.randomMove()
  }

  const safestMove = utils.getSafestMove(player, enemies, map)
  if (safestMove) {
    return safestMove
  }

  return 'move'
}
