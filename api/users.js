/**
 * Created with JetBrains WebStorm.
 * User: i017298
 * Date: 14/08/13
 * Time: 21:04
 * To change this template use File | Settings | File Templates.
 */

var tableName = 'users',
    mongoClient = require('../db/mongo'),
    ObjectId = mongoClient.ObjectId,
    db = mongoClient.schema;

var user = {
	subscribe: function subscribe(req, res) {
        var user = req.body;
        var validInput =
            user.firstName &&
            user.lastName &&
            user.username &&
            user.password &&
            user.type;

        if (!validInput)  {
            res.jsonp({'msg' : 'firstName, lastName, username, password and type are required', 'success' : false});
            return;
        }

        user.isOnline = false;
        user.lastKnownLocation = [ 0, 0 ];
        user.positiveFeedback = 0;
        user.negativeFeedback = 0;

        db.collection(tableName, function(err, collection) {
			collection.findOne({'username': user.username}, function(err, item) {
				if (item == null) {
                        collection.insert(user, function(err, item) {
                            res.jsonp(item);
                        });
					}
				else {
					res.jsonp({'msg' : 'user name is taken', 'success' : false});
				}
            });
        })
    },
	
	login: function login(req, res) {
	    var username = req.params.username;
		var password = req.params.password;
        var validInput =
            username &&
            password;

        if (!validInput)  {
            res.jsonp({'msg' : 'username and password are required', 'success' : false});
            return;
        }

		if (req.session.loggedInUser) {
		    res.jsonp({'msg' : 'user already logged in', 'success' : false});
            return;
		}

        db.collection(tableName, function(err, collection) {
            if (err) {
                console.log("db error", err);
            }
			collection.findOne({'username': username, 'password': password}, function(err, item) {
				if (item) {
                        req.session.loggedInUser = item._id;
						res.jsonp({'msg' : 'login success!', 'success' : true});
					}
				else {
					res.jsonp({'msg' : 'login failed!', 'success' : false});
				}
            });
        })
    },
	
	logout: function logout(req, res) {
		if (!req.session.loggedInUser) {
		    res.jsonp({'msg' : 'user is not logged in', 'success' : false});
            return;
		}

		req.session.loggedInUser = null;
		res.jsonp({'success' : true});
	},
	
	findUsersWithMinRating: function findUsersWithMinRating(req, res) {
        var minRating = parseInt(req.params.minRating);

		if (!minRating) {
		    res.jsonp({'msg' : 'minRating is required', 'success' : false});
            return;
		}

        if (!req.session.loggedInUser) {
		    res.jsonp({'msg' : 'user is not logged in', 'success' : false});
            return;
		}

        db.command( { count:'users',
                 query: { positiveFeedback: { $gt: minRating } }
               } ,  function(err, item) {		   
				if (item) {
					res.jsonp({'count' : item.n, 'success' : true});
				}
				else {
					res.jsonp(res.jsonp({'success' : false}));
					}
        });
    },

    findTopCloseUsers: function findTopCloseUsers(req, res) {
        if (!user.isLoggedIn(req)) {
            res.jsonp({'msg' : 'user is not logged in', 'success' : false});
            return;
        }

        var userId = user.getLoggedInUserId(req);
        var maxItems = parseInt(req.params.maxItems) || 0;
        var maxDistance = parseFloat(req.params.maxDistance) || 0;
        db.collection(tableName, function(err, collection) {
            var user = collection.findOne({"_id": new ObjectId(userId)}, function(err, loggedInUser) {
                if (loggedInUser) {
                    var options =  {
                        near:loggedInUser.lastKnownLocation,
                        distanceField: "dist.calculated",
                        spherical: true,
                        query: { "_id": { $ne: new ObjectId(userId) } }
                    };

                    if (maxItems) {
                        options.num = maxItems;
                    }

                    if (maxDistance) {
                        options.maxDistance = maxDistance;
                    }

                    collection.aggregate([
                        {
                            $geoNear: options
                        }
                    ], function(err, items) {
                        if (err) {
                            console.log("error", err);
                        }
                        res.jsonp(items);
                    })
                }
                else {
                    res.jsonp({'msg' : 'user not found', 'success' : false});
                    return;
                }
            });
        })
    },
	
    findById: function findById(req, res) {
        var id = req.params.id;
        db.collection(tableName, function(err, collection) {
            collection.findOne({"_id": new ObjectId(id)}, function(err, item) {
                res.jsonp(item);
            });
        })
    },

    findAll: function findAll(req, res) {
        var name = req.query["name"];

        db.collection(tableName, function(err, collection) {
            if (name) {
                collection.find({}).toArray(function(err, items) {
                    res.jsonp(items);
                });
            } else {
                collection.find().toArray(function(err, items) {
                    res.jsonp(items);
                });
            }
        });
    },

    isLoggedIn: function isLoggedIn(req) {
        return req.session.loggedInUser && req.session.loggedInUser.length > 0;
    },

    getLoggedInUserId: function getLoggedInUserId(req) {
        var userId = null;

        if (this.isLoggedIn(req)) {
            userId = req.session.loggedInUser;
        }

        return userId;
    }
}

module.exports = user;