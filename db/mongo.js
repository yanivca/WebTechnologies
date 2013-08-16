var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    dbPort = 27017,
    DBSchemeName = 'project',
    host = 'localhost',
    usersTableName = 'users',
    broadcastsTableName = 'broadcasts',
    db;

var server = new Server(host, dbPort);
var mongoClient = new MongoClient(server);

var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/project';

//mongoClient.open(function(err, client) {
mongoClient.connect( mongoUri, function(err, client) {
    db = client.db(DBSchemeName);
    db.collection(usersTableName, {strict:true}, function(err, collection) {
        if (err || !collection) {
            console.log("The '" + usersTableName + "' collection doesn't exist. Creating it with sample data...");
            populateUsersDB();
        }
    });

    db.collection(broadcastsTableName, {strict:true}, function(err, collection) {
        if (err || !collection) {
            console.log("The '" + broadcastsTableName + "' collection doesn't exist. Creating it with sample data...");
            populateBroadcastsDB();
        }
    });
});

module.exports = mongoClient;
module.exports.DBSchemeName = DBSchemeName;
module.exports.scheme = mongoClient.db(DBSchemeName);


/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateUsersDB = function() {

    console.log("Populating " + usersTableName + " database...");
    var users = [
        {
            "id": 1,
            "firstName": "Moshe",
            "lastName": "Haim",
            "username": "m_haim",
            "password": "12345",
            "type": [ "buyer", "seller" ],
            "isOnline": false,
            "lastKnownLocation": { "long": 34.8519261, "lat": 32.0636118},
            "positiveFeedback": 0,
            "negativeFeedback": 0
        },
        {
            "id": 2,
            "firstName": "Nissim",
            "lastName": "Cohen",
            "username": "n_cohen",
            "password": "54321",
            "type": [ "buyer" ],
            "isOnline": false,
            "lastKnownLocation": { "long": 35, "lat": 32.05},
            "positiveFeedback": 1,
            "negativeFeedback": 0
        },
        {
            "id": 3,
            "firstName": "Motti",
            "lastName": "Aroesti",
            "username": "m_aroesti",
            "password": "qwerty",
            "type": [ "seller" ],
            "isOnline": true,
            "lastKnownLocation": { "long": 34.9519261, "lat": 32.2},
            "positiveFeedback": 0,
            "negativeFeedback": 0
        },
        {
            "id": 4,
            "firstName": "Nadav",
            "lastName": "Henefeld",
            "username": "laser",
            "password": "laser",
            "type": [ "buyer", "seller" ],
            "isOnline": false,
            "lastKnownLocation": { "long": 34.6, "lat": 32.04},
            "positiveFeedback": 0,
            "negativeFeedback": 0
        },
        {
            "id": 5,
            "firstName": "Doron",
            "lastName": "Jamchi",
            "username": "its_me",
            "password": "doron!",
            "type": [ "buyer" ],
            "isOnline": true,
            "lastKnownLocation": { "long": 34.3, "lat": 32.02},
            "positiveFeedback": 2,
            "negativeFeedback": 1
        }
    ];

    db.collection(usersTableName, function(err, collection) {
        collection.insert(users, { safe:true }, function(err, result) {
            if (err) {
                console.log(err);
            }
        });
    });

};

var populateBroadcastsDB = function() {

    console.log("Populating " + broadcastsTableName + " database...");
    var broadcasts = [
        {
            "publisher": 5,
            "bitcoinsAmount": 10,
            "rate": 100,
            "type": "buy"
        },
        {
            "publisher": 4,
            "bitcoinsAmount": 3,
            "rate": 150,
            "type": "buy"
        },
        {
            "publisher": 3,
            "bitcoinsAmount": 2,
            "rate": 130,
            "type": "sell"
        }
    ];

    db.collection(broadcastsTableName, function(err, collection) {
        collection.insert(broadcasts, { safe:true }, function(err, result) {
            console.log(err);
        });
    });

};