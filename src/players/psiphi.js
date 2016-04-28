var utils = require('../lib/utils.js');

var waiting = false;

module.exports = {
    info: {
        name: 'Ψ',
        style: 3
    },
    ai: (playerState, enemiesStates, gameEnvironment) => { /* Siegfried */
        var directionToAmmo;

        if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
            return 'shoot';
        }

        if (gameEnvironment.ammoPosition.length && playerState.ammo < 1) {
            directionToAmmo = utils.fastGetDirection(playerState.position, findClosestAmmo(gameEnvironment.ammoPosition));

            if (directionToAmmo !== playerState.direction) return directionToAmmo;
            return 'move';
        }

        // if (gameEnvironment.ammoPosition.length) {
        //
        //     var closestAmmo = findClosestAmmo(gameEnvironment.ammoPosition);
        //     directionToAmmo = utils.fastGetDirection(playerState.position, closestAmmo);
        //     if (closestAmmo[0] === playerState.position[0] || closestAmmo[1] === playerState.position[1]) {
        //         if (directionToAmmo !== playerState.direction) return directionToAmmo;
        //     }
        //
        //     return 'move';
        // }

        return utils.safeRandomMove();

        function findClosestAmmo(ammos) {
            var min = 0;
            ammos.forEach((a, i) => {
                if (utils.getDistance(playerState, a) < utils.getDistance(playerState, ammos[min])) {
                    min = i;
                }
            });
            return ammos[min];
        }
    }
};
