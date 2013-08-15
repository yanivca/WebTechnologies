/**
 * Created with JetBrains WebStorm.
 * User: i017298
 * Date: 14/08/13
 * Time: 21:04
 * To change this template use File | Settings | File Templates.
 */
var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    dbPort = 27017,
    usersTableName = 'users',
    db;

var mongoClient = new MongoClient(new Server('localhost', dbPort));
mongoClient.open(function(err, mongoClient) {
    db = mongoClient.db("employeedb09");
    db.collection(usersTableName, {strict:true}, function(err, collection) {
        if (err) {
            console.log("The 'employees' collection doesn't exist. Creating it with sample data...");
            populateDB();
        }
    });
});

var user = {
    findById: function findById(req, res) {
        console.log(req.params);
        var id = parseInt(req.params.id);
        console.log('findById: ' + id);
        db.collection('employees', function(err, collection) {
            collection.findOne({'id': id}, function(err, item) {
                console.log(item);
                res.jsonp(item);
            });
        })
    },

    findByManager: function findByManager(req, res) {
        var id = parseInt(req.params.id);
        console.log('findByManager: ' + id);
        db.collection('employees', function(err, collection) {
            collection.find({'managerId': id}).toArray(function(err, items) {
                console.log(items);
                res.jsonp(items);
            });
        });
    },

    findAll: function findAll(req, res) {
        var name = req.query["name"];
        db.collection('employees', function(err, collection) {
            if (name) {
                collection.find({"fullName": new RegExp(name, "i")}).toArray(function(err, items) {
                    res.jsonp(items);
                });
            } else {
                collection.find().toArray(function(err, items) {
                    res.jsonp(items);
                });
            }
        });
    }
}

module.exports = user;

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    console.log("Populating users database...");
    var users = [
        {
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
        collection.insert(users, { safe:true }, function(err, result) { });
    });

};