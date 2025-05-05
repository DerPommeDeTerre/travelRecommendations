const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const timeResult = document.getElementById("localTime");
const searchResult = document.getElementById("searchResult");
const clearBtn = document.getElementById("clearBtn");
const searchIcon = document.getElementById("searchIcon");

let travelData = [];
let inputData = "";
let clockInterval = null;

//Function to retrieve data
function retrieveData(){

    fetch("travel_recommendation_api.json")
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        travelData = data;
    })
    .catch(function(error){
        console.log("Data not received", error);
    })
}
//Retrieve function can also be done like this:
// async function retrieveData(){
//     try{
//         const response = await fetch("travel_recommendation_api.json");
//         const data = await response.json();
//         travelData = data;
//     } catch(error) {
//         console.log("Data not received", error);
//     }
// }

retrieveData();
//Function to read users' data
function readInput(){
    searchInput.addEventListener("keyup", function(event){
        inputData = event.target.value.toLowerCase().trim();

        console.log(inputData);
        stopClock();
        timeResult.innerHTML = "";

        if(inputData.length > 0){
            searchResult.innerHTML = "";
        }
    })
}
readInput();
clickButton();
eventSearchIcon();

//Event listener for the button and search input
function clickButton(){
    searchBtn.addEventListener("click", function(){
        handleSearch();
    })

    searchInput.addEventListener("keyup", function(event){
        if(event.key === "Enter"){
        handleSearch();
        }
    })
}

function eventSearchIcon(){

    searchIcon.addEventListener("click", function(){
        handleSearch();
    })
}


//Function to handle search
function handleSearch(){

    if(inputData === ""){ //Validates the input data
        searchResult.innerHTML = "Please, enter a search term.";
        stopClock();
        timeResult.innerHTML = "";
    } else {
        searchResult.innerHTML = "";
        let results = searchData(inputData); //results stores the resultSearch array from
                                            //searchData function
        //console.log(results);
        setTime(results);
        displayResults(results);
        searchInput.value = "";
        inputData = "";
    }

}

//Event listener for clear button
function clearButton(){
    clearBtn.addEventListener("click", function(){
        console.log("button clicked");
        clearContent();
    })
}
clearButton();

function clearContent(){
    searchResult.innerHTML = "";
    timeResult.innerHTML = "";
    searchInput.value = "";
    inputData = "";
    stopClock();
}

//Function to search data
function searchData(inputData){
    let keyword = inputData;
    let resultSearch = [];

  const countryKeyWord = keyword === "country"||keyword === "countries"//Display all results whhen country or countries keyword is typed

    travelData.countries.forEach(function(country){
        country.cities.forEach(function(city){
            if(city.name.toLowerCase().trim().includes(keyword)||city.description.toLowerCase().trim().includes(keyword)||keyword === "city"||keyword === "cities"||countryKeyWord){
                resultSearch.push({
                    name: city.name,
                    timeZone: city.timeZone,
                    imageUrl: city.imageUrl,
                    description: city.description
                })
            }
        })
    })

    travelData.temples.forEach(function(temple){
        if(temple.name.toLowerCase().trim().includes(keyword)||temple.description.toLowerCase().trim().includes(keyword)||keyword === "temple"||keyword === "temples"||countryKeyWord){
            resultSearch.push({
                name: temple.name,
                timeZone: temple.timeZone,
                imageUrl: temple.imageUrl,
                description: temple.description
            })
        }
    })

    travelData.beaches.forEach(function(beach){
        if(beach.name.toLowerCase().trim().includes(keyword)||beach.description.toLowerCase().trim().includes(keyword)||keyword === "beach"||keyword === "beaches"||countryKeyWord){
            resultSearch.push({
                name: beach.name,
                timeZone: beach.timeZone,
                imageUrl: beach.imageUrl,
                description: beach.description
            })
        }
    })

    return resultSearch;
}

//Function to set time
function setTime(resultsArray) {
    stopClock();

    try {
        if (!Array.isArray(resultsArray) || resultsArray.length === 0) {
            displayTime("No results found.");
            return;
        }

        let element = resultsArray[0];
        let timeCode = element.timeZone;
        let placeName = element.name;

        function updateClock() {
            const options = {
                timeZone: timeCode,
                hour12: true,
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
            };
            const currentTime = new Date().toLocaleTimeString('en-US', options);
            let localClock = `Current time in ${placeName}: ${currentTime}`;
            displayTime(localClock);
            console.log(localClock);
        }

        updateClock();
        clockInterval = setInterval(updateClock, 1000);
    } catch (error) {
        console.error("Error setting time:", error);
        displayTime("Unable to retrieve time.");
    }
}

