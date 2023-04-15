const express = require('express'),
		path = require('path'),
			cookieParser = require('cookie-parser'),
				logger = require('morgan'),
					e = process.env;

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const routekey = util.genkey();

app.use(`/${routekey}`, express.static(path.join(__dirname, 'public')));

console.info('routekey', routekey)

module.exports = app;
