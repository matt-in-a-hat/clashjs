var utils = require('../lib/utils.js');

var enemies = {};

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

        if (gameEnvironment.ammoPosition.length) {

            var closestAmmo = findClosestAmmo(gameEnvironment.ammoPosition);

            if (playerState.ammo === 0) {
                directionToAmmo = utils.fastGetDirection(playerState.position, closestAmmo);
                if (directionToAmmo !== playerState.direction) return directionToAmmo;
                return 'move';
            }
            //     directionToAmmo = utils.fastGetDirection(playerState.position, closestAmmo);
            //     if (closestAmmo[0] === playerState.position[0] || closestAmmo[1] === playerState.position[1]) {
            //         if (directionToAmmo !== playerState.direction) return directionToAmmo;
            //     }
            // }
            //
            var dir = utils.fastGetDirection(playerState.position, fx());
            if (dir !== playerState.direction) return dir;
            return 'move';

        }


        return utils.safeRandomMove();

        function findClosestAmmo(ammos) {
            var min = 0;
            ammos.forEach((a, i) => {
                if (utils.getDistance(playerState.position, a) < utils.getDistance(playerState.position, ammos[min])) {
                    min = i;
                }
            });
            return ammos[min];
        }

        function fx() {
            var min = 0;
            enemiesStates.forEach((e, i) => {
                if (utils.getDistance(playerState.position, e.position) < utils.getDistance(playerState.position, enemiesStates[min].position)) {
                    min = i;
                }
            });
            return enemiesStates[min].position;
        }
    }
};
