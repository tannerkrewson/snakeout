import React, { Component } from "react";

import RRButton from "../components/RRButton";

export default class HowToPlay extends Component {
	render() {
		return (
			<div className="snakeout-info instructions">
				<div className="so- so-h2">
					<b>tl;dr:</b>
				</div>
				<p>
					Snakeout is based off the board game The Resistance, so if you've
					played that before, you'll understand Snakeout.
				</p>
				<p>
					In my opinion, the easiest way to learn how to play Snakeout would be
					to watch someone else play, as it will help you get a feel for the
					dynamic of the game. Here's a video from Tabletop on YouTube of some
					people playing The Resistance, which works in the same way:
				</p>
				<div className="embed-responsive embed-responsive-16by9">
					<iframe
						src="https://www.youtube.com/embed/g_QRczGzXqw"
						className="embed-responsive-item"
					/>
				</div>
				<p />
				<br />
				<div className="so- so-h2">
					<b>About</b>
				</div>
				<p>
					Snakeout is a game in which a team of loyalists is infiltrated by a
					group of snakes. The loyalists must try to figure out who the snakes
					are, and the snakes must try to keep them from figuring out their
					identity.
				</p>
				<p>
					The game is separated into five missions. The first team to "win"
					three missions wins the game.
				</p>
				<div className="so- so-h2">
					<b>How it works</b>
				</div>
				<p>Here's a rundown of a round of Snakeout:</p>
				<ol>
					<li>Start a new game, and give the code to your friends to join.</li>
					<li>When everyone has joined in, anyone may start the game.</li>
					<li>
						Each player can now view their role: either loyalist or snake.
						<ul>
							<li>
								The loyalists don't know who the snakes are, but the snakes are
								told who the other snakes are.
							</li>
						</ul>
					</li>
					<li>
						Next, a randomly selected captain will select a certain number of
						players to go on the mission.
						<ul>
							<li>
								If the captain is a loyalist, they should try to select players
								who they believe are not snakes to go on the mission.
							</li>
							<li>
								The captain may also select themselves to go on the mission.
							</li>
						</ul>
					</li>
					<li>
						Once the captain submits their selection, everyone will be prompted
						to vote on the captain's selection of players for the mission.
						<ul>
							<li>
								Loyalists will want to approve mission teams of people who they
								believe to be loyalists. They will want to keep snakes off the
								team, because it takes just one snake to fail the mission
								altogether.
							</li>
							<li>
								Be advised that game will show everyone each person's vote on
								the results page.
							</li>
						</ul>
					</li>
					<li>
						The vote results are then displayed based on majority vote.
						<ul>
							<li>
								If the majority votes to reject the team, a new captain will be
								selected at random and the process will start over again.
							</li>
							<li>If the vote is a tie, the selection will be rejected.</li>
							<li>If the selection is approved, the mission commences.</li>
						</ul>
					</li>
					<li>
						During the mission, the players selected to go on the mission will
						get to choose to either pass or fail the mission.
						<ul>
							<li>
								If one or more players vote to fail the mission, it will fail.
							</li>
							<li>
								Again, everyone on the mission must vote to pass it for it to
								pass, with one exception detailed below.
							</li>
							<li>
								NOTE: If the game has seven or more players and it is the fourth
								mission, TWO or more players must vote to fail the mission for
								it to fail.
							</li>
							<li>
								If you are a loyalist, it will always be in their best interest
								to pass the mission. Again, although the game will allow it, do
								not fail the mission as a loyalist, because it just hurts your
								team.
							</li>
							<li>
								If you are a snake, although it will sometimes be in your best
								interest to fail the mission, other times you may want to pass
								the mission to throw the other players off their scent.
							</li>
						</ul>
					</li>
					<li>
						The results of the mission will then be displayed on screen.
						<ul>
							<li>
								Unlike the results screen of the player vote, the mission
								results screen does not show how players voted (e.g. Pass or
								Fail).
							</li>
							<li>
								It does, however, show how many pass and fail votes there were.
							</li>
							<li>
								For example, if a mission has two players on it, and one player
								votes pass, and the other votes fail, the other players will now
								know that one of the two of you is a snake.
							</li>
						</ul>
					</li>
					<li>
						The game will now continue to the next mission, starting over the
						process of picking a random captain and having them select players.
					</li>
					<li>
						Once either team, loyalists or snakes, has gotten 3 missions, they
						win the game. To clarify:
						<ul>
							<li>Once 3 missions are passed, the loyalists win.</li>
							<li>Once 3 missions fail, the snakes win.</li>
						</ul>
					</li>
					<li>
						When a team is declared winner, the snakes that round are displayed
						on the screen for public scrutiny.
					</li>
				</ol>
				<p />
				<br />
				<div className="so- so-h2">
					<b>Tips</b>
				</div>
				<ul>
					<li>To play Snakeout, you must have 5 to 10 players.</li>
					<li>
						Don't worry if someone disconnects in the middle of the game. Just
						have someone (doesn't have to be the same person) join with the same
						game code. They will be able to replace the disconnected player, and
						the game will continue.
					</li>
				</ul>
				<br />
				<div className="so- so-h2">
					<b>Behind the scenes</b>
				</div>
				<p>
					Snakeout was programmed by myself, Tanner Krewson, with Node.js and
					React. Snakeout is 100% free and open-source, and is available on{" "}
					<a href="https://github.com/tannerkrewson/snakeout" target="_blank">
						GitHub{" "}
					</a>
					for your tinkering. If you run into any issues, or have any features
					you would like to see in Snakeout, feel free to open an issue on the{" "}
					<a
						href="https://github.com/tannerkrewson/snakeout/issues"
						target="_blank"
					>
						GitHub repo
					</a>
					. Hope you like it! &lt;3
				</p>
				<br />
				<div className="text-center">
					<RRButton path="/">Back to Snakeout</RRButton>
				</div>
				<br />
			</div>
		);
	}
}
