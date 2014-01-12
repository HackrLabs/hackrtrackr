'use strict';

var config = require('./config'),
    bookshelf = require('bookshelf')

bookshelf.DATABASE = bookshelf.initialize(
    { client: config.database.client || ''
    , connection: config.database.connection || {}
    }
);


module.exports = bookshelf;
