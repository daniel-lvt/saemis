const express = require('express');
const router = express.Router();

// manuel.gonzales
// usuario + code --> manuel.gonzales2016

router.get('/', (req, res) => {
    res.render('admin/admin')
});


module.exports = router;