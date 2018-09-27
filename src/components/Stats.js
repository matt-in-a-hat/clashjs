import React from 'react'
import PropTypes from 'prop-types'

class Stats extends React.Component {
  static propTypes = {
    large: PropTypes.bool,
    stats: PropTypes.object.isRequired,
    rounds: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }

  render() {
    const { large, stats, rounds, total } = this.props

    const sortedStats = Object.values(stats).sort((a, b) => {
      return b.wins - a.wins
    })

    const title = large
      ? `Results from ${total} rounds`
      : `Round ${rounds} of ${total}`

    return (
      <div className={large ? 'stats-large' : 'stats-small'}>
        <div className="stats-title">{title}</div>
        <table className="stats-table">
          <thead>
            <tr>
              <th />
              <th />
              <th>Wins</th>
              <th>Kills</th>
              <th>Deaths</th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((playerStats, index) => {
              return (
                <tr
                  key={index}
                  className={playerStats.isAlive ? '' : 'player-dead'}
                >
                  <td>{playerStats.isAlive ? '' : '💀'}</td>
                  <td className="player-name">{playerStats.name}</td>
                  <td className="stats-wins">{playerStats.wins}</td>
                  <td className="stats-kills">{playerStats.kills}</td>
                  <td className="stats-deaths">{playerStats.deaths}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Stats
