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
    console.log('Raw response:', responseText); // Debugging helper

    if (!response.ok) {
      // Handle JSON error responses
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Handle both possible response formats
    let title, content;
    if (responseText.includes('//')) {
      // Split text response
      [title, content] = responseText.split('//\n');
    } else {
      // Fallback for unexpected JSON
      try {
        const jsonData = JSON.parse(responseText);
        title = jsonData.title || jsonData.message?.title || 'New Post';
        content = jsonData.content || jsonData.message?.content || 'Content not available';
      } catch {
        throw new Error('Invalid response format from server');
      }
    }

    // Sanitize output
    title = title?.trim() || 'Untitled Post';
    content = content?.trim() || 'No content available';

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
