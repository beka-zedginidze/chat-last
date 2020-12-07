const express = require('express');
const router = express.Router();
router.get('/welcome', (req, res) => res.render('welcome'));
router.get('/index', (req, res) => res.render('index'));

module.exports = router;