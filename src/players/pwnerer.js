import * as utils from '../lib/utils.js'

function distance(lhs, rhs) {
  return Math.abs(Math.sqrt((lhs[0] - rhs[1]) **2 + (lhs[1] - rhs[1])**2))
}


function closestAmmo(thing, ammoPosition) {
  return ammoPosition.map(ammo => {
    const d = distance(thing.position, ammo)
    return {distance: d, ammo}
  })
  .sort((lhs, rhs) => lhs.d - rhs.d)[0]
}

function betterRandomMove() {
  const moves = ['north', 'east', 'south', 'west']
  return Math.random() > 0.33
    ? 'move'
    : moves[Math.floor(Math.random() * moves.length)]
}

function safeBetterRandomMove(player, enemies, map) {

  // If going to the center is safe, do it!
  const move = utils.goToCenter(player, map)
  if (utils.isMovementSafe(move, player, enemies, map)) {
    return move;
  }

  // if current version is safe, just move
  if(utils.isMovementSafe(player.direction, player, enemies, map)) {
    return 'move'
  }

  var moves = ['north', 'east', 'south', 'west']
  const options = moves.filter(m => utils.isMovementSafe(m, player, enemies, map))
  if (options.length) {
    return options[Math.floor(Math.random() * options.length)]
  } else {
    return betterRandomMove()
  }
}

export const info = {
  name: 'Teh pwnerer',
  style: 1
}

export default function(player, enemies, map) {

  // If I have ammo... Hunt
  // If I don't have ammo and I'm not closest, random move!
  if (utils.canKill(player, enemies) && player.ammo) {
    return 'shoot'
  }

  if (map.ammoPosition.length) {

    // If I'm closest to ammo, go for it!
    // the closest ammo to me
    const closeAmmo = closestAmmo(player, map.ammoPosition)
    // are any enemies closer than me?
    const enemyIsCloserToAmmo = enemies
      .filter(enemy=> enemy.isAlive)
      .map(enemy => ({distance: distance(enemy.position, closeAmmo.ammo), enemy}))
      .some((e) => {
        return e.distance < closeAmmo.distance
      })
    if (enemyIsCloserToAmmo) {
      return safeBetterRandomMove(player, enemies, map)
    }

    const directionToAmmo = utils.getDirection(
      player.position,
      map.ammoPosition[0]
    )

    if (directionToAmmo !== player.direction) {
      return directionToAmmo
    }


    return 'move'
  }

  return safeBetterRandomMove(player, enemies, map)
}
