import io from "socket.io-client";

function Connection(onStateUpdate) {
    this.socket = io();

    this.functionsToRunOnUpdateWaitingList = [];

    var self = this;
    this.socket.on("updateState", function (data) {
        onStateUpdate(data);
    });

    this.socket.on("disconnect", function () {
        //refresh the page
        location.reload();
    });
}

Connection.prototype.newGame = function (name) {
    this.send("newGame", {
        name,
    });
};

Connection.prototype.joinGame = function (code, name) {
    this.send("joinGame", {
        code,
        name,
    });
};

Connection.prototype.startGame = function (code) {
    this.send("startGame", {
        code,
    });
};

Connection.prototype.vote = function (vote) {
    this.send("selectionVote", {
        vote,
    });
    gtag("event", "pre_mission_vote", {
        event_label: vote,
    });
    gtag("event", "vote");
};

Connection.prototype.missionVote = function (vote) {
    this.send("missionVote", {
        vote,
    });
    gtag("event", "mission_vote", {
        event_label: vote,
    });
    gtag("event", "vote");
};

Connection.prototype.updateSelectedPlayers = function (selectedPlayers) {
    this.send("updateSelectedPlayers", {
        selectedPlayers,
    });
};

Connection.prototype.submitSelectedPlayers = function (selectedPlayers) {
    this.send("submitSelectedPlayers", {
        selectedPlayers,
    });
};

Connection.prototype.doneViewingStart = function () {
    this.send("doneViewingStart", {});
};

Connection.prototype.doneViewingResults = function () {
    this.send("doneViewingResults", {});
};

Connection.prototype.doneViewingVoteResults = function () {
    this.send("doneViewingVoteResults", {});
};

Connection.prototype.readyToViewResults = function () {
    this.send("readyToViewResults", {});
};

Connection.prototype.tryReplace = function (data) {
    this.send("tryReplace", data);
};

Connection.prototype.send = function (event, data) {
    this.socket.emit(event, data);
};

Connection.prototype.on = function (event, next) {
    this.socket.on(event, next);
};

Connection.prototype.once = function (event, next) {
    this.socket.once(event, next);
};

export default Connection;
