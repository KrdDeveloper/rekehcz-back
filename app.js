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

var link;

const routekey = util.genkey();

if (e.MODE === 'test') {
	link = `http://localhost:${e.PORT}/${routekey}`;
}

if (e.MODE === 'development') {
	link = `https://rekehcz.herokuapp.com/${routekey}`;
}

if (e.MODE === 'live') {
	link = `https://rekehcz-${e.BUILD}.herokuapp.com/${routekey}`;
}

const qrlink = QRCode.toString(link, { type:'terminal' }, (err, url) => { url })

app.use(`/${routekey}`, express.static(path.join(__dirname, 'public')));

console.info('qrlink', '\n', qrlink)
console.info('routekey', routekey)
console.info('link', link)

module.exports = app;
