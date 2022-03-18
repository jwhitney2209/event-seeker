var userFormEl = document.querySelector("#user-form");
var submitButtonEl = document.querySelector("#search-btn");
var eventContainerEl = document.querySelector("#event-list");
var cityInputEl = document.querySelector("#city-name");
var dateInputEl = document.querySelector("#datepicker")
var eventContainerEl = $('#event-list');

$(function() {
  $("#datepicker").datepicker({
    minDate: 1,
    dateFormat: "yy-mm-dd"
  });
});

// Get Weather API

// Dynamically add to DOM Weather Information

var dataArr = [1, 2, 3, 4, 5];

// "https://app.ticketmaster.com/discovery/v2/events.json?&apikey=bQAmmn8y0TYxPWEysqGkzSsdLE6iLGOx&city="+city+"&sort=date%2Cname%2Casc&page=0&size=5";

function getEvents(city, startdate) {
  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/events.json?&apikey=bQAmmn8y0TYxPWEysqGkzSsdLE6iLGOx&city="+city+"&startEndDateTime="+startdate+"T14%3A00%3A00Z&sort=date%2Cname%2Casc&page=0&size=5",
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
};

var formSubmitHandler = function(event) {
  event.preventDefault();
  // get city name
  var cityname = cityInputEl.value.trim();
  var getStartDate = dateInputEl.value.trim();
  if (cityname, getStartDate) {
    getEvents(cityname, getStartDate);
  } else {
    eventContainerEl.innerHTML = "<p class='title'>City Not Found, Please Enter Valid City Name</p>"
  };
};


// Dynamically add to DOM Event List

// events[i].name
// events[i].dates.start.localDate
// events[i]._embedded.venues[0].name

function showEvents(json) {
  var events = json._embedded.events;

  for (var i=0;i< 5; i++) {
    // event title 
    var eventTitleEl = document.createElement("p");
    eventTitleEl.classList = "title is-5"
    eventTitleEl.setAttribute("id", "event-title")
    eventTitleEl.textContent = events[i].name;
    
    // event date
    var eventDateEl = document.createElement("p");
    eventDateEl.classList = "subtitle"
    eventDateEl.setAttribute("id", "event-date")
    eventDateEl.textContent = events[i].dates.start.localDate;

    // event venue
    var eventVenueEl = document.createElement("p");
    eventVenueEl.classList = "subtitle is-6"
    eventVenueEl.setAttribute("id", "event-venue")
    eventVenueEl.textContent = events[i]._embedded.venues[0].name;

    eventContainerEl.append(eventTitleEl);
    eventContainerEl.append(eventDateEl);
    eventContainerEl.append(eventVenueEl);
  }

}

userFormEl.addEventListener("submit", formSubmitHandler);
