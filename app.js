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

const routekey = util.genkey(),
		link = `csliathz.xyz:${e.PORT}/${routekey}`;

app.use(`/${routekey}`, express.static(path.join(__dirname, 'public')));

console.info('routekey', routekey)
console.info('link', link)

module.exports = app;
