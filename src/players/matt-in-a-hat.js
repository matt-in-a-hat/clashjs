import * as utils from '../lib/utils.js'
// const DIRECTIONS = ['north', 'east', 'south', 'west']
// const MOVES = ['north', 'east', 'south', 'west', 'shoot']

export const info = {
  name: 'MortySmith',
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
// var first = true
export default function(player, enemies, map) {

  // if (first) {
  //   console.log(player, enemies, map)
  //   first = false
  // }

  if (utils.canKill(player, enemies) && player.ammo) {
    return 'shoot'
  }

  if (player.ammo) {
    const turnToAmbush = utils.turnToAmbush(player, enemies)
    if (turnToAmbush) {
      return turnToAmbush
    }
  }

  // Each alive enemy with ammo
  // if sameX && I'm visible
  //    if facing y
  //      move
  //    else
  //      turn y? (the y that matches closest ammo not on same y)
  var anyMove = null
  enemies.filter(e => e.isAlive && e.ammo).forEach(enemy => {
    if (utils.isVisible(enemy.position, player.position, enemy.direction)) {
      // if I'm on the same plane
      if (utils.isVertical(player.direction) && utils.isVertical(enemy.direction)) {
        anyMove = utils.canMoveTowards('west', player, map) ? 'west' : 'east'
      } else if (utils.isHorizontal(player.direction) && utils.isHorizontal(enemy.direction)) {
        anyMove = utils.canMoveTowards('north', player, map) ? 'north' : 'south'
      } else {
        anyMove = 'move'
      }
    }
  })

  if (anyMove) {
    return anyMove
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



  if (map.ammoPosition.length) {
    const closestAmmo = utils.getClosestAmmo(player, map.ammoPosition)
    const directionToAmmo = utils.getDirection(
      player.position,
      closestAmmo || map.ammoPosition[0]
    )

    if (directionToAmmo !== player.direction) {
      return directionToAmmo
    }

    return 'move'
  }

  return 'north'
}
