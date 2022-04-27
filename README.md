# Conrage Tic-tac-toe
![GitHub](https://img.shields.io/github/license/Conrage/ticTacToe) ![GitHub deployments](https://img.shields.io/github/deployments/Conrage/ticTacToe/Production) ![GitHub branch checks state](https://img.shields.io/github/checks-status/Conrage/ticTacToe/master) ![GitHub top language](https://img.shields.io/github/languages/top/Conrage/ticTacToe) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/Conrage/ticTacToe)
### The game is available to play at https://conrage-tictactoe.vercel.app/
##### To play with your friend just get the room code generate after the url, and send to him, for example
```
//The url is https://conrage-tictactoe.vercel.app/45
//So your room code is 45
```
## Or you can download and play on your machine

#### Install dependencies for both socket-server and tictactoe client

`cd socket-server`
`npm install`
`cd tictactoe`
`npm install`

#### Change the io connection and allowed origin to your localhost or keep it as development environment
`io("http://localhost:3000")`

```
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
```

#### Run the server and the client
`cd socket-server`
`npm run start`
`cd tictactoe`
`npm run start`

#### Access in your browser at http://localhost:5000
