const chartTypes = document.querySelectorAll(".chart-type");

const generateChartBtn =
    document.getElementById("generateChartBtn");

const visualizationStatus =
    document.getElementById("visualizationStatus");

const variableSelect =
    document.getElementById("variableSelect");

const chartTitle =
    document.getElementById("chartTitle");

const chartDescription =
    document.getElementById("chartDescription");

const infoChartType =
    document.getElementById("infoChartType");

const infoVariable =
    document.getElementById("infoVariable");


let selectedChart = "histogram";


/* ================================
   Chart Type Selection
================================ */

chartTypes.forEach((chart) => {

    chart.addEventListener("click", () => {

        chartTypes.forEach((item) => {
            item.classList.remove("active");
        });

        chart.classList.add("active");

        selectedChart =
            chart.dataset.chart;

        updateChartInformation();

    });

});


/* ================================
   Variable Change
================================ */

variableSelect.addEventListener("change", () => {

    updateChartInformation();

});


/* ================================
   Update Information
================================ */

function updateChartInformation() {

    const variable =
        variableSelect.value;

    const chartNames = {

        histogram: "Histogram",

        normal: "Normal Curve",

        density: "Density Plot",

        scatter: "Scatter Plot",

        correlation: "Correlation Plot",

        "3d": "3D Plot"

    };


    const descriptions = {

        histogram:
            `Distribution of ${variable} values.`,

        normal:
            `Normal distribution curve for ${variable}.`,

        density:
            `Density distribution of ${variable}.`,

        scatter:
            `Relationship between selected variables.`,

        correlation:
            `Correlation matrix of numerical variables.`,

        "3d":
            `Three-dimensional visualization of dataset variables.`

    };


    chartTitle.textContent =
        chartNames[selectedChart];

    chartDescription.textContent =
        descriptions[selectedChart];

    infoChartType.textContent =
        chartNames[selectedChart];

    infoVariable.textContent =
        variable;

}


/* ================================
   Generate Chart
================================ */

generateChartBtn.addEventListener("click", () => {

    const variable =
        variableSelect.value;


    generateChartBtn.textContent =
        "Generating...";

    generateChartBtn.disabled = true;


    visualizationStatus.textContent =
        `Generating ${selectedChart} for ${variable}...`;


    setTimeout(() => {

        generateChartBtn.textContent =
            "Chart Generated ✓";

        generateChartBtn.disabled = false;


        visualizationStatus.textContent =
            "Visualization generated successfully.";

    }, 1000);

});