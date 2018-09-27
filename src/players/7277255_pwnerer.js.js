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

export function betterRandomMove() {
  var moves = ['north', 'east', 'south', 'west']
  return Math.random() > 0.33
    ? 'move'
    : moves[Math.floor(Math.random() * moves.length)]
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
      .map(enemy => ({distance: distance(enemy.position, closeAmmo.ammo), enemy}))
      .some((e) => {
        return e.distance < closeAmmo.distance
      })
    if (enemyIsCloserToAmmo) {
      return betterRandomMove();
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

  return betterRandomMove()
}