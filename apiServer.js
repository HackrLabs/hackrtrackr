var express = require('express'),
    dooraccess = require('./libs/dooraccess'),
    areas = require('./libs/areas'),
    members = require('./libs/members');

var app = express();
app.set('domain', 'api.hackertracker.dev');

app.get('/', function(req, res) {
    res.send('This page is not active');
});

app.get('/dooraccess', dooraccess.getAll);
app.get('/dooraccess/:id', dooraccess.getByMemberId);
app.get('/areas', areas.findAll);
app.get('/areas/:id', areas.getById);
app.get('/members', members.getAll);
app.get('/members/:id', members.getById);

app.listen(1234);
console.log('Listening on port 1234');
