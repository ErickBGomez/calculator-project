// Constants and variables
const DATA_MAX_LENGTH = 12;

let currentPrompt = "10";

let firstOperand = 0;
let secondOperand = 0;
let selectedOperator = "";

// DOM Queries
const currentDataDisplay = document.querySelector("#current-data");
const previousDataDisplay = document.querySelector("#previous-data");

const numberButtons = document.querySelectorAll(".number-button");
const decimalPointButton = document.querySelector("#decimal-point");

const operatorButtons = document.querySelectorAll(".operator-button");

const backspaceButton = document.querySelector("#backspace");
const allClearButton = document.querySelector("#all-clear");

function updateAllData() {
    updateOperands();
    updatePreviousData(firstOperand, selectedOperator);
    
    currentPrompt = "";
}

function updateCurrentData(newValue) {
    currentDataDisplay.textContent = (newValue || "0");
}

function updateOperands() {
    firstOperand = +currentDataDisplay.textContent;
}

function updatePreviousData(firstValue, operator, secondValue = "") {
    previousDataDisplay.textContent = `${firstValue} ${operator} ${secondValue}`;
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

function clearAllData() {
    currentPrompt = "";
    
    firstOperand = 0;
    secondOperand = 0;
    selectedOperator = "";

    updateCurrentData(currentPrompt);
    updatePreviousData("", "");
}

function checkDecimalPoint() {
    // Prevent adding more than one decimal point
    decimalPointButton.disabled = currentPrompt.includes(".");
}

function selectOperator(e) {
    selectedOperator = e.target.dataset.operator;

    updateAllData();
}

// Events
numberButtons.forEach(button => button.addEventListener("mousedown", insertDigit));
operatorButtons.forEach(button => button.addEventListener("mousedown", selectOperator));
backspaceButton.addEventListener("mousedown", removeDigit);
allClearButton.addEventListener("mousedown", clearAllData);

// First loading functions
updateCurrentData(currentPrompt);