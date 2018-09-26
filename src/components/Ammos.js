import React from 'react'
import PropTypes from 'prop-types'

const Ammo = (props) => {
  const { tileSize, ammoPos } = props
  return (
    <div
      className="clash-ammo"
      style={{
        top: tileSize * ammoPos[0] + 'vmin',
        left: tileSize * ammoPos[1] + 'vmin',
        width: tileSize + 'vmin',
        height: tileSize + 'vmin'
      }}
    />
  )
}

const Ammos = (props) => {
  const { gridSize, ammoPosition } = props

  const tileSize = 100 / gridSize

  return (
    <div className="clash-layer animation-glow">
      {ammoPosition.map((ammoPos, ammoIndex) => (
        <Ammo key={ammoIndex} tileSize={tileSize} ammoPos={ammoPos} />
      ))}
    </div>
  )
}

Ammos.propTypes = {
  gridSize: PropTypes.number.isRequired,
  ammoPosition: PropTypes.array
}

export default Ammos
