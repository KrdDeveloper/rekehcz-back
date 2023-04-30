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

// global state
state.routekey = util.genkey();

if (e.MODE === 'development') {
	link = `http://localhost:${e.PORT}/${state.routekey}`;
}

if (e.MODE === 'test') {
	link = `https://rekehcz-test.herokuapp.com/${state.routekey}`;
}

if (e.MODE === 'live') {
	link = `https://rekehcz-live-${e.BUILD}.herokuapp.com/${state.routekey}`;
}

const qrlink = QRCode.toString(link, { type:'terminal' }, (err, url) => { url })

app.use(`/${state.routekey}`, express.static(path.join(__dirname, 'public')));

console.info('qrlink', '\n', qrlink)
console.info('state.routekey', state.routekey)
console.info('link', link)

module.exports = app;
