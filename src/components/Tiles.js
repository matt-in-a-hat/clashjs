import React from 'react'
import PropTypes from 'prop-types'

class Tiles extends React.Component {
  static propTypes = {
    gridSize: PropTypes.number.isRequired
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    const { gridSize } = this.props

    const tileSize = 100 / gridSize

    const tiles = []
    for (let i = 0; i < gridSize * gridSize; i++) {
      tiles.push(
        <div
          key={i}
          className="clash-tile"
          style={{
            height: tileSize + 'vmin',
            width: tileSize + 'vmin'
          }}
        />
      )
    }

    return <div className="clash-tile-list">{tiles}</div>
  }
}

export default Tiles
