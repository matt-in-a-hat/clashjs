var utils = require('../lib/utils.js');
var noAmmo = true;
var DIRECTIONS = ['north', 'east', 'south', 'west'];


var turnToKill = function(player, enemies) {
  var turn = false;
  var mockState = JSON.parse(JSON.stringify(player));

  DIRECTIONS.forEach(function(direction) {
    mockState.direction = direction;

    if (utils.canKill(mockState, enemies)) {
      turn = direction;
    }
  });

  return turn;
};


var getEnemiesWithAmmo = function(enemies) {
  var dangerous = enemies.filter((enemy) => enemy.ammo);
  if (dangerous.length) return dangerous;
  return enemies;
};

var findCloseAmmo = function(player, ammoPosition) {
  var closest;

  if (!ammoPosition.length) return;

  closest = ammoPosition[0];

  ammoPosition.forEach(function(ammo) {
    var isCloser = utils.getDistance(player.position, ammo) < utils.getDistance(player.position, closest);
    if (isCloser) {
      closest = ammo;
    }
  });

  return closest;
};

var getEnemieswithAmmoAndVisible = function(player, enemies) {
  return enemies.filter((enemy) => {
    return enemy.ammo > 0 && utils.isVisible(enemy.position, player.position, enemy.direction)
  });
};


var java4eva = {
  info: {
    name: 'Java4Eva',
    style: 2
  },
  ai: (playerState, enemiesStates, gameEnvironment) => {
    var directionToAmmo;
    var directionToEnemy;
    if (playerState.ammo >0){
      noAmmo = false;
    }
    if (playerState.ammo == 0){
      noAmmo = true;
    }

    if (gameEnvironment.ammoPosition.length && noAmmo) {
      directionToAmmo = utils.fastGetDirection(playerState.position, findCloseAmmo(playerState, gameEnvironment.ammoPosition))

      if (directionToAmmo !== playerState.direction) return directionToAmmo;
      return 'move';
    }

    var dangers = getEnemieswithAmmoAndVisible(playerState, enemiesStates)

    //LOOK for an enemy
    if(!noAmmo){
      directionToEnemy = utils.fastGetDirection(playerState.position, dangers[0].position);
      if (directionToEnemy !== playerState.direction){
        var directionToMargeus = utils.fastGetDirection(dangers[0].position, playerState.position);
        if (directionToMargeus !== dangers[0].position){
                  return directionToEnemy;
        } else {
                  return utils.safeRandomMove();
        }
      }
      if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
      return 'shoot';
      }else{
        return utils.safeRandomMove();
      }
    }


    if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
      return 'shoot';
    }

    if (gameEnvironment.ammoPosition.length ) {
      directionToAmmo = utils.fastGetDirection(playerState.position, findCloseAmmo(playerState, gameEnvironment.ammoPosition))

      if (directionToAmmo !== playerState.direction) return directionToAmmo;
      return 'move';
    }

    return utils.safeRandomMove();
  }
};

module.exports = java4eva;
