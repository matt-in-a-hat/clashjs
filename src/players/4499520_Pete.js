import * as utils from '../lib/utils.js'

export const info = {
  name: 'Pete',
  style: 0
}

export default function(player, enemies, map) {

  if (player.ammo) {
    return hunting(player, enemies, map)
  }
 
  if (map.ammoPosition.length !== 0) {
    const directionToAmmo = utils.getDirection(
      player.position,
      utils.getClosestAmmo(player,map.ammoPosition)
    )

    if (directionToAmmo !== player.direction) {
      return directionToAmmo
    }

    return 'move'
  }

  return utils.getSafestMove(player, enemies, map)
}

let count = 0

function hunting(player, enemies, map) {
  if (utils.canKill(player, enemies)) {
    return 'shoot'
  }
  
  if (count % 2 === 0) {
    return utils.chaseEnemy(player, enemies, map)
  } else {
    return utils.getSafestMove(player, enemies, map)
  }
}

