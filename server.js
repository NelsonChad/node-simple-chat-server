let app = require('express')();
let server = require('http').createServer(app);
//let io = require('socket.io')(server);
let io = require('socket.io')(server,{ 
    cors: {
    origin: "*"
}});
const cors = require('cors');

let users = []
let messages = []

app.use(cors());

io.on('connection', (socket) => {
  console.log('connected: ', socket.id)
    socket.on('disconnect', function(){
      io.emit('usersActivity', { user: socket.username, event: 'chatLeft' });
    });
   
    socket.on('setUserName', (name) => {
      socket.username = name;

      let user = {id: socket.id, username: socket.username};
      users.push(user);

      console.log('USERS: ', users)

      io.emit('usersActivity', { user: name, event: 'connectado' });  
      io.emit('usersConnected', users);    


    });
    
    socket.on('sendTheMessage', (message) => {
      io.emit('message', { msg: message.text, user: socket.username, createdAt: new Date() });    
    });

    socket.on('getConnected', () => {
      io.emit('usersConnected', users);    
    });
  });

  
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('Server Started and Listening on ' + port);
});