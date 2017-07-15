/*
 * @Author: Amol Kapoor
 * @Description: Runs server for spy games.
 */

var io = require('socket.io').listen(8000)

console.log('server running')

// Global vars for tracking players.
var players = {}

io.sockets.on('connection', function(socket) {

	var playerName = '';
	var isDM = false;

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

		if (callback)
			callback();
	});

	socket.on('charInputAttack', function(data, callback) {
		io.to(dm.id).emit('charAttack', data);

		if (callback)
			callback();
	});

	socket.on('chatGroup', function(data, callback) {
		io.sockets.emit('chat', data);

		if (callback)
			callback();
	});
});

