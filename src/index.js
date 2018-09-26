import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import seedrandom from 'seedrandom'

seedrandom('nodejs-meetup', { global: true })

ReactDOM.render(<App />, document.getElementById('root'))
