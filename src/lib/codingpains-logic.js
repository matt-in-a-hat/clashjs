import utils from './utils.js'

const DIRECTIONS = ['north', 'east', 'south', 'west']

const inDanger = function(player, enemies) {
  if (enemies.length <= 0) {
    return false
  }

  const pos = player.position
  return enemies.some((e) => {
    return sameY(pos, e.position) || sameX(pos, e.position)
  })
}

const sameY = function(start, end) {
  return start[0] === end[0]
}

const sameX = function(start, end) {
  return start[1] === end[1]
}

const canMoveTowards = function(direction, player, map) {
  let canDo = false
  switch (direction) {
    case 'north':
      canDo = player.position[0] > 0
      break
    case 'east':
      canDo = player.position[1] < map.gridSize
      break
    case 'south':
      canDo = player.position[0] < map.gridSize - 1
      break
    case 'west':
      canDo = player.position[1] > 0
      break
  }
  return canDo
}

const canDie = function(player, enemies) {
  return enemies.some((enemy) => {
    return (
      enemy.ammo > 0 &&
      utils.isVisible(enemy.position, player.position, enemy.direction)
    )
  })
}

const getClosestAmmo = function(player, ammoPosition) {
  if (!ammoPosition.length) {
    return
  }

  let closest = ammoPosition[0]

  ammoPosition.forEach(function(ammo) {
    const isCloser =
      utils.getDistance(player.position, ammo) <
      utils.getDistance(player.position, closest)
    if (isCloser) {
      closest = ammo
    }
  })

  return closest
}

const getReachableAmmo = function(player, enemies, map) {
  const reachable = map.ammoPosition.filter(function(ammo) {
    const distance = utils.getDistance(player.position, ammo)

    return !enemies.some(function(enemy) {
      return utils.getDistance(enemy.position, ammo) < distance
    })
  })

  return reachable
}

const shouldMoveForAmmo = function(player, enemies, map) {
  const ammo = getReachableAmmo(player, enemies, map)

  if (!ammo.length) {
    return false
  }

  let closest = getClosestAmmo(player, ammo)
  let direction = utils.fastGetDirection(player.position, closest)

  if (direction !== player.direction) {
    return direction
  }

  return 'move'
}

const isMovementSafe = function(action, player, enemies, map) {
  const futureState = JSON.parse(JSON.stringify(player))

  if (action === 'move') {
    switch (player.direction) {
      case DIRECTIONS[0]:
        if (futureState.position[0] > 0) {
          futureState.position[0]--
        }
        break
      case DIRECTIONS[1]:
        if (futureState.position[1] < map.gridSize) {
          futureState.position[1]++
        }
        break
      case DIRECTIONS[2]:
        if (futureState.position[0] < map.gridSize) {
          futureState.position[0]++
        }
        break
      case DIRECTIONS[3]:
        if (futureState.position[1] > 0) {
          futureState.position[1]--
        }
        break
      default:
        break
    }
  }

  if (canDie(futureState, enemies)) {
    return false
  } else {
    return true
  }
}

const getSafestMove = function(player, enemies, map) {
  const isSafeHere = isMovementSafe('north', player, enemies, map)
  const isSafeToMove = isMovementSafe('move', player, enemies, map)

  if (isSafeHere) {
    if (player.ammo) {
      return turnToKill(player, enemies) || chaseEnemy(player, enemies, map)
    }
  }
  if (isSafeToMove) {
    return 'move'
  }

  return
}

const goToCenter = function(player, map) {
  const center = [map.gridSize, map.gridSize].map((coord) =>
    Math.floor(coord / 2)
  )
  const movement = utils.fastGetDirection(player.position, center)

  if (movement === player.direction) {
    movement = 'move'
  }

  return movement
}

const getClosestEnemy = function(player, enemies) {
  let clonedStates = enemies.slice(0, enemies.length)

  clonedStates = clonedStates.filter(function(enemy) {
    return enemy.isAlive
  })

  let closest = clonedStates[0]

  clonedStates.forEach(function(enemy) {
    if (utils.getDistance(player, enemy) < utils.getDistance(player, closest)) {
      closest = enemy
    }
  })

  return closest
}

const getBackPosition = function(enemy) {
  const back = enemy.position.slice(0, 2)
  switch (enemy.direction) {
    case 'north':
      back[0]++
      break
    case 'south':
      back[0]--
      break
    case 'west':
      back[1]++
      break
    case 'east':
      back[1]--
      break
  }

  return back
}

