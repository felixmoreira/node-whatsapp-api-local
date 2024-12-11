const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const express = require('express');

// Criando uma instância do Express
const app = express();

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para interpretar dados JSON no corpo da requisição
app.use(express.json());

// Diretórios necessários
const dataDir = path.join(__dirname, 'dados');
const mediaDir = path.join(__dirname, 'arquivos');
const errorDir = path.join(__dirname, 'erros');

[dataDir, mediaDir, errorDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
});

// Função para log de erros
function logError(error) {
    const errorFilePath = path.join(errorDir, 'erros.log');
    const errorMessage = `[${new Date().toISOString()}] - ${error.stack || error}\n`;
    fs.appendFileSync(errorFilePath, errorMessage);
}

// Função para salvar mensagens de texto em arquivo JSON
function saveTextMessage(sender, type, body, timestamp) {
    const fileName = `${sender}.json`;
    const filePath = path.join(dataDir, fileName);
    const messageData = {type, body, timestamp};

    let existingData = [];
    if (fs.existsSync(filePath)) {
        existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    existingData.push(messageData);
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf-8');
    console.log(`Mensagem de texto salva: ${filePath}`);
}

// Função para salvar mídia (imagens, documentos e áudios)
function saveMedia(media, sender, timestamp) {
    const extension = media.mimetype.split('/')[1];
    const fileName = `${sender}_${timestamp}.${extension}`;
    const filePath = path.join(mediaDir, fileName);
    fs.writeFileSync(filePath, media.data, 'base64');
    console.log(`Mídia salva: ${filePath}`);
}

// Obter timestamp no formato UNIX
function getFormattedTimestamp() {
    return Math.floor(Date.now() / 1000);
}

// Configura o cliente WhatsApp
const client = new Client({
    authStrategy: new LocalAuth()
});

// Evento de conexão
client.on('ready', () => {
    console.log('Conectado!');
});

// Evento para exibir o QR Code
client.on('qr', qr => {
    if (!client.authStrategy.isAuthenticated) {
        qrcode.generate(qr, { small: true });
    }
});

// Evento para processar mensagens recebidas
client.on('message', async message => {
    const sender = message.from.split('@')[0];
    const timestamp = getFormattedTimestamp();

    if (message.hasMedia) {
        const media = await message.downloadMedia();
        if (media) {
            saveMedia(media, sender, timestamp);
        }
    } else {
        saveTextMessage(sender, 'received', message.body, timestamp);
    }
});

// Evento para processar mensagens enviadas
client.on('message_create', async message => {
    if (message.fromMe) {
        const sender = message.to.split('@')[0];
        const timestamp = getFormattedTimestamp();

        if (message.hasMedia) {
            const media = await message.downloadMedia();
            if (media) {
                saveMedia(media, sender, timestamp);
            }
        } else {
            saveTextMessage(sender, 'sent', message.body, timestamp);
        }
    }
});

// Captura e loga erros não tratados
process.on('unhandledRejection', error => {
    console.error('Unhandled Rejection:', error);
    logError(error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
    logError(error);
});

// Inicializa o cliente
client.initialize();

// Rota para enviar mensagens via API
app.post('/send-message', (req, res) => {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
        return res.status(400).json({ error: 'Phone number and message are required' });
    }

    const formattedNumber = `${phoneNumber}@c.us`;

    client.sendMessage(formattedNumber, message)
        .then(response => {
            res.json({ success: true, message: 'Message sent successfully', response });
        })
        .catch(error => {
            logError(error);
            res.status(500).json({ error: 'Failed to send message', details: error.message });
        });
});

// Rota para redirecionar para o Google
app.get('/', (req, res) => {
    res.redirect('https://github.com/felixmoreira/projeto-whatsapp-api');
});

// Inicia o servidor da API na porta 3000
app.listen(3000, () => { 
    console.log('API rodando em http://localhost:3000/send-message'); 
});
