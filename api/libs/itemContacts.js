'use strict';

var bookshelf = require('./dbconn').DATABASE;
if(typeof bookshelf != "undefined"){
var ItemContact = bookshelf.Model.extend(
    { tableName: 'contacts'
    }
);

var ItemContactCollection = bookshelf.Model.extend(
    { model: ItemContact
    }
);
}

module.exports = 
{ ItemContact : ItemContact
, ItemContactCollection: ItemContactCollection
}
