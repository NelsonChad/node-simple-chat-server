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
      io.emit('message',messages);   
    });
    
    socket.on('sendTheMessage', (message) => {

      let toSendMessage =  { msg: message.text, user: socket.username, createdAt: new Date() };
      messages.push(toSendMessage)
      io.emit('message',messages);   
    });

    socket.on('getConnected', () => {
      io.emit('usersConnected', users);    
    });
  });

  app.get("/", (req, res) => {
    res.send("<html> <head>server Response</head><body><h1> This page was render direcly from the server <p>SEVER STARTED</p></h1></body></html>");
  });

  
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('Server Started and Listening on ' + port);
});