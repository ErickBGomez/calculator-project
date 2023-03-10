// Constants and variables
const CURRENT_DATA_MAX_LENGTH = 12;
const PREVIOUS_DATA_MAX_LENGTH = 26;
const CURRENT_DATA_SCALE_INDEX = 20;
const PREVIOUS_DATA_SCALE_INDEX = 40;

let currentPrompt = "";
let firstOperand = 0;
let secondOperand = 0;
let selectedOperator = "";

let showingResult = false;

// DOM Queries
const currentDataDisplay = document.querySelector("#current-data");
const previousDataDisplay = document.querySelector("#previous-data");

const numberButtons = document.querySelectorAll(".number-button");
const decimalPointButton = document.querySelector("#decimal-point");

const operatorButtons = document.querySelectorAll(".operator-button");
const equalsButton = document.querySelector("#equals");

const backspaceButton = document.querySelector("#backspace");
const allClearButton = document.querySelector("#all-clear");

const sourceCodeButton = document.querySelector("#source-code-button");

// Functions:

// Update, clear and scale display data
function updateCurrentData(newValue) {
    currentDataDisplay.textContent = (newValue || "0");
    scaleDataDisplay(currentDataDisplay, CURRENT_DATA_MAX_LENGTH, CURRENT_DATA_SCALE_INDEX);
}

function updatePreviousData(firstValue = "", operator = "", secondValue = "") {
    previousDataDisplay.textContent = `${firstValue} ${operator} ${secondValue}`;

    scaleDataDisplay(previousDataDisplay, PREVIOUS_DATA_MAX_LENGTH, PREVIOUS_DATA_SCALE_INDEX);
}

function clearAllData() {
    currentPrompt = "";
    updateCurrentData(currentPrompt);

    clearPreviousData();
}

function clearPreviousData() {
    updatePreviousData();

    firstOperand = selectOperand();
    secondOperand = selectOperand();
    selectedOperator = "";
}

function clearAfterResult() {
    if (!showingResult) return;
    showingResult = false;    
    clearPreviousData();
}

function scaleDataDisplay(dataDisplay, maxLength, scaleIndex) {
    dataDisplay.removeAttribute("style");

    if (dataDisplay.textContent.length > maxLength) {
        const extraDigits = dataDisplay.textContent.length - maxLength;

        dataDisplay.style.scale = 1 - (extraDigits / scaleIndex);
        dataDisplay.style.alignSelf = "center";
    }
}

// Insert and removes digits and select operators
function insertDigit(numberValue) {
    if ((currentPrompt.length >= CURRENT_DATA_MAX_LENGTH)
    ||  (currentPrompt.includes(".") && numberValue === ".")) return;

    if (currentPrompt === "0") currentPrompt = "";
    if (!currentPrompt && numberValue === ".") currentPrompt = "0";

    currentPrompt += numberValue;
    updateCurrentData(currentPrompt);
    
    clearAfterResult();
}

function removeDigit() {
    currentPrompt = currentPrompt.slice(0, -1);
    if (currentPrompt === "0") currentPrompt = "";
    updateCurrentData(currentPrompt);

    clearAfterResult()
}

function selectOperand(newValue) {
    return Number(newValue) || 0;
}

function selectOperator(operatorValue) {
    if (selectedOperator && currentPrompt) calculateOperation();
    showingResult = false;

    selectedOperator = parseOperator(operatorValue);
    firstOperand = selectOperand(currentDataDisplay.textContent);

    updatePreviousData(firstOperand, selectedOperator);
    
    currentPrompt = "";
}

function parseOperator(operator) {
    switch (operator) {
        case "+":
        case "-":
            return operator;

        case "*":
            return "??";
    
        case "/":
            return "??";
    }
}

// Calculation and information processing
function calculateOperation() {
    if (!selectedOperator) return;

    secondOperand = selectOperand(currentDataDisplay.textContent);
    updatePreviousData(firstOperand, selectedOperator, secondOperand + " =");
    
    currentPrompt = "";
    let result = 0;
    
    showingResult = true;

    switch (selectedOperator) {
        case "+":
            result = firstOperand + secondOperand;
            break;

        case "-":
            result = firstOperand - secondOperand;
            break;
        
        case "??":
            result = firstOperand * secondOperand;
            break;
        
        case "??":
            if (secondOperand == 0) {
                result = 0;
                updateCurrentData(getDividedZeroMessage());
                return;
            }

            result = firstOperand / secondOperand;
            break;
    }

    // If result is decimal
    if ((result % 1 !== 0) && (result !== Infinity)) {
        if (result.toString().length > CURRENT_DATA_MAX_LENGTH) {
            result = roundDecimal(result);
        }
    }
    
    updateCurrentData(result);
}

function roundDecimal(number) {
    const integerDigits = number.toString().split(".")[0];
    return Number(number.toFixed(CURRENT_DATA_MAX_LENGTH - (integerDigits.length + 1)));
}

// Keyboard actions

function pressKeyAction(e) {
    const buttonKey = document.querySelector(`button[data-value="${e.key}"]`);

    if (!buttonKey) return;

    playKeyActionAnimation(buttonKey);
    
    if ((e.key >= 0 && e.key <= 9) || e.key === ".") {
        insertDigit(buttonKey.dataset.value);
    } else {
        switch(e.key) {
            case "+":
            case "-":
            case "*":
            case "/":
                selectOperator(buttonKey.dataset.value);
                break;
            
            case "Enter":
                calculateOperation();
                break;

            case "Backspace":
                removeDigit();
                break;

            case "Escape":
                clearAllData();
                break;
        }
    }
}

function playKeyActionAnimation(button) {
    button.classList.add("pressed");
    button.addEventListener("transitionend", () => button.classList.remove("pressed"));
}

// Others

// User gets a random message when you try to divide by zero.
// Yes, the calculator is going to be mad at you :)
function getDividedZeroMessage() {
    const messages = [
        "yes",
        "no",
        "no. just. no",
        "no way man",
        ":(",
        ">:(",
        "really?",
        "are you crazy?",
        "are you serious?",
        "try me",
        "haha :|",
        "you are funny :|",
        "haha NO",
        "????",
        "*explodes*",
        "i'm crying",
        "i won't do that",
        "...",
        "???",
        "excuse me?",
        "what???",
        "but why???",
        "huh?",
        "i'm out",
        "please stop"
    ];

    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

function openSourceCode() {
    window.open("https://github.com/ErickBGomez/calculator-project", "_blank").focus();
}

// Events
numberButtons.forEach(button => button.addEventListener("mousedown", e => insertDigit(e.target.dataset.value)));
operatorButtons.forEach(button => button.addEventListener("mousedown", e => selectOperator(e.target.dataset.value)));
equalsButton.addEventListener("mousedown", calculateOperation);
backspaceButton.addEventListener("mousedown", removeDigit);
allClearButton.addEventListener("mousedown", clearAllData);
document.addEventListener("keydown", pressKeyAction);
sourceCodeButton.addEventListener("click", openSourceCode);

// First loading functions
clearAllData();