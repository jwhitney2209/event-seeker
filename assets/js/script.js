// declared variables
var userFormEl = document.querySelector("#user-form");
var submitButtonEl = document.querySelector("#search-btn");
var eventContainerEl = document.querySelector("#event-list");
var eventCityEl = document.querySelector("#city-search")
var cityInputEl = document.querySelector("#city-name");
var dateInputEl = document.querySelector("#datepicker")
var recentSearchEl = document.querySelector("#recent-searches");

var searchHistory = [];
var searchDate = [];

// datepicker for selecting event day user is looking for
$(function() {
  $("#datepicker").datepicker({
    minDate: 0,
    maxDate: 6,
    dateFormat: "yy-mm-dd"
  });
});

var apiKey = "edb9f78900c4573920e4c01ff60162d2";

// Get Weather API
function getCoordinates(city) {
  $.ajax({
    type:"GET",
    url:"https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid="+apiKey,
    async:true,
    dataType: "json",
    success: function(json) {
      getCoordinates.json = json;
      getWeather(json.coord); // this is sending only the coordinate data from the Geocoding API data that we're requesting... to the getWeather function below
    },
    error: function(err) {
      console.log(err);
    }
  })
}
// Dynamically add to DOM Weather Information
function getEvents(city, startdate) {
  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/events.json?&apikey=bQAmmn8y0TYxPWEysqGkzSsdLE6iLGOx&city="+city+"&startEndDateTime="+startdate+"T14%3A00%3A00Z&sort=date%2Cname%2Casc&page=0&size=5",
    async:true,
    dataType: "json",
    success: function(json) {
          getEvents.json = json;
          // console.log(json);
  			  showEvents(json);
  		   },
    error: function(xhr, status, err) {
  			  console.log(err);
  		   }
  });
};

function getWeather(coord) {
  $.ajax({
    type:"GET",
    url:"https://api.openweathermap.org/data/2.5/onecall?lat="+coord.lat+"&lon="+coord.lon+"&units=imperial&appid="+apiKey,
    async:true,
    dataType: "json",
    success: function(json) {
          getWeather.json = json;
          // console.log(json);
          var daily = json.daily;
          // console.log(daily);
          for (i = 0; i < daily.length; i++) {
            var date = moment(daily[i].dt*1000).format('MM-DD-YYYY');
            var iconCode =  daily[i].weather[0].icon;
            var iconUrl = 'http://openweathermap.org/img/wn/'+iconCode+'.png';
            var tempLo = Math.round(daily[i].temp.min);
            var tempHi = Math.round(daily[i].temp.max);
            $('#forecastDate'+i).html(date);
            $('#forecastIcon'+i).html('<img src='+iconUrl+'>');
            $('#forecastLo'+i).html(tempLo + "\xB0" + "F");
            $('#forecastHi'+i).html(tempHi + "\xB0" + "F");
          }
  		   },
    error: function(xhr, status, err) {
  			  console.log(err);
  		   }
  });
};



// Dynamically add to DOM Event List
function showEvents(json) {
  if (json.length === 0) {
    eventContainerEl.textContent = "No Events Found";
    return;
  }
  // clear out existing events from previous search
  eventContainerEl.textContent = "";

  var events = json._embedded.events;

  var eventListCity = cityInputEl.value.trim();
  eventCityEl.textContent = "Showing Results for: "+eventListCity+".";

  // loop over events
  for (var i=0;i< 5; i++) {
    // event box
    var eventBoxEl = document.createElement("div");
    eventBoxEl.classList = "box";
    eventBoxEl.setAttribute("id", "event-list-box")

    // event title 
    var eventTitleEl = document.createElement("p");
    eventTitleEl.classList = "title is-5 has-text-white";
    eventTitleEl.setAttribute("id", "event-title");
    eventTitleEl.textContent = events[i].name;
    
    // event date
    var eventDateEl = document.createElement("p");
    eventDateEl.classList = "subtitle is-6 has-text-white";
    eventDateEl.setAttribute("id", "event-date");
    eventDateEl.textContent = "Date: " + events[i].dates.start.localDate;

    // event venue
    var eventVenueEl = document.createElement("p");
    eventVenueEl.classList = "subtitle is-6 mb-4 has-text-white";
    eventVenueEl.setAttribute("id", "event-venue");
    eventVenueEl.textContent = events[i]._embedded.venues[0].name;

    // get tickets
    var getTicketEl = document.createElement("button");
    getTicketEl.classList = "button is-info";
    getTicketEl.setAttribute("id", "ticketsBtn");
    getTicketEl.innerHTML = "<a href='"+events[i].url+"' target='_blank'>Get Tickets</a>";

    eventBoxEl.append(eventTitleEl);
    eventBoxEl.append(eventDateEl);
    eventBoxEl.append(eventVenueEl);
    eventBoxEl.append(getTicketEl);

    eventContainerEl.append(eventBoxEl);
  };


}

function displayHistory() {
  recentSearchEl.innerHTML = "";
  for (var i = 0; i <= searchHistory.length -1; i++) {
    var searchButtonEl = document.createElement("button");
    searchButtonEl.setAttribute("type", "button")
    searchButtonEl.classList = "button is-warning is-fullwidth";
    searchButtonEl.setAttribute("data-search", searchHistory[i])
    searchButtonEl.setAttribute("data-date", searchDate[i])
    searchButtonEl.textContent = searchHistory[i];
    recentSearchEl.append(searchButtonEl);
  }
};

function setHistory(info, date) {
  searchHistory.push(info);
  searchDate.push(date);

  localStorage.setItem("id", JSON.stringify(searchHistory));
  localStorage.setItem("date", JSON.stringify(searchDate));
  // localStorage.setItem("date", JSON.stringify(searchDate));
  displayHistory();
};

function getHistory() {
  var storageHistory = localStorage.getItem("id");
  var storageHistoryDate = localStorage.getItem("date");
  if (storageHistory, storageHistoryDate) {
    searchHistory = JSON.parse(storageHistory);
    searchDate = JSON.parse(storageHistoryDate);
  } 
  displayHistory();
};

var formSubmitHandler = function(event) {
  event.preventDefault();
  // get city name
  var cityname = cityInputEl.value.trim();
  var getStartDate = dateInputEl.value.trim();
  if (cityname, getStartDate) {
    getEvents(cityname, getStartDate);
    getCoordinates(cityname);
    setHistory(cityname, getStartDate);
  } else {
    eventContainerEl.textContent = "City Not Found, Please Enter Valid City Name";
  };
};

function historyHandler (event) {
  if (!event.target.matches("button")) {
    return;
  }
  var buttonClick = event.target;
  var search = buttonClick.getAttribute("data-search");
  var searchDate = buttonClick.getAttribute("data-date");
  getCoordinates(search);
  getEvents(search, searchDate)
};

getHistory();

userFormEl.addEventListener("submit", formSubmitHandler);
recentSearchEl.addEventListener("click", historyHandler);
