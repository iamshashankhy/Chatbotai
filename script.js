const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const clearChatBtn = document.getElementById("clear-chat");

let conversationStep = 0; // To track the steps in the conversation
let selectedOption = ""; // To store the user's choice (books or courses)
let selectedSubject = ""; // To store the selected subject

// Predefined bot responses
const botResponses = {
  hello: "Hello! How can I assist you?",
  hi: "Hello! How can I assist you?",
  thanks: "You're welcome! Have a great day!",
  bye: "Goodbye! Keep up the good work and see you next time!",
  ok: "Ok, thank you! How else can I assist you?",
  "no thanks": "You're welcome!",
};

// Subject-wise books and courses
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
  "computer networks": {
    books: [
      "📘 Computer Networking: A Top-Down Approach by Kurose & Ross",
      "📘 Data and Computer Communications by William Stallings",
      "📘 Computer Networks by Andrew S. Tanenbaum",
    ],
    courses: [
      "🎓 Coursera - Computer Networking",
      "🎓 Udemy - The Complete Networking Fundamentals",
      "🎓 edX - Computer Networking for Beginners",
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
      "📘 Pattern Recognition and Machine Learning by Christopher Bishop",
    ],
    courses: [
      "🎓 Coursera - Machine Learning by Andrew Ng",
      "🎓 edX - Machine Learning Fundamentals",
      "🎓 Udemy - Complete Machine Learning Bootcamp",
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

// Main input handler
function handleInput() {
  const userMessage = userInput.value.trim().toLowerCase();
  if (!userMessage) return;

  addMessage(userInput.value, "user");
  userInput.value = "";

  // Respond to predefined phrases
  if (userMessage in botResponses) {
    addMessage(botResponses[userMessage], "bot");

    // Reset conversation if "no thanks" is entered
    if (userMessage === "no thanks") {
      conversationStep = 0;
      selectedOption = "";
      selectedSubject = "";
    }
    return;
  }

  // Handle specific responses for "no"
  if (userMessage === "no") {
    addMessage("How can I assist you?", "bot");
    conversationStep = 0; // Reset conversation step
    return;
  }

  // Main conversation flow (for books or courses)
  if (conversationStep === 0) {
    if (userMessage.includes("book") || userMessage.includes("course")) {
      selectedOption = userMessage.includes("book") ? "books" : "courses";
      addMessage("Great! Which subject are you interested in? Options: Python, Computer Networks, Algorithms, Web Development, Machine Learning.", "bot");
      conversationStep = 1; // Move to subject selection step
    } else {
      addMessage("Please respond with 'books' or 'courses'.", "bot");
    }
  } else if (conversationStep === 1) {
    if (subjectResources[userMessage]) {
      selectedSubject = userMessage;
      const resources = subjectResources[selectedSubject][selectedOption];
      addMessage(
        `Here are some ${selectedOption} for ${selectedSubject}:\n${resources.map((item) => `- ${item}`).join("\n")}`,
        "bot"
      );

      if (selectedOption === "books") {
        addMessage("Would you also like course suggestions for this subject? (yes/no)", "bot");
      } else {
        addMessage("Would you also like book suggestions for this subject? (yes/no)", "bot");
      }
      conversationStep = 2;
    } else {
      addMessage("Please choose a valid subject. Options: Python, Computer Networks, Algorithms, Web Development, Machine Learning.", "bot");
    }
  } else if (conversationStep === 2) {
    if (userMessage === "yes") {
      const alternateOption = selectedOption === "books" ? "courses" : "books";
      const resources = subjectResources[selectedSubject][alternateOption];
      addMessage(
        `Here are some ${alternateOption} for ${selectedSubject}:\n${resources.map((item) => `- ${item}`).join("\n")}`,
        "bot"
      );
    } else if (userMessage === "no") {
      addMessage("Okay! How else can I assist you?", "bot");
    } else {
      addMessage("Please respond with 'yes' or 'no'.", "bot");
      return;
    }
    conversationStep = 0; // Reset for the next interaction
  }

  // Handle unknown inputs
  if (conversationStep === 0 && !userMessage.includes("book") && !userMessage.includes("course")) {
    addMessage("Please provide a valid input. Would you like suggestions for books or courses?", "bot");
  }
}

// Event listeners
sendBtn.addEventListener("click", handleInput);

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleInput();
});

clearChatBtn.addEventListener("click", () => {
  chatBox.innerHTML = ""; // Clear all chat messages
  conversationStep = 0; // Reset conversation
  selectedOption = ""; // Reset choice
  selectedSubject = ""; // Reset subject
});
