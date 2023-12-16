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

// Construct the query URL
const apiUrl = `https://services1.arcgis.com/79kfd2K6fskCAkyg/arcgis/rest/services/Louisville_Metro_KY_Inspection_Violations_of_Failed_Restaurants/FeatureServer/0/query?where=critical_yn%20%3D%20'YES'%20AND%20InspectionDate%20%3E=%20'${formattedOneYearAgo}'%20AND%20InspectionDate%20%3C=%20'${formattedCurrentDate}'&outFields=InspectionDate,premise_name,premise_adr1_street,Insp_Viol_Comments&outSR=4326&f=json`;
return apiUrl;
}


// Function to format a timestamp into a human-readable date.
function formatDateToHumanReadable(timestamp) {
  if (timestamp) {
    const date = new Date(timestamp);
    return date.toDateString();
  }
  return "N/A";
}

// Function to reset the color of the options to their original state.
function resetOptionColors() {
  option1.style.backgroundColor = "";
  option1.style.color = "";
  option2.style.backgroundColor = "";
  option2.style.color = "";
  option3.style.backgroundColor = "";
  option3.style.color = "";
}

// Fetch data from the API and process it.
function fetchData() {
  fetch(constructApiUrl())
    .then(response => response.json())
    .then(data => {
      // Extract the features array from the API response.
      const features = data.features;

      // Select a correct answer and two incorrect answers randomly.
      const correctAnswer = features[Math.floor(Math.random() * features.length)].attributes;
      const incorrectAnswer1 = features[Math.floor(Math.random() * features.length)].attributes;
      const incorrectAnswer2 = features[Math.floor(Math.random() * features.length)].attributes;



      
      // Check if correctAnswer.Insp_Viol_Comments is a case-insensitive match with "null".
      if (correctAnswer.Insp_Viol_Comments.toLowerCase() === "null") {
        // If it matches, call the fetchData function again to get a new set of data.
        fetchData();
        return;
      }

      // Check if correctAnswer, incorrectAnswer1, or incorrectAnswer2 have the same premises
      if (
        (correctAnswer.premise_name === incorrectAnswer1.premise_name &&
          correctAnswer.premise_adr1_street === incorrectAnswer1.premise_adr1_street) ||
        (correctAnswer.premise_name === incorrectAnswer2.premise_name &&
          correctAnswer.premise_adr1_street === incorrectAnswer2.premise_adr1_street) ||
        (incorrectAnswer1.premise_name === incorrectAnswer2.premise_name &&
          incorrectAnswer1.premise_adr1_street === incorrectAnswer2.premise_adr1_street)
      ) {
        // If they have the same premises, call fetchData again to get a new set of data.
        fetchData();
        return;
      }



      
      // Set a boolean attribute 'isCorrect' for the correct and incorrect answers.
      correctAnswer.isCorrect = true;
      incorrectAnswer1.isCorrect = false;
      incorrectAnswer2.isCorrect = false;

      // Format the inspection date for the correct answer (or "N/A" if missing).
      const inspectionDate = formatDateToHumanReadable(correctAnswer.InspectionDate) || "N/A";

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

      // Reset the color of the options.
      resetOptionColors();

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

          // Remove event listeners
          option1.removeEventListener("click", checkAnswer);
          option2.removeEventListener("click", checkAnswer);
          option3.removeEventListener("click", checkAnswer);


          // Dark out all options
          option1.style.backgroundColor = "rgb(50, 25, 0)";
          option1.style.color = "gray";
          option2.style.backgroundColor = "rgb(50, 25, 0)";
          option2.style.color = "gray";
          option3.style.backgroundColor = "rgb(50, 25, 0)";
          option3.style.color = "gray";
          clickedOption.style.backgroundColor = "green"; // Change color to green for correct answer.
          clickedOption.style.color = ""; // Reset text color

          // After a 2-second delay, move on to the next question.
          setTimeout(() => {
            // Reset the color of the options.
            resetOptionColors();
            
            // Call the fetchData function to get new data and update the quiz.
            fetchData();
          }, 750);
        } else {
          clickedOption.style.backgroundColor = "rgb(50, 25, 0)"; // Change color for incorrect answer.;
          clickedOption.style.color = "gray";
        }
      }
    })
    .catch(error => {
      // Handle and log any errors that occur during the data fetch.
      console.error("Error fetching data: " + error);
    });
}

// Call the fetchData function to start the process.
fetchData();
