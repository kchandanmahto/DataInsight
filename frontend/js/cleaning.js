const API_URL = "http://127.0.0.1:8000";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const cleanBtn =
    document.getElementById("cleanBtn");

const resetBtn =
    document.getElementById("resetBtn");

const missingToggle =
    document.getElementById("missingToggle");

const duplicateToggle =
    document.getElementById("duplicateToggle");

const datatypeToggle =
    document.getElementById("datatypeToggle");


/* =========================================================
   DATASET / REPORT ELEMENTS
========================================================= */

/*
    Your HTML does not have IDs for these elements.
    So we select them based on their existing classes/order.
*/

const selectedDatasetName =
    document.querySelector(
        ".selected-dataset strong"
    );

const selectedDatasetInfo =
    document.querySelector(
        ".selected-dataset span"
    );


/* Quality cards */

const qualityCards =
    document.querySelectorAll(
        ".quality-card"
    );


/* Report cards */

const reportItems =
    document.querySelectorAll(
        ".report-item"
    );


/* Download button */

const downloadButton =
    document.querySelector(
        ".download-area .secondary-button"
    );


/* =========================================================
   STATE
========================================================= */

let currentDataset = null;

let cleanedDataset = null;


/* =========================================================
   LOAD DATASET
========================================================= */

function loadCurrentDataset() {

    const savedDataset =
        localStorage.getItem(
            "datainsight_dataset"
        );


    if (!savedDataset) {

        console.warn(
            "No dataset found."
        );

        updateDatasetDisplay(null);

        return null;
    }


    try {

        currentDataset =
            JSON.parse(savedDataset);

        console.log(
            "Loaded dataset:",
            currentDataset
        );


        updateDatasetDisplay(
            currentDataset
        );


        return currentDataset;

    } catch (error) {

        console.error(
            "Invalid saved dataset:",
            error
        );

        return null;
    }
}


/* =========================================================
   UPDATE SELECTED DATASET DISPLAY
========================================================= */

function updateDatasetDisplay(
    dataset
) {

    if (!dataset) {

        if (selectedDatasetName) {

            selectedDatasetName.textContent =
                "No dataset selected";
        }


        if (selectedDatasetInfo) {

            selectedDatasetInfo.textContent =
                "Upload a dataset from the Dataset page";
        }


        return;
    }


    if (selectedDatasetName) {

        selectedDatasetName.textContent =
            dataset.filename ||
            "Selected Dataset";
    }


    if (selectedDatasetInfo) {

        selectedDatasetInfo.textContent =
            `${dataset.rows ?? 0} rows · ${dataset.columns ?? 0} columns`;
    }


    /*
        Update CSV / Excel icon
    */

    const fileIcon =
        document.querySelector(
            ".dataset-file-icon"
        );


    if (fileIcon && dataset.filename) {

        const extension =
            dataset.filename
                .split(".")
                .pop()
                .toUpperCase();

        fileIcon.textContent =
            extension;
    }
}


/* =========================================================
   UPDATE DATA QUALITY
========================================================= */

function updateDataQuality(
    dataset
) {

    if (!dataset) {
        return;
    }


    if (!qualityCards ||
        qualityCards.length < 4) {

        return;
    }


    /* -----------------------------------------------------
       Missing Values
    ----------------------------------------------------- */

    const missingCount =
        dataset.total_missing_values ?? 0;


    const missingStrong =
        qualityCards[0]
            .querySelector("strong");

    const missingSmall =
        qualityCards[0]
            .querySelector("small");


    if (missingStrong) {

        missingStrong.textContent =
            missingCount;
    }


    if (missingSmall) {

        missingSmall.textContent =
            missingCount === 0
                ? "No missing values"
                : `${missingCount} missing values found`;
    }


    /* -----------------------------------------------------
       Duplicate Rows
    ----------------------------------------------------- */

    const duplicateCount =
        dataset.duplicate_rows ?? 0;


    const duplicateStrong =
        qualityCards[1]
            .querySelector("strong");

    const duplicateSmall =
        qualityCards[1]
            .querySelector("small");


    if (duplicateStrong) {

        duplicateStrong.textContent =
            duplicateCount;
    }


    if (duplicateSmall) {

        duplicateSmall.textContent =
            duplicateCount === 0
                ? "No duplicate records"
                : `${duplicateCount} duplicate records`;
    }


    /* -----------------------------------------------------
       Data Types / Columns
    ----------------------------------------------------- */

    const columnCount =
        dataset.columns ?? 0;


    const datatypeStrong =
        qualityCards[2]
            .querySelector("strong");

    const datatypeSmall =
        qualityCards[2]
            .querySelector("small");


    if (datatypeStrong) {

        datatypeStrong.textContent =
            columnCount;
    }


    if (datatypeSmall) {

        datatypeSmall.textContent =
            "Columns detected";
    }


    /* -----------------------------------------------------
       Overall Data Quality
    ----------------------------------------------------- */

    const qualityStrong =
        qualityCards[3]
            .querySelector("strong");

    const qualitySmall =
        qualityCards[3]
            .querySelector("small");


    const hasProblems =
        missingCount > 0 ||
        duplicateCount > 0;


    if (qualityStrong) {

        qualityStrong.textContent =
            hasProblems
                ? "Needs Cleaning"
                : "Good";
    }


    if (qualitySmall) {

        qualitySmall.textContent =
            hasProblems
                ? "Cleaning recommended"
                : "Ready for analysis";
    }


    if (qualityStrong) {

        qualityStrong.classList.toggle(
            "success-value",
            !hasProblems
        );
    }
}


