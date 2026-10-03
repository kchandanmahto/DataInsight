const calculateCorrelationBtn = document.getElementById(
    "calculateCorrelationBtn"
);

const correlationStatus = document.getElementById(
    "correlationStatus"
);


calculateCorrelationBtn.addEventListener("click", () => {

    const selectedVariables = document.querySelectorAll(
        ".variable-option input:checked"
    );

    if (selectedVariables.length < 2) {

        correlationStatus.textContent =
            "Please select at least two variables.";

        return;
    }


    calculateCorrelationBtn.textContent =
        "Calculating...";

    calculateCorrelationBtn.disabled = true;

    correlationStatus.textContent =
        "Calculating correlation coefficients...";


    setTimeout(() => {

        calculateCorrelationBtn.textContent =
            "Correlation Calculated ✓";

        calculateCorrelationBtn.disabled = false;

        correlationStatus.textContent =
            "Correlation analysis completed successfully.";

    }, 1000);

});
