const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Seite noch im Aufbau. Come back later.');
    res.sendStatus(200);
});

module.exports = router;