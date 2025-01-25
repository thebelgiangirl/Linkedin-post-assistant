async function sendMessage() {
  const userInput = document.getElementById('userInput').value;
  if (!userInput) return;

  const chatbox = document.getElementById('chatbox');
  chatbox.innerHTML += `<div class="user-message">${userInput}</div>`;

  try {
    const response = await fetch('https://n8n-e2tg.onrender.com/webhook-test/3124586d-9fcc-42dc-8281-0fdc70704fc7', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput, url: userInput }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // Changed from response.json() to response.text()
    const responseText = await response.text();
    
    // Split the response using the "//" separator from your Set node
    const [title, content] = responseText.split('//\n');
    
    // Create formatted output
    chatbox.innerHTML += `
      <div class="bot-message">
        <strong>📝 ${title}</strong>
        <div class="post-content">${content}</div>
      </div>
    `;

  } catch (error) {
    chatbox.innerHTML += `<div class="error">❌ Erreur : ${error.message}</div>`;
    console.error('Error:', error);
  }

  document.getElementById('userInput').value = '';
  chatbox.scrollTop = chatbox.scrollHeight;
}
