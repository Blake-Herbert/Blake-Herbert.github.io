// Define the URL for the ArcGIS REST API endpoint.
const apiUrl = "https://services1.arcgis.com/79kfd2K6fskCAkyg/arcgis/rest/services/Louisville_Metro_KY_Inspection_Violations_of_Failed_Restaurants/FeatureServer/0/query?where=1%3D1&outFields=InspectionDate,premise_name,premise_adr1_street,Insp_Viol_Comments&outSR=4326&f=json";

// Function to format a timestamp into a human-readable date.
function formatDate(timestamp) {
  if (timestamp) {
      const date = new Date(timestamp);
      return date.toDateString();
  }
  return "N/A";
}

// Fetch data from the API and process it.
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Extract the features array from the API response.
    const features = data.features;
    
    // Select a correct answer and two incorrect answers randomly.
    const correctAnswer = features[Math.floor(Math.random() * features.length)].attributes;
    const incorrectAnswer1 = features[Math.floor(Math.random() * features.length)].attributes;
    const incorrectAnswer2 = features[Math.floor(Math.random() * features.length)].attributes;
    
    // Set a boolean attribute 'isCorrect' for the correct and incorrect answers.
    correctAnswer.isCorrect = true;
    incorrectAnswer1.isCorrect = false;
    incorrectAnswer2.isCorrect = false;

    // Format the inspection date for the correct answer (or "N/A" if missing).
    const inspectionDate = formatDate(correctAnswer.InspectionDate) || "N/A";
    
    // Create an array to hold the answer options.
    const answers = [correctAnswer, incorrectAnswer1, incorrectAnswer2];

    // Function to shuffle the answer options randomly.
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
    }

    // Shuffle the answer options.
    shuffleArray(answers);

    // Get references to HTML elements by their IDs.
    const promptDiv = document.getElementById("prompt");
    const option1 = document.getElementById("option1");
    const option2 = document.getElementById("option2");
    const option3 = document.getElementById("option3");

    // Populate the HTML elements with the question and answer options.
    promptDiv.textContent = "\"" + correctAnswer.Insp_Viol_Comments + "\" - " + inspectionDate;
    option1.textContent = answers[0].premise_name + " on " + answers[0].premise_adr1_street;
    option2.textContent = answers[1].premise_name + " on " + answers[1].premise_adr1_street;
    option3.textContent = answers[2].premise_name + " on " + answers[2].premise_adr1_street;

    // Add event listeners to each option.
    option1.addEventListener("click", checkAnswer);
    option2.addEventListener("click", checkAnswer);
    option3.addEventListener("click", checkAnswer);

    // Function to check if the clicked option is correct.
    function checkAnswer(event) {
    const clickedOption = event.currentTarget;
    // Get the corresponding data object from the original array.
    const clickedData = answers.find(answer => answer.premise_name === clickedOption.textContent.split(" on ")[0]);

    // Check the 'isCorrect' attribute to determine if the clicked option is correct.
    const isCorrect = clickedData.isCorrect;

    // Update the color of the clicked option based on correctness.
    if (isCorrect) {
      clickedOption.style.backgroundColor = "green"; // Change color to green for correct answer.
      alert("Correct answer!");
    } else {
      clickedOption.style.backgroundColor = "red"; // Change color to red for incorrect answer.
      alert("Incorrect answer. Try again.");
    }
  }
  }
)
  .catch(error => {
    // Handle and log any errors that occur during the data fetch.
    console.error("Error fetching data: " + error);
  });