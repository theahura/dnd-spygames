/*
 * @Author: Amol Kapoor
 * @Description: Handles client for dnd spygames.
 */
var socket = io('http://localhost:8000');
var username = window.prompt('What is your name?');
socket.emit('setName', {'name':username});

function getAttackData() {
	speed = $('#speed').val()
	accuracy = $('#accuracy').val()
	damage = $('#damage').val()

	if (speed && accuracy && damage)
		return {
			speed: speed,
			accuracy: accuracy,
			damage: damage,
			other: $('#other').val(),
			sender: $('#sender').val() ? $('#sender').val() : username
		};
}

function loadAttackData(attackData) {
	$('#speed').val(attackData['speed']);
	$('#accuracy').val(attackData['accuracy']);
	$('#damage').val(attackData['damage']);
	$('#other').val(attackData['other']);
	$('#sender').val(attackData['sender']);
}

function processAttackData(attackData) {
	speed = droll.roll(attackData['speed'])
	accuracy = droll.roll(attackData['accuracy'])
	damage = droll.roll(attackData['damage'])

	if (speed && accuracy && damage)
		return {
			sender: attackData['sender'],
			speed: speed.total,
			accuracy: accuracy.total,
			damage: damage.total,
			other: attackData['other'] 
		};
	return false;
}

$('.attack-form-submit').click(function(){

	data = processAttackData(getAttackData());

	if (!data) {
		alert('Error in attack form!');
		return;
	}

	socket.emit('charInputAttack', data);
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

$('.macro-submit').click(function() {
	this.attackData = getAttackData();
	if (!this.attackData) {
		alert('Error in attack form!');
		return;
	}

	this.macro = $('<li class="button"></li>').html($('#macro-name').val())
	this.deleteMacro = $('<div class="button delete-macro"> x </div>');
	$(this.macro).append($(this.deleteMacro))

	$(this.macro).click(function() {
		loadAttackData(this.attackData)
	}.bind(this));

	$(this.deleteMacro).click(function() {
		$(this.macro).remove();
		$(this.deleteMacro).remove();
	}.bind(this));

	$('.macro-list').append(this.macro);

});

socket.on('chat', function(data) {
	$('.chat-text').append($('<li>').text(data.sender + ': ' + data.message));
});


