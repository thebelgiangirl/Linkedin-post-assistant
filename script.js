async function sendMessage() {
  const userInput = document.getElementById('userInput').value;
  if (!userInput) return;

  const chatbox = document.getElementById('chatbox');
  chatbox.innerHTML += `<div class="user-message">${userInput}</div>`;

  try {
    // 1. Send message to robot helper
    const response = await fetch('https://n8n-e2tg.onrender.com/webhook/3124586d-9fcc-42dc-8281-0fdc70704fc7', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput, url: userInput }),
      mode: 'cors', // Magic school permission
      credentials: 'same-origin' // Secret handshake
    });

    // 2. Get robot's answer
    const responseText = await response.text();
    console.log('Robot said:', responseText); // Secret spy glass

    // 3. Check for robot errors
    if (!response.ok) {
      let errorMessage = `Robot confused! Error code: ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // 4. Split message into title/content
    if (!responseText.includes('//')) {
      throw new Error('Robot made messy pizza! 🍕🔥 (Missing // separator)');
    }
    
    const [title, content] = responseText.split('//\n');
    const safeTitle = title?.trim() || 'Awesome Post! 🚀';
    const safeContent = content?.trim() || 'Content loading... ⌛';

    // 5. Make text pretty with lines and spaces
    const formattedContent = safeContent
      .split('\n\n') // Cut between paragraphs
      .map(paragraph => 
        paragraph.replace(/\n/g, '<br>') // Add line breaks
      )
      .join('</p><p>') // Wrap in boxes
      .replace(/^(.*)$/, '<p>$1</p>'); // Final box wrap

    // 6. Show robot's message
    chatbox.innerHTML += `
      <div class="bot-message">
        <strong>📝 ${safeTitle}</strong>
        <div class="post-content">${formattedContent}</div>
      </div>
    `;

  } catch (error) {
    // 7. Show error message
    chatbox.innerHTML += `
      <div class="error">
        ❌ Oops! Robot needs help: ${error.message}
      </div>
    `;
    console.error('Robot error:', error);
  }

  // 8. Clean up and scroll
  document.getElementById('userInput').value = '';
  chatbox.scrollTop = chatbox.scrollHeight;
}
