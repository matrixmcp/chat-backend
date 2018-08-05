const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./routes');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

// ---- Подключаемся к БД
mongoose.connect('mongodb://localhost/chat');
const db = mongoose.connection;
var MessagesCollection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('db connected!');
    const messageScheme = new mongoose.Schema({
        userName: String,
        text: String,
        createdDate: { type: Date, default: Date.now },
    }) 
    MessagesCollection = mongoose.model('Messages', messageScheme);
});


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
    
    // Получаем историю сообщений из БД и отправляем ее подключенному клиенту
    MessagesCollection.find({}).exec((err, messages) => {
        if (err !== void 0 ) {
            socket.emit('messagesHistory', messages)
        } else {
            console.error(err)
        }

    } )

    socket.on('message', (message) => {
        socket.broadcast.emit('message', message)
        socket.emit('message', message)

        // Сохраняем сообщение в БД
        const messageModel = new MessagesCollection({ userName: message.userName, text: message.text })
        messageModel.save().then (() => console.log('Запись в БД прошла успешно!'))
    })

    socket.on('disconnect', () => console.log('Client disconnected'));
});

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
