/* ===================================
   Calculator Application
   Professional JavaScript Implementation
   =================================== */

// ===================================
// Global Variables
// ===================================
let expression = '';
const resultEl = document.getElementById('result');
const historyEl = document.getElementById('history');

// ===================================
// Core Calculator Functions
// ===================================

/**
 * Insert a value into the expression
 * @param {string} value - The value to insert
 */
function insert(value) {
    expression += value;
    updateDisplay();
}

/**
 * Clear all input and reset calculator
 */
function clearAll() {
    expression = '';
    resultEl.textContent = '0';
    historyEl.textContent = '';
}

/**
 * Delete the last character from expression
 */
function backspace() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

/**
 * Update the display with current expression
 */
function updateDisplay() {
    resultEl.textContent = expression || '0';
}

/**
 * Calculate the result of the expression
 */
function calculate() {
    try {
        // Trim and prepare expression
        let processedExpression = expression.trim();
        
        // Auto-close parentheses
        const openParentheses = (processedExpression.match(/\(/g) || []).length;
        const closeParentheses = (processedExpression.match(/\)/g) || []).length;
        
        if (openParentheses > closeParentheses) {
            processedExpression += ')'.repeat(openParentheses - closeParentheses);
        }

        // Replace mathematical symbols
        let evaluableExpression = processedExpression
            .replace(/π/g, 'pi')
            .replace(/\^/g, '**');

        // Convert trigonometric functions to radians
        evaluableExpression = evaluableExpression
            .replace(/sin\(([^)]+)\)/g, (match, angle) => `sin(${angle}*pi/180)`)
            .replace(/cos\(([^)]+)\)/g, (match, angle) => `cos(${angle}*pi/180)`)
            .replace(/tan\(([^)]+)\)/g, (match, angle) => `tan(${angle}*pi/180)`);

        // Evaluate using math.js
        const result = math.evaluate(evaluableExpression);

        // Update display
        historyEl.textContent = expression;
        
        if (Number.isFinite(result)) {
            const formattedResult = result.toFixed(8).replace(/\.?0+$/, '');
            resultEl.textContent = formattedResult;
            expression = result.toString();
        } else {
            resultEl.textContent = 'خطأ';
            expression = '';
        }
    } catch (error) {
        resultEl.textContent = 'خطأ في الصيغة';
        console.error('Calculation error:', error);
    }
}

// ===================================
// Keyboard Support
// ===================================

/**
 * Handle keyboard input
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyboardInput(event) {
    const key = event.key;

    // Numbers and basic operators
    if ((key >= '0' && key <= '9') || ['+', '-', '*', '/', '.', '(', ')'].includes(key)) {
        insert(key);
        event.preventDefault();
    }

    // Calculate on Enter or =
    if (key === 'Enter' || key === '=') {
        calculate();
        event.preventDefault();
    }

    // Backspace
    if (key === 'Backspace') {
        backspace();
        event.preventDefault();
    }

    // Clear on Escape
    if (key === 'Escape') {
        clearAll();
        event.preventDefault();
    }
}

// ===================================
// Event Listeners
// ===================================
document.addEventListener('keydown', handleKeyboardInput);

// ===================================
// Initialization
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Calculator initialized successfully');
    updateDisplay();
});
