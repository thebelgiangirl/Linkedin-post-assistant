async function sendMessage() {
  // ... (your existing code)

  // Call your n8n webhook URL
  const response = await fetch('https://n8n-e2tg.onrender.com/webhook-test/24612585-db6c-4b84-b28b-4f258b1baa7a', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userInput }),
  });

  // Process the RESPONSE from your workflow
  const data = await response.json();
  const posts = data.posts; // Adjust based on your final output

  // Display posts in chat
  posts.forEach(post => {
    chatbox.innerHTML += `<div class="bot-message">📝 ${post.title}<br>${post.content}</div>`;
  });
}
