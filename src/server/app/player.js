//
// Snakeout Player
//

function Player(name, socket, id) {
    this.name = name;
    this.socket = socket;
    this.id = id;
    this.isAdmin = false;
    this.isConnected = true;
    this.isSnake;
    this.isCaptain = false;
    this.hasBeenCaptain = false;
}

Player.prototype.getJson = function () {
    return {
        name: this.name,
        id: this.id,
        isAdmin: this.isAdmin,
        isConnected: this.isConnected,
        isSnake: this.isSnake,
        isCaptain: this.isCaptain,
        isOnMission: this.isOnMission,
        hasBeenCaptain: this.hasBeenCaptain,
    };
};

Player.prototype.send = function (event, round) {
    this.socket.emit(event, {
        you: this.getJson(),
        round,
    });
};

Player.prototype.sendThen = function (event, data, onEvent, next) {
    this.send(event, data);
    this.socket.once(onEvent, next);
};

Player.prototype.makeAdmin = function () {
    this.isAdmin = true;
};

Player.prototype.replaceConnection = function (socket) {
    this.socket = socket;
    this.isConnected = true;
};

module.exports = Player;
