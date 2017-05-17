'use strict';
import debug from 'debug';
const log = debug('server:socketIO');

export default io => {
  io.on('connection', socket => {
    socket.on('join', room => {
      log('join ');
      socket.join(room);
    });
  });

// setInterval(function () {
// let room = "abc123";
// io.sockets.in(room).emit('message', 'what is going on, party people?');
//   io.sockets.in('test room').emit('broadcast event', 'ololo!');
// }, 1000)

  // io.on('connection', socket => {
  //   log('New connection');
  //   // socket.join('Lobby');
  //   // log('socket should ', Object.keys(socket));
  //   // log('socket should ', socket.handshake);
  //   // log('socket rooms ', socket.rooms);
  //   // log('socket id ', socket.id);
  //   // socket.on('leave channel', function(channel) {
  //   //   socket.leave(channel)
  //   // })
  //   // socket.on('join channel', function(channel) {
  //   //   log('channel ', channel);
  //   //   socket.join(channel.name);
  //   //   // socket.join(channel.name)
  //   //   log('socket id ', socket.id);
  //   //   log('socket rooms ', socket.rooms);
  //   // })
  //   // socket.join('test room');
  //   // socket.on('new message', function(msg) {
  //   //   log('>>>>>');
  //   //   socket.to('test message').emit('test message', 'lalala');
  //   // });
  //   // socket.on('connection name', user => {
  //   //   log('FFFFFF', user);
  //   //   const userName = user.thename;
  //   //   log('userName', userName);
  //   // });
  // });
};

/**
  * event 'comment'  receives object 'comment' with params:
  * text- comment content.
  * user - user-author ID
  * email - user-author email
  */
