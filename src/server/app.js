var express = require("express");
var socketio = require("socket.io");
var logger = require("morgan");
var path = require("path");

var app = express();
var io = socketio();
app.io = io;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var devModeEnabled = app.get("env") === "development";

// startup the server-side code
var Snakeout = require("./app/snakeout");
app.snakeout = new Snakeout(devModeEnabled);
require("./routes/socketio")(app);

// serve the compiled client code
app.use(express.static("dist"));

app.get("/stats", (req, res) => {
    res.json({
        numberOfConnectedUsers: app.io.engine.clientsCount,
        games: app.snakeout.games.map((game) => ({
            numberOfPlayers: game.players.length,
            inProgress: game.inProgress,
            roundsPlayed: game.currentRoundNum - 1,
        })),
    });
});

app.post("/new", (req, res) => {
    const { code } = app.snakeout.newGame();
    res.json({ gameCode: code });
});

// for any route, give index.html, and react router will handle the rest
// only works in production mode atm
app.get("/{*splat}", function (req, res) {
    res.sendFile(path.resolve("dist/index.html"), function (err) {
        if (err) res.status(500).send(err);
    });
});

module.exports = app;
