const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatter');

router.get('/room', chatController.getRooms);

module.exports = router;