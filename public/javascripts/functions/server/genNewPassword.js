const generator = require('../generator.js');
const query = require('../../database/dbquery.js');

const genNewPassword = (req) => {
    return new Promise(async(resolve, reject) => {
        var srvuuid = req.body.newserverpassword;
        var password = await generator.genPW();
        var sql = "UPDATE server SET password='" + password + "' WHERE uuid='" + srvuuid + "';";
        await query(sql);
        resolve();
    });
}

module.exports = genNewPassword;
