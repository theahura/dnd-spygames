/*
 * @Author: Amol Kapoor
 * @Description: Runs server for spy games.
 */

var io = require('socket.io').listen(8000)

console.log('server running')

// Global vars for tracking players.
var dm = {}
var players = {}

// Global var for storing encounter stuff.
var attacks = []
var encounterPlayers = 0;


function orderAttacksAndSendToDM(attacks, dmSocket) {
	attacks.sort(function(a, b) {
		if (a.speed < b.speed)
			return -1;
		else if (a.speed > b.speed)
			return 1;
		else
			return 0;
	});

	io.to(dm.id).emit('sortedAttacks', attacks);
	attacks = []
}

io.sockets.on('connection', function(socket) {

	var playerName = '':

	socket.on('disconnect', function() {
     	console.log('Got disconnect!');
		data = {
			sender: 'server',
			message: playerName + ' left the chat.' 
		}
		io.sockets.emit('chat', data);
		delete players[playerName];
   	});

	socket.on('setName', function(data, callback) {
		if (data.name === 'dm')
			dm = socket;
		players[data.name] = socket;
		playerName = data.name;
		chatData = {
			sender:'server',
			message: data.name + ' joined the chat.'
		}
		io.sockets.emit('chat', chatData);
	});

	socket.on('dmSetNumPlayersEncounter', function(data, callback) {
		if (socket.id !== dm.id)
			return;
		encounterPlayers = data.num_players;
	});

	socket.on('dmSetMastermind', function(data, callback) {
		if (socket.id !== dm.id)
			return;

		mastermind_data = {
			'num_chances': data.chances,
			'num_colors': data.colors,
			'num_nodes': data.nodes,
			'timer': data.timer
		}

		io.to(players[data.sendto].id).emit('setMastermind', mastermind_data)
	});

	socket.on('charInputAttack', function(data, callback) {
		attacks.push(data)
		if (attacks.length === encounterPlayers) {
			orderAttacksAndSendToDM(attacks, dm);
		}
	});

	socket.on('chatGroup', function(data, callback) {
		io.sockets.emit('chat', data);
	});
});

