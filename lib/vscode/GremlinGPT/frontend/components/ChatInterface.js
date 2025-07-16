// Initialize component logger
const logger = window.GremlinLogger ? window.GremlinLogger.createLogger('frontend', 'chat-interface') : console;

export default function ChatInterface(targetId) {
  logger.info('Initializing ChatInterface component', { targetId });
  
  const el = document.getElementById(targetId);
  el.innerHTML = `
    <div class="card bg-secondary">
      <div class="card-header">Chat</div>
      <div class="card-body">
        <textarea id="chatInput" class="form-control mb-2" rows="2"></textarea>
        <button class="btn btn-light" onclick="sendChat()">Send</button>
        <div id="chatLog" class="mt-3 text-light"></div>
      </div>
    </div>
  `;

  window.sendChat = () => {
    const text = document.getElementById("chatInput").value;
    fetch("/api/chat", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({message: text})
    }).then(res => res.json()).then(data => {
      const log = document.getElementById("chatLog");
      log.innerHTML += `<div><b>You:</b> ${text}</div>`;
      log.innerHTML += `<div><b>Bot:</b> ${data.response}</div>`;
      document.getElementById("chatInput").value = "";
    });
  };
}

