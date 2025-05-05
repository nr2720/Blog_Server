var express = require('express');
var router = express.Router();
const passport = require('passport');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' })

//controller
const usersController = require('../controllers/usersController');


/* INDEX */
router.get('/', usersController.indexGet);


//users/register
router.get('/register', usersController.registerGet);
router.post('/register', usersController.registerPost);


//users/login
router.get('/login', usersController.loginGet);
router.post('/login', usersController.loginPost);


//users/protected
router.get('/protected', passport.authenticate('jwt', {session: false}), usersController.protectedGet);



//users/pdp
router.post('/pdp',passport.authenticate('jwt', {session: false}), upload.single('file'), usersController.pdpPost);

module.exports = router;
