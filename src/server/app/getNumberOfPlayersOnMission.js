module.exports = function (numberOfPlayers, missionNumber) {
    if (numberOfPlayers < 5 || numberOfPlayers > 10) {
        return false;
    }

    if (missionNumber < 1 || missionNumber > 5) {
        return false;
    }
    var playersXmission = [];

    //	playersXmission[numberOfPlayers][missionNumber]
    //		= number of players that go on this mission;

    playersXmission[5] = [];
    playersXmission[6] = [];
    playersXmission[7] = [];
    playersXmission[8] = [];
    playersXmission[9] = [];
    playersXmission[10] = [];

    playersXmission[5][1] = 2;
    playersXmission[5][2] = 3;
    playersXmission[5][3] = 2;
    playersXmission[5][4] = 3;
    playersXmission[5][5] = 3;

    playersXmission[6][1] = 2;
    playersXmission[6][2] = 3;
    playersXmission[6][3] = 4;
    playersXmission[6][4] = 3;
    playersXmission[6][5] = 4;

    playersXmission[7][1] = 2;
    playersXmission[7][2] = 3;
    playersXmission[7][3] = 3;
    playersXmission[7][4] = 4;
    playersXmission[7][5] = 4;

    playersXmission[8][1] = 3;
    playersXmission[8][2] = 4;
    playersXmission[8][3] = 4;
    playersXmission[8][4] = 5;
    playersXmission[8][5] = 5;

    playersXmission[9][1] = 3;
    playersXmission[9][2] = 4;
    playersXmission[9][3] = 4;
    playersXmission[9][4] = 5;
    playersXmission[9][5] = 5;

    playersXmission[10][1] = 3;
    playersXmission[10][2] = 4;
    playersXmission[10][3] = 4;
    playersXmission[10][4] = 5;
    playersXmission[10][5] = 5;

    return playersXmission[numberOfPlayers][missionNumber];
};
