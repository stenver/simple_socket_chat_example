var express = require('express');

var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

server.listen(3000);

io.sockets.on('connection', function (socket) {
  console.log('client connected');

  socket.on('join_room', function (data) {
    console.log('client joined room '+ data.room);
    socket.join(data.room);

    socket.on('new_message', function (data) {
      console.log('got message in ' + data.room + '. Message contains: '+ data.message);
      socket.broadcast.to(data.room).emit('new_message', { message: data.message } );
    })
  });

  socket.on('disconnect', function() {
    console.log('client disconnected');
  });
});
