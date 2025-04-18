let currentIndex = 0;
let currentMessage = "";
let intervalId = null;

// Display default null image on load
function showDefaultSymbol() {
  document.getElementById("symbolImg").src = getSymbolImage("null");
}

// Stop the current symbol display
function stopDisplay() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  showDefaultSymbol();
}

// Symbol and priority substitutions
const substitutions = {
  AAA: ".",
  MIM: ",",
  KN: "(",
  KK: ")",
  XE: "/",
  DU: "-",
  JK: "(.)",
  BT: "="
};

const priorities = {
  "DU P DU": "-P-",
  "DU R DU": "-R-",
  "DU O DU": "-O-",
  "DU F DU": "-F-"
};

function applySubstitutions(text) {
  for (const [key, value] of Object.entries(substitutions)) {
    const regex = new RegExp(key, 'g');
    text = text.replace(regex, value);
  }
  for (const [key, value] of Object.entries(priorities)) {
    const regex = new RegExp(key, 'g');
    text = text.replace(regex, value);
  }
  return text;
}

function getSymbolImage(letter) {
  if (letter === "null") return "symbol/null.jpg";
  if (letter === "number") return "symbol/number.jpg";
  return `symbol/${letter.toUpperCase()}.jpg`;
}

// Converts the message into a sequence of symbols and displays them with interval
function displaySymbols(message) {
  document.getElementById("symbolImg").src = getSymbolImage("null");
  const numberWords = {
    "0": "ZERO", "1": "ONE", "2": "TWO", "3": "THREE",
    "4": "FOUR", "5": "FIVE", "6": "SIX", "7": "SEVEN",
    "8": "EIGHT", "9": "NINE"
  };

  const segments = message.trim().split(/\s+/);
  const symbolSequence = [];

  segments.forEach(segment => {
    if (/^[0-9]+$/.test(segment)) {
      // Handle pure numbers
      symbolSequence.push("number");
      for (const digit of segment) {
        symbolSequence.push("null");
        symbolSequence.push(...numberWords[digit].split(""));
        symbolSequence.push("null");
      }
      symbolSequence.push("number");
    } else if (/^[a-zA-Z]+$/.test(segment)) {
      // Handle pure letters
      symbolSequence.push("null");
      symbolSequence.push(...segment.toUpperCase().split(""));
      symbolSequence.push("null");
    } else {
      // Mixed content: split letters and numbers
      let lettersOnly = '', digitsOnly = '';
      for (let char of segment) {
        if (/\d/.test(char)) {
          if (lettersOnly) {
            symbolSequence.push("null");
            symbolSequence.push(...lettersOnly.toUpperCase().split(""));
            symbolSequence.push("null");
            lettersOnly = '';
          }
          digitsOnly += char;
        } else {
          if (digitsOnly) {
            symbolSequence.push("number");
            for (const digit of digitsOnly) {
              symbolSequence.push("null");
              symbolSequence.push(...numberWords[digit].split(""));
              symbolSequence.push("null");
            }
            symbolSequence.push("number");
            digitsOnly = '';
          }
          lettersOnly += char;
        }
      }
      if (lettersOnly) {
        symbolSequence.push("null");
        symbolSequence.push(...lettersOnly.toUpperCase().split(""));
        symbolSequence.push("null");
      }
      if (digitsOnly) {
        symbolSequence.push("number");
        for (const digit of digitsOnly) {
          symbolSequence.push("null");
          symbolSequence.push(...numberWords[digit].split(""));
          symbolSequence.push("null");
        }
        symbolSequence.push("number");
      }
    }
  });

  currentIndex = 0;
  const speed = parseInt(document.getElementById("speed").value) || 1000;

  intervalId = setInterval(() => {
    if (currentIndex >= symbolSequence.length) {
      clearInterval(intervalId);
      return;
    }
    const symbol = symbolSequence[currentIndex];
    document.getElementById("symbolImg").src = getSymbolImage(symbol);
    currentIndex++;
  }, speed);
}

// Start displaying a random message from the given array
function startPractice(messageArray) {
  clearInterval(intervalId);
  currentMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
  displaySymbols(currentMessage);
  document.getElementById("correctAnswer").style.display = "none";
}

// Check if the user input matches the transformed message
function checkAnswer() {
  const userAnswer = document.getElementById("userInput").value.trim();
  const correctAnswer = applySubstitutions(currentMessage).replace(/\s+/g, '').toUpperCase();
  const userCleaned = userAnswer.replace(/\s+/g, '').toUpperCase();
  const result = document.getElementById("result");

  if (userCleaned === correctAnswer) {
    result.textContent = "Correct!";
    result.style.color = "green";
  } else {
    result.textContent = "Incorrect!";
    result.style.color = "red";
  }
}

// Show the correct transformed answer
document.getElementById("showAnswerBtn").addEventListener("click", () => {
  const correctAnswer = applySubstitutions(currentMessage).toUpperCase();
  const answerElement = document.getElementById("correctAnswer");
  answerElement.textContent = `Answer: ${correctAnswer}`;
  answerElement.style.display = "block";
});

// Speed controls

document.getElementById("increaseSpeed").addEventListener("click", () => {
  let speed = parseInt(document.getElementById("speed").value);
  speed = Math.max(200, speed - 200);
  document.getElementById("speed").value = speed;
});

document.getElementById("decreaseSpeed").addEventListener("click", () => {
  let speed = parseInt(document.getElementById("speed").value);
  speed = Math.min(5000, speed + 200);
  document.getElementById("speed").value = speed;
});

// Button event bindings

document.getElementById("startBtn").addEventListener("click", () => startPractice(messageList));
document.getElementById("longMessageBtn").addEventListener("click", () => startPractice(longMessageList));
document.getElementById("submitBtn").addEventListener("click", checkAnswer);

// Initialize on load
window.onload = showDefaultSymbol;
