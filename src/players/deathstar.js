export const info = {
  name: 'Deathstar',
  style: 7
}

const randomMove = () => {
  if (Math.random() > 0.33) {
    return 'move'
  }
  const directions = ['north', 'east', 'south', 'west']
  return directions[Math.floor(Math.random() * directions.length)]
}


export default function(playerState, enemiesState, gameEnvironment) {
  if (Math.random() > 0.9) {
    return 'shoot'
  }

  return randomMove()
}
