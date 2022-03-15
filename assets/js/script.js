var cityInputEl = document.querySelector("#city-name");
var eventContainerEl = document.querySelector("#event-container")

var getLocationEvents = function(city) {
 // format ticketmaster api url
  var apiUrl = "https://app.ticketmaster.com/discovery/v2/events.json?size=5&" + city + "&apikey=bQAmmn8y0TYxPWEysqGkzSsdLE6iLGOx";

  // make request
  fetch(apiUrl).then(function(response){
    if (response.ok) {
      response.json().then(function(data){
        displayEvents(data, city);
      });
    } else {
      // replace the alert with a function that changes the DOM with a City Not Found message
      alert("Error: City not found");
    }
  })
  .catch(function(error) {
    // replace this alert with a function that changes the DOM with a Connection Error message
    alert("unable to connect to github")
  })
};

// Handle Form Submission

var formSubmitHandler = function(event) {
  event.preventDefault();

  // get user inpout
  var cityName = cityInputEl.value.trim();

  if (cityName) {
    getLocationEvents(cityName);
    cityInputEl.value ="";
  } else {
    // replace this alert with a function that changes the dom with a connect error message
    alert("Please Enter a City");
  }
};


var displayEvents = function(){};
// getLocationEvents();