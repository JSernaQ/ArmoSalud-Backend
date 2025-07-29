const { Router } = require('express');
const router = Router();

const { 
    generateDailyReport,
    getDailyReport
} = require('../controllers/reports.controller');
const { verifyToken } = require('../middlewares/verifyJWT');
const { isAdmin } = require('../middlewares/isAdmin');

router.get('/generate-daily-report', verifyToken, isAdmin, generateDailyReport);
router.get('/daily-report', verifyToken, isAdmin, getDailyReport);

module.exports = router;