const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./routes');

const PORT = process.env.PORT || 5000;

// ---- Добавляем возможность отвечать на запросы к API с любого адреса
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// ---- Путь к статике -----------------------------------
app.use(express.static(__dirname + '/public'))

// ---- Обработка роутов ----------------------------------
routes(app);

// ---- Работа с сокетами ---------------------------------
io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', (message) => {
        socket.broadcast.emit('message', message)
        socket.emit('message', message)
    })

    socket.on('disconnect', () => console.log('Client disconnected'));
});

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
