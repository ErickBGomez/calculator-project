// Constants and variables
const DATA_MAX_LENGTH = 12;

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

// Functions
function updateCurrentData(newValue) {
    currentDataDisplay.textContent = (newValue || "0");
    scaleDownDataDisplay(currentDataDisplay, 20);
}

function updatePreviousData(firstValue, operator, secondValue = "") {
    previousDataDisplay.textContent = `${firstValue} ${operator} ${secondValue}`;
}

function insertDigit(e) {
    if ((currentPrompt.length >= DATA_MAX_LENGTH)
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

function clearAllData() {
    currentPrompt = "";
    updateCurrentData(currentPrompt);

    clearPreviousData();
}

function clearPreviousData() {
    previousDataDisplay.textContent = "";

    firstOperand = 0;
    secondOperand = 0;
    selectedOperator = "";
}

function clearAfterResult() {
    if (!showingResult) return;
    showingResult = false;    
    clearPreviousData();
}

function selectOperator(e) {
    if (selectedOperator) calculateOperation();
    showingResult = false;

    selectedOperator = e.target.dataset.operator;
    firstOperand = Number(currentDataDisplay.textContent);

    updatePreviousData(firstOperand, selectedOperator);
    
    currentPrompt = "";
}

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
    if ((result % 1 !== 0)) {
        if (result.toString().length <= DATA_MAX_LENGTH) return;
        result = roundDecimal(result);
    }

    showingResult = true;
    updateCurrentData(result);
}

function roundDecimal(number) {
    const integerDigits = number.toString().split(".")[0];
    return Number(number.toFixed(DATA_MAX_LENGTH - (integerDigits.length + 1)));
}

function scaleDownDataDisplay(dataDisplay, scaleIndex) {
    if (dataDisplay.textContent.length > DATA_MAX_LENGTH) {
        const extraDigits = currentDataDisplay.textContent.length - DATA_MAX_LENGTH;

        dataDisplay.style.scale = 1 - (extraDigits / scaleIndex);
        dataDisplay.style.alignSelf = "center";
    } else {
        dataDisplay.removeAttribute("style");
    }
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