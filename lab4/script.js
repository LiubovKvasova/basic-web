const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

const retrieveName = () => {
  const name = prompt('Enter your name');

  if (name) {
    return name;
  }

  setTimeout(() => {}, 1000);
  return retrieveName();
}

const name = retrieveName();
appendMessage('You joined', true);
socket.emit('new-user', name);

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-connected', name => {
  appendMessage(`${name} connected`, true);
});

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`, true);
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value;

  if (message) {
    appendMessage(`You: ${message}`);
    socket.emit('send-chat-message', message);
    messageInput.value = '';
  }
})

function appendMessage(message, isServiceMessage) {
  const messageElement = document.createElement('div');

  if (isServiceMessage) {
    messageElement.classList.add("service-message")
  }

  messageElement.innerText = message;
  messageContainer.append(messageElement);
}