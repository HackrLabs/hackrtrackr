var pg = require('pg'),
    async = require('async'),
    config = require('./config.js');

var pgConn = "postgres://" + config.postgres.user + ":" + config.postgres.password + "@" + config.postgres.host + "/" + config.postgres.database;
var pgClient = new pg.Client(pgConn);


// Connect to Postgres Database
pgClient.connect(function(err) {
    if(err) {
        console.log('Could not connect to postgres', err); 
    } else {
        console.log('Connect to Hacker Tracker');
    }
});

function getUniqueItems(res, results, callback) {
    var items = [];
    async.eachSeries(results, function(area, cb){
        var pgAreaItemsQuery = "SELECT i.* FROM areas a LEFT JOIN unique_items i ON a.id = i.area_id WHERE a.id='" + area.id + "'";
        var unique_items = pgClient.query(pgAreaItemsQuery, function(err, result){
            if(err) {
                res.send({error: 1, errorMsg: 'Error Receiving Items based on Area'})
                return console.error('Error Receiving Items based on Area', err);
            } else {
                var item = result.rows;
                getTickets(res, item, function(response) {
                    area.items = item;
                    items.push(area);
                });
            }
        });
        unique_items.on('end', function(results){
            cb();
        });
    }, function(){
        if(typeof callback === "function") {
            callback(items);
        }
    });
}
function getTickets(res, results, callback) {
    var tickets = [];
    async.eachSeries(results, function(item, cb) {
        var pgAreaItemsQuery = "SELECT t.* FROM unique_items i LEFT JOIN tickets t ON t.fuid = i.id WHERE i.id='" + item.id + "'";
        var getTickets = pgClient.query(pgAreaItemsQuery, function(err, result){
            if(err) {
                res.send({error: 1, errorMsg: 'Error Receiving Items based on Area'})
                return console.error('Error Receiving Item Tickets', err);
            } else {
                var ticket = result.rows;
                if(result.rowCount != 0 || result.rows[0].id != null) {
                    item.tickets = ticket;
                    tickets.push(item);
                }
            }
        });
        getTickets.on('end', function(results){
            cb();
        });
    }, function(){
        if(typeof callback === "function") {
            callback(tickets);
        }
    });
}

exports.findAll = function(req, res) {
    var pgQueryFindAll = "SELECT * FROM areas";
    pgClient.query(pgQueryFindAll, function(err, result) {
        if(err) {
            res.send({error: 1, errMsg: 'Error Querying Hacker Tracker ' + err})
            return console.error('Error Querying Hacker Tracker', err);
        }

        var results = result.rows;
        var callback = req.query.callback
        var format = req.query.format;
        getUniqueItems(res, results, function(response) {
            var areas_with_items = {};
            areas_with_items.areas = response;
            if(typeof format != "undefined" || format != null) {
                res.send(areas_with_items);
            } else {
                res.send(callback + '(' + JSON.stringify(areas_with_items) + ')');
            }
        });
    });
}

exports.getByName = function(req, res) {
    var name = req.route.params.name;
    var pgQueryFindByName = "SELECT * from areas WHERE name='"  + name + "'";
    pgClient.query(pgQueryFindByName, function(err, result){
        if(err) {
            res.send({error: 1, errMsg: 'Error Querying Hacker Tracker ' + err})
            return console.error('Error Querying Hacker Tracker', err);
        } else {
            var results = result.rows;
            var callback = req.query.callback;
            var format = req.query.format;
            getUniqueItems(results, function(response) {
                var areas_with_items = {};
                areas_with_items.areas = response;
                if(typeof format != "undefined" || format != null) {
                    res.send(JSON.stringify(areas_with_items));
                } else {
                    res.send(callback + '(' + JSON.stringify(areas_with_items) + ')');
                }
            });
        }
    });
}
exports.getById = function(req, res) {
    var id = req.route.params.id;
    var pgQueryFindByName = "SELECT * from areas WHERE id='"  + id + "'";
    pgClient.query(pgQueryFindByName, function(err, result){
        if(err) {
            res.send({error: 1, errMsg: 'Error Querying Hacker Tracker ' + err})
            return console.error('Error Querying Hacker Tracker', err);
        } else {
            var results = result.rows;
            var callback = req.query.callback;
            var format = req.query.format;
            getUniqueItems(results, function(response) {
                var areas_with_items = {};
                areas_with_items.areas = response;
                if(typeof format != "undefined" || format != null) {
                    res.send(JSON.stringify(areas_with_items));
                } else {
                    res.send(callback + '(' + JSON.stringify(areas_with_items) + ')');
                }
            });
        }
    });
}
