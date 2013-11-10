'use strict';

var async = require('async');
/**
 * Function For Getting Unique Items in an Area
 * @function
 * @param {object} res - Response Object from ExpressJS
 * @param {object} areas - Areas object for getting Items
 * @param {function} callback - Callback Function
 */
var getCaveats = function(pgClient, res, areas, caveatsCallback) {
    var areaWithCaveats = [];
    async.eachSeries(areas, function(area, areas_callback){
        var pgAreaCaveatsQuery = "SELECT c.* FROM areas a LEFT JOIN caveats c ON a.id = c.fuid WHERE a.id='" + area.id + "'";
        var caveats = pgClient.query(pgAreaCaveatsQuery, function(err, caveatsForArea){
            if(err) {
                res.send({error: 1, errorMsg: 'Error Receiving Area Caveats'})
                return console.error('Error Receiving Area Caveates', err);
            } else {
                var areaCaveats = caveatsForArea.rows;
                 // Check to make sure there is a row and that it's not null
                if(caveatsForArea.rowCount != 0 && caveatsForArea.rows[0].id != null) {
                    // Push Ticket into item.tickets
                    area.caveats = areaCaveats;
                } else {
                    area.caveats = [];
                }
                areaWithCaveats.push(area);
                areas_callback();
            }
        });
    }, function(){
        if(typeof caveatsCallback === "function" && areas.length === areaWithCaveats.length) {
            caveatsCallback(areaWithCaveats);
        }
    });
};

module.exports = {
    getCaveats: getCaveats
};
