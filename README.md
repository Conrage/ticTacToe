# ticTacToe

#### Is available to play at https://conrage-tictactoe.vercel.app/

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
    handlePreflightRequest: (req, res, next) => {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "GET,POST",
      });
      res.end();
    },
  },
});
```

#### Run the server and the client
`cd socket-server`
`npm run start`
`cd tictactoe`
`npm run start`

#### Access in your browser at http://localhost:5000
