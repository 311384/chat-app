// src/routes/routes.js
const express = require("express");
const router = express.Router(); // Cria uma nova instância de Router

// Você pode adicionar suas rotas aqui no futuro, por exemplo:
// router.get('/minha-api/dados', (req, res) => {
//   res.json({ mensagem: 'Dados da API' });
// });

// ESSENCIAL: Exporta o roteador para que o server.js possa usá-lo
module.exports = router;
