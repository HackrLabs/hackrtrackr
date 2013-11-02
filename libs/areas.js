var pg = require('pg'),
    async = require('async'),
    config = require('./config.js');

var pgConn = "postgres://" + config.postgres.user + ":" + config.postgres.password + "@" + config.postgres.host + "/" + config.postgres.database;
var pgClient = new pg.Client(pgConn);


/* Connect to Postgres Database */
pgClient.connect(function(err) {
    if(err) {
        console.log('Could not connect to postgres', err); 
    } else {
        console.log('Connect to Hacker Tracker');
    }
});

/**
 * Function For Getting Unique Items in an Area
 * @function
 * @param {object} res - Response Object from ExpressJS
 * @param {object} areas - Areas object for getting Items
 * @param {function} callback - Callback Function
 */
function getUniqueItems(res, areas, uniqueItemsCallback) {
    var areasWithItemsAndTickets = [];
    async.eachSeries(areas, function(area, areas_callback){
        var pgAreaItemsQuery = "SELECT i.* FROM areas a LEFT JOIN unique_items i ON a.id = i.area_id WHERE a.id='" + area.id + "'";
        var unique_items = pgClient.query(pgAreaItemsQuery, function(err, itemsForArea){
            if(err) {
                res.send({error: 1, errorMsg: 'Error Receiving Items based on Area'})
                return console.error('Error Receiving Items based on Area', err);
            } else {
                var itemsForArea = itemsForArea.rows;
                getTickets(res, itemsForArea, function(getTicketsResponse) {
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
}

/**
 * Function that takes in items as object and returns items with any tickets
 * they have
 * @function
 * @param {object} res - ExpressJS Res Object
 * @param {object} items - Array of Item Objects
 * @param {function} ticketsCallback - Callback Function
 */
function getTickets(res, itemsForArea, ticketsCallback) {
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

exports.findAll = function(req, res) {
    var pgQueryFindAll = "SELECT * FROM areas";
    pgClient.query(pgQueryFindAll, function(err, areas) {
        if(err) {
            res.send({error: 1, errMsg: 'Error Querying Hacker Tracker ' + err})
            return console.error('Error Querying Hacker Tracker', err);
        }

        var allAreas = areas.rows;
        var callback = req.query.callback
        var format = req.query.format;
        getUniqueItems(res, allAreas, function(fullAreaInfo) {
            var areas_with_items = {};
            areas_with_items.areas = fullAreaInfo;
            if(typeof format != "undefined" || format != null) {
                res.send(areas_with_items);
            } else {
                res.send(callback + '(' + JSON.stringify(areas_with_items) + ')');
            }
        });
    });
}
exports.getById = function(req, res) {
    var id = req.route.params.id;
    var pgQueryFindByName = "SELECT * from areas WHERE id='"  + id + "'";
    pgClient.query(pgQueryFindByName, function(err, areas){
        if(err) {
            res.send({error: 1, errMsg: 'Error Querying Hacker Tracker ' + err})
            return console.error('Error Querying Hacker Tracker', err);
        } else {
            var allAreas = areas.rows;
            var callback = req.query.callback;
            var format = req.query.format;
            getUniqueItems(res, allAreas, function(fullAreaInfo) {
                var areas_with_items = {};
                areas_with_items.areas = fullAreaInfo;
                if(typeof format != "undefined" || format != null) {
                    res.send(areas_with_items);
                } else {
                    res.send(callback + '(' + JSON.stringify(areas_with_items) + ')');
                }
            });
        }
    });
}
