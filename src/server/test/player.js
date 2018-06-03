var test = require("tape");

var Player = require("../app/player.js");

var testPlayer, playerJson;

var emitResults, onceResults;
var mockSocket = {
	emit: function(eventName, data) {
		emitResults = {
			eventName,
			data
		};
	},
	once: function(eventName, next) {
		onceResults = {
			eventName,
			next,
			nextRes: next()
		};
	}
};

test("create player", function(t) {
	testPlayer = new Player("Arthur", mockSocket, 123);
	t.ok(testPlayer);
	t.equal(testPlayer.name, "Arthur");
	t.equal(testPlayer.socket, mockSocket);
	t.equal(testPlayer.id, 123);
	t.equal(testPlayer.isAdmin, false);
	t.equal(testPlayer.isConnected, true);
	t.end();
});

test("getJson", function(t) {
	playerJson = testPlayer.getJson();
	t.ok(playerJson);
	t.equal(playerJson.name, "Arthur");
	t.equal(playerJson.id, 123);
	t.equal(playerJson.isAdmin, false);
	t.equal(playerJson.isConnected, true);

	//getJson removes the socket
	t.notOk(playerJson.socket);

	t.end();
});

test("send", function(t) {
	testPlayer.send("eventToSend-test1", "qwertyuiop");
	t.equal(emitResults.eventName, "eventToSend-test1");

	//the you object should be the whole json of the player,
	//  but I just check the name to keep it short
	t.equal(emitResults.data.you.name, "Arthur");

	t.equal(emitResults.data.round, "qwertyuiop");
	t.end();

	emitResults = undefined;
});

test("sendThen", function(t) {
	var runMe = function() {
		return "Yay, I ran!";
	};
	testPlayer.sendThen(
		"eventToSend-test2",
		"asdfghjkl",
		"receivedEvent-test",
		runMe
	);
	t.equal(emitResults.eventName, "eventToSend-test2");

	//the you object should be the whole json of the player,
	//  but I just check the name to keep it short
	t.equal(emitResults.data.you.name, "Arthur");

	t.equal(emitResults.data.round, "asdfghjkl");
	t.equal(onceResults.eventName, "receivedEvent-test");
	t.equal(onceResults.next, runMe);
	t.equal(onceResults.nextRes, "Yay, I ran!");
	t.end();
});

test("makeAdmin", function(t) {
	t.equal(testPlayer.isAdmin, false);
	testPlayer.makeAdmin();
	t.equal(testPlayer.isAdmin, true);
	t.end();
});
