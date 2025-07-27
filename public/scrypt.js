// login elements
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");

// chat elements
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

const colors = [
  "cadetblue",
  "darkgoldenrod",
  "cornflowerblue",
  "darkkhaki",
  "hotpink",
  "gold",
];

const user = { id: "", name: "", color: "" };

// Declara a variável socket para a instância do Socket.IO
let socket;

const createMessageSelfElement = (content) => {
  const div = document.createElement("div");

  div.classList.add("message--self");
  div.innerHTML = content;

  return div;
};

const createMessageOtherElement = (content, sender, senderColor) => {
  const div = document.createElement("div");
  const span = document.createElement("span");

  div.classList.add("message--other");

  span.classList.add("message--sender");
  // Aplica a cor do remetente, se disponível
  if (senderColor) {
    span.style.color = senderColor;
  }

  div.appendChild(span);

  span.innerHTML = sender;
  div.innerHTML += content; // Adiciona o conteúdo após o span
  return div;
};

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

// Adaptação para Socket.IO: a função processMessage não é mais necessária,
// a lógica de processamento de mensagens será diretamente no 'socket.on("chat message")'

// Função para conectar ao Socket.IO
const connectToSocketIO = () => {
  // Conecta ao servidor Socket.IO. Por padrão, ele tenta se conectar ao mesmo host e porta
  // onde a página HTML foi servida.
  socket = io();

  socket.on("connect", () => {
    console.log("Conectado ao Socket.IO! ID:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Desconectado do Socket.IO.");
  });

  // Ouve o evento "chat message" do servidor
  socket.on("chat message", (messageData) => {
    // messageData agora é um objeto com { id, content, sender, timestamp }
    const { content, sender, senderColor } = messageData; // Adaptei para esperar senderColor do backend

    const messageElement =
      sender === user.name // Compara pelo nome do usuário para determinar se é mensagem própria
        ? createMessageSelfElement(content)
        : createMessageOtherElement(content, sender, senderColor); // Passa a cor do sender

    chatMessages.appendChild(messageElement);
    scrollScreen();
  });
};

const handleLogin = (event) => {
  event.preventDefault();

  user.id = crypto.randomUUID();
  user.name = loginInput.value;
  user.color = getRandomColor();

  login.style.display = "none";
  chat.style.display = "flex";

  // Chama a função para conectar o Socket.IO após o login
  connectToSocketIO();
};

const sendMessage = (event) => {
  event.preventDefault();

  const messageContent = chatInput.value;

  if (messageContent.trim() === "") {
    // Evita enviar mensagens vazias
    return;
  }

  // Envia a mensagem para o backend via Socket.IO
  // Inclui as informações do usuário para que o backend possa persistir corretamente
  // e re-emitir para todos os clientes, incluindo a cor do usuário.
  socket.emit("chat message", {
    content: messageContent,
    userName: user.name,
    userColor: user.color, // Inclui a cor do usuário no objeto enviado
    userId: user.id, // Inclui o ID do usuário para identificação no backend
  });

  chatInput.value = ""; // Limpa o campo de entrada após enviar
};

// Adiciona os event listeners
loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
