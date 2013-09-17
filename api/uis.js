/**
 * Created with JetBrains PhpStorm. User: elad Date: 9/5/13 Time: 11:28 AM To
 * change this template use File | Settings | File Templates.
 */
var jade = require('jade');

var bitcoinUi = {
	index : function index(client, req, res) {
		res.render(client + '/index', {
			clientType : client,
			pageName : req.params.page
		});
	},

	userSearch : function userSearch(client, req, res) {
		var submenu = {
			submenu : [ {
				target : "userSearch",
				text : "Find closest"
			}, {
				target : "userSearchMinRating",
				text : "Find by Rating"
			}, {
				target : "userSearchById",
				text : "Find by ID"
			}, {
				target : "userSearchAll",
				text : "Get All"
			} ],
			clientType : client,
			pageName : req.params.page
		};

		if (req.params.page) {
			switch (req.params.page) {
			case "userSearch":
				res.render(client + '/userSearch', submenu);
				break;
			case "userSearchMinRating":
				res.render(client + '/userSearchMinRating', submenu);
				break;
			case "userSearchById":
				res.render(client + '/userSearchById', submenu);
				break;
			case "userSearchAll":

				res.render(client + '/userSearchAll', submenu);
				break;
			default:
				res.render(client + '/userSearch', submenu);
				break;
			}
		} else {
			res.render(client + '/userSearch', submenu);
		}
	},

	notification : function notification(client, req, res) {
		var data = {
			clientType : client,
			data : req.body,
			pageName : req.params.page
		}
		if (req.params.page) {
			switch (req.params.page) {
			case "notificationCreate":
				res.render(client + '/notificationCreate', data);
				break
			case "notificationGetAll":
				res.render(client + '/notificationGetAll', data);
				break;
			case "notificationUpdate":
				res.render(client + '/notificationUpdate', data);
				break;
			case "notificationDetails":
				res.render(client + '/notificationDetails', data);
				break;

			default:
				res.render(client + '/notificationGetAll', data);
				break;
			}
		}
	},

	broadcast : function broadcast(client, req, res) {
		var submenu = {
			submenu : [ {
				target : "broadcastGetAll",
				text : "Get all broadcasts"
			}, {
				target : "broadcastPublish",
				text : "publish broadcast"
			} ],
			clientType : client,
            data : req.body,
			pageName : req.params.page
		};

		if (req.params.page) {
			switch (req.params.page) {
			case "broadcastGetAll":
				res.render(client + '/broadcastGetAll', submenu);
				break
			case "broadcastPublish":
				res.render(client + '/broadcastPublish', submenu);
				break;
            case "broadcastDetails":
                res.render(client + '/broadcastDetails', submenu);
                break;
			default:
				res.render(client + '/broadcastGetAll', submenu);
				break;
			}
		}
	},

	main : function main(client, req, res) {
		res.render(client + '/main', {
			clientType : client,
			pageName : req.params.page
		});
	},

	mobile : function mobile(req, res) {
		var page = req.params.page;

		switch (page) {
		case "index":
			bitcoinUi.index("mobile", req, res);
			break;

		case "main":
			bitcoinUi.main("mobile", req, res);
			break;
		default:
			if (page.indexOf("userSearch") == 0) {
				bitcoinUi.userSearch("mobile", req, res);
			}
			if (page.indexOf("notification") == 0) {
				bitcoinUi.notification("mobile", req, res);
			}
			if (page.indexOf("broadcast") == 0) {
				bitcoinUi.broadcast("mobile", req, res);
			}
			break;
		}

	}

}

module.exports = bitcoinUi;