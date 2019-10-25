const express = require('express');
const router = express.Router();
const socketController = require('../controllers/socket');

router.get('/notifications', socketController.getNotifications);

module.exports = router;