import * as utils from '../lib/utils.js'

export const info = {
  name: 'Trigger2',
  style: 2
}

export default function (player, enemies, map) {
  if (utils.canKill(player, enemies) && player.ammo) {
    return 'shoot'
  }

  if (Math.random() > 0.9) {
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

  if (Math.random() > 0.1) {
    const safestMove = utils.getSafestMove(player, enemies, map)
    if (safestMove) {
      return safestMove
    }
  }

}
