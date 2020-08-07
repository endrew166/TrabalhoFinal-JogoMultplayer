export default function renderScreen(
	screen,
	game,
	requestAnimationFrame,
	currentPlayerId
) {
	const context = screen.getContext("2d");
	context.fillStyle = "white";
	context.clearRect(0, 0, 10, 10);

	for (const playerId in game.state.players) {
		const player = game.state.players[playerId];
		context.fillStyle = player.cor;
		context.fillRect(player.x, player.y, 1, 1);
	}

	for (const fruitId in game.state.fruits) {
		const fruit = game.state.fruits[fruitId];
		context.fillStyle = "rgba(139,0,139,0.8)";
		context.fillRect(fruit.x, fruit.y, 1, 1);
	}

	const currentPlayer = game.state.players[currentPlayerId];

	if (currentPlayer) {
		context.fillStyle = currentPlayer.cor;
		context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1);
	}

	requestAnimationFrame(() => {
		renderScreen(screen, game, requestAnimationFrame, currentPlayerId);
	});
}
