async function sendMessage() {
  const userInput = document.getElementById('userInput').value;
  const chatbox = document.getElementById('chatbox');

  // Show YOUR message
  chatbox.innerHTML += `<div>You: ${userInput}</div>`;

  // Ask n8n for a reply (replace YOUR_N8N_URL below!)
  try {
    const response = await fetch('https://n8n-e2tg.onrender.com/webhook-test/3124586d-9fcc-42dc-8281-0fdc70704fc7', {
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
