const loadSrvInventory = require('../inventory/loadSrvInventory.js');
const uuidName = require('../uuidName.js');
const getItemData = require('../inventory/getItemData.js');

const serverCmdLs = (req, cmd, command) => {
    return new Promise(async(resolve, reject) => {
        var srvuuid = await uuidName.toSrvUuid(req.session.conToSrv);
        var inventory = await loadSrvInventory(srvuuid);
        var getinvname = await getItemData(inventory);
        var length = getinvname.inventory.length;

        if(length > 0) {
            req.session.command_log += "#> Installed software:\n";
            for(let i = 0; i < length; i++) {
                req.session.command_log += getinvname.inventory[i].name + "\n";
            }
        } else {
            req.session.command_log += "No software installed on this server!\n";
        }

        resolve();
    });
}

module.exports = serverCmdLs;
