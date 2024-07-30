document.addEventListener('DOMContentLoaded', (Event) => {// run code when the DOM is fully loaded
    const messages = document.getElementById('mesaage'); // get the div for messages
    const messageInput = document.getElementById('message-input'); // get the message input field
    const sendButton = document.getElementById('send-button'); // get the send button
    const usersList = document.getElementById('users'); // get the users list
    
    let username = prompt("please Enter your username:"); // getting username
    if (!username) {// If no username is entered, default to "Anonymous"
        username = "Anonymous";}
    
    const users = new Set(); // Create a set to store online users
    users.add(username); // Add the current user to the set
    localStorage.setItem('username', username); // Save the username to local storage

    // Load existing messages from local storage
    const existingMessages = JSON.parse(localStorage.getItem('messages')) || [];
    existingMessages.forEach(msg => addMessageToDOM(msg)); // Display existing messages

    sendButton.addEventListener('click', sendMessage); // Add event listener to send button
    messageInput.addEventListener('keypress', (e) => { // Add event listener for 'Enter' key
    if (e.key === 'Enter') {
        sendMessage();
    }});


    function sendMessage() {
        const messageText = messageInput.value.trim(); // Get and trim the message input
        if (messageText !== '') { // If message is not empty
            const message = {
                username: username, // Set the username
                text: messageText, // Set the message text
                timestamp: new Date().toLocaleTimeString() // Set the current time as the timestamp
            };
            addMessageToDOM(message); // Add message to the DOM
            saveMessageToLocalStorage(message); // Save message to local storage
            messageInput.value = ''; // Clear the input field
        }
    }


    function addMessageToDOM(message) {
        const messageElement = document.createElement('div'); // Create a new div for the message
        messageElement.classList.add('message'); // Add a class to the message div
        messageElement.innerHTML = `<strong>${message.username}</strong> [${message.timestamp}]: ${message.text}`; // Set the inner HTML
        messages.appendChild(messageElement); // Append the message to the messages div
        messages.scrollTop = messages.scrollHeight; // Scroll to the bottom of the messages div
    }


    function saveMessageToLocalStorage(message) {
        const messages = JSON.parse(localStorage.getItem('messages')) || []; // Get existing messages from local storage
        messages.push(message); // Add the new message to the array
        localStorage.setItem('messages', JSON.stringify(messages)); // Save the updated array back to local storage
    }


    function updateUserList() {
        usersList.innerHTML = ''; // Clear the current list of users
        users.forEach(user => { // For each user in the set
            const userElement = document.createElement('li'); // Create a new list item
            userElement.textContent = user; // Set the text content to the username
            usersList.appendChild(userElement); // Append the user to the users list
        });
    }

    updateUserList(); // Update the user list initially
});

