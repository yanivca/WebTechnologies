/**
 * Created with JetBrains PhpStorm.
 * User: elad
 * Date: 9/5/13
 * Time: 11:28 AM
 * To change this template use File | Settings | File Templates.
 */
var jade = require('jade');

var bitcoinUi = {
    index: function index(client, req, res) {
        res.render(client + '/index');
    },

    userSearch: function userSearch(client, req, res) {
        var submenu = {submenu: [
            {target: "userSearchTopNearest", text: "Find closest"},
            {target: "userSearchMinRating", text: "Find by Rating"},
            {target: "userSearchById", text: "Find by ID"},
            {target: "userSearchAll", text: "Get All"}
        ]};

        if (req.params.subpage) {
            switch(req.params.subpage) {
                case "userSearchTopNearest":
                    res.render(client + '/userSearchTopNearest', submenu);
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
            }
        } else {
            res.render(client + '/userSearchTopNearest', submenu);
        }
    },
    mobile: function mobile(req, res) {
        var page = req.params.page;

        switch (page) {
            case "index":
                bitcoinUi.index("mobile", req, res);
                break;

            case "userSearch":
                bitcoinUi.userSearch("mobile", req, res);
                break;

        }

    }

}

module.exports = bitcoinUi;