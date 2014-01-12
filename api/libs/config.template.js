'use strict';

/*
 * For database. Bookshelf JS is used
 * Please check booshelfJS documentation for other database
 * connection information
 */

var config =
{ app:
    { domain: ''
    , port: 1111
    , namespace: '/api'
    , stockResponse: 'json'
    }
, database:
		{ client: 'postgres'
		, connection:
			{ user: 'hackertracker'
			, password: 'hackertracker'
			, host: 'localhost'
			, database: 'hackertracker'
			}
		}
, redis:
    { expire: 120
    }
};

module.exports = config;

