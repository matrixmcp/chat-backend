function routes (app) {
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
}

module.exports = routes