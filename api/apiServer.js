var express = require('express');
    require('express-namespace');
var areas = require('./libs/areas'),
    doorAccess = require('./libs/doorAccess'),
    members = require('./libs/members'),
    cards = require('./libs/cards')
    config = require('./libs/config'),
		response = require('./libs/response'),
		employees = require('./libs/employees')


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};

var setResponseOptions = function(req, res, next) {
	var responseOptions = {};
	responseOptions.callback = req.query.callback || '';
	responseOptions.format = req.query.format || null;
	res.responseOptions = responseOptions;
	next();
}
var app = express();
app.set('domain', config.app.domain);
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(allowCrossDomain);
app.use(setResponseOptions)
app.namespace(config.app.namespace, function(){
    app.get('/dooraccess', doorAccess.getAll);
    app.get('/dooraccess/:id', doorAccess.getByMemberId);
    app.get('/areas', areas.findAll);
    app.get('/areas/:id', areas.getById);
    app.get('/members', members.getAll);
    app.get('/members/:memberid', members.getById);
    app.post('/members/add/', members.add);
    app.post('/members/update/', members.update);
		app.del('/members/remove/:memberid', members.remove)
    app.post('/members/toggleEnabled/:memberid', members.toggleEnabled);
    app.post('/members/cards/add', cards.addCard);
    app.del('/members/cards/remove/:id', cards.removeCard);
		app.get('/employees', employees.getAll)

});
app.listen(config.app.port);
console.log('Listening on port ' + config.app.port);