//Function to stop generated clocks
function stopClock(){
    if(clockInterval){
        clearInterval(clockInterval);
        clockInterval = null;
    }
}
//Function to display results
function displayResults(results){
    searchResult.innerHTML = "";

    if(results.length > 0){
        results.forEach(function(item, index){
            searchResult.innerHTML += `
            <div class="resultCard" data-index=${index}>
                <img class="cardImage" src="${item.imageUrl}">
                <h3 class="cardH3">${item.name}</h3>
                <p class="cardP">${item.description}</p>
            </div>
            `;
        });
        eventTimeCard(results);
    } else {
        searchResult.innerHTML = "No results found.";
    }
}

// Function to display time
function displayTime(timeInPlace){
    timeResult.innerHTML = "";

    if(timeInPlace){
        timeResult.innerHTML = `
        <div id="localTime-container">
        <p id="timeP">${timeInPlace}</p>
        <div>
        `
    };
}
//function to select time zone from results
function eventTimeCard(results){
    const resultCards = document.querySelectorAll(".resultCard");

    resultCards.forEach(function(card){
        card.addEventListener("click", function(){
            const index = this.getAttribute("data-index");
            const selectedItem = results[index];
            setTime([selectedItem]);
        });
    });
}


// function searchPlace() {
//     const input = document.getElementById("searchInput").value.toLowerCase();
//     const resultDiv = document.getElementById("searchResult");
//     resultDiv.innerHTML = "";

//     fetch("travel_recommendation_api.json")
//         .then(function(response) {
//             return response.json();
//         })
//         .then(function(data) {
//             let matches = [];

//             // Search in countries
//             data.countries.forEach(function(country) {
//                 if (country.name.toLowerCase().includes(input)) {
//                     let imageUrl = "";
//                     let description = "No description available";

//                     if (country.cities.length > 0 && country.cities[0].imageUrl) {
//                         imageUrl = country.cities[0].imageUrl;
//                     }

//                     if (country.cities.length > 0 && country.cities[0].description) {
//                         description = country.cities[0].description;
//                     }

//                     matches.push({
//                         name: country.name,
//                         imageUrl: imageUrl,
//                         description: description
//                     });
//                 }

//                 // Additionally, search inside the cities
//                 country.cities.forEach(function(city) {
//                     if (city.name.toLowerCase().includes(input) || city.description.toLowerCase().includes(input)) {
//                         matches.push({
//                             name: city.name,
//                             imageUrl: city.imageUrl,
//                             description: city.description
//                         });
//                     }
//                 });
//             });

//             // Search in temples
//             data.temples.forEach(function(temple) {
//                 if (temple.name.toLowerCase().includes(input) || temple.description.toLowerCase().includes(input)) {
//                     matches.push({
//                         name: temple.name,
//                         imageUrl: temple.imageUrl,
//                         description: temple.description
//                     });
//                 }
//             });

//             // Search in beaches
//             data.beaches.forEach(function(beach) {
//                 if (beach.name.toLowerCase().includes(input) || beach.description.toLowerCase().includes(input)) {
//                     matches.push({
//                         name: beach.name,
//                         imageUrl: beach.imageUrl,
//                         description: beach.description
//                     });
//                 }
//             });

//             // Show results
//             if (matches.length > 0) {
//                 matches.forEach(function(place) {
//                     resultDiv.innerHTML += `
//                         <div class="card">
//                             <img src="${place.imageUrl}" alt="${place.name}" class="card-img">
//                             <h3>${place.name}</h3>
//                             <p>${place.description}</p>
//                         </div>
//                     `;
//                 });
//             } else {
//                 resultDiv.innerHTML = "No destinations found.";
//             }
//         })
//         .catch(function(error) {
//             console.error("Error", error);
//             resultDiv.innerHTML = "An error occurred while fetching data.";
//         });
// }

// Attach event listener
// searchBtn.addEventListener("click", searchPlace);

// function clearBtn(){
//     document.getElementById("searchInput").value = "";
//     document.getElementById("searchResult").innerHTML = "";
// }
// clearAllBtn.addEventListener("click", clearBtn);