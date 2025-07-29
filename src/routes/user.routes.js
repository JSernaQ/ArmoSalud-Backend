const { Router } = require('express');
const router = Router();
const {
  registerNewUser,
  login
} = require('../controllers/user.controllers.js');
const { verifyToken } = require('../middlewares/verifyJWT.js');
const { isAdmin } = require('../middlewares/isAdmin.js');


router.post('/register', verifyToken, isAdmin, registerNewUser);
router.post('/login', login);

module.exports = router;