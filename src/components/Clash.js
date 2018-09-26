import React from 'react'
import _ from 'lodash'

import * as fx from './../lib/sound-effects'

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

    const alivePlayerCount = playerStates.filter((el) => el.isAlive).length

    // stop playing if there is only 1 player left
    if (alivePlayerCount <= 1) {
      return false
    }

    var currentGameIndex = this.state.currentGameIndex

    if (this.nextTurnTimeout) {
      clearTimeout(this.nextTurnTimeout)
    }

    this.nextTurnTimeout = window.setTimeout(() => {
      if (this.state.currentGameIndex !== currentGameIndex) {
        return
      }
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

  handleEvent(event, data) {
    switch (event) {
      case 'SHOOT':
        return this._handleShoot(data)
      case 'WIN':
        return this.newGame()
      case 'DRAW':
        return this.newGame()
      case 'KILL':
        return this._handleKill(data)
      case 'END':
        return this._handleEnd()
      default:
        throw new Error(`Unhandled event: ${event}`)
    }
  }

  _handleEnd() {
    this.setState({
      clashjs: this.ClashJS.getState()
    })
  }

  _handleShoot(data) {
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

  _handleKill(data) {
    const { killer, killed } = data

    let kills = this.state.kills

    killed.forEach((player) => {
      killsStack.push(data.killer)
      killer.kills++
      player.deaths++
    })

    let notification = [
      killer.getName(),
      'killed',
      killed.map((player) => player.getName()).join(' and ')
    ].join(' ')

    kills.push({
      date: new Date(),
      text: notification
    })

    this.setState({
      kills: kills
    })

    setTimeout(() => this.handleStreak(data.killer, killer, killed), 100)
  }

  handleStreak(index, killer, killed) {
    let streakCount = _.filter(killsStack, (player) => player === index).length
    let multiKill = ''
    let spreeMessage = ''
    let kills = this.state.kills
    if (killsStack.length === 1) {
      setTimeout(() => fx.streak.firstBlood.play(), 50)
    }

    switch (killed.length) {
      case 2:
        setTimeout(() => fx.streak.doubleKill.play(), 100)
        multiKill = killer.getName() + ' got a double kill!'
        break
      case 3:
        setTimeout(() => fx.streak.tripleKill.play(), 100)
        multiKill = killer.getName() + ' got a Triple Kill!'
        break
      case 4:
        setTimeout(() => fx.streak.monsterKill.play(), 100)
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
        setTimeout(() => fx.streak.killingSpree.play(), 300)
        spreeMessage = killer.getName() + ' is on a killing spree!'
        break
      case 4:
        setTimeout(() => fx.streak.dominating.play(), 300)
        spreeMessage = killer.getName() + ' is dominating!'
        break
      case 5:
        setTimeout(() => fx.streak.rampage.play(), 300)
        spreeMessage = killer.getName() + ' is on a rampage of kills!'
        break
      case 6:
        setTimeout(() => fx.streak.godLike.play(), 300)
        spreeMessage = killer.getName() + ' is Godlike!'
        break
      default:
        spreeMessage = 'Somebody stop that bastard ' + killer.getName()
        setTimeout(() => fx.streak.ownage.play(), 300)
        break
    }
    kills.push({ date: new Date(), text: spreeMessage })
    this.setState({
      kills: kills
    })
  }

  render() {
    const { clashjs, shoots, kills } = this.state

    const {
      completed,
      gameEnvironment,
      gameStats,
      playerStates,
      playerInstances,
      rounds,
      totalRounds
    } = clashjs

    _.forEach(playerInstances, function(player, index) {
      gameStats[player.getId()].isAlive = playerStates[index].isAlive
    })

    if (completed) {
      return (
        <div>
          <Stats
            large
            rounds={rounds}
            total={totalRounds}
            playerStates={playerStates}
            stats={gameStats}
          />
        </div>
      )
    }

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
