const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const Ticket = require('../models/Ticket');
const authMiddleware = require('../middlewares/authMiddleware');

// Comprar ingressos
router.post('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { tickets } = req.body; // [{ ticketId, quantity }, { ticketId, quantity }]

        if (!tickets || tickets.length === 0) {
            return res.status(400).json({ error: 'Nenhum ingresso foi selecionado para compra.' });
        }

        let totalPrice = 0;
        const ticketUpdates = [];

        for (const item of tickets) {
            const ticket = await Ticket.findById(item.ticketId);
            if (!ticket) {
                return res.status(404).json({ error: `Ingresso com ID ${item.ticketId} não encontrado.` });
            }

            // Verifica se a quantidade solicitada é válida
            if (isNaN(item.quantity) || item.quantity <= 0) {
                return res.status(400).json({ error: `Quantidade inválida para o ingresso ${ticket.nome}.` });
            }

            // Verifica se há estoque suficiente
            if (item.quantity > ticket.quantidade) {
                return res.status(400).json({ error: `Estoque insuficiente para o ingresso ${ticket.nome}. Disponível: ${ticket.quantidade}` });
            }

            // Calcula o preço total
            totalPrice += ticket.preco * item.quantity;

            // Atualiza o estoque
            ticket.quantidade -= item.quantity; // Subtrai a quantidade comprada
            await ticket.save(); // Salva a atualização no banco de dados

            // Adiciona o ingresso à lista de atualizações
            ticketUpdates.push({ ticket, quantity: item.quantity });
        }

        // Cria a compra
        const purchase = new Purchase({
            user: userId,
            tickets: ticketUpdates.map(item => ({
                ticket: item.ticket._id,
                quantity: item.quantity
            })),
            totalPrice
        });

        await purchase.save();

        res.status(201).json({ message: 'Compra realizada com sucesso!', purchase });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao processar a compra' });
    }
});

// Listar histórico de compras do usuário
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const purchases = await Purchase.find({ user: userId }).populate('tickets.ticket');

        if (!purchases.length) {
            return res.status(404).json({ message: 'Nenhuma compra encontrada para este usuário.' });
        }

        res.status(200).json({ purchases });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar o histórico de compras' });
    }
});

// Visualizar detalhes de uma compra específica
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const purchaseId = req.params.id;

        const purchase = await Purchase.findById(purchaseId).populate('tickets.ticket');

        if (!purchase) {
            return res.status(404).json({ message: 'Compra não encontrada.' });
        }

        if (purchase.user.toString() !== userId) {
            return res.status(403).json({ error: 'Acesso negado: você não tem permissão para visualizar esta compra.' });
        }

        res.status(200).json({ purchase });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar os detalhes da compra' });
    }
});

module.exports = router;
