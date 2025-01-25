async function sendMessage() {
  // 1. Récupérer le message de l'utilisateur
  const userInput = document.getElementById('userInput').value;
  if (!userInput) return; // Ne rien faire si le champ est vide

  // 2. Afficher le message de l'utilisateur
  const chatbox = document.getElementById('chatbox');
  chatbox.innerHTML += `<div class="user-message">${userInput}</div>`;

  try {
    // 3. Envoyer au webhook
    const response = await fetch('https://n8n-e2tg.onrender.com/webhook-test/3124586d-9fcc-42dc-8281-0fdc70704fc7', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput, url: userInput }), // Envoie les deux champs
    });

    // 4. Gérer les erreurs
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // 5. Afficher la réponse
    const data = await response.json();
    data.posts.forEach(post => {
      chatbox.innerHTML += `<div class="bot-message">📝 ${post.title}<br>${post.content}</div>`;
    });

  } catch (error) {
    chatbox.innerHTML += `<div class="error">❌ Erreur : ${error.message}</div>`;
  }

  // 6. Vider le champ et scroll automatique
  document.getElementById('userInput').value = '';
  chatbox.scrollTop = chatbox.scrollHeight;
}
