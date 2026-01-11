var baseUrl = "https://api.weatherapi.com/v1";
var myApiKey = "5dc24d6c71404744b60113549250507";
var cityNameInput = document.getElementById("location");
var todayWeather = document.querySelector(".today-weather");
var nextDayWeather = document.querySelector(".next-day");
var afterDayWeather = document.querySelector(".day-after-tommorow");
var msg = document.getElementById("err-msg");

function getdaysWeather() {
  var cityName = cityNameInput.value ? cityNameInput.value : "cairo";
  var apiUrl = `${baseUrl}/forecast.json?key=${myApiKey}&q=${cityName}&days=3`;

  var request = new XMLHttpRequest();
  request.open("get", apiUrl);
  request.send();
  request.addEventListener("readystatechange", function () {
    if (request.readyState === 4) {
      if (request.status === 200) {
        try {
          var data = JSON.parse(request.responseText);
          clearInput();
          displayTodayWeather(data);
          displayNextDayWeather(data, 1, nextDayWeather);
          displayNextDayWeather(data, 2, afterDayWeather);
        } catch {
          msg.innerHTML = "Failed to read weather data. Please try again.";
        }
      } else {
        try {
          var errData = JSON.parse(request.responseText);
          msg.innerHTML = `${errData.error.message}`;
        } catch {
          msg.innerHTML =
            "Please check your internet connection or make sure the city name is correct.";
        }
      }
    }
  });
}

function clearInput() {
  cityNameInput.value = "";
  msg.innerHTML = "";
}

function displayTodayWeather(data) {
  var date = new Date(data.current.last_updated).toDateString();

  todayWeather.innerHTML = `


                <div
                  class="location-date d-flex justify-content-between fw-semibold"
                >
                  <p>${data.location.name}</p>
                  <p>${date}</p>
                </div>

                <p class="display-1 text-center fw-medium">${data.current.temp_c}&deg;C</p>

                <div class="d-flex justify-content-center align-items-center">
                  <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}" />
                  <span class="fs-5" >${data.current.condition.text}</span>
                </div>

                <ul class="list-unstyled d-flex justify-content-around mt-5">
                  <li><i class="bi bi-droplet pe-2"></i><span>${data.current.humidity} %</span></li>
                  <li><i class="bi bi-wind pe-2"></i><span>${data.current.wind_kph} km/h</span></li>
                  <li><i class="bi bi-compass pe-2"></i><span>${data.current.wind_dir}</span></li>
                </ul>

`;
}

function displayNextDayWeather(data, n, c) {
  var nextDay = data.forecast.forecastday[n];
  var date = new Date(nextDay.date);
  var day = date.toLocaleDateString("en-US", { weekday: "long" });

  c.innerHTML = `
  
  
                    <p>${day}</p>
                     <img src="https:${nextDay.day.condition.icon}" alt="${nextDay.day.condition.text}" />
                    <p class="fs-3 fw-bold mb-1">${nextDay.day.maxtemp_c}&deg;C</p>
                    <p>${nextDay.day.mintemp_c}&deg;C</p>
                    <p class="fw-semibold">${nextDay.day.condition.text}</p>
  
  
  `;
}

getdaysWeather();
