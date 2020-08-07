import createGame from "./game.js";
import createKeyboardListener from "./keyboard-listener.js";
import renderScreen from "./render-screen.js";

//adicionado o elemnto de de conectou no jogo
const TelaConectada = document.getElementById("connect");
// adicionado o elemnto pelo id quando game e iniciado
const TelaGame = document.getElementById("game");
//adicionando o elemneto nome
const formN = document.getElementById("nome");
//adicionando o elemnto de cor pelo id
const formC = document.getElementById("cor");
//tela
const screen = document.getElementById("screen");
//adicionando o elemnto do form
const form = document.getElementById("form");
//pontuação
const Jogadores = document.getElementById("Jogadores");
const Telas = [TelaConectada, TelaGame];
//entrando no form

form.onsubmit = function (event) {
	event.preventDefault();

	const nome = formN.value;
	const cor = formC.value;

	const user = {
		nome,
		cor,
	};
	connectToGame(user);
	showScreen(TelaGame);
};

function showScreen(screen) {
	for (var s of Telas) s.style.display = "none";
	screen.style.display = null;
}

function connectToGame(userData) {
	const game = createGame();
	const keyboardListener = createKeyboardListener(document);

	const socket = io();

	var playerId = null;
	var isConnected = false;

	socket.on("connect", () => {
		playerId = socket.id;
		isConnected = false;

		renderScreen(screen, game, requestAnimationFrame, playerId);

		socket.emit("join-player", userData);

		console.log(`Player connected on Client with id: ${playerId}`);
		//controle da musica
		document.getElementById("musica").volume = 0.02;
		document.getElementById("musica").play();
	});

	socket.on("setup", (state) => {
		game.setState(state);

		keyboardListener.registerPlayerId(playerId);
		keyboardListener.subscribe(game.movePlayer);
		keyboardListener.subscribe((command) => {
			socket.emit("move-player", command);
		});
	});

	socket.on("add-player", (command) => {
		game.addPlayer(command);
		//dando update nos jogadores
		updateJogadores(game);
	});

	socket.on("remove-player", (command) => {
		game.removePlayer(command);
		//dando update nos jogadores
		updateJogadores(game);
	});

	socket.on("move-player", (command) => {
		const playerId = socket.id;

		if (playerId !== command.playerId) {
			game.movePlayer(command);
		}
	});

	socket.on("add-fruit", (command) => {
		game.addFruit(command);
	});

	socket.on("remove-fruit", (command) => {
		game.removeFruit(command);
	});

	//conectando as telas dos jogadores
	socket.on("player-jogador", (command) => {
		const player = game.state.players[command.playerId];
		if (player == null) return;

		updateJogadores(game);
	});
}
//função para pegar a cor do jogador de acordo com o nome
function getPlayerJogadores(player) {
	return `
        <span class="Jogadores-player">
            <div class="player-cor" style="background-cor: ${player.cor};"></div> 
            ${player.nome}
        </span>`;
}

//Cria uma lista de jogadores vazias
function updateJogadores(game) {
	const players = [];

	var html = "";
	//insere os jogadores na lista
	for (var player of Object.values(game.state.players))
		html += `${getPlayerJogadores(player)}\n`;
	Jogadores.innerHTML = html;
}
