/**
 * Created with JetBrains WebStorm.
 * User: i017298
 * Date: 14/08/13
 * Time: 21:04
 * To change this template use File | Settings | File Templates.
 */
var tableName = 'broadcasts',
    mongoClient = require('../db/mongo'),
    db = mongoClient.scheme;

var braodcast = {
    findById: function findById(req, res) {
        console.log(req.params);
        var id = parseInt(req.params.id);
        console.log('findById: ' + id);
        db.collection(tableName, function(err, collection) {
            collection.findOne({'id': id}, function(err, item) {
                console.log(item);
                res.jsonp(item);
            });
        })
    },

    findByManager: function findByManager(req, res) {
        var id = parseInt(req.params.id);
        console.log('findByManager: ' + id);
        db.collection(tableName, function(err, collection) {
            collection.find({'managerId': id}).toArray(function(err, items) {
                console.log(items);
                res.jsonp(items);
            });
        });
    },

    findAll: function findAll(req, res) {
        var name = req.query["name"];
        db.collection(tableName, function(err, collection) {
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

module.exports = braodcast;