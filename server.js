require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const exphbs = require('express-handlebars');

const PORT = process.env.PORT || 3000;

connectDB();

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
