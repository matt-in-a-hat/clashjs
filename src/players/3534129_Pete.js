import * as utils from '../lib/utils.js'

export const info = {
  name: 'Pete',
  style: 0
}

export default function(player, enemies, map) {
  if (utils.canKill(player, enemies) && player.ammo) {
    return 'shoot'
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

  return utils.chaseEnemy(player, enemies, map)
}


