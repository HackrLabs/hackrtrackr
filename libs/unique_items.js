'use strict';

var async = require('async'),
    itemTickets = require('./tickets'),
    caveats = require('./caveats');

/**
 * Function For Getting Unique Items in an Area
 * @function
 * @param {object} res - Response Object from ExpressJS
 * @param {object} areas - Areas object for getting Items
 * @param {function} callback - Callback Function
 */
var getUniqueItems = function(pgClient, res, areas, uniqueItemsCallback) {
    var areasWithItemsTicketsAndCaveats = [];
    async.eachSeries(areas, function(area, areas_callback){
        var pgAreaItemsQuery = "SELECT i.* FROM areas a LEFT JOIN unique_items i ON a.id = i.area_id WHERE a.id='" + area.id + "'";
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

module.exports = {
    getUniqueItems: getUniqueItems
};
