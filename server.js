/**
 * Created with JetBrains WebStorm. User: i017298 Date: 14/08/13 Time: 21:04 To
 * change this template use File | Settings | File Templates.
 */
var express = require('express'),
	http = require('http'),
	io = require('socket.io'),
    user = require('./api/users'),
    notification = require('./api/notifications'),
    bitcoinUi = require('./api/uis'),
    broadcast = require('./api/broadcasts'),
    path = require('path'),
    portNumber = process.env.PORT || 8888;

var bitcoinsServer = express();
bitcoinsServer.use(express.cookieParser());
bitcoinsServer.use(express.session({secret: '1234567890QWERTY'}));
bitcoinsServer.use(express.bodyParser());

bitcoinsServer.post('/users/subscribe', user.subscribe);
bitcoinsServer.get('/users/login/:username/:password', user.login);
bitcoinsServer.get('/users/logout', user.logout);
bitcoinsServer.get('/users/isloggedin', user.getUserId);
bitcoinsServer.get('/users/minRating/:minRating', user.findUsersWithMinRating);
bitcoinsServer.get('/users/near', user.findTopCloseUsers);
bitcoinsServer.get('/users/near/:maxItems', user.findTopCloseUsers);
bitcoinsServer.get('/users/near/:maxItems/:maxDistance', user.findTopCloseUsers);
bitcoinsServer.get('/users/:id', user.findById);
bitcoinsServer.get('/users', user.findAll);

bitcoinsServer.post('/notifications/notify', notification.notifyUser);
bitcoinsServer.post('/notifications/update', notification.updateNotificationRate);
bitcoinsServer.post('/notifications/approve', notification.approveNotification);
bitcoinsServer.post('/notifications/disapprove', notification.disapproveNotification);
bitcoinsServer.get('/notifications', notification.getNotifications);

bitcoinsServer.post('/broadcasts/publish', broadcast.publishOrUpdate);
bitcoinsServer.delete('/broadcasts/cancel', broadcast.deleteBroadcast);
bitcoinsServer.get('/broadcasts', broadcast.getBroadcasts);

bitcoinsServer.get('/mobile/:page', bitcoinUi.mobile);
bitcoinsServer.post('/mobile/:page', bitcoinUi.mobile);
// bitcoinsServer.get('/desktop/:page', ui.desktop);

bitcoinsServer.set('view engine', 'jade');
bitcoinsServer.set('views', __dirname + '/html');
bitcoinsServer.set('view options', { pretty: true });
bitcoinsServer.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(bitcoinsServer);
server.listen(portNumber);
console.log('Listening on port ' + portNumber);

var sio = io.listen(server);

// listen for incoming connections from client
sio.sockets.on('connection', function (socket) {

  // start listening for coords
  socket.on('send:coords', function (data) {
 
    // broadcast your coordinates to everyone except you
    socket.broadcast.emit('load:coords', data);
  });
  
  // start listening for notifications
  socket.on('send:notif', function (data) {
	  
    // broadcast notification to everyone except you
	socket.broadcast.emit('load:notif', data);
  });
});