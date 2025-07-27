require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const ChatMessage = require("./models/ChatMessage");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

// --- ATUALIZAÇÃO AQUI: Configuração do Socket.IO com CORS ---
const io = new Server(server, {
  cors: {
    origin: "*", // Permite acesso de qualquer origem.
    // Em produção, considere usar o domínio específico do seu frontend,
    // por exemplo: "https://seu-app-do-heroku.herokuapp.com"
    methods: ["GET", "POST"], // Métodos HTTP permitidos
  },
});

const routes = require("./routes/routes");

app.use(express.json());
app.use(routes);

// Conectar com Banco MongoDB
mongoose
  .connect(process.env.MONGODB_URI || process.env.DB_URI) // Removi as opções depreciadas para limpar o log
  .then(() => {
    console.log("Conexão com o MongoDB estabelecida com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error);
  });

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Define a route for the root path
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
});

// --- Configuração do Socket.IO para o Chat ---
io.on("connection", (socket) => {
  console.log("Um usuário conectado com o ID:", socket.id);

  socket.on("chat message", async (msgData) => {
    console.log("Mensagem recebida do cliente:", msgData);

    try {
      const newChatMessage = new ChatMessage({
        content: msgData.content,
        sender: msgData.userName,
        senderColor: msgData.userColor,
      });

      await newChatMessage.save();
      console.log("Mensagem salva no banco de dados:", newChatMessage);

      io.emit("chat message", {
        id: newChatMessage._id,
        content: newChatMessage.content,
        sender: newChatMessage.sender,
        senderColor: newChatMessage.senderColor,
        timestamp: newChatMessage.timestamp,
      });
    } catch (error) {
      console.error(
        "Erro ao salvar mensagem de chat no banco de dados:",
        error
      );
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Socket.IO is ready!");
});
