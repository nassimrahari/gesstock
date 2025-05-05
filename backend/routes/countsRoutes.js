
const express = require('express');

const router = express.Router();
const controller = require('../controllers/countsController');

// Routes
router.get('/', controller.getCounts.bind(controller));

module.exports = router;
        