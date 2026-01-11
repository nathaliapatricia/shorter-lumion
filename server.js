const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const links = {};

app.use(express.json());
app.use(cors());

// SOLUÇÃO: Usar __dirname + "/" para o Vercel
app.use(express.static(__dirname + "/"));
app.use('/assets', express.static(__dirname + "/assets/"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const generateCode = len => {
    let code = ''
    do {
        code += (Math.random().toString(36).substring(2))
    } while (code.length < len);
    return code.substring(0, len);
};

app.post('/shorten', (req, res) => {
    const url = req.body.url;
    const customCode = req.body.customCode;
    const code = (customCode && customCode.trim() !== '') ? customCode : generateCode(6);

    if (links[code]) {
        return res.status(400).json({ error: 'Esse código já está em uso! Escolha outro.' });
    }

    links[code] = url;
    res.json({ shortCode: code, originalUrl: url});
});

app.get('/:shortCode', (req, res) => { 
    const shortCode = req.params.shortCode;

    // Ignora requisições de arquivos
    if (shortCode.includes('.')) {
        return;
    }

    const urlOriginal = links[shortCode];
    if (!urlOriginal) {
        return res.status(404).send('Link não encontrado! 😢');
    }
    res.redirect(urlOriginal); 
});

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Para Vercel
module.exports = app;