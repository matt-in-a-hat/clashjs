export function randomMove() {
  var moves = ['north', 'east', 'south', 'west', 'shoot']
  return Math.random() > 0.33
    ? 'move'
    : moves[Math.floor(Math.random() * moves.length)]
}

export function turn(yourDirection, howMuchTurn) {
  const directions = ['north', 'east', 'south', 'west']
  var currentPositionIndex = directions.indexOf(yourDirection)
  return directions[(currentPositionIndex + howMuchTurn) % 4]
}

export const getDistance = (start = [], end = []) => {
  var diffVertical = Math.abs(start[0] - end[0])
  var diffHorizontal = Math.abs(start[1] - end[1])

  return diffHorizontal + diffVertical
}

export function getDirection(start = [], end = []) {
  var diffVertical = Math.abs(start[0] - end[0])

  if (diffVertical) {
    return start[0] - end[0] > 0 ? 'north' : 'south'
  }
  return start[1] - end[1] > 0 ? 'west' : 'east'
}

export function isVisible(
  yourPosition = [],
  enemyPosition = [],
  yourDirection
) {
  switch (yourDirection) {
    case 'north':
      return (
        yourPosition[1] === enemyPosition[1] &&
        yourPosition[0] > enemyPosition[0]
      )
    case 'east':
      return (
        yourPosition[0] === enemyPosition[0] &&
        yourPosition[1] < enemyPosition[1]
      )
    case 'south':
      return (
        yourPosition[1] === enemyPosition[1] &&
        yourPosition[0] < enemyPosition[0]
      )
    case 'west':
      return (
        yourPosition[0] === enemyPosition[0] &&
        yourPosition[1] > enemyPosition[1]
      )
    default:
      break
  }
}

export function canKill(currentPlayerState = {}, enemiesStates = []) {
  return enemiesStates.some(
    (enemyObject) =>
      enemyObject.isAlive &&
      isVisible(
        currentPlayerState.position,
        enemyObject.position,
        currentPlayerState.direction
      )
  )
}

export function inDanger(player, enemies) {
  if (enemies.length <= 0) {
    return false
  }

  const pos = player.position
  return enemies.some((e) => {
    return sameY(pos, e.position) || sameX(pos, e.position)
  })
}

export function sameY(start, end) {
  return start[0] === end[0]
}

export function sameX(start, end) {
  return start[1] === end[1]
}

export function sameXY(start, end) {
  return sameY(start, end) && sameX(start, end)
}

export function canMoveTowards(direction, player, map) {
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
    default:
      break
  }
  return canDo
}

export function canDie(player, enemies) {
  return enemies.some((enemy) => {
    return (
      enemy.ammo > 0 &&
      isVisible(enemy.position, player.position, enemy.direction)
    )
  })
}

export function getClosestAmmo(player, ammoPosition) {
  if (!ammoPosition.length) {
    return
  }

  let closest = ammoPosition[0]

  ammoPosition.forEach(function(ammo) {
    const isCloser =
      getDistance(player.position, ammo) < getDistance(player.position, closest)
    if (isCloser) {
      closest = ammo
    }
  })

  return closest
}

export function getReachableAmmo(player, enemies, map) {
  const reachable = map.ammoPosition.filter(function(ammo) {
    const distance = getDistance(player.position, ammo)

    return !enemies.some(function(enemy) {
      return getDistance(enemy.position, ammo) < distance
    })
  })

  return reachable
}

export function shouldMoveForAmmo(player, enemies, map) {
  const ammo = getReachableAmmo(player, enemies, map)

  if (!ammo.length) {
    return false
  }

  let closest = getClosestAmmo(player, ammo)
  let direction = getDirection(player.position, closest)

  if (direction !== player.direction) {
    return direction
  }

  return 'move'
}

export function isMovementSafe(action, player, enemies, map) {
  const futureState = JSON.parse(JSON.stringify(player))

  if (action === 'move') {
    switch (player.direction) {
      case 'north':
        if (futureState.position[0] > 0) {
          futureState.position[0]--
        }
        break
      case 'east':
        if (futureState.position[1] < map.gridSize) {
          futureState.position[1]++
        }
        break
      case 'south':
        if (futureState.position[0] < map.gridSize) {
          futureState.position[0]++
        }
        break
      case 'west':
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

export function getSafestMove(player, enemies, map) {
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

export function goToCenter(player, map) {
  const center = [map.gridSize, map.gridSize].map((coord) =>
    Math.floor(coord / 2)
  )

  const movement = getDirection(player.position, center)
  if (movement === player.direction) {
    return 'move'
  }

  return movement
}

export function getClosestEnemy(player, enemies) {
  let clonedStates = enemies.slice(0, enemies.length)

  clonedStates = clonedStates.filter(function(enemy) {
    return enemy.isAlive
  })

  let closest = clonedStates[0]

  clonedStates.forEach(function(enemy) {
    if (getDistance(player, enemy) < getDistance(player, closest)) {
      closest = enemy
    }
  })

  return closest
}

export function getBackPosition(enemy) {
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
    default:
      break
  }

  return back
}

export function sneakyGetDirection(player, enemy) {
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

export function verticalDelta(start, end) {
  return start[0] - end[0]
}

export function absVerticalDelta(start, end) {
  return Math.abs(verticalDelta(start, end))
}

export function horizontalDelta(start, end) {
  return start[1] - end[1]
}

export function absHorizontalDelta(start, end) {
  return Math.abs(horizontalDelta(start, end))
}

export function isVertical(direction) {
  return ['north', 'south'].indexOf(direction) > -1
}

export function isHorizontal(direction) {
  return ['west', 'east'].indexOf(direction) > -1
}

export function opositeDirection(direction) {
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
    default:
      break
  }
  return ret
}

export function chaseEnemy(player, enemies, map) {
  const closest = getClosestEnemy(player, enemies)
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

export function turnToKill(player, enemies) {
  let turn = false
  const mockState = JSON.parse(JSON.stringify(player))

  const directions = ['north', 'east', 'south', 'west']
  directions.forEach(function(direction) {
    mockState.direction = direction

    if (canKill(mockState, enemies)) {
      turn = direction
    }
  })

  return turn
}

export function turnToAmbush(player, enemies) {
  const killables = enemies.filter(function(enemy) {
    switch (enemy.direction) {
      case 'north':
        return verticalDelta(player.position, enemy.position) === -1
      case 'east':
        return verticalDelta(player.position, enemy.position) === 1
      case 'south':
        return verticalDelta(player.position, enemy.position) === 1
      case 'west':
        return verticalDelta(player.position, enemy.position) === -1
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

export function canKillMany(player, enemies) {
  let { position, direction } = player
  const targets = enemies.filter((enemy) =>
    isVisible(position, enemy.position, direction)
  )
  return targets.length > 2
}

export function canKillAll(player, enemies) {
  if (!player.ammo) {
    return false
  }
  const killable = enemies.filter((enemy) => canKill(player, [enemy]))
  return enemies.length === killable.length
}

export function getImmediateThreats(player, enemies) {
  return enemies.filter(
    (enemy) =>
      enemy.ammo > 0 &&
      isVisible(enemy.position, player.position, enemy.direction)
  )
}

export function getDangerousEnemies(enemies) {
  const dangerous = enemies.filter((enemy) => enemy.ammo)
  if (dangerous.length > 0) {
    return dangerous
  }
  return enemies
}
