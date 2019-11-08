const express = require('express');
const router = express.Router();
const communicatorController = require('../controllers/communicator');
const isAuth = require('../middleware/isAuth');

/*
██████╗  ██████╗ ██╗   ██╗████████╗███████╗███████╗
██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔════╝
██████╔╝██║   ██║██║   ██║   ██║   █████╗  ███████╗
██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ╚════██║
██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗███████║
╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚══════╝
*/                                                   

router.get('/room/:roomID', isAuth, communicatorController.getRooms);

router.get('/contact', isAuth, communicatorController.getContacts);

router.post('/contact', isAuth, communicatorController.createContact);

router.post('/message', isAuth, communicatorController.createMessage);

module.exports = router;