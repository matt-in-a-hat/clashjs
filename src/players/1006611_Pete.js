import * as utils from '../lib/utils.js'

let canKill = null 

export const info = {
  name: 'Pete',
  style: 0
}

export default function(player, enemies, map) {
  if (canKill == null) {
    canKill = utils.canKill;
  }
  if (canKill(player, enemies) && player.ammo) {
    return 'shoot'
  }

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

  return utils.randomMove()
}
