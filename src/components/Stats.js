import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

class Stats extends React.Component {
  static propTypes = {
    stats: PropTypes.object.isRequired,
    rounds: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }

  render() {
    let { stats, rounds, total } = this.props
    stats = _.map(stats, (playerStats) => playerStats)
    stats = _.sortBy(stats, (playerStats) => playerStats.wins * -1)
    return (
      <div className="stats">
        <div className="stats-title">
          Round {rounds} of {total}
        </div>
        <table className="stats-table">
          <thead>
            <tr>
              <th />
              <th />
              <th>Wins</th>
            </tr>
          </thead>
          <tbody>
            {_.map(stats, (playerStats, index) => {
              return (
                <tr
                  key={index}
                  className={playerStats.isAlive ? '' : 'player-dead'}
                >
                  <td>{playerStats.isAlive ? '' : '💀'}</td>
                  <td className="player-name">{playerStats.name}</td>
                  <td className="stats-results">{playerStats.wins}</td>
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
