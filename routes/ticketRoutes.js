const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/', authMiddleware, adminMiddleware, ticketController.createTicket);
router.get('/', authMiddleware, ticketController.getTickets);
router.put('/:id', authMiddleware, adminMiddleware, ticketController.updateTicket);
router.delete('/:id', authMiddleware, adminMiddleware, ticketController.deleteTicket);

module.exports = router;
