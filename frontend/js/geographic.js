const generateMapBtn =
    document.getElementById("generateMapBtn");

const geoStatus =
    document.getElementById("geoStatus");


generateMapBtn.addEventListener("click", () => {

    const latitude =
        document.getElementById("latitudeColumn").value;

    const longitude =
        document.getElementById("longitudeColumn").value;


    generateMapBtn.textContent =
        "Generating Map...";

    generateMapBtn.disabled = true;


    geoStatus.textContent =
        `Processing ${latitude} and ${longitude} coordinates...`;


    setTimeout(() => {

        generateMapBtn.textContent =
            "Map Generated ✓";

        generateMapBtn.disabled = false;


        geoStatus.textContent =
            "Geographic visualization generated successfully.";

    }, 1000);

});