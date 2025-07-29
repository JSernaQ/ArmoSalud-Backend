const { Router } = require('express');
const router = Router();

const { 
    generateDailyReport,
    getDailyReport
} = require('../controllers/reports.controller');

router.get('/', (req, res) => {
    return res.status(200).json({
        ok: true,
        msg: 'Todo bien!'
    })
});

router.get('/generate-daily-report', generateDailyReport);
router.get('/daily-report', getDailyReport);

module.exports = router;