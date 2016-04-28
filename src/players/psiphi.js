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

                if (dist(playerState.position, e.position) < dist(playerState.position, enemiesStates[min].position)) {
                    min = i;
                }
            });
            return enemiesStates[min].position;
        }

        function dist(start = [], end = []) {
          var diffVertical = Math.abs(start[0] - end[0]);
          var diffHorizontal = Math.abs(start[1] - end[1]);

          return Math.min(diffHorizontal, diffVertical);
        }
    }
};
