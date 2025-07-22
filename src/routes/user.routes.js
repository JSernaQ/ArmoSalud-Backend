const { Router } = require('express');
const router = Router();
const {
  registerNewUser,
  login
} = require('../controllers/user.controllers.js');
const { verifyToken } = require('../middlewares/verifyJWT.js');
const { isAdmin } = require('../middlewares/isAdmin.js');


router.get('/', verifyToken, (req, res) => {
  return res.status(200).json({
    ok: true,
  })
})

router.post('/register', isAdmin, registerNewUser);
router.post('/login', login);

module.exports = router;