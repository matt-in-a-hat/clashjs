///
// TEAM PAYPR
///


var utils = require('../lib/utils.js');

var gameRunner = {
  info: {
    name: 'paypr',
    style: 1,
    handicap: 1,
    state: {
        test: "hello"
    }
},
ai: (playerState, enemiesState, gameEnvironment) => {

    var hasAmmo = playerState.ammo > 0;
    var i;
    var directionToAmmo;
    var closestAmmoPos;

    var enemiesLeft = 0;
    var lastEnemy;

    for(i=0; i<enemiesState.length; i++) {
        if(enemiesState[i].isAlive) {
            enemiesLeft++;
            lastEnemy = enemiesState[i];
        }
    }

    console.log("PAYPR");

    if(!playerState.custom) {
        playerState.custom = {};
    }


    //kill if possible
    if (utils.canKill(playerState, enemiesState) && playerState.ammo) {
        return 'shoot';
    }

    //find closest ammo direction
    if (gameEnvironment.ammoPosition.length > 0) {

        var minDist = Math.abs(utils.getDistance(playerState.position, gameEnvironment.ammoPosition[0]));
        closestAmmoPos = gameEnvironment.ammoPosition[0];
        directionToAmmo = utils.getDirection(
            playerState.position,
            gameEnvironment.ammoPosition[0]
        );


        for(i=1; i<gameEnvironment.ammoPosition.length; i++) {
            console.log(gameEnvironment.ammoPosition[i]);

            var testDist = Math.abs(utils.getDistance(playerState.position, gameEnvironment.ammoPosition[i]));
            console.log("comparing " + testDist + " < " + minDist);
            if(testDist < minDist) {
                console.log("testDist smaller");
                minDist = testDist;
                directionToAmmo = utils.getDirection(
                    playerState.position,
                    gameEnvironment.ammoPosition[i]
                );
                closestAmmoPos = gameEnvironment.ammoPosition[i];
            }
        }
        
    }

    //check to see if there are any enemies moving within direction
    var myX = playerState.position[0];
    var myY = playerState.position[1];
    var myPos = playerState.position;

    var isUp = function(myPosition, enemyPosition) {
        return myPosition[1] - enemyPosition[1] < 0;
    };

    var isDown = function(myPosition, enemyPosition) {
        return !isUp(myPosition,enemyPosition);
    };

    var isLeft = function(myPosition, enemyPosition) {
        return myPosition[0] - enemyPosition[0] > 0;
    };
    var isRight = function(myPosition, enemyPosition) {
        return !isLeft(myPosition,enemyPosition);
    };

    for(i=0; i<enemiesState.length && hasAmmo; i++) {
        var enemy = enemiesState[i];
        var enPos = enemy.position;
        var enDir = enemy.direction;


        //if they are in the same lane and not moving out of it
        //then point and FIRE
        if(enPos[0] === myX && (enDir == 'north' || enDir == 'south')) {

            if(isUp(myPos, enPos)) {
                return 'north';
            }
            else return 'south';
        }

        if(enPos[1] === myY && (enDir == 'east' || enDir == 'west')) {
            if(isLeft(myPos, enPos)) {
                return 'west';
            }
            else return 'east';
        }
        /*
        // is moving left and facing east                if moving right and facing west
        if( (enPos[0]+1 === myX && enDir == 'east') || (enPos[0]-1 === myX && enDir == 'west'))  { //is left and moving east
            if(isUp(enPos, myPos)) {
                console.log("PREDICTING ENEMY WILL BE NORTH");
                return 'north';
            }
            console.log("PREDICTING ENEMY WILL BE SOUTH")
            else return 'south';
        }
        */
    }

    /*
    if(hasAmmo) {
        var predictEnemys = [];
        for(i=0; i<enemiesState.length; i++) {
            predictEnemys.push({
                isAlive: enemiesState[i].isAlive,
                position: enemiesState[i].position
            });
        }

        for(i=0; i<predictEnemys.length; i++) {
            var enemy = predictEnemys[i];
            var enDir = enemy.direction;
            if(enDir == 'north') { predictEnemys[i].position[1]++; }
            if(enDir == 'south') { predictEnemys[i].position[1]--; }
            if(enDir == 'west') { predictEnemys[i].position[0]--; }
            if(enDir == 'east') { predictEnemys[i].position[0]++; }
        }

        var directions = ['north', 'south', 'east', 'west'];

        for(i=0; i<directions.length; i++) {
            var testPlayer = {
                position: playerState.position,
                direction: directions[i]
            };

            if(utils.canKill(testPlayer, predictEnemys)) {
                return directions[i];
            }
        }

    }
    */


    if(hasAmmo && enemiesLeft === 1) {
        //hunt the last player
        var newDir = utils.getDirection(playerState.position,lastEnemy.position);

        if(newDir !== playerState.direction) {
            return newDir;
        }
        else {
            return 'move';
        }
    }

    //move to ammo
    // if(!hasAmmo) {
        if (directionToAmmo !== playerState.direction) {
            console.log("turning to ammo");
            return directionToAmmo;
        }
        console.log("moving to ammo");
        return 'move';
    // }

    //otherwise hunt 
    if (gameEnvironment.ammoPosition.length > 0) {
        console.log("hunting");

        if(!utils.isVisible(playerState.position, closestAmmoPos, playerState.direction)) {
            if (directionToAmmo !== playerState.direction) {
                console.log("turning to ammo");
                return directionToAmmo;
            }
            console.log("moving to ammo");
            return 'move';
        }

    }





    //return utils.randomMove();
}
};

module.exports = gameRunner;