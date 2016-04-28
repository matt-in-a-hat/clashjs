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

    console.log(playerState.custom);

    console.log("PAYPR");
    console.log(enemiesState);

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
        return myPosition[1] - enemyPosition[1] > 0;
    };

    var isDown = function(myPosition, enemyPosition) {
        return !isUp(myPosition,enemyPosition);
    };

    var isLeft = function(myPosition, enemyPosition) {
        return myPosition[0] - enemyPosition[0] < 0;
    };
    var isRight = function(myPosition, enemyPosition) {
        return !isLeft(myPosition,enemyPosition);
    };

    for(i=0; i<enemiesState.length && hasAmmo; i++) {
        var enemy = enemiesState[i];
        var enPos = enemy.position;
        var enDir = enemy.direction;

        // is moving left and facing east                if moving right and facing west
        if( (enPos[0]-1 === myX-1 && enDir == 'east') || (enPos[0]+1 === myX+1 && enDir == 'west'))  { //is left and moving east
            if(isUp(enPos, myPos)) {
                return 'north';
            }
            else return 'south';
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