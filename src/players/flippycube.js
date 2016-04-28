var utils = require('../lib/utils.js');

var flippycube = {
    info: {
        name: 'flippycube',
        style: 10
    },
    ai: (playerState, enemiesStates, gameEnvironment) => {
        var directionToAmmo;

        if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
            return 'shoot';
        }

        //find nearest ammo
        //Iterate thru ammo in loop
        //Calculate distance to ammo item
        //find shortest distance (hold in variable)
        //Point at nearest ammo and move towards it 
        //No ammo on the board head for the centre of the board?


        if (gameEnvironment.ammoPosition.length) {



            if (!playerState.ammo) {
                var closest = 0;

                var minDist = 1000.0;
                var i;
                for (i = 0; i < gameEnvironment.ammoPosition.length; i++) {
                    var dist = utils.getDistance(playerState.position, gameEnvironment.ammoPosition[i]);
                    if (dist < minDist) {
                        closest = i;
                        minDist = dist;
                    }
                }
                directionToAmmo = utils.fastGetDirection(playerState.position, gameEnvironment.ammoPosition[closest]);
                if (directionToAmmo !== playerState.direction) return directionToAmmo;
            }
            else {
                if (playerState.position[0] >= 35 && playerState.direction !== 'north') {
                    return 'north';
                }
                else if (playerState.position[0] <= 0 && playerState.direction !== 'south') {
                    return 'south';
                }
                if (playerState.position[1] >= 35 && playerState.direction !== 'west') {
                    return 'west';
                }
                else if (playerState.position[1] <= 0 && playerState.direction !== 'east') {
                    return 'east';
                }
                
                // based on our direction
                // loop through enemy positions
                // if player in our next row or column, and has ammo, reverse direction
                
                var direction = playerState.direction;
                var lookCol = playerState.position[0];
                var lookRow = playerState.position[1];
                switch(direction){
                    case 'north':
                    lookRow--;
                    break;
                    case 'south':
                    lookRow++;
                    break;
                    case 'west':
                    lookCol--;
                    break;
                    case 'east':
                    lookCol++;
                    break;             
                }
                var safeDirections=['north', 'south', 'east', 'west'];
                var indexOfDirection;
                for (i = 0; i < enemiesStates.length; i++) {
                    if(enemiesStates[i].position[0]==lookCol && enemiesStates[i].ammo){
                      indexOfDirection = safeDirections.indexOf(direction=='north'?'south':'north');
                      safeDirections.splice(indexOfDirection,1);
                    }
                    if(enemiesStates[i].position[1]==lookRow && enemiesStates[i].ammo){
                      indexOfDirection = safeDirections.indexOf(direction=='west'?'east':'east');
                      safeDirections.splice(indexOfDirection,1);
                    }
                
                }
                console.log('Safe Directions: '+safeDirections);
                if(safeDirections.length){
                    if(playerState.direction===safeDirections[0]){
                        return 'move';
                    }else{
                        return safeDirections[0];
                    }
                    
                }
                

            } 
            if (playerState.ammo) {
               //return playerState.direction; 
            }
            
            return 'move';

        }
        return utils.safeRandomMove();
    }
};

module.exports = flippycube;
