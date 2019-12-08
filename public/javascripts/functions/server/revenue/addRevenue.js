const query = require('../../../database/dbquery.js');
const addServerRevenue = require('./addServerRevenue.js');
const changeMoney = require('../../changeMoney.js');
const drainSrvHealth = require('../drainSrvHealth.js');

const addRevenue = () => {
    return new Promise(async(resolve, reject) => {
        var sql = "SELECT * FROM server;";
        var results = await query(sql);
        var srvuuid, itemuuid, usruuid, sql1, resrevenue, revenue, health;

        if(results.length > 0) {
            for(let i = 0; i < results.length; i++) {
                srvuuid = results[i].uuid;
                itemuuid = results[i].executedSoftware;
                usruuid = results[i].uuidOwner;
                health = results[i].health;
                if(health > 0) {
                    if(itemuuid != "" && itemuuid != null && itemuuid != undefined) {
                        sql1 = "SELECT revenue FROM shop WHERE uuid='" + itemuuid + "';";
                        resrevenue = await query(sql1);
                        revenue = resrevenue[0].revenue;
                        await changeMoney(usruuid, revenue, "give");
                        await addServerRevenue(srvuuid, revenue);
                    }
                    await drainSrvHealth(srvuuid, 1);
                }
            }
        }
        
        resolve();
    });
}

module.exports = addRevenue;
