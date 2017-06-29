/*
 * @Author: Amol Kapoor
 * @Description: Handles client for dnd spygames.
 */

var socket = io('http://localhost:8000');

var username = window.prompt('What is your name?');

socket.emit('setName', {'name':username});

$('.attack-form-holder').submit(function(){
});

$('.chat-input').submit(function(){
});
