// Format a date as 'YYYY-MM-DD' so it can be used in API query
function formatDateToBeQueryable(date) {
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
return `${year}-${month}-${day}`;
}

// Get the apiURL to only include dates from the past year
function constructApiUrl() {
//Get current date and date from one year ago
const currentDate = new Date();
const oneYearAgo = new Date();
oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

// Format dates in 'YYYY-MM-DD' format
const formattedCurrentDate = formatDateToBeQueryable(currentDate);
const formattedOneYearAgo = formatDateToBeQueryable(oneYearAgo);

// Construct the query URL with dynamic date range and critical_yn condition
const apiUrl = `https://services1.arcgis.com/79kfd2K6fskCAkyg/arcgis/rest/services/Louisville_Metro_KY_Inspection_Violations_of_Failed_Restaurants/FeatureServer/0/query?where=critical_yn%20%3D%20'YES'%20AND%20InspectionDate%20%3E=%20'${formattedOneYearAgo}'%20AND%20InspectionDate%20%3C=%20'${formattedCurrentDate}'&outFields=InspectionDate,premise_name,premise_adr1_street,Insp_Viol_Comments&outSR=4326&f=json`;
return apiUrl;
}



// Function to format a timestamp into a readable date string
function formatDateToHumanReadable(timestamp) {
    if (timestamp) {
        const date = new Date(timestamp);
        return date.toDateString();
    }
    return "N/A";
}

// Function to fetch and populate the sorted table
function populateSortedTable() {
    // Fetch data from the specified API endpoint
    fetch(constructApiUrl())
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
                const inspectionDate = formatDateToHumanReadable(attributes.InspectionDate) || "N/A";
                console.log({att:feature.attributes.InspectionDate,inspectionDate});
                const premiseName = attributes.premise_name || "N/A";
                const violationComments = attributes.Insp_Viol_Comments || "N/A";
                const premise_street = attributes.premise_adr1_street || "N/A";

                // Create a new row and cells in the table
                const row = tableBody.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);

                // Populate cells with data
                cell1.textContent = inspectionDate;
                cell2.textContent = premiseName + " on " + premise_street;
                cell3.textContent = violationComments;
            });
        })
        .catch(error => console.error("Error fetching data: " + error));
}

// Call the function to populate the sorted table
populateSortedTable();
