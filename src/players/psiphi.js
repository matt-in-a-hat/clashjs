var utils = require('../lib/utils.js');

var enemies = {}

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

            // if (playerState.ammo < 1) {
                directionToAmmo = utils.fastGetDirection(playerState.position, closestAmmo);
                if (directionToAmmo !== playerState.direction) return directionToAmmo;
                return 'move';
            // } else {
            //     directionToAmmo = utils.fastGetDirection(playerState.position, closestAmmo);
            //     if (closestAmmo[0] === playerState.position[0] || closestAmmo[1] === playerState.position[1]) {
            //         if (directionToAmmo !== playerState.direction) return directionToAmmo;
            //     }
            // }
            //
            // if (playerState.ammo > 2) {
            //
            // }
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
    }
};
