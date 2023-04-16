const express = require('express'),
		path = require('path'),
			cookieParser = require('cookie-parser'),
				logger = require('morgan'),
					QRCode = require('qrcode'),
						e = process.env;

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const routekey = util.genkey(),
		link = `http://csliathz.xyz:${e.PORT}/${routekey}`,
			qrlink = QRCode.toString(link, 
				{ type:'terminal' }, (err, url) => { url })

app.use(`/${routekey}`, express.static(path.join(__dirname, 'public')));

console.info('routekey', routekey)
console.info('link', link)
console.info('qrlink', '\n', qrlink)

module.exports = app;
