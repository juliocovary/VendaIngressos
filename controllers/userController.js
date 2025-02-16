const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Cadastro de usuário
exports.register = async (req, res) => {
    try {
        const { nome, email, senha, isAdmin } = req.body;

        // Verifica se o email já existe
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'E-mail já cadastrado' });

        // Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        // Cria o usuário
        user = new User({ nome, email, senha: hashedPassword, isAdmin });
        await user.save();

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor' });
    }
};

// Login de usuário
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Verifica se o usuário existe
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

        // Verifica a senha
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) return res.status(400).json({ error: 'Senha inválida' });

        // Gera um token JWT
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor' });
    }
};
