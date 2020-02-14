var express = require('express');
var router = express.Router();
var Email = require('../controllers/emailController');

/* GET users listing. */
router.get('/', Email.email);

module.exports = router;
