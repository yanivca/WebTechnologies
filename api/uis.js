/**
 * Created with JetBrains PhpStorm.
 * User: elad
 * Date: 9/5/13
 * Time: 11:28 AM
 * To change this template use File | Settings | File Templates.
 */
var jade = require('jade');

var bitcoinUi = {
    mobile: function mobile(req, res) {
        var page = req.params.page;
        res.render('mobile/' + page);
    }
}

module.exports = bitcoinUi;