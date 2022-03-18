var userFormEl = document.querySelector("#user-form");
var submitButtonEl = document.querySelector("#search-btn");
var eventContainerEl = document.querySelector("#event-list");
var cityInputEl = document.querySelector("#city-name");

$("#datepicker").datepicker({
  minDate: 1
}).formatDate("yy-mm-dd");


// Get Weather API

// Dynamically add to DOM Weather Information


// "https://app.ticketmaster.com/discovery/v2/events.json?&apikey=bQAmmn8y0TYxPWEysqGkzSsdLE6iLGOx&city="+city+"&sort=date%2Cname%2Casc&page=0&size=5";

function getEvents(city) {
  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/events.json?&apikey=bQAmmn8y0TYxPWEysqGkzSsdLE6iLGOx&city="+city+"&sort=date%2Cname%2Casc&page=0&size=5",
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
  if (cityname) {
    getEvents(cityname);
  } else {
    eventContainerEl.innerHTML = "<p class='title'>City Not Found, Please Enter Valid City Name</p>"
  };
  // code here for datepicker
  // var getDate = 
};

// Dynamically add to DOM Event List

function showEvents(json) {
  var items = $('#event-list .column');
  var events = json._embedded.events;
  console.log(events)
  var item = items.first();
  for (var i=0;i<events.length;i++) {
    item.children('#event-title').text(events[i].name);
    item.children('#event-info').text(events[i].dates.start.localDate);
    try {
      item.children('#event-venue').text(events[i]._embedded.venues[0].name + " in " + events[i]._embedded.venues[0].city.name);
    } catch (err) {
      console.log(err);
    }
  }
}

userFormEl.addEventListener("submit", formSubmitHandler);
