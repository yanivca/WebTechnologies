/**
 * Created with JetBrains WebStorm.
 * User: i017298
 * Date: 14/08/13
 * Time: 21:04
 * To change this template use File | Settings | File Templates.
 */
var tableName = 'broadcasts',
    mongoClient = require('../db/mongo'),
	ObjectId = mongoClient.ObjectId,
    user = require('../api/users'),
    db = mongoClient.schema;

var broadcast = {
    publishOrUpdate: function publishOrUpdate(req, res) {
        var userId = null;
        if (user.isLoggedIn(req)) {
            userId = user.getLoggedInUserId(req);
        }

        if (!userId) {
            res.jsonp({'msg' : 'must be logged in', 'success' : false});
            return;
        }

        var broadcast = req.body;
        var validInput =
            broadcast.bitcoinsAmount &&
            broadcast.bitcoinsAmount > 0 &&
            broadcast.rate &&
            broadcast.rate > 0 &&
			broadcast.type;

        if (!validInput)  {
            res.jsonp({'msg' : 'bitcoinsAmount rate and type are required. Numbers should be greater then 0', 'success' : false});
            return;
        }
		
		broadcast.publisher = new ObjectId(userId);
        db.collection(tableName, function(err, collection) {
            collection.save(broadcast, function(err, item) {
				if (err) {
					res.jsonp({'msg' : 'publish falied', 'success' : false});
				}
				else {
					res.jsonp({'success' : true});
				}
            });
        })
    },
		
    deleteBroadcast: function deleteBroadcast(req, res) {
        var userId = null;
        if (user.isLoggedIn(req)) {
            userId = user.getLoggedInUserId(req);
        }

        if (!userId) {
            res.jsonp({'msg' : 'must be logged in', 'success' : false});
            return;
        }

        var broadcastId = req.body._id;
        if (!broadcastId)  {
            res.jsonp({'msg' : '_id is required', 'success' : false});
            return;
        };
	
	    if (broadcastId.length != 24)  {
            res.jsonp({'msg' : '_id should be 24 chars long', 'success' : false});
            return;
        };
		
        db.collection(tableName, function(err, collection) {
			collection.findOne({"_id": new ObjectId(broadcastId) }, function(err, item) {
				if (err) {
					res.jsonp({'msg' : 'broadcast does not exist', 'success' : false});
					return;
				}
				else if (item.publisher != new ObjectId(userId)) {
					res.jsonp({'msg' : 'failed permission', 'success' : false});
					return;
				}
			 });
            collection.remove({"_id": new ObjectId(broadcastId) }, function(err, item) {
                if (err) {
					res.jsonp({'msg' : 'update failed', 'success' : false});
				}
				else {
					res.jsonp({'success' : true});
				}
            });
        })
    },

   getBroadcasts: function getBroadcasts(req, res) {
        var userId = null;
        if (user.isLoggedIn(req)) {
            userId = user.getLoggedInUserId(req);
        }

        if (!userId) {
            res.jsonp({'msg' : 'must be logged in', 'success' : false});
            return;
        }

        db.collection(tableName, function(err, collection) {
            collection.find({"publisher": new ObjectId(userId) }).toArray(function(err, items) {
                if (err) {
                    console.log("error", err)
                }
                else {
                    res.jsonp(items);
                }
            });
        })
    }
}

module.exports = broadcast;