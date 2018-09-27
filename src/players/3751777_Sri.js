import * as utils from '../lib/utils'

export const info = {
  name: 'Sri',
  style: 3
}

export default function(player, enemies, map) {
  if (Math.random() > 0.3) {
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
