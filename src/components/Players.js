import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

var DIRECTIONS = ['north', 'east', 'south', 'west']

const Player = (props) => {
  const { tileSize, data, info, direction } = props
  return (
    <div
      className="clash-player-container"
      style={{
        width: tileSize + 'vmin',
        height: tileSize + 'vmin',
        transform:
        'translateY(' +
        tileSize * data.position[0] +
        'vmin) ' +
        'translateX(' +
        tileSize * data.position[1] +
        'vmin)'
      }}
    >
      <div
        className="clash-player"
        style={{
          width: tileSize + 'vmin',
          height: tileSize + 'vmin',
          backgroundImage:
          'url(assets/rockets/rocket' + (data.style || 0) + '.png)',
          transform:
          'scale(1.25) rotate(' +
          90 * direction +
          'deg) '
        }}
      />
      <div className="clash-player-name">{info.name}</div>
    </div>
  )
}

class Players extends React.Component {
  static propTypes = {
    gridSize: PropTypes.number.isRequired,
    playerStates: PropTypes.array,
    playerInstances: PropTypes.array
  }

  constructor(props) {
    super(props)
    const { playerStates } = props
    this.state = {
      playerDirections: playerStates.map((el) =>
        DIRECTIONS.indexOf(el.direction)
      )
    }
  }

  componentWillReceiveProps(nextProps) {
    var playerDirections = this.state.playerDirections
    var newPlayerDirections = nextProps.playerStates.map((el) =>
      DIRECTIONS.indexOf(el.direction)
    )

    this.setState({
      playerDirections: newPlayerDirections.map((el, index) => {
        var diff = ((el + 4) % 4) - ((playerDirections[index] + 4) % 4)
        if (diff === 3) diff = -1
        if (diff === -3) diff = 1

        return playerDirections[index] + diff
      })
    })
  }

  render() {
    var { playerDirections } = this.state
    var { gridSize, playerStates, playerInstances } = this.props

    var tileSize = 100 / gridSize

    var playerRender = _.map(playerStates, (playerData, playerIndex) => {
      if (!playerData.isAlive) return null

      const playerInfo = playerInstances[playerIndex].getInfo()
      const direction = playerDirections[playerIndex] 

      return (
        <Player
          key={playerIndex}
          tileSize={tileSize}
          direction={direction}
          index={playerIndex}
          info={playerInfo}
          data={playerData}
        />
      )
    })

    return <div className="clash-layer">{playerRender}</div>
  }
}

export default Players
