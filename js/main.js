// Constants and variables
const DATA_MAX_LENGTH = 12;

let currentPrompt = "10";
let firstOperand = 0;
let secondOperand = 0;
let selectedOperator = "";

// DOM Queries
const currentDataDisplay = document.querySelector("#current-data");

const operatorButtons = document.querySelectorAll(".operator-button");

const numberButtons = document.querySelectorAll(".number-button");
const decimalPointButton = document.querySelector("#decimal-point");

const backspaceButton = document.querySelector("#backspace");
const allClearButton = document.querySelector("#all-clear");

function updateCurrentData(newValue) {
    currentDataDisplay.textContent = (newValue || "0");
}

function insertDigit(e) {
    if (currentPrompt.length >= DATA_MAX_LENGTH) return;
    if (!currentPrompt && e.target.dataset.value === ".") currentPrompt = "0";

    currentPrompt += e.target.dataset.value;
    updateCurrentData(currentPrompt);
    
    checkDecimalPoint();
}

function removeDigit() {
    currentPrompt = currentPrompt.slice(0, -1);
    if (currentPrompt === "0") currentPrompt = "";
    updateCurrentData(currentPrompt);

    checkDecimalPoint();
}

function clearCurrentPrompt() {
    currentPrompt = "";
    updateCurrentData(currentPrompt);
}

function checkDecimalPoint() {
    // Prevent adding more than one decimal point
    decimalPointButton.disabled = currentPrompt.includes(".");
}

// Events
numberButtons.forEach(button => button.addEventListener("mousedown", insertDigit));
backspaceButton.addEventListener("mousedown", removeDigit);
allClearButton.addEventListener("mousedown", clearCurrentPrompt);

// First loading functions
updateCurrentData(currentPrompt);