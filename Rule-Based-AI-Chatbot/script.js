/* ==========================================================================
   NEXUS-9 JAVASCRIPT - CORE CHATBOT ENGINE & INTERFACES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatList = document.getElementById('chat-list');
    const messagesContainer = document.getElementById('messages-container');
    const typingIndicator = document.getElementById('typing-indicator');
    const welcomeCard = document.getElementById('welcome-card');
    const clearChatBtn = document.getElementById('clear-chat');
    
    // Mobile responsive elements
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    
    // Set initial timestamp for the default bot message
    const initialTimeEl = document.getElementById('initial-time');
    if (initialTimeEl) {
        initialTimeEl.textContent = getCurrentTimestamp();
    }

    // --- Predefined Bot Responses (Rule-Based Map) ---
    const responses = {
        'hello': "Greetings, user! I am NEXUS-9. My rule-based core is ready. What instructions do you have for me?",
        'hi': "Hello! Diagnostic checks show 100% battery and database connectivity. How can I help?",
        'how are you': "My cognitive processing cells are operating within optimal temperature ranges. Computational latency is at 0.02ms. How is your human experience today?",
        'bye': "Session termination initialized. Goodbye, user. Safe travels in the digital grid!",
        'help': "I am a Rule-Based AI Chatbot. I match exact input codes. Try sending one of these commands:<br>• <strong>hello</strong><br>• <strong>hi</strong><br>• <strong>how are you</strong><br>• <strong>help</strong><br>• <strong>bye</strong>"
    };

    // --- Event Listeners ---

    // Form submission (Send message)
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleUserMessage();
    });

    // Clear chat history
    clearChatBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to purge the current communication log?")) {
            // Keep only the default message
            const firstMessage = chatList.firstElementChild;
            chatList.innerHTML = '';
            if (firstMessage) {
                chatList.appendChild(firstMessage);
            }
            // Show welcome card again
            welcomeCard.classList.remove('hidden');
            scrollToBottom();
        }
    });

    // Toggle Mobile Sidebar Drawer
    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('active');
    });

    // Close Mobile Sidebar when clicking outside or clicking a menu option
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && e.target !== mobileToggle) {
                sidebar.classList.remove('active');
            }
        }
    });

    // --- Core Functions ---

    /**
     * Handles processing the user input and showing the message in UI.
     */
    function handleUserMessage() {
        const rawText = chatInput.value;
        if (!rawText.trim()) return;

        // Hide welcome card upon first message exchange
        if (!welcomeCard.classList.contains('hidden')) {
            welcomeCard.classList.add('hidden');
        }

        // Add user message to the panel
        appendMessage(rawText, 'user');
        
        // Clear input field and focus again
        chatInput.value = '';
        chatInput.focus();

        // Close sidebar on mobile after sending message
        if (window.innerWidth <= 900) {
            sidebar.classList.remove('active');
        }

        // Trigger bot response logic
        processBotResponse(rawText);
    }

    /**
     * Processes input, runs rule-matcher, simulates thinking delay, and adds bot response.
     * @param {string} userText Raw message typed by user
     */
    function processBotResponse(userText) {
        // Clean text: convert to lowercase, trim whitespace, remove trailing punctuation (likes '?', '!', '.')
        const cleanText = userText.toLowerCase().trim().replace(/[?.!]+$/, '');

        // Show typing indicator
        showTypingIndicator(true);
        scrollToBottom();

        // Calculate dynamic delay based on reply length (feels more realistic)
        const delay = Math.max(800, Math.min(1500, cleanText.length * 60));

        setTimeout(() => {
            // Hide typing indicator
            showTypingIndicator(false);

            // Rule matching logic
            let responseText = responses[cleanText];
            
            // If no exact match is found, check if the input contains the keywords
            if (!responseText) {
                if (cleanText.includes('hello')) {
                    responseText = responses['hello'];
                } else if (cleanText.includes('hi')) {
                    responseText = responses['hi'];
                } else if (cleanText.includes('how are you')) {
                    responseText = responses['how are you'];
                } else if (cleanText.includes('bye')) {
                    responseText = responses['bye'];
                } else if (cleanText.includes('help')) {
                    responseText = responses['help'];
                }
            }

            // Fallback response if no rules are met
            if (!responseText) {
                responseText = "Sorry, I don't understand that instruction. Try typing 'help' to see my operational code triggers.";
            }

            // Append bot message to UI
            appendMessage(responseText, 'bot');
            scrollToBottom();
        }, delay);
    }

    /**
     * Appends a message bubble into the chat area.
     * @param {string} text Message contents (HTML supported)
     * @param {'user'|'bot'} sender Who is sending the message
     */
    function appendMessage(text, sender) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message-wrapper', `${sender}-message`);

        // Generate Avatar SVG depending on sender
        let avatarMarkup = '';
        if (sender === 'bot') {
            avatarMarkup = `
                <svg viewBox="0 0 100 100" class="msg-avatar-svg">
                    <circle cx="50" cy="50" r="45" stroke="#00f0ff" stroke-width="4" fill="rgba(0, 240, 255, 0.1)" />
                    <path d="M30 40 L70 40 M50 25 L50 40 M35 65 Q50 80 65 65" stroke="#00f0ff" stroke-width="5" stroke-linecap="round" fill="none"/>
                    <circle cx="40" cy="48" r="4" fill="#00f0ff" />
                    <circle cx="60" cy="48" r="4" fill="#00f0ff" />
                </svg>`;
        } else {
            avatarMarkup = `
                <svg viewBox="0 0 100 100" class="msg-avatar-svg">
                    <circle cx="50" cy="50" r="45" stroke="#9d4edd" stroke-width="4" fill="rgba(157, 78, 221, 0.1)" />
                    <!-- Futuristic user helmet outline -->
                    <path d="M50 20 C35 20 25 32 25 48 C25 60 30 70 40 75 L40 85 L60 85 L60 75 C70 70 75 60 75 48 C75 32 65 20 50 20 Z" stroke="#9d4edd" stroke-width="4.5" fill="none" />
                    <path d="M32 48 L68 48" stroke="#9d4edd" stroke-dasharray="3 3" stroke-width="2" />
                </svg>`;
        }

        messageWrapper.innerHTML = `
            <div class="avatar">
                ${avatarMarkup}
            </div>
            <div class="message-bubble">
                <div class="message-text">${text}</div>
                <span class="message-time">${getCurrentTimestamp()}</span>
            </div>
        `;

        // Insert message bubble before typing indicator
        chatList.appendChild(messageWrapper);
    }

    /**
     * Toggles visibility of the typing indicator block.
     * @param {boolean} show Should the indicator show
     */
    function showTypingIndicator(show) {
        if (show) {
            typingIndicator.classList.remove('hidden');
            // Move typing indicator to bottom of the chat list
            chatList.appendChild(typingIndicator);
        } else {
            typingIndicator.classList.add('hidden');
        }
    }

    /**
     * Helper to get system time formatted as HH:MM
     * @returns {string} Formatted timestamp
     */
    function getCurrentTimestamp() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        
        // Pad zero values
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        return `${hours}:${minutes}`;
    }

    /**
     * Automatically scrolls the message list container to the bottom.
     */
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});

/**
 * Global function called when user clicks on a command badge in the sidebar.
 * Loads the text in the console, focuses and automatically submits it.
 * @param {string} cmd Command text
 */
function loadCommand(cmd) {
    const chatInput = document.getElementById('chat-input');
    const chatForm = document.getElementById('chat-form');
    
    if (chatInput && chatForm) {
        chatInput.value = cmd;
        chatInput.focus();
        
        // Simulate immediate submission
        setTimeout(() => {
            chatForm.dispatchEvent(new Event('submit'));
        }, 150);
    }
}
