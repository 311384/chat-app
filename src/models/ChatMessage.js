// models/ChatMessage.js
const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    default: "Anônimo", // Ou você pode definir o sender baseado no usuário logado
  },
  senderColor: {
    // <-- **ADICIONE ESTE CAMPO AQUI**
    type: String,
    default: "#CCCCCC", // Uma cor padrão caso não seja fornecida
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
