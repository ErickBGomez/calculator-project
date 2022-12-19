const DATA_MAX_LENGTH = 12;

const currentData = document.querySelector("#current-data");

const numberButtons = document.querySelectorAll(".number-button");
const decimalPointButton = document.querySelector("#decimal-point");

const backspaceButton = document.querySelector("#backspace");

numberButtons.forEach(button => button.addEventListener("mousedown", insertDigit));

backspaceButton.addEventListener("mousedown", removeDigit)

function insertDigit(e) {
    if (currentData.textContent.length < DATA_MAX_LENGTH) {
        currentData.textContent += e.target.dataset.value;
    }

    checkDecimalPoint();
}

function removeDigit() {
    currentData.textContent = currentData.textContent.slice(0, -1);

    checkDecimalPoint();
}

function checkDecimalPoint() {
    // Prevent adding more than one decimal point
    decimalPointButton.disabled = currentData.textContent.includes(".");
}