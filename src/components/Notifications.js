import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

class Notifications extends React.Component {
  static propTypes = {
    kills: PropTypes.array
  }

  render() {
    var { kills } = this.props
    var date = new Date()

    _.remove(kills, (k) => date - k.date > 3000)
    kills = _.sortBy(kills, (k) => k.date.valueOf)
    return (
      <div className="notifications">
        {_.map(kills, (k, idx) => {
          return <p key={idx}>{k.text}</p>
        })}
      </div>
    )
  }
}

export default Notifications
