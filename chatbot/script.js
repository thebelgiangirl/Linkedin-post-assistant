async function sendMessage() {
  const userInput = document.getElementById('userInput').value;
  const chatbox = document.getElementById('chatbox');

  // Show YOUR message
  chatbox.innerHTML += `<div>You: ${userInput}</div>`;

  // Ask n8n for a reply (replace YOUR_N8N_URL below!)
  try {
    const response = await fetch('YOUR_N8N_WEBHOOK_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput }),
    });
    const data = await response.json();

    // Show BOT's reply
    chatbox.innerHTML += `<div style="color: blue;">Bot: ${data.reply}</div>`;
  } catch (error) {
    chatbox.innerHTML += `<div style="color: red;">Bot is sleeping 😴</div>`;
  }

  // Clear the input box
  document.getElementById('userInput').value = '';
}