'use strict'

var async = require('async');
/**
 * Function that takes in items as object and returns items with any tickets
 * they have
 * @function
 * @param {object} res - ExpressJS Res Object
 * @param {object} items - Array of Item Objects
 * @param {function} ticketsCallback - Callback Function
 */

var getTickets = function(pgClient, res, itemsForArea, ticketsCallback) {
    // Instantiate Array of ticket objects to be returned
    var getTicketsResponse = [];

    /*
     * Iterate through each item
     * Query PG for resulting tickets
     * Append tickets to Item
     * Return Item when done
     */
    async.eachSeries(itemsForArea, function(item, item_cb) {
        // Create PG Query Statement
        var pgAreaItemsQuery = "SELECT t.* FROM unique_items i LEFT JOIN tickets t ON t.fuid = i.id WHERE i.id='" + item.id + "'";
        // Query PG for tickets
        var getTickets = pgClient.query(pgAreaItemsQuery, function(err, itemTickets){
            if(err) {
                res.send({error: 1, errorMsg: 'Error Receiving Items based on Area'})
                return console.error('Error Receiving Item Tickets', err);
            } else {
                // Push Row information into Ticket
                var ticket = itemTickets.rows;
                
                // Check to make sure there is a row and that it's not null
                if(itemTickets.rowCount != 0 && itemTickets.rows[0].id != null) {
                    // Push Ticket into item.tickets
                    item.tickets = ticket;
                } else {
                    item.tickets = [];
                }
                // Push Item into Tickets Response
                getTicketsResponse.push(item);
                
                
            }
        });
        getTickets.on('end', function(results){
            item_cb();
        });
    }, function(){
        if(typeof ticketsCallback === "function" && itemsForArea.length === getTicketsResponse.length) {
            ticketsCallback(getTicketsResponse);
        }
    });
}

module.exports = {
    getTickets: getTickets
}
