var test = require('tape');

var Round = require('../app/round.js');

var Player = require('../app/player.js');

function MockSocket() {
  this.lastEmit;
  this.lastOnce;
  this.onEmit;
  this.onOnce;
}

MockSocket.prototype.emit = function(eventName, data) {
  this.lastEmit = {
    eventName,
    data
  };
  if (this.onEmit) {
    this.onEmit(this.lastEmit);
  }
};

MockSocket.prototype.once = function(eventName, next) {
  this.lastOnce = {
    eventName,
    next
  };
  if (this.onOnce) {
    this.onOnce(this.lastOnce);
  }
};

MockSocket.prototype.bindOnEmit = function (funcToRun) {
  this.onEmit = funcToRun;
}

MockSocket.prototype.bindOnOnce = function (funcToRun) {
  this.onOnce = funcToRun;
}

function bindOnEmitOnPlayers (players, onEmit) {
  players.forEach(function (player) {
    player.socket.bindOnEmit(onEmit);
  });
}

function bindOnOnceOnPlayers (players, onOnce) {
  players.forEach(function (player) {
    player.socket.bindOnce(onOnce);
  });
}

var mockPlayers = [];

var P1Socket = new MockSocket();
var P2Socket = new MockSocket();
var P3Socket = new MockSocket();
var P4Socket = new MockSocket();
var P5Socket = new MockSocket();
var P6Socket = new MockSocket();

mockPlayers.push(new Player('Player1', P1Socket, 1));
mockPlayers.push(new Player('Player2', P2Socket, 2));
mockPlayers.push(new Player('Player3', P3Socket, 3));
mockPlayers.push(new Player('Player4', P4Socket, 4));
mockPlayers.push(new Player('Player5', P5Socket, 5));
mockPlayers.push(new Player('Player6', P6Socket, 6));

var onEndCalled = false;

var testRound;
test('create round', function(t) {
  var onEnd = function() {
    onEndCalled = true;
  };
  testRound = new Round(2, mockPlayers, onEnd);
  t.ok(testRound);
  t.equal(testRound.roundNumber, 2);
  t.equal(testRound.players, mockPlayers);
  t.equal(testRound.onEnd, onEnd);
  t.end();
});

test('getNumberOfSpies', function(t) {
  var numSpies = testRound.getNumberOfSpies();
  t.equal(typeof numSpies, 'number');
  t.ok(numSpies > 0);
  t.ok(numSpies < testRound.players.length);
  t.end();
});

test('assignRoles', function(t) {
  testRound.assignRoles();
  var spyCount = 0;
  var nonSpyCount = 0;
  testRound.players.forEach(function(player) {
    if (player.isSpy) {
      spyCount++;
    } else {
      nonSpyCount++;
    }
  });

  var spyCountShouldBe = testRound.getNumberOfSpies();
  t.equal(spyCount, spyCountShouldBe);
  t.equal(nonSpyCount, testRound.players.length - spyCountShouldBe);
  t.end();
});

test('assignNewCaptain', function(t) {
  testRound.assignNewCaptain();
  var captainCount = 0;
  var nonCaptainCount = 0;
  testRound.players.forEach(function(player) {
    if (player.isCaptain) {
      captainCount++;
    } else {
      nonCaptainCount++;
    }
  });

  t.equal(captainCount, 1);
  t.equal(nonCaptainCount, testRound.players.length - 1);
  t.end();
});

test('prepNextMission', function(t) {
  var missionNumberBefore = testRound.missionNumber;
  testRound.prepNextMission();
  t.equal(testRound.missionNumber, missionNumberBefore + 1);
  t.ok(testRound.missions[testRound.missionNumber - 1].inProgress);
  t.end();
});

test('startSelectionPhase', function (t) {
  testRound.startSelectionPhase();

  t.equal(testRound.phase, 'selection');


  t.end();
});

var mockSelectedPlayers = [];
test('startVotingPhase', function (t) {
  mockSelectedPlayers.push(mockPlayers[2]);
  mockSelectedPlayers.push(mockPlayers[0]);

  testRound.startVotingPhase(mockSelectedPlayers);

  t.end();
});

test('startMissionPhase', function (t) {
  testRound.getCurrentMission().putSelectedPlayersOnTheMission();
  testRound.startMissionPhase();

  t.end();
});

test('sendStateToAll', function (t) {
  t.plan(mockPlayers.length);

  bindOnEmitOnPlayers(mockPlayers, function () {
    t.pass('state emitted');
  });

  testRound.sendStateToAll();

  t.end();
});

test('getState', function (t) {
  var state = testRound.getState();

  // fail the test if params are removed
  t.ok(Object.keys(state).length >= 6);
  t.end();
});
