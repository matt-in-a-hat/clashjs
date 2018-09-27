import * as utils from '../lib/utils.js'

export const info = {
  name: 'Pete',
  style: 0
}

export default function(player, enemies, map) {
  if (player.ammo) {
    return hunting(player, enemies, map)
  } else {
    if (utils.shouldMoveForAmmo(player, enemies, map)) {
      const directionToAmmo = utils.getDirection(
        player.position,
        utils.getClosestAmmo(player,map.ammoPosition)
      )
  
      if (directionToAmmo !== player.direction) {
        return directionToAmmo
      }
  
      if (utils.isMovementSafe('move', player, enemies, map)) {
        return 'move'
      } 
    }
  }
 
  return utils.getSafestMove(player, enemies, map)
}

let count = 0

function hunting(player, enemies, map) {
  if (utils.canKill(player, enemies)) {
    return 'shoot'
  }

  let potential = utils.turnToKill(player,enemies)
  if (potential) {
    return potential
  } else {
    return utils.turnToAmbush(player, enemies)
  }
}

