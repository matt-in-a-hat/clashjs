import _ from 'lodash'

import PlayerClass from './PlayerClass'
import executeMovementHelper from './executeMovementHelper'

const DIRECTIONS = ['north', 'east', 'south', 'west']

const TOTAL_ROUNDS = 10
const GRID_SIZE = 15
const ROUND_LENGTH_MULTIPLIER = 500

class ClashJS {
  constructor(playerDefinitionArray, currentStats, evtCallback) {
    this._completed = false
    this._totalRounds = TOTAL_ROUNDS
    this._rounds = 0
    this._gameStats = currentStats || {}
    this._evtCallback = evtCallback
    this._alivePlayerCount = 0
    this._suddenDeathCount = 0
    this._playerInstances = playerDefinitionArray.map((playerDefinition) => {
      let player = new PlayerClass(playerDefinition)
      this._gameStats[player.getId()] = {
        name: player.getName(),
        deaths: 0,
        kills: 0,
        kdr: 0,
        wins: 0,
        winrate: 0
      }
      return player
    })

    this.setupGame()
  }

  setupGame() {
    this._gameEnvironment = {
      gridSize: GRID_SIZE,
      ammoPosition: []
    }
    this._rounds++
    this._suddenDeathCount = 0
    this._playerInstances = _.shuffle(this._playerInstances)
    this._alivePlayerCount = this._playerInstances.length
    this._playerStates = this._playerInstances.map((playerInstance) => {
      let gridSize = this._gameEnvironment.gridSize
      return {
        style: playerInstance.getInfo().style,
        position: [
          Math.floor(Math.random() * gridSize),
          Math.floor(Math.random() * gridSize)
        ],
        direction: DIRECTIONS[Math.floor(Math.random() * 4)],
        ammo: 0,
        isAlive: true
      }
    })

    this._currentPlayer = 0
    this._createAmmo()
  }

  _createAmmo() {
    var newAmmoPosition = [
      Math.floor(Math.random() * this._gameEnvironment.gridSize),
      Math.floor(Math.random() * this._gameEnvironment.gridSize)
    ]

    if (
      this._gameEnvironment.ammoPosition.some((el) => {
        return el[0] === newAmmoPosition[0] && el[1] === newAmmoPosition[1]
      })
    ) {
      this._createAmmo()
      return
    }

    this._gameEnvironment.ammoPosition.push(newAmmoPosition)
  }

  getState() {
    return {
      completed: this._completed,
      gameEnvironment: this._gameEnvironment,
      gameStats: this._gameStats,
      rounds: this._rounds,
      totalRounds: this._totalRounds,
      playerStates: this._playerStates,
      playerInstances: this._playerInstances
    }
  }

  nextPly() {
    if (
      this._suddenDeathCount >
      ROUND_LENGTH_MULTIPLIER * this._alivePlayerCount
    ) {
      this._handleCoreAction('DRAW')
      return this.getState()
    }

    let clonedStates = _.cloneDeep(this._playerStates, true)
    if (this._alivePlayerCount <= 3) {
      this._suddenDeathCount++
    }

    var otherPlayers = clonedStates.filter((currentEnemyFilter, index) => {
      if (index === this._currentPlayer) {
        return false
      }
      return currentEnemyFilter.isAlive
    })

    if (this._playerStates[this._currentPlayer].isAlive) {
      this._savePlayerAction(
        this._currentPlayer,
        this._playerInstances[this._currentPlayer].execute(
          clonedStates[this._currentPlayer],
          otherPlayers,
          _.cloneDeep(this._gameEnvironment, true)
        )
      )
    }

    this._currentPlayer =
      (this._currentPlayer + 1) % this._playerInstances.length

    if (
      this._gameEnvironment.ammoPosition.length <
        this._playerStates.length / 1.2 &&
      Math.random() > 0.95
    ) {
      this._createAmmo()
    }

    return this.getState()
  }

  _handleCoreAction(action, data) {
    switch (action) {
      case 'KILL':
        return this._handleKill(data)
      case 'WIN':
        return this._handleWin(data)
      case 'DRAW':
        return this._handleDraw(data)
      default:
        throw new Error(`Unhandled action: ${action}`)
    }
  }

  _handleKill(data) {
    const { killer, killed } = data
    this._gameStats[killer.getId()].kills++
    _.forEach(this._playerInstances, (player) => {
      let stats = this._gameStats[player.getId()]
      if (killed.indexOf(player) > -1) {
        this._alivePlayerCount--
        stats.deaths++
      }
      if (stats.deaths) {
        stats.kdr = stats.kills / stats.deaths
      } else {
        stats.kdr = stats.kills
      }
    })
    return this._evtCallback('KILL', data)
  }

  _handleWin(data) {
    this._gameStats[data.winner.getId()].wins++
    for (const key in this._gameStats) {
      const playerStats = this._gameStats[key]
      const { wins } = playerStats
      playerStats.winrate = Math.round((wins * 100) / this._rounds)
    }
    if (this._rounds >= this._totalRounds) {
      this._handleEnd()
      return
    }
    this._evtCallback('WIN', data)
  }

  _handleDraw() {
    for (const key in this._gameStats) {
      const playerStats = this._gameStats[key]
      const { wins } = playerStats
      playerStats.winrate = Math.round((wins * 100) / this._rounds)
    }
    if (this._rounds >= this._totalRounds) {
      this._handleEnd()
      return
    }
    this._evtCallback('DRAW')
  }

  _handleEnd() {
    this._completed = true
    this._evtCallback('END')
  }

  _savePlayerAction(playerIndex, playerAction) {
    this._playerStates = executeMovementHelper({
      playerIndex: playerIndex,
      playerAction: playerAction,
      playerStates: this._playerStates,
      playerInstances: this._playerInstances,
      gameEnvironment: this._gameEnvironment,
      evtCallback: this._evtCallback,
      coreCallback: this._handleCoreAction.bind(this)
    })
  }
}

export default ClashJS
