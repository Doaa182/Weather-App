var searchNavBtn = document.querySelector("nav .btn");
var cityNameInput = document.getElementById("location");

var baseUrl = undefined;
var myApiKey = undefined;

var todayWeather = document.querySelector(".today-weather");
var nextDayWeather = document.querySelector(".next-day");
var afterDayWeather = document.querySelector(".day-after-tommorow");

var countryInfo = document.querySelector("#explore .container");
var countryNews = document.querySelector("#news .container-fluid .row");

var searchHeaderBtn = document.querySelector("header .btn");
var msg = document.getElementById("err-msg");

var concatNews = "";

/******************************************************************************************************** */

// Navbar Search

searchNavBtn.addEventListener("click", function () {
  cityNameInput.focus();
});

/******************************************************************************************************** */

// Weather Widget

// Old Way
// function getDaysWeather() {
//   var cityName = cityNameInput.value ? cityNameInput.value : "cairo";
//   var apiUrl = `${baseUrl}/forecast.json?key=${myApiKey}&q=${cityName}&days=3`;

//   var request = new XMLHttpRequest();
//   request.open("get", apiUrl);
//   request.send();
//   request.addEventListener("readystatechange", function () {
//     if (request.readyState === 4) {
//       if (request.status === 200) {
//         try {
//           var data = JSON.parse(request.responseText);
//           clearInput();
//           displayTodayWeather(data);
//           displayNextDayWeather(data, 1, nextDayWeather);
//           displayNextDayWeather(data, 2, afterDayWeather);
//         } catch {
//           msg.innerHTML = "Failed to read weather data. Please try again.";
//         }
//       } else {
//         try {
//           var errData = JSON.parse(request.responseText);
//           msg.innerHTML = `${errData.error.message}`;
//         } catch {
//           msg.innerHTML =
//             "Please check your internet connection or make sure the city name is correct.";
//         }
//       }
//     }
//   });
// }

async function getDaysWeather() {
  const cityName = cityNameInput.value ? cityNameInput.value : "cairo";
  baseUrl = "https://api.weatherapi.com/v1";
  myApiKey = "5dc24d6c71404744b60113549250507";
  const apiUrl = `${baseUrl}/forecast.json?key=${myApiKey}&q=${cityName}&days=3`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errData = await response.json();
      msg.innerHTML = errData.error?.message || "Something went wrong.";
      return;
    }

    const data = await response.json();

    clearInput();
    displayTodayWeather(data);
    displayNextDayWeather(data, 1, nextDayWeather);
    displayNextDayWeather(data, 2, afterDayWeather);
    getCountryInfo(data);
  } catch (error) {
    msg.innerHTML =
      "Failed to fetch weather data. Please check your internet connection.";
  }
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

searchHeaderBtn.addEventListener("click", getDaysWeather);

/******************************************************************************************************** */

// Country Info Card

async function getCountryInfo(data) {
  baseUrl = "https://restcountries.com/v3.1/name";
  const countryName = data?.location?.country ?? "egypt";
  const apiUrl = `${baseUrl}/${countryName}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errData = await response.json();
      msg.innerHTML = errData.message || "Something went wrong.";
      return;
    }

    const countryData = await response.json();
    displayCountryInfo(countryData);
    getNews(countryData);
  } catch (error) {
    msg.innerHTML =
      "Failed to fetch Country data. Please check your internet connection.";
  }
}

function displayCountryInfo(countryData) {
  countryInfo.innerHTML = `
  
   <div class="row">
            <div class="col-12 col-md-6">
              <div class="flag-wrap w-75">
                <img
                  class="w-100 rounded"
                  src="${countryData[0].flags.svg}"
                  alt="${countryData[0].flags.alt}"
                />
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="country-info">
                <h2 class="fw-bold mb-1 display-3">${
                  countryData[0].name.common
                }</h2>
                <h3 class="text-body-tertiary mb-3 fw-semibold">
                ${countryData[0].name.official}
                </h3>

                <ul class="list-unstyled mb-3">
                  <li><strong>Capital:</strong> ${
                    countryData[0].capital["0"]
                  }</li>
                  <li><strong>Region:</strong> ${countryData[0].region}</li>
                  <li><strong>Subregion:</strong> ${
                    countryData[0].subregion
                  }</li>
                  <li><strong>Language:</strong> ${
                    Object.values(countryData[0].languages)[0]
                  }</li>
                  <li><strong>Currency:</strong> ${
                    Object.values(countryData[0].currencies)[0].name
                  }</li>
                  <li><strong>Timezone:</strong> ${
                    countryData[0].timezones["0"]
                  }</li>
                </ul>

                <a
                  href="${countryData[0].maps.googleMaps}"
                  target="_blank"
                  class="btn text-decoration-none"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
  `;
}

/******************************************************************************************************** */

// News

async function getNews(countryData) {
  baseUrl = "https://newsdata.io/api/1/latest";
  myApiKey = "pub_2e05f324ce3e439aa84093933adaf557";
  const countryCode = countryData[0]?.cca2?.toLowerCase() ?? "eg";
  const apiUrl = `${baseUrl}?apikey=${myApiKey}&country=${countryCode}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errData = await response.json();
      msg.innerHTML = errData.message || "Something went wrong.";
      return;
    }

    const NewsData = await response.json();
    console.log(NewsData);

    displayNews(NewsData);
  } catch (error) {
    msg.innerHTML =
      "Failed to fetch News. Please check your internet connection.";
  }

  console.log(apiUrl);
}

function displayNews(NewsData) {
  console.log(NewsData.results.length);

  for (var i = 0; i < NewsData.results.length; i++) {
    concatNews += `
      <div class="col-md-4 col-12">
          <div class="news-card rounded shadow mb-4 overflow-hidden object-fit-cover">
              <div class="position-relative">
                  <img
                      src="${NewsData.results[i].image_url}"
                      alt="${NewsData.results[i].title}"
                      class="w-100"
                  />

                  <span
                    class="badge position-absolute start-0 m-2 text-capitalize"
                    >${NewsData.results[i].category[0]}</span
                  >
              </div>
              
              <div class="card-body p-3 position-relative">
                <div class="news-title fw-bold fs-5">
                  ${NewsData.results[i].title}                  
                </div>

                <div class="news-description my-2">
                  ${NewsData.results[i].description}
                </div>

                <div class="news-meta">
                  <p class="m-0"><strong>By:</strong> 
                  ${NewsData.results[i].creator[0]}
                  </p>

                  <p class="m-0">
                  ${new Date(NewsData.results[i].pubDate).toLocaleDateString(
                    "en-US"
                  )}
                  </p>
                </div>
                <a
                  href="${NewsData.results[i].link}"
                  target="_blank"
                  class="position-absolute end-0 me-2 text-decoration-none rounded p-1"
                >
                  Read More
                </a>
                
              </div>
        </div>
      </div>`;
  }
  countryNews.innerHTML = concatNews;
}
/******************************************************************************************************** */
// getDaysWeather();
