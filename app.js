const express = require('express');
const config = require('./config.json');
const https = require('https');
const fs = require('fs');
const app = express();

// Routes
const rootRoute = require('./routes/root');

//Middlewares
app.use(express.static("static"));
app.use('/', rootRoute);

//starting server
https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./fullchain.pem')
}, app).listen(config.bindport);
console.log('Listening on Port xxxx');
/*app.listen(config.bindport, config.bindip, () => {
    console.log(`Listening to ${config.bindip}:${config.bindport} !`);
});*/
