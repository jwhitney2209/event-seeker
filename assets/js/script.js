var userFormEl = document.querySelector("#user-form")
var submitButtonEl = document.querySelector("#search-btn")
var cityInputEl = document.querySelector("#city-name");
var eventContainerEl = document.querySelector("#event-list")

// Get Weather API

// Dynamically add to DOM Weather Information

// Dynamically add to DOM Event List

// set variables for specific data  "var eventInfo = _embedded.events"

function getEvents(page) {

  $('#events-panel').show();
  $('#attraction-panel').hide();

  if (page < 0) {
    page = 0;
    return;
  }
  if (page > 0) {
    if (page > getEvents.json.page.totalPages-1) {
      page=0;
    }
  }
  
  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/events.json?apikey=bQAmmn8y0TYxPWEysqGkzSsdLE6iLGOx&size=5&page="+page,
    async:true,
    dataType: "json",
    success: function(json) {
          getEvents.json = json;
  			  showEvents(json);
  		   },
    error: function(xhr, status, err) {
  			  console.log(err);
  		   }
  });
}

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


var displayEvents = function(){

};

submitButtonEl.addEventListener("submit", formSubmitHandler);
getLocationEvents();