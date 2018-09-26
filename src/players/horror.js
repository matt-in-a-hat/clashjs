import * as utils from '../lib/utils.js'

export const info = {
  name: 'Horror',
  style: 1
}

export default function (player, enemies, game) {
  var directionToAmmo

  if (utils.canKill(player, enemies) && player.ammo) {
    return 'shoot'
  }

  if (game.ammoPosition.length) {
    directionToAmmo = utils.getDirection(
      player.position,
      game.ammoPosition[0]
    )

    if (directionToAmmo !== player.direction) {
      return directionToAmmo
    }

    return 'move'
  }

  return utils.turn(player.direction, 2)
}
