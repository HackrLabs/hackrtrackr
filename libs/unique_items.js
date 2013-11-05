'use strict';

var async = require('async'),
    itemTickets = require('./tickets');

/**
 * Function For Getting Unique Items in an Area
 * @function
 * @param {object} res - Response Object from ExpressJS
 * @param {object} areas - Areas object for getting Items
 * @param {function} callback - Callback Function
 */
var getUniqueItems = function(pgClient, res, areas, uniqueItemsCallback) {
    var areasWithItemsAndTickets = [];
    async.eachSeries(areas, function(area, areas_callback){
        var pgAreaItemsQuery = "SELECT i.* FROM areas a LEFT JOIN unique_items i ON a.id = i.area_id WHERE a.id='" + area.id + "'";
        var unique_items = pgClient.query(pgAreaItemsQuery, function(err, itemsForArea){
            if(err) {
                res.send({error: 1, errorMsg: 'Error Receiving Items based on Area'})
                return console.error('Error Receiving Items based on Area', err);
            } else {
                var itemsForArea = itemsForArea.rows;
                itemTickets.getTickets(pgClient, res, itemsForArea, function(getTicketsResponse) {
                    area.items = getTicketsResponse;
                    areasWithItemsAndTickets.push(area);
                    areas_callback();
                });
            }
        });
        unique_items.on('end', function(results){
            if(areas.length === areasWithItemsAndTickets.length) {
                areas_callback();
            }
        });
    }, function(){
        if(typeof uniqueItemsCallback === "function" && areas.length === areasWithItemsAndTickets.length) {
            uniqueItemsCallback(areasWithItemsAndTickets);
        }
    });
};

module.exports = {
    getUniqueItems: getUniqueItems
};
