import * as utils from '../lib/utils.js'

export const info = {
  name: 'coder_stu',
  style: 8
}

export default function (player, enemies, map) {
  if (utils.canKill(player, enemies) && player.ammo) {
    return 'shoot'
  }

  return utils.shouldMoveForAmmo(player, enemies, map) || utils.getSafestMove(player, enemies, map)
}
