const router = require('express').Router();

router.get('/', (req, res) => {
    res.sendFile('/static/index.html');
    res.sendStatus(200);
});

module.exports = router;