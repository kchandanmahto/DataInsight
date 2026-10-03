const runRegressionBtn =
    document.getElementById("runRegressionBtn");

const regressionStatus =
    document.getElementById("regressionStatus");


const modelRadios =
    document.querySelectorAll(
        'input[name="regressionModel"]'
    );


modelRadios.forEach((radio) => {

    radio.addEventListener("change", () => {

        const selectedModel = document.querySelector(
            'input[name="regressionModel"]:checked'
        ).value;

        console.log(
            "Selected regression model:",
            selectedModel
        );

    });

});


runRegressionBtn.addEventListener("click", () => {

    const selectedModel = document.querySelector(
        'input[name="regressionModel"]:checked'
    ).value;


    let modelName = "Linear Regression";

    if (selectedModel === "logistic") {
        modelName = "Logistic Regression";
    }

    if (selectedModel === "multiple") {
        modelName = "Multiple Regression";
    }


    runRegressionBtn.textContent =
        "Running Model...";

    runRegressionBtn.disabled = true;


    regressionStatus.textContent =
        `Running ${modelName}...`;


    setTimeout(() => {

        runRegressionBtn.textContent =
            "Regression Completed ✓";

        runRegressionBtn.disabled = false;


        regressionStatus.textContent =
            `${modelName} analysis completed successfully.`;

    }, 1000);

});