import * as utils from '../lib/utils.js'

export const info = {
  name: 'ReadyPlayerOne',
  style: 4
}
function randomTurn() {
  var moves = ['north', 'east', 'south', 'west']
  return moves[Math.floor(Math.random() * moves.length)]
}
export default function(player, enemies, map) {


  if (utils.canKill(player, enemies) && player.ammo) {
    return 'shoot'
  }

  if (!player.ammo){
    utils.shouldMoveForAmmo(player, enemies, map)
  }

  if (utils.canDie(player, enemies)) {
    if (utils.isMovementSafe('move', player, enemies, map)) {
      return 'move'
    }
    return randomTurn()
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
