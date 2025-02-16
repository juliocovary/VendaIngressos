const Ticket = require('../models/Ticket');

// Criar um novo tipo de ingresso (Apenas Admin)
exports.createTicket = async (req, res) => {
    try {
        const { nome, preco, quantidade } = req.body;

        const novoTicket = new Ticket({ nome, preco, quantidade });
        await novoTicket.save();

        res.status(201).json(novoTicket);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar o ingresso' });
    }
};

// Listar todos os tipos de ingressos
exports.getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar ingressos' });
    }
};

// Atualizar um ingresso (Apenas Admin)
exports.updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, preco, quantidade } = req.body;

        const ticketAtualizado = await Ticket.findByIdAndUpdate(id, { nome, preco, quantidade }, { new: true });

        if (!ticketAtualizado) {
            return res.status(404).json({ error: 'Ingresso não encontrado' });
        }

        res.json(ticketAtualizado);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o ingresso' });
    }
};

// Deletar um ingresso (Apenas Admin)
exports.deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const ticketDeletado = await Ticket.findByIdAndDelete(id);
        if (!ticketDeletado) {
            return res.status(404).json({ error: 'Ingresso não encontrado' });
        }

        res.json({ message: 'Ingresso deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar o ingresso' });
    }
};