const sneakyGetDirection = function(player, enemy) {
  const diffVertical = Math.abs(player.position[0] - player.position[0])

  if (
    diffVertical &&
    enemy.position !== 'north' &&
    enemy.position !== 'south'
  ) {
    return player.position[0] - enemy.position[0] > 0 ? 'north' : 'south'
  }
  return player.position[1] - enemy.position[1] > 0 ? 'west' : 'east'
}

const verticalDelta = function(start, end) {
  return start[0] - end[0]
}

const absVerticalDelta = function(start, end) {
  return Math.abs(verticalDelta(start, end))
}

const horizontalDelta = function(start, end) {
  return start[1] - end[1]
}

const absHorizontalDelta = function(start, end) {
  return Math.abs(horizontalDelta(start, end))
}

const isVertical = function(direction) {
  return ['north', 'south'].indexOf(direction) > -1
}

const isHorizontal = function(direction) {
  return ['west', 'east'].indexOf(direction) > -1
}

const opositeDirection = function(direction) {
  let ret
  switch (direction) {
    case 'north':
      ret = 'south'
      break
    case 'south':
      ret = 'north'
      break
    case 'west':
      ret = 'east'
      break
    case 'east':
      ret = 'west'
      break
  }
  return ret
}

const chaseEnemy = function(player, enemies, map) {
  const closest = getClosestEnemy(player, enemies)
  const back = getBackPosition(closest)
  const direction = sneakyGetDirection(player, closest)

  if (direction !== player.direction) {
    return direction
  }

  if (!isMovementSafe('move', player, [closest], map)) {
    if (
      isVertical(player.direction) &&
      absHorizontalDelta(player.position, closest.position) === 1
    )
      return 'hold'
    if (
      isHorizontal(player.direction) &&
      absVerticalDelta(player.position, closest.position) === 1
    )
      return 'hold'
    return opositeDirection(closest.direction)
  }

  return 'move'
}

const turnToKill = function(player, enemies) {
  const turn = false
  const mockState = JSON.parse(JSON.stringify(player))

  DIRECTIONS.forEach(function(direction) {
    mockState.direction = direction

    if (utils.canKill(mockState, enemies)) {
      turn = direction
    }
  })

  return turn
}

const turnToAmbush = function(player, enemies) {
  const killables = enemies.filter(function(enemy) {
    switch (enemy.direction) {
      case 'north':
        return verticalDelta(player.position, enemy.position) === -1
        break
      case 'east':
        return verticalDelta(player.position, enemy.position) === 1
        break
      case 'south':
        return verticalDelta(player.position, enemy.position) === 1
        break
      case 'west':
        return verticalDelta(player.position, enemy.position) === -1
        break
      default:
        return false
    }
  })

  if (!killables.length) {
    return
  }

  let enemy = killables[0]
  if (isVertical(enemy.direction)) {
    if (horizontalDelta(player.position, enemy.position) < 0) {
      return 'east'
    }
    return 'west'
  }

  if (verticalDelta(player.position, enemy.position) < 0) {
    return 'south'
  }
  return 'north'
}

const canKillMany = function(player, enemies) {
  let { position, direction } = player
  const targets = _.filter(enemies, (enemy) =>
    utils.isVisible(position, enemy.position, direction)
  )
  return targets.length > 2
}

const canKillAll = function(player, enemies) {
  if (!player.ammo) {
    return false
  }
  const killable = enemies.filter((enemy) => utils.canKill(player, [enemy]))
  return enemies.length === killable.length
}

const getImmediateThreats = function(player, enemies) {
  return enemies.filter(
    (enemy) =>
      enemy.ammo > 0 &&
      utils.isVisible(enemy.position, player.position, enemy.direction)
  )
}

const getDangerousEnemies = function(enemies) {
  const dangerous = enemies.filter((enemy) => enemy.ammo)
  if (dangerous.length > 0) {
    return dangerous
  }
  return enemies
}

module.exports = {
  inDanger,
  sameY,
  sameX,
  canDie,
  canMoveTowards,
  canKillMany,
  getClosestAmmo,
  getReachableAmmo,
  shouldMoveForAmmo,
  isMovementSafe,
  getSafestMove,
  goToCenter,
  getClosestEnemy,
  getBackPosition,
  sneakyGetDirection,
  isHorizontal,
  isVertical,
  absVerticalDelta,
  absHorizontalDelta,
  opositeDirection,
  chaseEnemy,
  turnToKill,
  turnToAmbush,
  canKillAll,
  getImmediateThreats,
  getDangerousEnemies
}
