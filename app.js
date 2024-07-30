document.addEventListener('DOMContentLoaded', () => {
    const messages = document.getElementById('messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const usersList = document.getElementById('users');
    const typingNotification = document.getElementById('typing-notification');

    // Prompt the user for a username
    let username = prompt("Please enter your username:");
    if (!username) {
        username = "Anonymous";
    }

    // Create a set to store online users
    const users = new Set(JSON.parse(localStorage.getItem('users')) || []);
    users.add(username);
    localStorage.setItem('username', username);
    localStorage.setItem('users', JSON.stringify(Array.from(users)));

    // Load existing messages from local storage
    const existingMessages = JSON.parse(localStorage.getItem('messages')) || [];
    existingMessages.forEach(msg => addMessageToDOM(msg));

    // Add event listener to the send button
    sendButton.addEventListener('click', sendMessage);

    // Add event listener for 'Enter' key
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add event listener for input to display "user is typing" notification
    messageInput.addEventListener('input', () => {
        if (messageInput.value) {
            typingNotification.innerText = `${username} is typing...`;
        } else {
            typingNotification.innerText = '';
        }
    });

    // Function to send a message
    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText !== '') {
            const message = {
                username: username,
                text: formatMessage(messageText),
                timestamp: new Date().toLocaleTimeString()
            };
            addMessageToDOM(message);
            saveMessageToLocalStorage(message);
            messageInput.value = '';
        }
    }

    // Function to add a message to the DOM
    function addMessageToDOM(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${message.username}</strong> [${message.timestamp}]: ${message.text}`;
        messages.appendChild(messageElement);
        messages.scrollTop = messages.scrollHeight;
    }

    // Function to save a message to local storage
    function saveMessageToLocalStorage(message) {
        const messagesArray = JSON.parse(localStorage.getItem('messages')) || [];
        messagesArray.push(message);
        localStorage.setItem('messages', JSON.stringify(messagesArray));
    }

    // Function to update the user list
    function updateUserList() {
        usersList.innerHTML = '';
        users.forEach(user => {
            const userElement = document.createElement('li');
            userElement.textContent = user;
            usersList.appendChild(userElement);
        });
    }

    updateUserList();

    // Function to display "user is typing" notification
    function displayTypingNotification() {
        if (messageInput.value) {
            typingNotification.innerText = `${username} is typing...`;
        } else {
            typingNotification.innerText = '';
        }
    }

    // Function to change username
    document.getElementById('change-username-button').addEventListener('click', () => {
        const newUsername = prompt("Enter new username:");
        changeUsername(newUsername);
    });

    function changeUsername(newUsername) {
        if (newUsername) {
            users.delete(username);
            username = newUsername;
            users.add(username);
            localStorage.setItem('username', username);
            localStorage.setItem('users', JSON.stringify(Array.from(users)));
            updateUserList();
        }
    }

    // Function to format messages
    function formatMessage(text, options = { bold: false, italic: false }) {
        let formattedText = text;
        if (options.bold) {
            formattedText = `<strong>${formattedText}</strong>`;
        }
        if (options.italic) {
            formattedText = `<em>${formattedText}</em>`;
        }
        return formattedText;
    }
});
