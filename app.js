const express = require('express'),
		path = require('path'),
			cookieParser = require('cookie-parser'),
				logger = require('morgan');

const e = process.env;

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(`/${e.ROUTE_KEY}`, express.static(path.join(__dirname, 'public')));

module.exports = app;
