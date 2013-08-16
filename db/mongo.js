var mongoDB = require('mongodb'),
    MongoClient = mongoDB.MongoClient,
    Server = mongoDB.Server,
    ObjectId = mongoDB.ObjectID,
    dbPort = 27017,
    DBSchemeName = 'project',
    host = 'localhost',
    usersTableName = 'users',
    broadcastsTableName = 'broadcasts',
    notificationsTableName = 'notifications',
    db,
    server;

var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://' + host + ':' + dbPort + '/' + DBSchemeName;

if (process.env.MONGOLAB_URI) {
    var dbUser = 'heroku_app17536456';
    var dbPass = 'iac9efodqagmpkq0q8phbloot3';
    host = 'ds041218.mongolab.com';
    dbPort = '41218';
    DBSchemeName = 'heroku_app17536456';

}
server = new Server(host, dbPort);

console.log(process.env.MONGOLAB_URI);

var mongoClient = new MongoClient(server);

mongoClient.open(function(err, client) {
    db = client.db(DBSchemeName);
    if (dbUser && dbPass) {
        db.authenticate('username', 'password', function(err, result) {
            if (!result) {
                console.log("Could not login to database");
            }
            // Not authorized result=false

            // If authorized you can use the database in the db variable
        });
    }
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

    db.collection(notificationsTableName, {strict:true}, function(err, collection) {
        if (err || !collection) {
            console.log("The '" + notificationsTableName + "' collection doesn't exist. Creating it with sample data...");
            populateNofiticationDB();
        }
    });
});

module.exports = mongoClient;
module.exports.DBSchemeName = DBSchemeName;
module.exports.scheme = mongoClient.db(DBSchemeName);
module.exports.ObjectId = ObjectId;


/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateUsersDB = function() {

    console.log("Populating " + usersTableName + " database...");
    var users = [
        {
            "firstName": "Moshe",
            "lastName": "Haim",
            "username": "m_haim",
            "password": "12345",
            "type": [ "buyer", "seller" ],
            "isOnline": false,
            "lastKnownLocation": [ 34.8519261, 32.0636118 ],
            "positiveFeedback": 0,
            "negativeFeedback": 0,
            "_id": new ObjectId("520d15c35156cc4912d10f07")
        },
        {
            "firstName": "Nissim",
            "lastName": "Cohen",
            "username": "n_cohen",
            "password": "54321",
            "type": [ "buyer" ],
            "isOnline": false,
            "lastKnownLocation": [ 35, 32.05 ],
            "positiveFeedback": 1,
            "negativeFeedback": 0,
            "_id": new ObjectId("520d15c35156cc4912d10f08")
        },
        {
            "firstName": "Motti",
            "lastName": "Aroesti",
            "username": "m_aroesti",
            "password": "qwerty",
            "type": [ "seller" ],
            "isOnline": true,
            "lastKnownLocation": [ 34.9519261, 32.2 ],
            "positiveFeedback": 0,
            "negativeFeedback": 0,
            "_id": new ObjectId("520d15c35156cc4912d10f09")
        },
        {
            "firstName": "Nadav",
            "lastName": "Henefeld",
            "username": "laser",
            "password": "laser",
            "type": [ "buyer", "seller" ],
            "isOnline": false,
            "lastKnownLocation": [ 34.6, 32.04 ],
            "positiveFeedback": 0,
            "negativeFeedback": 0,
            "_id": new ObjectId("520d15c35156cc4912d10f0a")
        },
        {
            "firstName": "Doron",
            "lastName": "Jamchi",
            "username": "its_me",
            "password": "doron!",
            "type": [ "buyer" ],
            "isOnline": true,
            "lastKnownLocation": [ 34.3, 32.02 ],
            "positiveFeedback": 2,
            "negativeFeedback": 1,
            "_id": new ObjectId("520d15c35156cc4912d10f0b")
        }
    ];


    db.collection(usersTableName, function(err, collection) {
        var usersCollection = db.collection(usersTableName);
        try {
            collection.ensureIndex({ lastKnownLocation: "2dsphere"}, {w: 0}, function(err, result) {
        collection.insert(users, { safe:true }, function(err, result) {
            if (err) {
                console.log(err);
            }
        });
    });
        }
        catch(err) {
            console.log("error", err);
        }
    });

};

var populateBroadcastsDB = function() {
    console.log("Populating " + broadcastsTableName + " database...");
    var broadcasts = [
        {
            "publisher": new ObjectId("520d15c35156cc4912d10f0b"),
            "bitcoinsAmount": 10,
            "rate": 100,
            "type": "buy"
        },
        {
            "publisher": new ObjectId("520d15c35156cc4912d10f0a"),
            "bitcoinsAmount": 3,
            "rate": 150,
            "type": "buy"
        },
        {
            "publisher": new ObjectId("520d15c35156cc4912d10f09"),
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
var populateNofiticationDB = function() {
    console.log("Populating " + notificationsTableName + " database...");
    var notifications = [
        {
            "from": new ObjectId("520d15c35156cc4912d10f0b"),
            "to": new ObjectId("520d15c35156cc4912d10f07"),
            "bitcoinsAmount": 4,
            "rate": 120,
            "unread": true,
            "isApproved": false
        }
    ];

    db.collection(notificationsTableName, function(err, collection) {
        collection.insert(notifications, { safe:true }, function(err, result) {
            console.log(err);
        });
    });

};