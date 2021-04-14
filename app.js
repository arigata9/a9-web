const express = require('express');
const config = require('./config.json');
const app = express();

// Routes
const rootRoute = require('./routes/root');

//Middlewares
app.use(express.static("static"));
app.use('/', rootRoute);

//starting server
app.listen(config.bindport, config.bindip, () => {
    console.log(`Listening to ${config.bindip}:${config.bindport} !`);
});
