/*
 * @Author: Amol Kapoor
 * @Description: Handles client for dnd spygames.
 */

var socket = io('http://localhost:8000');

var username = window.prompt('What is your name?');

socket.emit('setName', {'name':username});

var canSubmitAttack = true;

function process_attack_data() {
	speed = droll.roll($('#speed').val())
	accuracy = droll.roll($('#accuracy').val())
	damage = droll.roll($('#damage').val())

	alert(speed)
	alert(accuracy)
	alert(damage)

	if (speed && accuracy && damage)
		return {
			sender: username,
			speed: speed.total,
			accuracy: accuracy.total,
			damage: damage.total,
			other: $('#other').val()
		};
	return false;
}

$('.attack-form-submit').click(function(){
	if (!canSubmitAttack) {
		alert('Cant submit attack yet!');
		return;
	}

	data = process_attack_data();
	if (!data) {
		alert('Error in attack form!');
		return;
	}

	socket.emit('charInputAttack', data);
	console.log(data)

	canSubmitAttack = false;
});

$('.chat-input-textarea').keypress(function (e) {
	if (e.which == 13) {
		data = {
			sender: username,
			message: $(this).val()
		}
		socket.emit('chatGroup', data)
		$(this).val('')
	}
});

socket.on('chat', function(data) {
	$('.chat-text').append($('<li>').text(data.sender + ': ' + data.message));
});


