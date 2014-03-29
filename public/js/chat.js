/**
* Model for Chat Window
*
* @constructor
*/
function ChatWindow(socket, owner, inputId, sendId, chatBoxId){
  this.owner = owner.trim();
  this.inputId = inputId;
  this.sendId = sendId;
  this.chatBoxId = chatBoxId;
  this.socket = socket;

  this.lastMessageSender;
  this.roomName

  // if user presses enter, click send
  $(this.inputId).keyup(function(event){
    if(event.keyCode == 13){
      $(this.sendId).click();
    }
  });

  // if send is pressed, call send function
  $(this.sendId).click(this, function(event){
    var chatWindow = event.data;
    chatWindow.send($(chatWindow.inputId).val().trim(), chatWindow.owner);
  });
}

ChatWindow.prototype.receive = function(msg){
  console.log(msg)
  var textArea = $(this.chatBoxId);

  textArea.val(textArea.val() + '\n' + msg);
  textArea.animate({
    scrollTop:textArea[0].scrollHeight - textArea.height()
  });
}

ChatWindow.prototype.joinRoom = function(roomName){
  this.roomName = roomName
  this.socket.emit("join_room", { room: this.roomName});

  this.socket.on('new_message', function(data){
    console.log('got message ' + data.message)
    receive(data)
  })
}

ChatWindow.prototype.send = function(msg, senderName){
  console.log('Sending message to ' + this.roomName);
  console.log('Message: ' + msg)
  this.socket.emit('new_message', { room: this.roomName, message: msg })
}

window.onload = function(){
  var socket = io.connect('http://localhost:3000');
  console.log('Connected to server!')
  var leftChat = new ChatWindow(socket, "Left Guy", '#left-input', '#left-send', '#left-textarea');
  var rightChat = new ChatWindow(socket, "Right Guy", '#right-input', '#right-send', '#right-textarea');
  leftChat.joinRoom("leftRoom");
  rightChat.joinRoom("rightRoom");
}

