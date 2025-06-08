let targetNumber = '';
let guessHistory = [];
let attempts = 0;
let gameWon = false;

function generateRandomNumber() {
    let digits = [];
    while (digits.length < 4) {
        let digit = Math.floor(Math.random() * 10).toString();
        if (!digits.includes(digit)) {
            digits.push(digit);
        }
    }
    return digits.join('');
}

function validateInput(guess) {
    if (guess.length !== 4) {
        return "Please enter exactly 4 digits.";
    }
    if (!/^\d+$/.test(guess)) {
        return "Please enter only numbers.";
    }
    let uniqueDigits = [...new Set(guess)];
    if (uniqueDigits.length !== 4) {
        return "Please use 4 different digits.";
    }
    return null;
}

function calculateBullsAndCows(guess, target) {
    let bulls = 0;
    let cows = 0;
    
    for (let i = 0; i < 4; i++) {
        if (guess[i] === target[i]) {
            bulls++;
        } else if (target.includes(guess[i])) {
            cows++;
        }
    }
    
    return { bulls, cows };
}

function updateDisplay(bulls, cows, guess) {
    let resultText = document.getElementById('resultText');
    let bullsDisplay = document.getElementById('bullsDisplay');
    let cowsDisplay = document.getElementById('cowsDisplay');
    
    resultText.textContent = `${bulls} bull${bulls !== 1 ? 's' : ''} ${cows} cow${cows !== 1 ? 's' : ''}`;
    
    // Update animal displays with exact numbers
    bullsDisplay.textContent = '🐂'.repeat(bulls);
    cowsDisplay.textContent = '🐄'.repeat(cows);
}

function updateHistory() {
    let historyList = document.getElementById('historyList');
    if (guessHistory.length === 0) {
        historyList.innerHTML = '<div style="text-align: center; color: #8b4513; font-style: italic;">No guesses yet</div>';
        return;
    }
    
    let historyHTML = '';
    for (let i = guessHistory.length - 1; i >= 0; i--) {
        const entry = guessHistory[i];
        historyHTML += `
            <div class="history-item">
                <span class="attempt-number">${i + 1}</span>
                <span class="guess-number">${entry.guess}</span>
                <span class="result">${entry.bulls} bull${entry.bulls !== 1 ? 's' : ''} ${entry.cows} cow${entry.cows !== 1 ? 's' : ''}</span>
            </div>
        `;
    }
    historyList.innerHTML = historyHTML;
}

function makeGuess() {
    if (gameWon) return;
    
    let guessInput = document.getElementById('guessInput');
    let errorMessage = document.getElementById('errorMessage');
    let guess = guessInput.value.trim();
    
    // Clear previous error
    errorMessage.textContent = '';
    
    // Validate input
    let validationError = validateInput(guess);
    if (validationError) {
        errorMessage.textContent = validationError;
        return;
    }
    
    attempts++;
    let result = calculateBullsAndCows(guess, targetNumber);
    
    // Add to history
    guessHistory.push({
        guess: guess,
        bulls: result.bulls,
        cows: result.cows
    });
    
    // Update display
    updateDisplay(result.bulls, result.cows, guess);
    updateHistory();
    
    // Check for win
    if (result.bulls === 4) {
        gameWon = true;
        document.getElementById('winText').textContent = `Congrats! You got it in ${attempts} attempt${attempts !== 1 ? 's' : ''}!`;
        document.getElementById('winSection').style.display = 'block';
        document.getElementById('submitBtn').disabled = true;
        guessInput.disabled = true;
    }
    
    // Clear input
    guessInput.value = '';
}

function startNewGame() {
    targetNumber = generateRandomNumber();
    console.log('New game started! The target number is:', targetNumber);
    guessHistory = [];
    attempts = 0;
    gameWon = false;
    
    // Reset UI
    document.getElementById('guessInput').value = '';
    document.getElementById('guessInput').disabled = false;
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('errorMessage').textContent = '';
    document.getElementById('resultText').textContent = 'Make your first guess!';
    document.getElementById('bullsDisplay').textContent = '🐂';
    document.getElementById('cowsDisplay').textContent = '🐄';
    document.getElementById('winSection').style.display = 'none';
    
    updateHistory();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('guessInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            makeGuess();
        }
    });

    // Start the game
    startNewGame();
}); 