import React, { Component } from 'react';

export default class HowToPlay extends Component {
  render() {
    return (
      <div className="spyout-info">
        <div className="so- so-h2"><b>tl;dr:</b></div>
        <p>Spyout is based off the board game The Resistance, so if you've played that before, you'll understand Spyout.</p>
        <p>In my opinion, the easiest way to learn how to play Spyout would be to watch someone else play, as it will help you get a feel for the dyanmic of the game. Here's a video from Tabletop on YouTube of some people playing The Resistance, which works in the same way:</p>
        <div className="embed-responsive embed-responsive-16by9">
          <iframe src="https://www.youtube.com/embed/g_QRczGzXqw" className="embed-responsive-item" />
        </div>
        <p />
        <br />
        <div className="so- so-h2"><b>About</b></div>
        <p>Spyout is a game in which a team of loyalists is infultrated by a group of spies. The loyalists must try to figure out who the spies are, and the spies must try to keep them from figuring out their identity.</p>
        <p>The game is seperated into five missions. The first team to get three missions wins the game.</p>
        <div className="so- so-h2"><b>How it works</b></div>
        <p>Here's a rundown of a round of Spyout:</p>
        <ol>
          <li>Start a new game, and give the code to your friends to join.</li>
          <li>When everyone has joined in, the host may start the game.</li>
          <li>Each player can now view their role, either a loyalist or a spy.
            <ul>
              <li>The loyalists don't know who the spies are, but the spies </li>are told who the other spies are.</ul>
          </li>
          <li>Next, a randomly selected captain will select a certain number of players to go on the mission.
            <ul>
              <li>If the captain is a loyalist, they should try to select players who they believe are not spies to go on the mission.</li>
              <li>The captain may also select themselves to go on the mission.</li>
            </ul>
          </li>
          <li>Once the captain submits their selection, everyone will be prompted to vote on the captain's selection of players for the mission.
            <ul>
              <li>Loyalists will want to approve mission teams of people who they believe to be loyalists. They will want to keep spies off the team, because it takes just one spy to fail the mission altogether.</li>
              <li>Be advised that game will show everyone each person's vote on the results page.</li>
            </ul>
          </li>
          <li>The vote results are then displayed based on majority vote.
            <ul>
              <li>If the majority votes to reject the team, a new captain will be selected at random and the process will start over again.</li>
              <li>If the vote is a tie, the selection will be rejected.</li>
              <li>If the selection is approved, the mission commences.</li>
            </ul>
          </li>
          <li>During the mission, the selected player will get to choose to either pass or fail the mission.
            <ul>
              <li>If one or more players vote to fail the mission, it will fail.</li>
              <li>Again, everyone on the mission must vote to pass it for it to pass, with one exception detailed below.</li>
              <li>NOTE: If the game has seven or more players and it is the fourth mission, TWO or more players must vote to fail the mission for it to fail.</li>
              <li>If one is a loyalist, it will always be in their best interest to pass the mission. Again, although the game will allow it, do not fail the mission as a loyalist, because it just hurts your team.</li>
              <li>If one is a spy, although it would sometimes be in one's best interest to vote to fail the mission, other times they may want to pass the mission to throw the other players off their scent.</li>
            </ul>
          </li>
          <li>The results of the mission will then be displayed on screen.
            <ul>
              <li>Unlike the results screen of the player vote, the mission results screen does not show how players voted (e.g. Pass or Fail).</li>
              <li>It does, however, show how many pass and fail votes there were.
              </li>
              <li>For example, if a mission has two players on it, and one player votes pass, and the other votes fail, the other players will now know that one of the two of you is a spy.</li>
            </ul>
          </li>
          <li>The game will now continue to the next mission, starting over the process of picking a random captain and having them select players.
          </li>
          <li>Once either team, loyalists or spies, has gotten 3 missions, they win the game. To clarify:
            <ul>
              <li>Once 3 missions are passed, the loyalists win.</li>
              <li>Once 3 missions fail, the spies win.</li>
            </ul>
          </li>
          <li>When a team is declared winner, the spies that round are displayed on the screen for public scrutiny.</li>
        </ol>
        <p />
        <br />
        <div className="so- so-h2"><b>Tips</b></div>
        <ul>
          <li>To play Spyout, you must have 5 to 10 players.</li>
          <li>Don't worry if someone disconnects in the middle of the game. Just have someone (doesn't have to be the same person) join with the same game code. They will be able to replace the disconnected player, and the game will continue.</li>
        </ul>
        <br />
        <div className="so- so-h2"><b>Behind the scenes</b></div>
        <p>Spyout was programmed by myself, Tanner Krewson, with Node.js and React. Spyout is 100% free and open-source, and is available on <a href="https://github.com/tannerkrewson/spyout" target="_blank">GitHub </a>for your tinkering. If you run into any issues, or have any features you would like to see in Spyout, feel free to open an issue on the <a href="https://github.com/tannerkrewson/spyout" target="_blank">GitHub repo</a>. Hope you like it! &lt;3</p>
        <br />
        <div className="text-xs-center">
          <a href="/" className="btn btn-secondary sobutton">Back to Spyout</a>
        </div>
        <br />
      </div>
    );
  }
}