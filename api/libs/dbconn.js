'use strict';

var config = require('./config'),
    bookshelf = require('bookshelf');

bookshelf.DATABASE = bookshelf.initialize(
    { client: 'postgres'
    , connection:
        { host: config.postgres.host
        , user: config.postgres.user
        , password: config.postgres.password
        , database: config.postgres.database
        }
    }    
);

module.exports = bookshelf;
