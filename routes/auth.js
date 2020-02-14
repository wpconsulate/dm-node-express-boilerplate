var express = require("express");
var router = express.Router();
var auth = require('../controllers/authController');
var validateUser = require('../middleware/verify.user');
var validateAuth = require('../middleware/verify.auth');


//------------------------------------------------------------------------
// API STARTS HERE

router.post( 
			"/login",
			validateUser.validateVals,
			auth.login
		);


router.post( 
			"/register",
			validateUser.validateUserdata,
			auth.register
		);


router.patch( 
			"/reset/:email",
			validateUser.forgotPass,
			auth.forgot
		);

router.put(
			"/update/:email",
			validateUser.validateUpdatePassData,
			auth.updatePass
		);


router.post( 
			"/refresh",
			validateAuth.validJWTNeeded,
			validateAuth.verifyRefreshBodyField,
			validateAuth.validRefreshNeeded,
			auth.register
		);



module.exports = router;