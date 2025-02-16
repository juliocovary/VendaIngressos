const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Purchase = require('../models/Purchase');
const authMiddleware = require('../middlewares/authMiddleware');

// Página de Login
router.get('/login', (req, res) => {
    res.render('login');
});

// Página de compra de ingressos
router.get('/buy', authMiddleware, async (req, res) => {
    try {
        const tickets = await Ticket.find();
        console.log(tickets);
        res.render('buy', { tickets });
    } catch (error) {
        res.status(500).send('Erro ao carregar ingressos.');
    }
});

// Página de histórico de compras
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const purchases = await Purchase.find({ user: userId }).populate('tickets.ticket');
        res.render('history', { purchases });
    } catch (error) {
        res.status(500).send('Erro ao carregar histórico.');
    }
});

module.exports = router;
