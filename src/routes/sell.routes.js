const { Router } = require('express');
const router = Router();

router.get('/:user', (req, res) => {
  res.send(`user ${req.params.user}`)
})

module.exports = router;