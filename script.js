const apiUrl = "https://services1.arcgis.com/79kfd2K6fskCAkyg/arcgis/rest/services/Louisville_Metro_KY_Inspection_Violations_of_Failed_Restaurants/FeatureServer/0/query?where=1%3D1&outFields=InspectionDate,premise_name,premise_adr1_street,Insp_Viol_Comments&outSR=4326&f=json";

function formatDate(timestamp) {
    if (timestamp) {
        const date = new Date(timestamp);
        return date.toDateString();
    }
    return "N/A";
}

// Function to fetch and populate the table
function populateTable() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#dataTable tbody");

            data.features.forEach(feature => {
                const attributes = feature.attributes;
                const inspectionDate = formatDate(attributes.InspectionDate) || "N/A";
                const premiseName = attributes.premise_name || "N/A";
                const violationComments = attributes.Insp_Viol_Comments || "N/A";
                const premise_street = attributes.premise_adr1_street || "N/A";

                const row = tableBody.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                const cell4 = row.insertCell(3);

                cell1.textContent = inspectionDate;
                cell2.textContent = premiseName;
                cell3.textContent = premise_street;
                cell4.textContent = violationComments;
            });
        })
        .catch(error => console.error("Error fetching data: " + error));
}

// Call the function to populate the table
populateTable();
