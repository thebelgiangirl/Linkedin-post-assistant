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

    const responseText = await response.text();
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // Split response and format newlines
    const [title, content] = responseText.split('//\n');
    
    // Convert newlines to HTML line breaks and paragraphs
    const formattedContent = content
      .split('\n\n') // Split paragraphs
      .map(paragraph => 
        paragraph.replace(/\n/g, '<br>') // Convert single newlines to <br>
      )
      .join('</p><p>') // Wrap paragraphs in <p> tags
      .replace(/^(.*)$/, '<p>$1</p>'); // Ensure wrapping

    chatbox.innerHTML += `
      <div class="bot-message">
        <strong>📝 ${title.trim()}</strong>
        <div class="post-content">${formattedContent}</div>
      </div>
    `;

  } catch (error) {
    chatbox.innerHTML += `<div class="error">❌ Erreur : ${error.message}</div>`;
    console.error('Error:', error);
  }

  document.getElementById('userInput').value = '';
  chatbox.scrollTop = chatbox.scrollHeight;
}
