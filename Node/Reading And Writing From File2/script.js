function loadMessages() {
    fetch('/api/messages')
        .then(res => res.json())
        .then(messages => {
            const container = document.getElementById('messages');
            container.innerHTML = messages.map(msg => `<p>${msg}</p>`).join('');
        });
}

window.onload = loadMessages;
