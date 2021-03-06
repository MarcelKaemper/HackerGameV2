const changeMoney = require('../changeMoney.js');
const addInventory = require('../inventory/addInventory.js');

const buyShop = (req) => {
    return new Promise(async(resolve, reject) => {
        var usruuid = req.session.uuid;
        var itemuuid = req.body.buyitem;
        var amount = req.body.buyprice;

        if(req.session.money >= amount) {
            await changeMoney(usruuid, amount, "take");
            await addInventory(usruuid, itemuuid);
            resolve(true);
        } else {
            resolve(false);
        }        
    });
}

module.exports = buyShop;
