var utils = require('../lib/utils.js');

var wayneholis = {
  info: {
    name: 'wayneholis',
    style: 3
  },
  ai: (playerState, enemiesStates, gameEnvironment) => {
    var directionToAmmo;

    if (playerState.ammo) { // if have ammo
      if (utils.canKill(playerState, enemiesStates)) {
        return 'shoot';
      } else {
        let closestEnemyDistance = -1;
        let closestEnemyPosition
        enemiesStates.map(enemy => {
          const distance = utils.getDistance(playerState.position, enemy.position)
          if (closestEnemyDistance < 0 || distance < closestEnemyDistance) {
            closestEnemyDistance = distance
            closestEnemyPosition = enemy.position
          }
        })
        let closestAmmoDistance = -1;
        let closestAmmoPosition
        gameEnvironment.ammoPosition.map(pos => {
          const distance = utils.getDistance(playerState.position, pos)
          if (closestAmmoDistance < 0 || distance < closestAmmoDistance) {
            closestAmmoDistance = distance
            closestAmmoPosition = pos
          }
        })
        const closestPosition = closestAmmoDistance < closestEnemyDistance
        directionToAmmo = utils.fastGetDirection(playerState.position, closestEnemyPosition);
        if (directionToAmmo !== playerState.direction) return directionToAmmo;
        return 'move';
      }
    }

    if (gameEnvironment.ammoPosition.length) {
      let closestDistance = -1;
      let closestAmmoPosition
      gameEnvironment.ammoPosition.map(pos => {
        const distance = utils.getDistance(playerState.position, pos)
        if (closestDistance < 0 || distance < closestDistance) {
          closestDistance = distance
          closestAmmoPosition = pos
        }
      })
      directionToAmmo = utils.fastGetDirection(playerState.position, closestAmmoPosition);

      if (directionToAmmo !== playerState.direction) return directionToAmmo;
      return 'move';
    }
    if (playerState.ammo) { // if have ammo
      let closestDistance = -1;
      let closestEnemyPosition
      enemiesStates.map(enemy => {
        const distance = utils.getDistance(playerState.position, enemy.position)
        if (closestDistance < 0 || distance < closestDistance) {
          closestDistance = distance
          closestEnemyPosition = enemy.position
        }
      })
      directionToAmmo = utils.fastGetDirection(playerState.position, closestEnemyPosition);
      if (directionToAmmo !== playerState.direction) return directionToAmmo;
      return 'move';
    }
    return utils.safeRandomMove();
  }
};

module.exports = wayneholis;
