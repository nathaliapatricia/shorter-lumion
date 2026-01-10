const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;
const links = {};

app.use(express.json());
app.use(cors());
app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

links["abc123"] = "https://google.com";
links["xyz789"] = "https://youtube.com";


const generateCode = len => {
    let code = ''
    do {
        code += (Math.random().toString(36).substring(2))
    } while (code.length < len);

    return code.substring(0, len);
};

console.log("Codigo gerado: ", generateCode(6));
console.log("Outro codigo: ", generateCode(6));

app.get('/:shortCode', (req,res) => { 
    const shortCode = req.params.shortCode;
    const urlOriginal = links[shortCode];
    if (!urlOriginal) {
        return res.status(404).send('Link não encontrado! 😢');
    }
    
    res.redirect(urlOriginal); 
});

app.post('/shorten', (req, res) => {
    const url = req.body.url;
    const customCode = req.body.customCode
    const code = (customCode && customCode.trim() !== '') ? customCode : generateCode(6);

    if (links[code]) {
        return res.status(400).json({ error: 'Esse código já está em uso! Escolha outro.' });
    }

    links[code] = url;
    res.json({ shortCode: code, originalUrl:url});
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

module.exports = app;
