import React from 'react'
import _ from 'lodash'

import fx from './../lib/sound-effects'

import Tiles from './Tiles'
import Ammos from './Ammos'
import Players from './Players'
import Stats from './Stats'
import Shoots from './Shoots'
import Notifications from './Notifications'

import ClashJS from '../clashjs/ClashCore'

import playerObjects from '../Players'

var playerArray = _.shuffle(_.map(playerObjects, (el) => el))

var killsStack = []

class Clash extends React.Component {
  constructor() {
    super()

    this.handleEvent = this.handleEvent.bind(this)
    this.handleClick = this.handleClick.bind(this)

    this.ClashJS = new ClashJS(playerArray, {}, this.handleEvent)
    this.state = {
      clashjs: this.ClashJS.getState(),
      shoots: [],
      speed: 150,
      kills: [],
      currentGameIndex: 1
    }
  }

  componentDidMount() {
    this.nextTurn()
  }

  handleClick() {
    this.setState({
      speed: Math.floor(this.state.speed * 0.9)
    })
  }

  newGame() {
    killsStack = []
    var nextGameIndex = this.state.currentGameIndex + 1

    if (this.nextTurnTimeout) clearTimeout(this.nextTurnTimeout)

    this.nextTurnTimeout = window.setTimeout(() => {
      this.ClashJS.setupGame()
      this.setState(
        {
          clashjs: this.ClashJS.getState(),
          shoots: [],
          speed: 150,
          kills: [],
          currentGameIndex: nextGameIndex
        },
        this.nextTurn
      )
    }, 1000)
  }

  nextTurn() {
    var { playerStates } = this.ClashJS.getState()
    var alivePlayerCount = playerStates.reduce((result, el) => {
      return el.isAlive ? result + 1 : result
    }, 0)
    if (alivePlayerCount < 2) return false

    var currentGameIndex = this.state.currentGameIndex

    if (this.nextTurnTimeout) clearTimeout(this.nextTurnTimeout)
    this.nextTurnTimeout = window.setTimeout(() => {
      if (this.state.currentGameIndex !== currentGameIndex) return
      this.setState(
        {
          clashjs: this.ClashJS.nextPly(),
          speed:
            this.state.speed > 15 ? parseInt(this.state.speed * 0.99, 10) : 15
        },
        this.nextTurn
      )
    }, this.state.speed)
  }

  handleEvent(evt, data) {
    if (evt === 'SHOOT') {
      let newShoots = this.state.shoots
      let players = this.ClashJS.getState().playerInstances
      newShoots.push({
        direction: data.direction,
        origin: data.origin.slice(),
        time: new Date().getTime()
      })

      this.setState({
        shoots: newShoots
      })

      players[data.shooter].playLaser()
    }
    if (evt === 'WIN') return this.newGame()
    if (evt === 'DRAW') {
      this.newGame()
    }
    if (evt === 'KILL') return this._handleKill(data)
    if (evt === 'END') return this.endGame()
  }

  _handleKill(data) {
    let players = this.ClashJS.getState().playerInstances
    let kills = this.state.kills
    let killer = players[data.killer]
    let killed = _.map(data.killed, (index) => {
      killsStack.push(data.killer)
      killer.kills++
      players[index].deaths++
      return players[index]
    })
    let notification = [
      killer.getName(),
      'killed',
      _.map(killed, (player) => player.getName()).join(',')
    ].join(' ')

    kills.push({ date: new Date(), text: notification })
    this.setState({
      kills: kills
    })

    setTimeout(() => this.handleStreak(data.killer, killer, killed), 100)
  }

  endGame() {
    this.setState({
      clashjs: null,
      shoots: [],
      speed: 0,
      kills: []
    })
    return 'finish'
  }

  handleStreak(index, killer, killed) {
    let streakCount = _.filter(killsStack, (player) => player === index).length
    let multiKill = ''
    let spreeMessage = ''
    let kills = this.state.kills
    if (killsStack.length === 1) {
      setTimeout(fx.streak.firstBlood.play(), 50)
    }

    switch (killed.length) {
      case 2:
        setTimeout(fx.streak.doubleKill.play(), 100)
        multiKill = killer.getName() + ' got a double kill!'
        break
      case 3:
        setTimeout(fx.streak.tripleKill.play(), 100)
        multiKill = killer.getName() + ' got a Triple Kill!'
        break
      case 4:
        setTimeout(fx.streak.monsterKill.play(), 100)
        multiKill = killer.getName() + ' is a MONSTER KILLER!'
        break
      default:
        break
    }
    kills.push({
      date: new Date(),
      text: multiKill
    })

    switch (streakCount) {
      case 3:
        setTimeout(fx.streak.killingSpree.play(), 300)
        spreeMessage = killer.getName() + ' is on a killing spree!'
        break
      case 4:
        setTimeout(fx.streak.dominating.play(), 300)
        spreeMessage = killer.getName() + ' is dominating!'
        break
      case 5:
        setTimeout(fx.streak.rampage.play(), 300)
        spreeMessage = killer.getName() + ' is on a rampage of kills!'
        break
      case 6:
        setTimeout(fx.streak.godLike.play(), 300)
        spreeMessage = killer.getName() + ' is Godlike!'
        break
      default:
        spreeMessage = 'Somebody stop that bastard ' + killer.getName()
        setTimeout(fx.streak.ownage.play(), 300)
        break
    }
    kills.push({ date: new Date(), text: spreeMessage })
    this.setState({
      kills: kills
    })
  }

  render() {
    var { clashjs, shoots, kills } = this.state
    var {
      gameEnvironment,
      gameStats,
      playerStates,
      playerInstances,
      rounds,
      totalRounds
    } = clashjs

    gameEnvironment = gameEnvironment || {
      gridSize: 13
    }

    _.forEach(playerInstances, function(player, index) {
      gameStats[player.getId()].isAlive = playerStates[index].isAlive
    })

    return (
      <div className="clash" onClick={this.handleClick}>
        <Tiles gridSize={gameEnvironment.gridSize} />
        <Shoots shoots={shoots.slice()} gridSize={gameEnvironment.gridSize} />
        <Ammos
          gridSize={gameEnvironment.gridSize}
          ammoPosition={gameEnvironment.ammoPosition}
        />
        <Players
          gridSize={gameEnvironment.gridSize}
          playerInstances={playerInstances}
          playerStates={playerStates}
        />
        <Notifications kills={kills} />
        <Stats
          rounds={rounds}
          total={totalRounds}
          playerStates={playerStates}
          stats={gameStats}
        />
      </div>
    )
  }
}

export default Clash
