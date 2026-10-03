const API_URL = "http://127.0.0.1:8000";

let selectedFile = null;
let currentDataset = null;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const fileInput =
    document.getElementById("datasetFile");

const chooseFileButton =
    document.getElementById("chooseFileButton");

const analyzeButton =
    document.getElementById("analyzeButton");

const selectedFileName =
    document.getElementById("selectedFileName");

const uploadStatus =
    document.getElementById("uploadStatus");

const rowsValue =
    document.getElementById("rowsValue");

const columnsValue =
    document.getElementById("columnsValue");

const missingValue =
    document.getElementById("missingValue");

const duplicateValue =
    document.getElementById("duplicateValue");

const columnInfoBody =
    document.getElementById("columnInfoBody");

const previewTableHead =
    document.getElementById("previewTableHead");

const previewTableBody =
    document.getElementById("previewTableBody");


/* =========================================================
   FILE SELECTION
========================================================= */

if (chooseFileButton && fileInput) {

    chooseFileButton.addEventListener(
        "click",
        () => {
            fileInput.click();
        }
    );
}


if (fileInput) {

    fileInput.addEventListener(
        "change",
        () => {

            if (
                !fileInput.files ||
                fileInput.files.length === 0
            ) {

                selectedFile = null;

                if (selectedFileName) {
                    selectedFileName.textContent =
                        "No file selected";
                }

                return;
            }

            selectedFile =
                fileInput.files[0];

            if (selectedFileName) {

                selectedFileName.textContent =
                    selectedFile.name;
            }

            showStatus(
                `Selected: ${selectedFile.name}`,
                "success"
            );
        }
    );
}


/* =========================================================
   ANALYZE DATASET
========================================================= */

if (analyzeButton) {

    analyzeButton.addEventListener(
        "click",
        async () => {

            if (!selectedFile) {

                showStatus(
                    "Please select a CSV or Excel file first.",
                    "error"
                );

                return;
            }

            await uploadDataset();
        }
    );
}


/* =========================================================
   UPLOAD DATASET
========================================================= */

async function uploadDataset() {

    try {

        setLoading(true);

        showStatus(
            "Uploading and analyzing dataset...",
            "loading"
        );

        const formData =
            new FormData();

        formData.append(
            "file",
            selectedFile
        );

        const response =
            await fetch(
                `${API_URL}/api/dataset/upload`,
                {
                    method: "POST",
                    body: formData
                }
            );

        if (!response.ok) {

            let errorMessage =
                "Failed to upload dataset.";

            try {

                const errorData =
                    await response.json();

                if (errorData.detail) {

                    errorMessage =
                        errorData.detail;
                }

            } catch {
                // Ignore JSON parsing error
            }

            throw new Error(
                errorMessage
            );
        }

        const data =
            await response.json();

        currentDataset = data;


        /* -------------------------------------------------
           SAVE DATASET FOR OTHER PAGES
        ------------------------------------------------- */

        localStorage.setItem(
            "datainsight_dataset",
            JSON.stringify(data)
        );


        console.log(
            "Dataset API response:",
            data
        );


        updateDatasetUI(data);


        showStatus(
            "Dataset analyzed successfully.",
            "success"
        );

    } catch (error) {

        console.error(
            "Dataset upload error:",
            error
        );

        showStatus(
            error.message ||
            "Something went wrong.",
            "error"
        );

    } finally {

        setLoading(false);
    }
}


/* =========================================================
   UPDATE DATASET UI
========================================================= */

function updateDatasetUI(data) {

    if (rowsValue) {

        rowsValue.textContent =
            data.rows ?? 0;
    }


    if (columnsValue) {

        columnsValue.textContent =
            data.columns ?? 0;
    }


    if (missingValue) {

        missingValue.textContent =
            data.total_missing_values ?? 0;
    }


    if (duplicateValue) {

        duplicateValue.textContent =
            data.duplicate_rows ?? 0;
    }


    updateColumnInfo(data);

    updatePreview(data);
}


/* =========================================================
   COLUMN INFORMATION
========================================================= */

function updateColumnInfo(data) {

    if (!columnInfoBody) {
        return;
    }

    columnInfoBody.innerHTML = "";

    const columnNames =
        data.column_names || [];

    const dataTypes =
        data.data_types || {};

    const missingValues =
        data.missing_values || {};


    columnNames.forEach(
        (columnName) => {

            const row =
                document.createElement("tr");


            const columnCell =
                document.createElement("td");

            columnCell.textContent =
                columnName;


            const typeCell =
                document.createElement("td");

            typeCell.textContent =
                dataTypes[columnName] ||
                "Unknown";


            const missingCell =
                document.createElement("td");

            missingCell.textContent =
                missingValues[columnName] ?? 0;


            row.appendChild(
                columnCell
            );

            row.appendChild(
                typeCell
            );

            row.appendChild(
                missingCell
            );


            columnInfoBody.appendChild(
                row
            );
        }
    );
}


/* =========================================================
   PREVIEW TABLE
========================================================= */

function updatePreview(data) {

    if (
        !previewTableHead ||
        !previewTableBody
    ) {
        return;
    }


    previewTableHead.innerHTML = "";

    previewTableBody.innerHTML = "";


    const preview =
        data.preview || [];


    if (preview.length === 0) {
        return;
    }


    const columns =
        Object.keys(
            preview[0]
        );


    const headerRow =
        document.createElement("tr");


    columns.forEach(
        (column) => {

            const th =
                document.createElement("th");

            th.textContent =
                column;

            headerRow.appendChild(th);
        }
    );


    previewTableHead.appendChild(
        headerRow
    );


    preview.forEach(
        (record) => {

            const row =
                document.createElement("tr");


            columns.forEach(
                (column) => {

                    const td =
                        document.createElement("td");

                    const value =
                        record[column];


                    td.textContent =
                        value === null ||
                            value === undefined ||
                            value === ""
                            ? "-"
                            : value;


                    row.appendChild(td);
                }
            );


            previewTableBody.appendChild(
                row
            );
        }
    );
}


/* =========================================================
   STATUS
========================================================= */

function showStatus(
    message,
    type = "info"
) {

    if (!uploadStatus) {
        return;
    }


    uploadStatus.textContent =
        message;


    uploadStatus.className =
        `upload-status ${type}`;
}


/* =========================================================
   LOADING
========================================================= */

function setLoading(
    isLoading
) {

    if (!analyzeButton) {
        return;
    }


    analyzeButton.disabled =
        isLoading;


    if (isLoading) {

        analyzeButton.dataset.originalText =
            analyzeButton.textContent;

        analyzeButton.textContent =
            "Analyzing...";

    } else {

        analyzeButton.textContent =
            analyzeButton.dataset.originalText ||
            "Analyze Dataset";
    }
}