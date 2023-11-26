// API endpoint for fetching inspection data
const apiUrl = "https://services1.arcgis.com/79kfd2K6fskCAkyg/arcgis/rest/services/Louisville_Metro_KY_Inspection_Violations_of_Failed_Restaurants/FeatureServer/0/query?where=1%3D1&outFields=InspectionDate,premise_name,premise_adr1_street,Insp_Viol_Comments&outSR=4326&f=json";

// Function to format a timestamp into a readable date string
function formatDate(timestamp) {
    if (timestamp) {
        const date = new Date(timestamp);
        return date.toDateString();
    }
    return "N/A";
}

// Function to fetch and populate the sorted table
function populateSortedTable() {
    // Fetch data from the specified API endpoint
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            
        console.log(data.features);
            // Sort features by InspectionDate in descending order
            const sortedFeatures = data.features.sort((a, b) => {
                return new Date(b.attributes.InspectionDate) - new Date(a.attributes.InspectionDate);
            });

            // Get the table body element
            const tableBody = document.querySelector("#dataTable tbody");

            // Iterate through sorted features and populate the table
            sortedFeatures.forEach(feature => {
                const attributes = feature.attributes;
                const inspectionDate = formatDate(attributes.InspectionDate) || "N/A";
                console.log({att:feature.attributes.InspectionDate,inspectionDate});
                const premiseName = attributes.premise_name || "N/A";
                const violationComments = attributes.Insp_Viol_Comments || "N/A";
                const premise_street = attributes.premise_adr1_street || "N/A";

                // Create a new row and cells in the table
                const row = tableBody.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                const cell4 = row.insertCell(3);

                // Populate cells with data
                cell1.textContent = inspectionDate;
                cell2.textContent = premiseName;
                cell3.textContent = premise_street;
                cell4.textContent = violationComments;
            });
        })
        .catch(error => console.error("Error fetching data: " + error));
}

// Call the function to populate the sorted table
populateSortedTable();
