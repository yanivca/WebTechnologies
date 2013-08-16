/**
 * Created with JetBrains WebStorm.
 * User: i017298
 * Date: 14/08/13
 * Time: 21:04
 * To change this template use File | Settings | File Templates.
 */
var express = require('express'),
    user = require('./api/users'),
    braodcast = require('./api/broadcasts'),
    portNumber = process.env.PORT || 8888;

var bitcoinsServer = express();

bitcoinsServer.get('/users/:id/reports', user.findByManager);
bitcoinsServer.get('/users/:id', user.findById);
bitcoinsServer.get('/users', user.findAll);
bitcoinsServer.post('/users', user.findAll);
bitcoinsServer.put('/users', user.findAll);
bitcoinsServer.delete('/users/:id', function(req, res) {
    res.write("2222");
    res.end();
});

bitcoinsServer.get('/broadcasts/:id/reports', braodcast.findByManager);
bitcoinsServer.get('/broadcasts/:id', braodcast.findById);
bitcoinsServer.get('/broadcasts', braodcast.findAll);
bitcoinsServer.post('/broadcasts', braodcast.findAll);
bitcoinsServer.put('/broadcasts', braodcast.findAll);
bitcoinsServer.delete('/broadcasts/:id', function(req, res) {
    res.write("2222");
    res.end();
});


bitcoinsServer.listen(portNumber);
console.log('Listening on port ' + portNumber);