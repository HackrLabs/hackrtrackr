'use strict';

var async = require('async');
/**
 * Function For Getting Unique Items in an Area
 * @function
 * @param {object} res - Response Object from ExpressJS
 * @param {object} items - Areas object for getting Items
 * @param {function} callback - Callback Function
 */
var getCaveats = function(pgClient, res, items, caveatsCallback) {
    var itemWithCaveats = [];
    async.eachSeries(items, function(item, items_callback){
        var pgItemCaveatsQuery = "SELECT c.* FROM items i LEFT JOIN caveats c ON i.id = c.item_id WHERE i.id='" + item.id + "'";
        var caveats = pgClient.query(pgItemCaveatsQuery, function(err, caveatsForItem){
            if(err) {
                res.send({error: 1, errorMsg: 'Error Receiving Area Caveats'})
                return console.error('Error Receiving Item Caveates', err);
            } else {
                var itemCaveats = caveatsForItem.rows;
                 // Check to make sure there is a row and that it's not null
                if(caveatsForItem.rowCount != 0 && caveatsForItem.rows[0].id != null) {
                    // Push Ticket into item.tickets
                    item.caveats = itemCaveats;
                } else {
                    item.caveats = [];
                }
                itemWithCaveats.push(item);
                items_callback();
            }
        });
    }, function(){
        if(typeof caveatsCallback === "function" && items.length === itemWithCaveats.length) {
            caveatsCallback(itemWithCaveats);
        }
    });
};

module.exports = {
    getCaveats: getCaveats
};
