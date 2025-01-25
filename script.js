async function sendMessage() {
  const userInput = document.getElementById('userInput').value;
  if (!userInput) return;

  const chatbox = document.getElementById('chatbox');
  chatbox.innerHTML += `<div class="user-message">${userInput}</div>`;

  try {
    // 1. Send request
    const response = await fetch('https://n8n-e2tg.onrender.com/webhook-test/3124586d-9fcc-42dc-8281-0fdc70704fc7', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput, url: userInput }),
      mode: 'cors',
      credentials: 'same-origin'
    });

    // 2. Get response text FIRST
    const responseText = await response.text();

    // 3. Detailed error logging
    console.log('Status:', response.status);
    console.log('Headers:', [...response.headers]);
    console.log('Body:', responseText);

    // 4. Check for HTTP errors
    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { error: responseText };
      }
      throw new Error(errorData.error || `HTTP Error ${response.status}`);
    }

    // 5. Validate response format
    if (!responseText.includes('//')) {
      throw new Error(`Robot sent bad format: ${responseText.substring(0, 50)}...`);
    }

    // 6. Process response
    const [title, content] = responseText.split('//\n');
    const formattedContent = content
      .split('\n\n')
      .map(p => p.replace(/\n/g, '<br>'))
      .join('</p><p>')
      .replace(/^(.*)$/, '<p>$1</p>');

    chatbox.innerHTML += `
      <div class="bot-message">
        <strong>📝 ${title?.trim() || 'New Post'}</strong>
        <div class="post-content">${formattedContent}</div>
      </div>
    `;

  } catch (error) {
    chatbox.innerHTML += `
      <div class="error">
        ❌ Error: ${error.message.replace('Robot confused! Error code: 500', 'Server error - check workflow configuration')}
      </div>
    `;
    console.error('Full error:', error);
  }

  document.getElementById('userInput').value = '';
  chatbox.scrollTop = chatbox.scrollHeight;
}
