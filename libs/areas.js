var pg = require('pg'),
    async = require('async'),
    config = require('./config.js'),
    uniqueItems = require('./unique_items');

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
        uniqueItems.getUniqueItems(pgClient, res, allAreas, function(fullAreaInfo) {
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
            uniqueItems.getUniqueItems(pgClient, res, allAreas, function(fullAreaInfo) {
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
