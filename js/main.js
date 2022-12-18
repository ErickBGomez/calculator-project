const DATA_MAX_LENGTH = 12;

const currentData = document.querySelector("#current-data");

const numberButtons = document.querySelectorAll(".number-button");
const decimalPointButton = document.querySelector("#decimal-point");

numberButtons.forEach(button => button.addEventListener("mousedown", updateCurrentData));

function updateCurrentData(e) {
    if (currentData.textContent.length < DATA_MAX_LENGTH) {
        currentData.textContent += e.target.dataset.value;
    }

    // Prevent adding more than one decimal point
    decimalPointButton.disabled = currentData.textContent.includes(".");
}
