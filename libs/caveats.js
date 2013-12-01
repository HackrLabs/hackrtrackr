'use strict';

//var async = require('async');
var orm = require('orm'),
    config = require('./config');

// Create PG Connection String and Client
var pgConn = "postgres://" + config.postgres.user + ":" + config.postgres.password + "@" + config.postgres.host + "/" + config.postgres.database;
//var pgClient = new pg.Client(pgConn);
var db = orm.connect(pgConn);

db.on("connect", function(err){
    if(err) {
        console.log("Could not connect to relational database");
        return;
    }
});

var Caveats = db.define("caveats",
    { id: "number"
    , item_id: "number"
    , user_id: "number"
    , body: "text"
    , created_at: "date"
    , updated_at: "date"
    }    
);

/**
 * Function For Getting Unique Items in an Area
 * @function
 * @param {object} res - Response Object from ExpressJS
 * @param {object} items - Areas object for getting Items
 * @param {function} callback - Callback Function
 */
/*var getCaveats = function(pgClient, res, items, caveatsCallback) {
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
*/
module.exports = {
    caveats: Caveats
};
