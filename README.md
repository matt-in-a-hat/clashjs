# [ClashJS](http://javierbyte.github.io/clashjs/)

[![](spec_assets/screenshot.jpg)](http://javierbyte.github.io/clashjs/)

The idea is to create a battle game, where the participants code their AI, and
then we make them fight! You can play by adding your own AI to the game!

# How to run this project

Clone the repo and then run:

```sh
npm install
npm start
```

Then go to `http://localhost:3000`.

# How to participate.
Add your player as specificed in [player definition](#player-definition) in

```
/src/Players/mybot.js
```

And then require yourself in

```
/src/Players.js
```

And run the demo again. Have fun!

Read the [game definitions](#game-definitions) to learn how to create your player. Have fun!

# Game. Functional Spec.

## Introduction.
Games and coding are fun! So I want to make a game where we can confront AI vs AI in javascript.

The game is simple: we will put all the players in a battle arena, and then make them fight to death. Where will be ammo in the arena so they can shoot each other. The last player alive wins!

### Game Rules.
* Every player will have a position and direction on the grid. A player can not go over the grid limits, and can only face north, east, south or west.
* The game will be turn based. Every turn we will excecute the AI of every player passing as arguments:
  * The state of the player.
  * The state of all other players.
  * A environment configuration option with:
    * Grid size.
    * The position of the ammo.
* Every turn a player must execute some of the following actions:
  * Move one step in its current direction. (`move`).
  * Turn into any of the four directions. (`north`, `east`, `south`, `west`).
  * Shoot. (`shoot`).
* A player can shoot to try to destroy another player.
* A player can collect ammo in the moment it steps over it. A new ammo may appear in any moment of the game.

## Game Definitions.

### Player Definition.
Let the *player definition* (`playerDefinition`) be an object with the player info and its AI function.

```js
{
  info: {
    name: 'javierbyte',
    style: 2 // one of the 6 styles (0 to 5)
  },
  ai: function(playerState, enemiesStates, gameEnvironment) {
    // think...
    return 'move';
  }
}
```

The AI function will receive [`playerState`](#player-state), `enemiesStates` (array of all the other players `playerState`s), and [`gameEnvironment`](#game-environment) as arguments, and must return one of the following strings:
  * `move`: To move one tile in the current direction.
  * `north`, `east`, `south` or `west`: To turn to that direction.
  * `shoot`. To shoot if the user has enough ammo.

Any other response, trying to move outside the arena size (`gameEnvironment.gridSize`) or trying to shoot without ammo, will result in a no-op.

### Player State.
Let the *player state* (`playerState`) be an object with a player information like the following:

```js
{
  position: `[<number>, <number>]`,
  direction: `<string>`, // One of 'north', 'east', 'south' or 'west'
  ammo: `<number>`,
  isAlive: `<bool>`
}
```

### Game Environment.
Let the *game environment* (`gameEnvironment`) be a configuration object like the following:

```js
{
  gridSize: [<number>, <number>],
  ammoPosition: <array of [<number>, <number>] arrays>
}
```

### Game State.
Let the *game state* (`gameState`) be an object with the array of all user states, and the game environment.

```js
{
  playerStates: <array of `playerStates`>,
  gameEnvironment: <`gameEnvironment`>
}
```
