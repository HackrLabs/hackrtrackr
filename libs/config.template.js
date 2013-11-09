'use strict';

var config = {};
config.postgres = {};
config.redis = {};

config.postgres.user = 'user';
config.postgres.password = 'password';
config.postgres.host = 'localhost';
config.postgres.database = 'database';

config.redis.expire = 120;

module.exports = config;

