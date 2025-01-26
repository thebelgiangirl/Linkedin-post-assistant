async function sendMessage() {
  const userInput = document.getElementById('userInput').value;
  if (!userInput) return;

  const chatbox = document.getElementById('chatbox');
  chatbox.innerHTML += `<div class="user-message">${userInput}</div>`;

  // Add typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'typing-indicator';
  typingIndicator.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot" style="animation-delay: 0.2s"></div>
    <div class="typing-dot" style="animation-delay: 0.4s"></div>
  `;
  chatbox.appendChild(typingIndicator);
  chatbox.scrollTop = chatbox.scrollHeight;

  try {
    // Use your Cloudflare Worker URL
    const response = await fetch('https://linkedin-post.maryamhmdaoui.workers.dev/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Password': 'MyDemoPassword123' // Add a simple password for security
      },
      body: JSON.stringify({ message: userInput, url: userInput }),
      mode: 'cors'
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { error: responseText };
      }
      throw new Error(errorData.error || `HTTP Error ${response.status}`);
    }

    if (!responseText.includes('//')) {
      throw new Error(`Robot sent bad format: ${responseText.substring(0, 50)}...`);
    }

    // Remove typing indicator
    chatbox.removeChild(typingIndicator);

    // Process response
    const [title, content] = responseText.split('//\n');
    const formattedContent = content
      .split('\n\n')
      .map(p => p.replace(/\n/g, '<br>'))
      .join('</p><p>')
      .replace(/^(.*)$/, '<p>$1</p>');

    const messageId = Date.now();
    chatbox.innerHTML += `
      <div class="bot-message">
        <div class="message-header">
          <strong>📝 ${title?.trim() || 'New Post'}</strong>
          <button class="copy-btn" onclick="copyToClipboard('${messageId}')">
            📋 Copy
          </button>
        </div>
        <div id="${messageId}" class="post-content">${formattedContent}</div>
      </div>
    `;

  } catch (error) {
    chatbox.removeChild(typingIndicator);
    let errorMessage = error.message;
    if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Connection failed! Check: \n1. Internet connection \n2. Server URL \n3. Workflow activation';
    }
    
    chatbox.innerHTML += `
      <div class="error">
        ❌ Error: ${errorMessage}
      </div>
    `;
    console.error('Full error:', error);
  }

  document.getElementById('userInput').value = '';
  chatbox.scrollTop = chatbox.scrollHeight;
}

function copyToClipboard(messageId) {
  const contentDiv = document.getElementById(messageId);
  const textToCopy = contentDiv.innerText;
  
  navigator.clipboard.writeText(textToCopy).then(() => {
    const btn = document.querySelector(`button[onclick="copyToClipboard('${messageId}')"]`);
    btn.innerHTML = '✅ Copied!';
    setTimeout(() => {
      btn.innerHTML = '📋 Copy';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}
