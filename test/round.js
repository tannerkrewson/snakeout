var test = require('tape');

var Round = require('../app/round.js');

var Player = require('../app/player.js');

function MockSocket() {
  this.lastEmit;
  this.lastOnce;
}

MockSocket.prototype.emit = function(eventName, data) {
  this.lastEmit = {
    eventName,
    data
  };
};

MockSocket.prototype.once = function(eventName, next) {
  this.lastOnce = {
    eventName,
    next,
    nextRes: next()
  };
};

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

test('sendToAll', function(t) {
  var exampleData = {
    example: 'kjbfsbsk'
  };
  testRound.sendToAll('exampleEvent', exampleData);

  mockPlayers.forEach(function(player) {
    var lastEmit = player.socket.lastEmit;
    t.equal(lastEmit.eventName, 'exampleEvent');
    t.ok(lastEmit.data.you);
    t.equal(lastEmit.data.data, exampleData);
  });

  t.end();
});
