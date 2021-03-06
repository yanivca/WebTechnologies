/**
 * Created with JetBrains WebStorm.
 * User: i017298
 * Date: 14/08/13
 * Time: 21:04
 * To change this template use File | Settings | File Templates.
 */

var tableName = 'notifications',
    mongoClient = require('../db/mongo'),
    ObjectId = mongoClient.ObjectId,
    user = require('../api/users'),
    db = mongoClient.schema;

var notification = {
    notifyUser: function notifyUser(req, res) {
        var userId = null;
        if (user.isLoggedIn(req)) {
            userId = user.getLoggedInUserId(req);
        }

        if (!userId) {
            res.jsonp({'msg' : 'must be logged in', 'success' : true});
            return;
        }

        var notification = req.body;
        var validInput =
            notification.to &&
            notification.bitcoinsAmount &&
            notification.bitcoinsAmount > 0 &&
            notification.rate &&
            notification.rate > 0 &&
            notification.type;

        if (!validInput)  {
            res.jsonp({'msg' : 'to, bitcoins Amount and rate are required. Numbers should be greater then 0', 'success' : false});
            return;
        }

        notification.from = new ObjectId(userId);
        notification.to = new ObjectId(notification.to); // "to" is string, so we need to parse it
        notification.unread = true;
        notification.isApproved = null;

        db.collection(tableName, function(err, collection) {
            collection.insert(notification, function(err, item) {
                res.jsonp({'success' : true, data: { id: item._id }});
            });
        })
    },
	
	updateNotificationRate: function updateNotificationRate(req, res) {
        var userId = null;
        if (user.isLoggedIn(req)) {
            userId = user.getLoggedInUserId(req);
        }

		if (!userId) {
            res.jsonp({'msg' : 'must be logged in', 'success' : true});
            return;
        }
		
        var notification = req.body;
        var validInput =
			notification._id &&
            notification.rate &&
            notification.rate > 0;

        if (!validInput)  {
            res.jsonp({'msg' : '_id, and rate are required. Numbers should be greater then 0', 'success' : false});
            return;
        }
        db.collection(tableName, function(err, collection) {
            collection.update({_id : ObjectId(notification._id)}, {$set: {rate : notification.rate}}, function(err, item) {
				if ( err ) {
					 res.jsonp({'msg' : 'update failed', 'success' : false});
				}
                res.jsonp({'success' : true});
            });
        })
    },

    approveNotification: function approveNotification(req, res) {
        req.body.isApproved = true;
        notification.updateNotificationState(req, res);
    },

    disapproveNotification: function approveNotification(req, res) {
        req.body.isApproved = false;
        notification.updateNotificationState(req, res);
    },

    updateNotificationState: function updateNotificationState(req, res) {
        var userId = null;
        if (user.isLoggedIn(req)) {
            userId = user.getLoggedInUserId(req);
        }

        if (!userId) {
            res.jsonp({'msg' : 'must be logged in', 'success' : true});
            return;
        }

        var notification = req.body;
        console.log("notification", notification);
        var validInput =
            notification.id &&
            notification.hasOwnProperty("isApproved");

        if (!validInput)  {
            res.jsonp({'msg' : 'id and isApproved are required', 'success' : false});
            return;
        }
        db.collection(tableName, function(err, collection) {
            collection.update({_id : ObjectId(notification.id)}, {$set: {isApproved : notification.isApproved}}, function(err, item) {
                if ( err ) {
                    res.jsonp({'msg' : 'update failed', 'success' : false});
                }
                res.jsonp({'success' : true});
            });
        })
    },

    getNotifications: function getNotifications(req, res) {
        var userId = null;
        if (user.isLoggedIn(req)) {
            userId = user.getLoggedInUserId(req);
        }

        if (!userId) {
            res.jsonp({'msg' : 'must be logged in', 'success' : false});
            return;
        }

        db.collection(tableName, function(err, collection) {
            collection.find({"to": new ObjectId(userId), "isApproved": null }).toArray(function(err, items) {
                if (err) {
                    console.log("error", err);
                }
                else {
                    res.jsonp({'count' : items.length, 'success' : true, status: true, data: items});
                }
            });
        })
    }
}

module.exports = notification;