import * as utils from '../lib/utils.js'

export const info = {
  name: 'LA',
  style: 1
}

export default function(player, enemies, map) {
  if (utils.canKill(player, enemies) && player.ammo) {
    return 'shoot'
  }

  if(utils.inDanger(player, enemies)){
    return utils.getSafestMove(player, enemies, map)
  }

  // if(utils.getClosestEnemy(player, enemies)){
  //   return 'shoot'
  // }

  if (map.ammoPosition.length) {
    const directionToAmmo = utils.getDirection(
      player.position,
      map.ammoPosition[0]
    )

    if (directionToAmmo !== player.direction) {
      return directionToAmmo
    }

    return utils.shouldMoveForAmmo(player, enemies, map)
  }



  return utils.shouldMoveForAmmo(player, enemies, map)
}
