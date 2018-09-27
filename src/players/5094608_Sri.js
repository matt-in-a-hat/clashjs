import * as utils from '../lib/utils'

export const info = {
  name: 'Sri',
  style: 3
}

export default function(player, enemies, map) {

    if(utils.canKill(player, enemies) && player.ammo) {
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

  if(utils.isMovementSafe('move', player, enemies, map)) {
    return 'move'
}

  return utils.randomMove()
}
