var utils = require('../lib/utils.js');

var meme = {
  info: {
    name: 'meme',
    style: 1,
    state: {
        test: "hello"
    }
},
ai: (playerState, enemiesState, gameEnvironment) => {

    var hasAmmo = playerState.ammo > 0;
    var i;
    var directionToAmmo;
    var closestAmmoPos;

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

            var testDist = Math.abs(utils.getDistance(playerState.position, gameEnvironment.ammoPosition[i]));
            if(testDist < minDist) {
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

    //move to ammo
    // if(!hasAmmo) {
        if (directionToAmmo !== playerState.direction) {
            return directionToAmmo;
        }
        return 'move';
    // }

    //otherwise hunt
    if (gameEnvironment.ammoPosition.length > 0) {

        if(!utils.isVisible(playerState.position, closestAmmoPos, playerState.direction)) {
            if (directionToAmmo !== playerState.direction) {
                return directionToAmmo;
            }
            return 'move';
        }

    }
}
};

module.exports = meme;
