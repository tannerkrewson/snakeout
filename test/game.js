var test = require('tape');

var Game = require('../app/game.js');

var Player = require('../app/player.js');

var testCode = 'abcd';
var testName = 'Bob';
var testSocket = {
	on: function() {},
	once: function() {},
	emit: function() {}
};

var onEmpty = function() {
	return 'test';
};

var mockPlayer;

var testGame;

test('game', function (t) {
	t.plan(3);
	testGame = new Game(testCode, onEmpty);

	t.equal(testGame.code, testCode);
	t.equal(testGame.onEmpty(), onEmpty());
	t.equal(testGame.inProgress, false);
});

test('new player', function(t) {
	mockPlayer = new Player(testName, testSocket, testGame.currentId);
	var gamePlayer = testGame.newPlayer(testName, testSocket);
	t.deepEqual(gamePlayer, mockPlayer);

	//newPlayer function should not add the player to the array
	t.equal(testGame.players.length, 0);

	//game's currentId should have advanced by one
	t.equal(testGame.currentId, 2);
	t.end();
});

var player1;
var player2;

test('add player', function(t) {
	player1 = testGame.addPlayer(testName, testSocket);
	t.equal(testGame.players.length, 1);

	player2 = testGame.addPlayer('John', testSocket);
	t.equal(testGame.players.length, 2);

	t.equal(testGame.players[0], player1);
	t.end();
});

test('init player', function(t) {
	//initPlayer should have been ran when we added the players
	t.equal(player1.isAdmin, true);
	t.equal(player2.isAdmin, false);
	t.end();
});

test('getPlayer', function(t) {
	var foundP1 = testGame.getPlayer(player1.id);
	var foundP2 = testGame.getPlayer(player2.id);
	t.equal(foundP1, player1);
	t.equal(foundP2, player2);
	t.end();
});

test('getNextId', function(t) {
	var idCountBefore = testGame.currentId;
	var idCountAfter = idCountBefore + 1;
	t.equal(testGame.getNextId(), idCountBefore);
	t.equal(testGame.currentId, idCountAfter);
	t.end();
});

test('getNextRoundNum', function(t) {
	var roundNumCountBefore = testGame.currentRoundNum;
	var roundNumCountAfter = roundNumCountBefore + 1;
	t.equal(testGame.getNextRoundNum(), roundNumCountBefore);
	t.equal(testGame.currentRoundNum, roundNumCountAfter);
	t.end();
});

test('getJsonGame', function(t) {
	var jsonGame = testGame.getJsonGame();
	t.ok(jsonGame);
	t.equal(jsonGame.code, testGame.code);
	t.equal(jsonGame.inProgress, testGame.inProgress);
	t.equal(jsonGame.players.length, testGame.players.length);

	//sockets should have been removed from the player objects,
	//	because if they weren't, socket.io will shit itself
	t.notOk(jsonGame.players[0].socket);
	t.end();
});

test('startNewRound', function (t) {
	var roundCountBefore = testGame.currentRoundNum;
	var roundCountAfter = roundCountBefore + 1;
	t.equal(testGame.inProgress, false);
	testGame.startNewRound();
	t.equal(testGame.currentRoundNum, roundCountAfter);
	t.equal(testGame.inProgress, true);
	t.ok(testGame.currentRound);
	t.end();
});

test('checkIfWeNeedANewAdmin', function(t) {
	//if the admin disconnects, it should make someone else admin
	player1.isConnected = false;
	testGame.checkIfWeNeedANewAdmin(player1);
	t.equal(player2.isAdmin, true);
	t.end();

	//reset
	player1.isConnected = true;
});

test('checkIfTheGameHasNoPlayersLeft', function(t) {
	//if there are no players left when this function runs,
	//	it should call onEmpty
	var onEmptyCallCount = 0;
	var testOnEmpty = function() {
		onEmptyCallCount++;
	};
	var emptyTestGame = new Game(testCode, testOnEmpty);
	var testPlayer = emptyTestGame.addPlayer(testName, testSocket);
	emptyTestGame.removePlayer(testPlayer.id);
	emptyTestGame.checkIfTheGameHasNoPlayersLeft();

	t.equal(onEmptyCallCount, 2);
	t.end();
});

test('startIfReady', function(t) {
	var startIfReadyTestGame = new Game(testCode);

	//between 0 and 4 players, it should not start the round
	for (var i = 0; i <= 4; i++) {
		t.notOk(startIfReadyTestGame.startIfReady());
		startIfReadyTestGame.addPlayer('TestPlayerName', testSocket);
	}

	//between 5 and 10 players, it should start the round
	for (var i = 5; i <= 10; i++) {
		t.ok(startIfReadyTestGame.startIfReady());
		startIfReadyTestGame.addPlayer('TestPlayerName', testSocket);
	}

	//for more than 10 players, it should not start the round
	for (var i = 11; i <= 15; i++) {
		t.notOk(startIfReadyTestGame.startIfReady());
		startIfReadyTestGame.addPlayer('TestPlayerName', testSocket);
	}

	t.end();
});
