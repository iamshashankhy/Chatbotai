// Select DOM elements
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const clearChatBtn = document.getElementById("clear-chat");

// Variables to track conversation state
let conversationStep = 0;
let selectedOption = "";
let selectedSubject = "";
let lastResourceIndex = 0; // Track the index of the last shown resource

// Predefined bot responses
const botResponses = {
  thanks: "You're welcome! Have a great day!",
  bye: "Goodbye! Keep up the good work and see you next time!",
  ok: "Ok, thank you! How else can I assist you?",
  "no thanks": "You're welcome!",
};

// Resources for books and courses
const subjectResources = {
  python: {
    books: [
      "📘 Automate the Boring Stuff with Python by Al Sweigart",
      "📘 Python Crash Course by Eric Matthes",
      "📘 Fluent Python by Luciano Ramalho",
    ],
    courses: [
      "🎓 Coursera - Python for Everybody",
      "🎓 Udemy - Complete Python Bootcamp",
      "🎓 edX - Introduction to Python Programming",
    ],
  },
  algorithms: {
    books: [
      "📘 Introduction to Algorithms by Cormen et al.",
      "📘 Algorithms by Robert Sedgewick",
      "📘 The Algorithm Design Manual by Steven Skiena",
    ],
    courses: [
      "🎓 Coursera - Data Structures and Algorithms Specialization",
      "🎓 Udemy - Mastering Algorithms with Python",
      "🎓 edX - Algorithmic Thinking",
    ],
  },
  "web development": {
    books: [
      "📘 HTML and CSS: Design and Build Websites by Jon Duckett",
      "📘 JavaScript: The Good Parts by Douglas Crockford",
      "📘 Eloquent JavaScript by Marijn Haverbeke",
    ],
    courses: [
      "🎓 Udemy - The Web Developer Bootcamp",
      "🎓 freeCodeCamp - Responsive Web Design",
      "🎓 Coursera - Full-Stack Web Development Specialization",
    ],
  },
  "machine learning": {
    books: [
      "📘 Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow by Aurélien Géron",
      "📘 Deep Learning by Ian Goodfellow",
      "📘 Machine Learning Yearning by Andrew Ng",
    ],
    courses: [
      "🎓 Coursera - Machine Learning by Andrew Ng",
      "🎓 Udemy - Machine Learning A-Z",
      "🎓 edX - Principles of Machine Learning",
    ],
  },
  "computer networks": {
    books: [
      "📘 Computer Networking: A Top-Down Approach by Kurose and Ross",
      "📘 Data Communications and Networking by Behrouz Forouzan",
      "📘 TCP/IP Illustrated by Richard Stevens",
    ],
    courses: [
      "🎓 Coursera - Computer Networking by Stanford University",
      "🎓 Udemy - Networking Fundamentals",
      "🎓 edX - Introduction to Networking",
    ],
  },
};

// Helper to add messages to the chat
function addMessage(content, sender) {
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.textContent = content;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
}

// Main chatbot logic
function handleInput() {
  const userMessage = userInput.value.trim().toLowerCase(); // Get user input
  if (!userMessage) return;

  addMessage(userInput.value, "user"); // Display user's message
  userInput.value = ""; // Clear input field

  // Respond to greetings
  if (userMessage === "hi" || userMessage === "hello") {
    addMessage("Hello! How can I assist you?", "bot");
    addMessage("Would you like suggestions for books or courses?", "bot");
    conversationStep = 0;
    return;
  }

  // Handle predefined responses
  if (userMessage in botResponses) {
    addMessage(botResponses[userMessage], "bot");

    // Reset conversation if "no thanks" is entered
    if (userMessage === "no thanks") {
      conversationStep = 0;
      selectedOption = "";
      selectedSubject = "";
      lastResourceIndex = 0;
    }
    return;
  }

  // Main conversation logic
  if (conversationStep === 0) {
    if (userMessage.includes("book") || userMessage.includes("course")) {
      selectedOption = userMessage.includes("book") ? "books" : "courses";
      addMessage(
        "Great! Which subject are you interested in? Options: Python, Algorithms, Web Development, Machine Learning, Computer Networks.",
        "bot"
      );
      conversationStep = 1;
    } else {
      addMessage("Please respond with 'books' or 'courses'.", "bot");
    }
  } else if (conversationStep === 1) {
    if (subjectResources[userMessage]) {
      selectedSubject = userMessage;
      lastResourceIndex = 0; // Reset resource index for new subject
      const resources = subjectResources[selectedSubject][selectedOption];
      addMessage(`Here's a ${selectedOption.slice(0, -1)} for ${selectedSubject}: ${resources[lastResourceIndex]}`, "bot");
      lastResourceIndex++;
      addMessage("Would you like another suggestion from this category? (yes/no)", "bot");
      conversationStep = 2;
    } else {
      addMessage(
        "Please choose a valid subject: Python, Algorithms, Web Development, Machine Learning, Computer Networks.",
        "bot"
      );
    }
  } else if (conversationStep === 2) {
    const resources = subjectResources[selectedSubject][selectedOption];
    if (userMessage === "yes") {
      if (lastResourceIndex < resources.length) {
        addMessage(`Here's another ${selectedOption.slice(0, -1)}: ${resources[lastResourceIndex]}`, "bot");
        lastResourceIndex++;
        addMessage("Would you like another suggestion? (yes/no)", "bot");
      } else {
        addMessage(`No more ${selectedOption} available for ${selectedSubject}. Would you like courses/books instead? (yes/no)`, "bot");
      }
    } else if (userMessage === "no") {
      addMessage(
        `Would you like to see ${selectedOption === "books" ? "courses" : "books"} for ${selectedSubject}? (yes/no)`,
        "bot"
      );
      conversationStep = 3;
    } else {
      addMessage("Please respond with 'yes' or 'no'.", "bot");
    }
  } else if (conversationStep === 3) {
    if (userMessage === "yes") {
      const alternateOption = selectedOption === "books" ? "courses" : "books";
      const resources = subjectResources[selectedSubject][alternateOption];
      addMessage(
        `Here are some ${alternateOption} for ${selectedSubject}:\n${resources.map((item) => `- ${item}`).join("\n")}`,
        "bot"
      );
      addMessage("Would you like to explore another topic? (yes/no)", "bot");
      conversationStep = 0; // Reset for new topic
    } else if (userMessage === "no") {
      addMessage("Okay! How else can I assist you?", "bot");
      conversationStep = 0; // Reset conversation
    } else {
      addMessage("Please respond with 'yes' or 'no'.", "bot");
    }
  }
}

// Event Listeners
sendBtn.addEventListener("click", handleInput); // Handle button click
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleInput(); // Handle Enter key
});

clearChatBtn.addEventListener("click", () => {
  chatBox.innerHTML = ""; // Clear chat messages
  conversationStep = 0; // Reset conversation
  selectedOption = "";
  selectedSubject = "";
  lastResourceIndex = 0;
});
