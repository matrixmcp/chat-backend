const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 5000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(__dirname + '/public'))
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/messages', function(req, res) {
    res.sendFile(__dirname + '/public/messages.json');
});

app.get('/contacts', function(req, res) {
    res.sendFile(__dirname + '/public/contacts.json');
});

app.get('/user', function(req, res) {
    res.sendFile(__dirname + '/public/user.json');
});


io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', (message) => {
        socket.broadcast.emit('message', message)
        socket.emit('message', message)
    })

    socket.on('disconnect', () => console.log('Client disconnected'));
});

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