/* =========================================================
   CLEAN DATASET BUTTON
========================================================= */

if (cleanBtn) {

    cleanBtn.addEventListener(
        "click",
        async () => {

            await cleanDataset();
        }
    );
}


/* =========================================================
   CLEAN DATASET API
========================================================= */

async function cleanDataset() {

    /* -----------------------------------------------------
       Make sure dataset exists
    ----------------------------------------------------- */

    if (!currentDataset) {

        currentDataset =
            loadCurrentDataset();
    }


    if (!currentDataset) {

        showMessage(
            "Please upload and analyze a dataset first.",
            "error"
        );

        return;
    }


    /* -----------------------------------------------------
       Dataset ID check
    ----------------------------------------------------- */

    if (!currentDataset.dataset_id) {

        showMessage(
            "Dataset ID not found. Please upload the dataset again.",
            "error"
        );

        return;
    }


    try {

        setCleaningLoading(true);


        showMessage(
            "Cleaning dataset...",
            "loading"
        );


        /* -------------------------------------------------
           Form Data
        ------------------------------------------------- */

        const formData =
            new FormData();


        formData.append(
            "dataset_id",
            currentDataset.dataset_id
        );


        formData.append(
            "remove_missing",
            String(
                missingToggle
                    ? missingToggle.checked
                    : true
            )
        );


        formData.append(
            "remove_duplicates",
            String(
                duplicateToggle
                    ? duplicateToggle.checked
                    : true
            )
        );


        formData.append(
            "validate_datatypes",
            String(
                datatypeToggle
                    ? datatypeToggle.checked
                    : true
            )
        );


        console.log(
            "Cleaning options:",
            {
                dataset_id:
                    currentDataset.dataset_id,

                remove_missing:
                    missingToggle
                        ? missingToggle.checked
                        : true,

                remove_duplicates:
                    duplicateToggle
                        ? duplicateToggle.checked
                        : true,

                validate_datatypes:
                    datatypeToggle
                        ? datatypeToggle.checked
                        : true
            }
        );


        /* -------------------------------------------------
           API CALL
        ------------------------------------------------- */

        const response =
            await fetch(
                `${API_URL}/api/dataset/clean`,
                {
                    method: "POST",
                    body: formData
                }
            );


        /* -------------------------------------------------
           Error handling
        ------------------------------------------------- */

        if (!response.ok) {

            let errorMessage =
                "Failed to clean dataset.";


            try {

                const errorData =
                    await response.json();


                if (errorData.detail) {

                    errorMessage =
                        errorData.detail;
                }

            } catch {
                // Ignore JSON parse error
            }


            throw new Error(
                errorMessage
            );
        }


        /* -------------------------------------------------
           Response
        ------------------------------------------------- */

        const data =
            await response.json();


        console.log(
            "Cleaning API response:",
            data
        );


        cleanedDataset =
            data;


        /* -------------------------------------------------
           Save cleaned dataset
        ------------------------------------------------- */

        localStorage.setItem(
            "datainsight_cleaned_dataset",
            JSON.stringify(data)
        );


        /* -------------------------------------------------
           Update report
        ------------------------------------------------- */

        updateCleaningReport(
            data.report
        );


        /* -------------------------------------------------
           Update quality using cleaned data
        ------------------------------------------------- */

        if (data.cleaned_dataset) {

            updateDataQuality(
                data.cleaned_dataset
            );
        }


        /* -------------------------------------------------
           Download
        ------------------------------------------------- */

        if (downloadButton) {

            downloadButton.disabled =
                false;


            if (data.download_url) {

                downloadButton.dataset.url =
                    `${API_URL}${data.download_url}`;
            }
        }


        /* -------------------------------------------------
           Success
        ------------------------------------------------- */

        cleanBtn.textContent =
            "Dataset Cleaned ✓";


        showMessage(
            "Dataset cleaned successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Cleaning error:",
            error
        );


        showMessage(
            error.message ||
            "Something went wrong while cleaning the dataset.",
            "error"
        );


    } finally {

        setCleaningLoading(
            false
        );
    }
}


/* =========================================================
   UPDATE CLEANING REPORT
========================================================= */

