const express = require('express');
const router = express.Router();
const pool = require('../db/database');

router.get('/', (req, res) => {
    res.render('./user/user');
});

module.exports = router;