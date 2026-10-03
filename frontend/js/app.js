const API_URL = "http://127.0.0.1:8000";


const datasetFile = document.getElementById("datasetFile");
const analyzeBtn = document.getElementById("analyzeBtn");

const fileName = document.getElementById("fileName");
const statusMessage = document.getElementById("statusMessage");

const overviewSection = document.getElementById("overviewSection");
const infoSection = document.getElementById("infoSection");
const previewSection = document.getElementById("previewSection");

const rowsCount = document.getElementById("rowsCount");
const columnsCount = document.getElementById("columnsCount");
const duplicateCount = document.getElementById("duplicateCount");
const missingCount = document.getElementById("missingCount");

const columnTableBody = document.getElementById("columnTableBody");

const previewHead = document.getElementById("previewHead");
const previewBody = document.getElementById("previewBody");


datasetFile.addEventListener("change", () => {

    if (datasetFile.files.length === 0) {
        fileName.textContent = "No file selected";
        return;
    }

    fileName.textContent = datasetFile.files[0].name;
});


analyzeBtn.addEventListener("click", async () => {

    if (datasetFile.files.length === 0) {
        showStatus("Please select a CSV or Excel file.", true);
        return;
    }


    const file = datasetFile.files[0];

    const formData = new FormData();

    formData.append("file", file);


    showStatus("Analyzing dataset...", false);

    analyzeBtn.disabled = true;


    try {

        const response = await fetch(
            `${API_URL}/api/dataset/upload`,
            {
                method: "POST",
                body: formData
            }
        );


        const result = await response.json();


        if (!response.ok) {
            throw new Error(
                result.detail || "Failed to analyze dataset."
            );
        }


        displayDataset(result.data);

        showStatus(
            "Dataset analyzed successfully.",
            false
        );


    } catch (error) {

        console.error(error);

        showStatus(
            error.message,
            true
        );

    } finally {

        analyzeBtn.disabled = false;

    }

});


function displayDataset(data) {

    overviewSection.classList.remove("hidden");
    infoSection.classList.remove("hidden");
    previewSection.classList.remove("hidden");


    rowsCount.textContent = data.rows;

    columnsCount.textContent = data.columns;

    duplicateCount.textContent =
        data.duplicate_rows;


    const totalMissing = Object.values(
        data.missing_values
    ).reduce(
        (total, value) => total + value,
        0
    );


    missingCount.textContent = totalMissing;


    displayColumnInformation(data);

    displayPreview(data.preview);

}


function displayColumnInformation(data) {

    columnTableBody.innerHTML = "";


    data.column_names.forEach(column => {

        const row = document.createElement("tr");

        const columnCell =
            document.createElement("td");

        const typeCell =
            document.createElement("td");

        const missingCell =
            document.createElement("td");


        columnCell.textContent = column;

        typeCell.textContent =
            data.data_types[column];

        missingCell.textContent =
            data.missing_values[column] || 0;


        row.appendChild(columnCell);
        row.appendChild(typeCell);
        row.appendChild(missingCell);


        columnTableBody.appendChild(row);

    });

}


function displayPreview(rows) {

    previewHead.innerHTML = "";
    previewBody.innerHTML = "";


    if (!rows || rows.length === 0) {
        return;
    }


    const columns = Object.keys(rows[0]);


    const headerRow =
        document.createElement("tr");


    columns.forEach(column => {

        const th =
            document.createElement("th");

        th.textContent = column;

        headerRow.appendChild(th);

    });


    previewHead.appendChild(headerRow);


    rows.forEach(rowData => {

        const row =
            document.createElement("tr");


        columns.forEach(column => {

            const td =
                document.createElement("td");

            td.textContent =
                rowData[column];

            row.appendChild(td);

        });


        previewBody.appendChild(row);

    });

}


function showStatus(message, isError) {

    statusMessage.textContent = message;

    if (isError) {
        statusMessage.style.color = "#dc2626";
    } else {
        statusMessage.style.color = "#16a34a";
    }

}