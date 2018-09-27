import * as utils from '../lib/utils.js'
const DIRECTIONS = ['north', 'east', 'south', 'west']
const MOVES = ['north', 'east', 'south', 'west', 'shoot']

export const info = {
  name: 'Matt',
  style: 10
}

function inDangerFrom(player, enemies) {
  if (enemies.length <= 0) {
    return false
  }

  const pos = player.position
  return enemies.some((e) => {
    return utils.sameY(pos, e.position) || utils.sameX(pos, e.position)
  })
}
var first = true
export default function(player, enemies, map) {
  if (first) {
    console.log(player, enemies, map)
    first = false
  }

  if (utils.canKill(player, enemies) && player.ammo) {
    return 'shoot'
  }

  if (player.ammo) {
    const turnToAmbush = utils.turnToAmbush(player, enemies)
    if (turnToAmbush) {
      return turnToAmbush
    }
  }

  const inDangerFromEnemies = utils.getImmediateThreats(player, enemies)
  if (inDangerFromEnemies.length) {

    const safestMove = utils.getSafestMove(player, enemies, map)
    if (safestMove) {
      return safestMove
    }
  //   if (utils.canMoveTowards(player.direction, player, map)) {
  //     return 'move'
  //   } else {
  //     DIRECTIONS.forEach(direction => {
  //       if (utils.isMovementSafe(direction, player, enemies, map)) {
  //         return direction
  //       }
  //     })
  //   }
  }

  // if (utils.getClosestAmmo)

  if (map.ammoPosition.length) {
    const directionToAmmo = utils.getDirection(
      player.position,
      map.ammoPosition[0]
    )

    if (directionToAmmo !== player.direction) {
      return directionToAmmo
    }

    return 'move'
  }

  return 'north'
}
