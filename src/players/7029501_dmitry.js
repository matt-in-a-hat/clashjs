import * as utils from '../lib/utils'

export const info = {
  name: 'RandomPlayer',
  style: 7
}

const gSM  = function (player, enemies, map) {
  const isSafeN = utils.isMovementSafe('north', player, enemies, map)
  const isSafeHere = utils.isMovementSafe('north', player, enemies, map)
  const isSafeToMove = utils.isMovementSafe('move', player, enemies, map)

  if (Math.random() > 0.1) {
    if (isSafeN) {
      if (player.ammo) {
        return utils.turnToKill(player, enemies) || utils.chaseEnemy(player, enemies, map)
      }
    }
  }

  const isSafeS = utils.isMovementSafe('south', player, enemies, map)

  if (isSafeN) {
    if (player.ammo) {
      return utils.turnToKill(player, enemies) || utils.chaseEnemy(player, enemies, map)
    }
  }

  if (isSafeToMove) {
    return 'move'
  }

  return
}

export default function(player, enemies, map) {
  if (player.ammo && utils.canKill(player, enemies)) {
    return "shoot"
  }

  if (player.ammo == 0) {
    const nearestAmmo = utils.getClosestAmmo(player, map.ammoPosition)
    const directionToAmmo = utils.getDirection(player.position, nearestAmmo)
    const isSafeAmmoPlace = utils.isMovementSafe(directionToAmmo, player, enemies, map)

    if (nearestAmmo && isSafeAmmoPlace) {
      if (directionToAmmo !== player.direction) {
        return directionToAmmo
      }
    }
  }

  const safestMove = gSM(player, enemies, map)
  if (safestMove) { return safestMove }

  // return utils.randomMove()

  return "move"
}