/*
 * @Author: Amol Kapoor
 * Description: Runs the DM specific code.
 */
var attacks = [];

if (username === 'dm')
	$('.dm-only').show();

function renderAttacks() {
	$('.attacks').empty();
	for (i in attacks) {
		obj = attacks[i];
		sender = obj['sender'];
		speed = obj['speed'];
		accuracy = obj['accuracy'];
		damage = obj['damage'];
		other = obj['other'];

		html = '<li><div> Sender: ' + sender + '<br> Speed: ' + speed +
			'<br> Accuracy: ' + accuracy + '<br> Damage: ' + damage +
			'<br> Other: ' + other + '<br></li>';
		$('.attacks').append($(html));
	}
}

function orderAttacks() {
	attacks.sort(function(a, b) {
		if (a.speed < b.speed)
			return 1;
		else if (a.speed > b.speed)
			return -1;
		else
			return 0;
	});
	return attacks;
}

$('.order-attacks').click(function() {
	attacks = orderAttacks(attacks);
	renderAttacks();
});

$('.clear-attacks').click(function() {
	attacks = [];
	renderAttacks();
});

socket.on('charAttack', function(data) {
	attacks.push(data)
	renderAttacks()
});
