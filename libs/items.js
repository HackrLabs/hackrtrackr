'use strict';

var orm = require('orm'),
    tickets = require('./tickets'),
    caveats = require('./caveats'),
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
var Item = db.define("items",
    { id: { type: "number" }
    , loggable: { type: "boolean" }
    , ticketable: { type: "boolean" }
    , name: { type: "text" }
    , created_at: { type: "date" }
    , updated_at: { type: "date" }
    , photo_file_name: { type: "text" }
    , photo_content_type: { type: "text" }
    , photo_file_size: { type: "text" }
    , photo_updated_at: { type: "date" }
    , fuid: { type: "number" }
    , area_id: { type: "number" }
    }
);

Item.hasMany("tickets", tickets.tickets);
Item.hasMany("caveats", caveats.caveats);

/*
var async = require('async'),
    itemTickets = require('./tickets'),
    caveats = require('./caveats');
*/
/**
 * Function For Getting Unique Items in an Area
 * @function
 * @param {object} res - Response Object from ExpressJS
 * @param {object} areas - Areas object for getting Items
 * @param {function} callback - Callback Function
 */
/*
var getUniqueItems = function(pgClient, res, areas, uniqueItemsCallback) {
    var areasWithItemsTicketsAndCaveats = [];
    async.eachSeries(areas, function(area, areas_callback){
        var pgAreaItemsQuery = "SELECT i.* FROM areas a LEFT JOIN items i ON a.id = i.area_id WHERE a.id='" + area.id + "'";
        var unique_items = pgClient.query(pgAreaItemsQuery, function(err, itemsForArea){
            if(err) {
                res.send({error: 1, errorMsg: 'Error Receiving Items based on Area'})
                return console.error('Error Receiving Items based on Area', err);
            } else {
                var itemsForArea = itemsForArea.rows;
                itemTickets.getTickets(pgClient, res, itemsForArea, function(getTicketsResponse) {
                    caveats.getCaveats(pgClient, res, getTicketsResponse, function(itemsWithTicketsAndCaveats){
                        area.items = itemsWithTicketsAndCaveats;
                        areasWithItemsTicketsAndCaveats.push(area);
                        areas_callback();
                    })
                });
            }
        });
        unique_items.on('end', function(results){
            if(areas.length === areasWithItemsTicketsAndCaveats.length) {
                areas_callback();
            }
        });
    }, function(){
        if(typeof uniqueItemsCallback === "function" && areas.length === areasWithItemsTicketsAndCaveats.length) {
            uniqueItemsCallback(areasWithItemsTicketsAndCaveats);
        }
    });
};
*/
module.exports = {
    item: Item
};
