var express = require('express');
var logger  = require('../');

var app = express();

app.use(logger());

app.listen(3300);
