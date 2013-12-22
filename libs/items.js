'use strict';
var bookshelf = require('./dbconn').DATABASE,
    caveats = require('./caveats'),
    tickets = require('./tickets');

var Item = bookshelf.Model.extend(
    { tableName: 'items'
    , tickets: function(){
            return this.hasMany(tickets.Ticket)
        }
    , caveats: function() {
            return this.hasMany(caveats.Caveat)
        }
    }
); 

module.exports = {
    Item: Item
};
