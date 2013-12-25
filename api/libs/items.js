'use strict';
var bookshelf = require('./dbconn').DATABASE,
    caveats = require('./caveats'),
    tickets = require('./tickets'),
    itemContacts = require('./itemContacts');

var Item = bookshelf.Model.extend(
    { tableName: 'items'
    , tickets: function(){
            return this.hasMany(tickets.Ticket)
        }
    , caveats: function() {
            return this.hasMany(caveats.Caveat)
        }
    , contacts: function() {
            return this.hasMany(itemContacts.ItemContact)
        }
    }
); 

module.exports = {
    Item: Item
};
