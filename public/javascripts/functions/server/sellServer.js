const query = require('../../database/dbquery.js');
const changeMoney = require('../changeMoney.js');

const sellServer = (req) => {
    return new Promise(async(resolve, reject) => {
        var usruuid = req.session.uuid;
        var srvuuid = req.body.sellserver;
        var confirm = req.body.confirm_sell;
        var amount = 30000;

        if(confirm == "true") {
            var sql = "DELETE FROM server WHERE uuid='" + srvuuid + "';";
            await changeMoney(usruuid, amount, "give");
            await query(sql);
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

module.exports = sellServer;
