const API_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {

    const analyzeBtn = document.getElementById("analyzeBtn");
    const analysisStatus = document.getElementById("analysisStatus");

    // -----------------------------
    // Get Statistics Page Elements
    // -----------------------------

    const datasetName = document.querySelector(
        ".dataset-info-box strong"
    );

    const datasetInfo = document.querySelector(
        ".dataset-info-box span"
    );

    const datasetIcon = document.querySelector(
        ".dataset-icon"
    );

    const summaryCards = document.querySelectorAll(
        ".summary-card"
    );

    const statsTableBody = document.querySelector(
        ".table-container tbody"
    );

    const frequencyGrid = document.querySelector(
        ".frequency-grid"
    );

    const measureGrid = document.querySelector(
        ".measure-grid"
    );


    // -----------------------------
    // Load Dataset From localStorage
    // -----------------------------

    const storedDataset = localStorage.getItem(
        "datainsight_dataset"
    );

    if (!storedDataset) {

        showStatus(
            "Please upload a dataset first from the Dataset page.",
            "error"
        );

        if (analyzeBtn) {
            analyzeBtn.disabled = true;
        }

        return;
    }


    let dataset;

    try {

        dataset = JSON.parse(storedDataset);

    } catch (error) {

        console.error(
            "Failed to read dataset:",
            error
        );

        showStatus(
            "Unable to read dataset information.",
            "error"
        );

        return;
    }


    // -----------------------------
    // Display Dataset Information
    // -----------------------------

    displayDatasetInfo(dataset);


    // -----------------------------
    // Analyze Button
    // -----------------------------

    if (analyzeBtn) {

        analyzeBtn.addEventListener(
            "click",
            calculateStatistics
        );

    }


    // -----------------------------
    // Calculate Statistics
    // -----------------------------

    async function calculateStatistics() {

        if (!dataset.dataset_id) {

            showStatus(
                "Dataset ID not found. Please upload the dataset again.",
                "error"
            );

            return;
        }


        try {

            setLoading(true);

            showStatus(
                "Calculating descriptive statistics...",
                "loading"
            );


            const formData = new FormData();

            formData.append(
                "dataset_id",
                dataset.dataset_id
            );


            const response = await fetch(
                `${API_URL}/api/statistics/descriptive`,
                {
                    method: "POST",
                    body: formData
                }
            );


            if (!response.ok) {

                let message =
                    "Failed to calculate statistics.";

                try {

                    const errorData =
                        await response.json();

                    if (errorData.detail) {
                        message = errorData.detail;
                    }

                } catch (error) {
                    // Ignore JSON parsing error
                }

                throw new Error(message);
            }


            const result =
                await response.json();


            console.log(
                "Statistics API Response:",
                result
            );


            if (!result.success) {

                throw new Error(
                    "Statistics calculation failed."
                );

            }


            // Store statistics
            localStorage.setItem(
                "datainsight_statistics",
                JSON.stringify(result)
            );


            // Update UI
            updateStatisticsUI(
                result.statistics
            );


            showStatus(
                "Statistical analysis completed successfully.",
                "success"
            );


        } catch (error) {

            console.error(
                "Statistics error:",
                error
            );

            showStatus(
                error.message ||
                "Something went wrong while calculating statistics.",
                "error"
            );

        } finally {

            setLoading(false);

        }

    }


    // -----------------------------
    // Display Dataset Information
    // -----------------------------

    function displayDatasetInfo(data) {

        if (datasetName) {

            datasetName.textContent =
                data.filename ||
                "Uploaded Dataset";

        }


        if (datasetInfo) {

            datasetInfo.textContent =
                `${data.rows ?? 0} rows · ${data.columns ?? 0} columns`;

        }


        if (datasetIcon) {

            const filename =
                data.filename || "";

            const extension =
                filename.split(".").pop().toUpperCase();

            datasetIcon.textContent =
                extension || "DATA";

        }

    }


    // -----------------------------
    // Update Statistics UI
    // -----------------------------

    function updateStatisticsUI(statistics) {

        if (!statistics) {
            return;
        }


        console.log(
            "Statistics:",
            statistics
        );


        updateSummaryCards(
            statistics
        );


        updateStatisticsTable(
            statistics
        );


        updateFrequencySection(
            statistics
        );


        updateMeasuresSection(
            statistics
        );

    }


    // -----------------------------
    // Summary Cards
    // -----------------------------

    function updateSummaryCards(statistics) {

        if (!summaryCards.length) {
            return;
        }


        const numericStats =
            getNumericStatistics(statistics);


        const numericColumns =
            Object.keys(numericStats);


        const totalNumericColumns =
            numericColumns.length;


        let totalValues = 0;

        let totalMean = 0;

        let totalStd = 0;


        numericColumns.forEach(
            (column) => {

                const item =
                    numericStats[column];

                totalValues +=
                    Number(item.count || 0);

                totalMean +=
                    Number(item.mean || 0);

                totalStd +=
                    Number(item.std_dev || 0);

            }
        );


        const averageMean =
            totalNumericColumns > 0
                ? totalMean / totalNumericColumns
                : 0;


        const averageStd =
            totalNumericColumns > 0
                ? totalStd / totalNumericColumns
                : 0;


        // Card 1
        if (summaryCards[0]) {

            const value =
                summaryCards[0].querySelector(
                    "strong"
                );

            if (value) {
                value.textContent =
                    totalNumericColumns;
            }

        }


        // Card 2
        if (summaryCards[1]) {

            const value =
                summaryCards[1].querySelector(
                    "strong"
                );

            if (value) {
                value.textContent =
                    totalValues;
            }

        }


        // Card 3
        if (summaryCards[2]) {

            const value =
                summaryCards[2].querySelector(
                    "strong"
                );

            if (value) {
                value.textContent =
                    formatNumber(averageMean);
            }

        }


        // Card 4
        if (summaryCards[3]) {

            const value =
                summaryCards[3].querySelector(
                    "strong"
                );

            if (value) {
                value.textContent =
                    formatNumber(averageStd);
            }

        }

    }


    // -----------------------------
    // Statistics Table
    // -----------------------------

    function updateStatisticsTable(statistics) {

        if (!statsTableBody) {
            return;
        }


        const numericStats =
            getNumericStatistics(statistics);


        statsTableBody.innerHTML = "";


        Object.entries(numericStats).forEach(
            ([column, values]) => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `
                    <td>${escapeHTML(column)}</td>
                    <td>${formatNumber(values.count)}</td>
                    <td>${formatNumber(values.mean)}</td>
                    <td>${formatNumber(values.median)}</td>
                    <td>${formatNumber(values.mode)}</td>
                    <td>${formatNumber(values.variance)}</td>
                    <td>${formatNumber(values.std_dev)}</td>
                    <td>${formatNumber(values.min)}</td>
                    <td>${formatNumber(values.max)}</td>
                    <td>${formatNumber(values.skewness)}</td>
                    <td>${formatNumber(values.kurtosis)}</td>
                `;


                statsTableBody.appendChild(row);

            }
        );

    }


    // -----------------------------
    // Frequency Section
    // -----------------------------

    function updateFrequencySection(statistics) {

        if (!frequencyGrid) {
            return;
        }


        const frequencyStats =
            getFrequencyStatistics(
                statistics
            );


        frequencyGrid.innerHTML = "";


        Object.entries(frequencyStats).forEach(
            ([column, frequencies]) => {

                const card =
                    document.createElement("div");

                card.className =
                    "frequency-card";


                let rowsHTML = "";


                Object.entries(frequencies).forEach(
                    ([value, count]) => {

                        rowsHTML += `
                            <div class="frequency-row">
                                <span>${escapeHTML(value)}</span>
                                <strong>${count}</strong>
                            </div>
                        `;

                    }
                );


                card.innerHTML = `
                    <h3>${escapeHTML(column)}</h3>
                    ${rowsHTML}
                `;


                frequencyGrid.appendChild(card);

            }
        );


        if (!Object.keys(frequencyStats).length) {

            frequencyGrid.innerHTML = `
                <div class="frequency-card">
                    <h3>No categorical data</h3>
                    <p>
                        No categorical columns were found
                        in this dataset.
                    </p>
                </div>
            `;

        }

    }


    // -----------------------------
    // Measures Section
    // -----------------------------

    function updateMeasuresSection(statistics) {

        if (!measureGrid) {
            return;
        }


        const numericStats =
            getNumericStatistics(statistics);


        measureGrid.innerHTML = "";


        Object.entries(numericStats).forEach(
            ([column, values]) => {

                const item =
                    document.createElement("div");

                item.className =
                    "measure-item";


                item.innerHTML = `
                    <div>
                        <span>Column</span>
                        <strong>${escapeHTML(column)}</strong>
                    </div>

                    <div>
                        <span>Min</span>
                        <strong>${formatNumber(values.min)}</strong>
                    </div>

                    <div>
                        <span>Max</span>
                        <strong>${formatNumber(values.max)}</strong>
                    </div>

                    <div>
                        <span>Skewness</span>
                        <strong>${formatNumber(values.skewness)}</strong>
                    </div>

                    <div>
                        <span>Kurtosis</span>
                        <strong>${formatNumber(values.kurtosis)}</strong>
                    </div>
                `;


                measureGrid.appendChild(item);

            }
        );

    }


    // -----------------------------
    // Numeric Statistics Helper
    // -----------------------------

    function getNumericStatistics(statistics) {

        if (
            statistics.numeric_statistics
        ) {

            return statistics.numeric_statistics;

        }


        if (
            statistics.numeric
        ) {

            return statistics.numeric;

        }


        return {};

    }


    // -----------------------------
    // Frequency Helper
    // -----------------------------

    function getFrequencyStatistics(statistics) {

        if (
            statistics.frequency
        ) {

            return statistics.frequency;

        }


        if (
            statistics.categorical_statistics
        ) {

            return statistics.categorical_statistics;

        }


        return {};

    }


    // -----------------------------
    // Loading State
    // -----------------------------

    function setLoading(isLoading) {

        if (!analyzeBtn) {
            return;
        }


        analyzeBtn.disabled =
            isLoading;


        if (isLoading) {

            analyzeBtn.dataset.originalText =
                analyzeBtn.textContent;

            analyzeBtn.textContent =
                "Calculating...";

        } else {

            analyzeBtn.textContent =
                analyzeBtn.dataset.originalText ||
                "Calculate Statistics";

        }

    }


    // -----------------------------
    // Status Message
    // -----------------------------

    function showStatus(
        message,
        type = "info"
    ) {

        if (!analysisStatus) {
            return;
        }


        analysisStatus.textContent =
            message;


        analysisStatus.className =
            `analysis-status ${type}`;

    }


    // -----------------------------
    // Number Formatting
    // -----------------------------

    function formatNumber(value) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "-";

        }


        const number =
            Number(value);


        if (Number.isNaN(number)) {

            return String(value);

        }


        return number.toFixed(4);

    }


    // -----------------------------
    // HTML Safety
    // -----------------------------

    function escapeHTML(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }

});