var utils = require('../lib/utils.js');
var noAmmo = true;
var DIRECTIONS = ['north', 'east', 'south', 'west'];
var playerStateG = {}
var enemiesStatesG = {}
var gameEnvironmentG = {}

var canBeShot = function(player, enemies) {
  // make arr of if you can be shot [true, false, false, true]
  var arrayOfAnswers = enemies.map(function(enemy) {
      return enemy.ammo > 0 && utils.isVisible(enemy.position, player.position, enemy.direction);
    })

  // If any are true. Dont do the move!
  for (var i = 0; arrayOfAnswers.length < i; i++) {
    if (arrayOfAnswers[i] === true) {
      return true
    }
  }
  return false
};

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
  if (dangerous.length) {
    return dangerous;
  }
  return enemies;
};

var findCloseAmmo = function(player, ammoPosition) {
  var closest;

  if (!ammoPosition.length) {
    return;
  }

  closest = ammoPosition[0];

  for (var i = 0; ammoPosition.length < i; i++ ) {
    var isCloser = utils.getDistance(player.position, ammoPosition[i]) < utils.getDistance(player.position, closest);
    if (isCloser) {
      closest = ammo;
    }
  }
  return closest;
};

var getEnemieswithAmmoAndVisible = function(player, enemies) {
  return enemies.filter((enemy) => {
    return enemy.ammo > 0 && utils.isVisible(enemy.position, player.position, enemy.direction)
  });
};

var getReallySafeMove = () => {
  return utils.safeRandomMove()
}

var moveToAmmo = () => {
  var directionToAmmo = utils.fastGetDirection(playerStateG.position, findCloseAmmo(playerStateG, gameEnvironmentG.ammoPosition))

  if (directionToAmmo !== playerStateG.direction) {
    return directionToAmmo;
  }

  return 'move';
}

var java4eva = {
  info: {
    name: 'Java4Eva',
    style: 2,
    handicap: 1,
  },
  ai: (playerState, enemiesStates, gameEnvironment) => {
    playerStateG = playerState;
    enemiesStatesG = enemiesStates;
    gameEnvironmentG = gameEnvironment;

    var directionToAmmo;
    var directionToEnemy;
    if (playerState.ammo >0){
      noAmmo = false;
    }
    if (playerState.ammo == 0){
      noAmmo = true;
    }

    if (gameEnvironment.ammoPosition.length && noAmmo) {
      return moveToAmmo()
    }

    var dangers = getEnemiesWithAmmo(playerState, enemiesStates)
    if (dangers.length === 0) {
      dangers = enemiesStates;
    }

    //LOOK for an enemy
    if(!noAmmo){

      if (dangers.length === 0) {
        dangers = enemiesStates;
      }

      if (utils.canKill(playerState, dangers) && playerState.ammo) {
        return 'shoot';
      }

      if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
        return 'shoot';
      }

      var directionToEnemy

      if (dangers && dangers.length < 0) {
        directionToEnemy = utils.fastGetDirection(playerState.position, dangers[0].position);
      } else {
        directionToEnemy = utils.fastGetDirection(playerState.position, enemiesStates[0].position);
      }
      if (directionToEnemy !== playerState.direction){
        var directionToMargeus = utils.fastGetDirection(dangers[0].position, playerState.position);
        if (directionToMargeus !== dangers[0].position){
                  return directionToEnemy;
        } else {
                  return getReallySafeMove();
        }
      }
      if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
        return 'shoot';
      }else{
        return getReallySafeMove()
      }
    }

    if (gameEnvironment.ammoPosition.length ) {
      return moveToAmmo()
    }

    return getReallySafeMove()
  }
};

module.exports = java4eva;
