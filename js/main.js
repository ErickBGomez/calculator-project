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

    firstOperand = 0;
    secondOperand = 0;
    selectedOperator = "";
}

function clearAfterResult() {
    if (!showingResult) return;
    showingResult = false;    
    clearPreviousData();
}

function scaleDataDisplay(dataDisplay, maxLength, scaleIndex) {
    if (dataDisplay.textContent.length > maxLength) {
        const extraDigits = dataDisplay.textContent.length - maxLength;

        dataDisplay.style.scale = 1 - (extraDigits / scaleIndex);
        dataDisplay.style.alignSelf = "center";
    } else {
        dataDisplay.removeAttribute("style");
    }
}

// Insert and removes digits and select operators
function insertDigit(e) {
    if ((currentPrompt.length >= CURRENT_DATA_MAX_LENGTH)
    ||  (currentPrompt.includes(".") && e.target.dataset.value === ".")) return;

    if (currentPrompt === "0") currentPrompt = "";
    if (!currentPrompt && e.target.dataset.value === ".") currentPrompt = "0";

    currentPrompt += e.target.dataset.value;
    updateCurrentData(currentPrompt);
    
    clearAfterResult();
}

function removeDigit() {
    currentPrompt = currentPrompt.slice(0, -1);
    if (currentPrompt === "0") currentPrompt = "";
    updateCurrentData(currentPrompt);

    clearAfterResult()
}

function selectOperator(e) {
    if (selectedOperator) calculateOperation();
    showingResult = false;

    selectedOperator = parseOperator(e.target.dataset.value);
    firstOperand = Number(currentDataDisplay.textContent);

    updatePreviousData(firstOperand, selectedOperator);
    
    currentPrompt = "";
}

function parseOperator(operator) {
    switch (operator) {
        case "+":
        case "-":
            return operator;

        case "*":
            return "×";
    
        case "/":
            return "÷";
    }
}

// Calculation and information processing
function calculateOperation() {
    if (!selectedOperator || !currentPrompt) return;

    secondOperand = Number(currentDataDisplay.textContent);
    updatePreviousData(firstOperand, selectedOperator, secondOperand + " =");
    
    currentPrompt = "";
    let result = 0;

    switch (selectedOperator) {
        case "+":
            result = firstOperand + secondOperand;
            break;

        case "-":
            result = firstOperand - secondOperand;
            break;
        
        case "×":
            result = firstOperand * secondOperand;
            break;
        
        case "÷":
            result = firstOperand / secondOperand;
            break;
    }

    
    
    // If result is decimal
    if ((result % 1 !== 0) && (result !== Infinity)) {
        if (result.toString().length > CURRENT_DATA_MAX_LENGTH) {
            result = roundDecimal(result);
        }
    }
    
    showingResult = true;
    updateCurrentData(result);
}

function roundDecimal(number) {
    const integerDigits = number.toString().split(".")[0];
    return Number(number.toFixed(CURRENT_DATA_MAX_LENGTH - (integerDigits.length + 1)));
}

// Events
numberButtons.forEach(button => button.addEventListener("mousedown", insertDigit));
operatorButtons.forEach(button => button.addEventListener("mousedown", selectOperator));
equalsButton.addEventListener("mousedown", calculateOperation);
backspaceButton.addEventListener("mousedown", removeDigit);
allClearButton.addEventListener("mousedown", clearAllData);

// First loading functions
updateCurrentData(currentPrompt);
clearPreviousData();