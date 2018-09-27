import * as utils from '../lib/utils.js'

export const info = {
  name: 'ReadyPlayerOne',
  style: 4
}

export default function(player, enemies, map) {


  if (utils.canKill(player, enemies) && player.ammo) {
    return 'shoot'
  }

  if (utils.canDie(player, enemies)) {
    return 'move'
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