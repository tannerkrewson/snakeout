function byId(playerList, id) {
	var index = indexById(playerList, id);
	if (index > -1) {
		return playerList[index];
	}
	return false;
}

function indexById(playerList, id) {
	for (var i = 0; i < playerList.length; i++) {
		var player = playerList[i];
		if (player.id === id) {
			return i;
		}
	}
	return -1;
}

export default {byId, indexById};