function updateCleaningReport(
    report
) {

    if (!report) {
        return;
    }


    /*
        HTML report order:

        0 → Original Rows
        1 → Rows Removed
        2 → Missing Values Fixed
        3 → Final Rows
    */


    if (reportItems.length >= 4) {


        /* Original Rows */

        const originalRows =
            reportItems[0]
                .querySelector("strong");


        if (originalRows) {

            originalRows.textContent =
                report.original_rows ?? 0;
        }


        /* Rows Removed */

        const rowsRemoved =
            reportItems[1]
                .querySelector("strong");


        if (rowsRemoved) {

            rowsRemoved.textContent =
                report.rows_removed ?? 0;
        }


        /* Missing Values Fixed */

        const missingFixed =
            reportItems[2]
                .querySelector("strong");


        if (missingFixed) {

            missingFixed.textContent =
                report.filled_missing_values ?? 0;
        }


        /* Final Rows */

        const finalRows =
            reportItems[3]
                .querySelector("strong");


        if (finalRows) {

            finalRows.textContent =
                report.final_rows ?? 0;
        }
    }
}


/* =========================================================
   LOADING STATE
========================================================= */

function setCleaningLoading(
    isLoading
) {

    if (!cleanBtn) {
        return;
    }


    cleanBtn.disabled =
        isLoading;


    if (isLoading) {

        cleanBtn.dataset.originalText =
            cleanBtn.textContent;

        cleanBtn.textContent =
            "Cleaning...";

    } else {

        if (!cleanedDataset) {

            cleanBtn.textContent =
                cleanBtn.dataset.originalText ||
                "Clean Dataset";
        }
    }
}


/* =========================================================
   RESET
========================================================= */

if (resetBtn) {

    resetBtn.addEventListener(
        "click",
        () => {

            /* Reset toggles */

            if (missingToggle) {

                missingToggle.checked =
                    true;
            }


            if (duplicateToggle) {

                duplicateToggle.checked =
                    true;
            }


            if (datatypeToggle) {

                datatypeToggle.checked =
                    true;
            }


            /* Reset state */

            cleanedDataset =
                null;


            /* Reset button */

            if (cleanBtn) {

                cleanBtn.disabled =
                    false;

                cleanBtn.textContent =
                    "Clean Dataset";
            }


            /* Reset report */

            resetCleaningReport();


            /* Reset download */

            if (downloadButton) {

                downloadButton.disabled =
                    true;

                delete downloadButton.dataset.url;
            }


            /* Restore original quality */

            if (currentDataset) {

                updateDataQuality(
                    currentDataset
                );
            }


            showMessage(
                "Cleaning options reset.",
                "info"
            );
        }
    );
}


/* =========================================================
   RESET REPORT
========================================================= */

function resetCleaningReport() {

    if (reportItems.length < 4) {
        return;
    }


    const values = [
        currentDataset
            ? currentDataset.rows ?? 0
            : 0,

        0,

        0,

        currentDataset
            ? currentDataset.rows ?? 0
            : 0
    ];


    reportItems.forEach(
        (item, index) => {

            const strong =
                item.querySelector("strong");


            if (strong) {

                strong.textContent =
                    values[index] ?? 0;
            }
        }
    );
}


/* =========================================================
   DOWNLOAD CLEANED DATASET
========================================================= */

if (downloadButton) {

    downloadButton.addEventListener(
        "click",
        () => {

            const url =
                downloadButton.dataset.url;


            if (!url) {

                showMessage(
                    "Please clean the dataset first.",
                    "error"
                );

                return;
            }


            window.open(
                url,
                "_blank"
            );
        }
    );
}


/* =========================================================
   STATUS MESSAGE
========================================================= */

function showMessage(
    message,
    type = "info"
) {

    /*
        Your cleaning.html does not currently
        have a dedicated status element.

        So we use a small temporary message.
    */


    let status =
        document.getElementById(
            "cleaningStatus"
        );


    if (!status) {

        status =
            document.createElement(
                "div"
            );

        status.id =
            "cleaningStatus";

        status.style.marginTop =
            "12px";

        status.style.padding =
            "10px 14px";

        status.style.borderRadius =
            "10px";

        status.style.fontSize =
            "13px";

        status.style.fontWeight =
            "600";


        if (cleanBtn) {

            cleanBtn
                .parentElement
                .after(status);
        }
    }


    status.textContent =
        message;


    if (type === "success") {

        status.style.background =
            "#ecfdf5";

        status.style.color =
            "#047857";

    } else if (type === "error") {

        status.style.background =
            "#fef2f2";

        status.style.color =
            "#b91c1c";

    } else if (type === "loading") {

        status.style.background =
            "#eef2ff";

        status.style.color =
            "#4f46e5";

    } else {

        status.style.background =
            "#f8fafc";

        status.style.color =
            "#64748b";
    }
}


/* =========================================================
   INITIALIZE PAGE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        currentDataset =
            loadCurrentDataset();


        if (currentDataset) {

            updateDataQuality(
                currentDataset
            );


            resetCleaningReport();
        }
    }
);