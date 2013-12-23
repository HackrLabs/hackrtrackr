'use strict';

var bookshelf = require('./dbconn').DATABASE;

var Card = bookshelf.Model.extend(
    { tableName: 'cards'
    }    
);

var CardCollection = bookshelf.Model.extend(
    { model: Card
    }
);

module.exports = 
{ Card: Card
};
