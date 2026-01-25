/**********************************************************************
  NOTE: 
  This project uses public API keys for frontend demo purposes.
  In a real production app, API requests should be routed through a server to keep keys private.
**********************************************************************/

const searchNavBtn = document.querySelector("nav .btn");
const cityNameInput = document.getElementById("location");

const todayWeather = document.querySelector(".today-weather");
const nextDayWeather = document.querySelector(".next-day");
const afterDayWeather = document.querySelector(".day-after-tommorow");

const countryInfo = document.querySelector("#explore .container");
const countryNews = document.querySelector("#news .container-fluid .row");

const searchHeaderBtn = document.querySelector("header .btn");
const msg = document.getElementById("err-msg");

const WEATHER_BASE_URL = "https://api.weatherapi.com/v1";
const WEATHER_API_KEY = "5dc24d6c71404744b60113549250507";

const COUNTRY_BASE_URL = "https://restcountries.com/v3.1/name";

const NEWS_BASE_URL = "https://newsdata.io/api/1/latest";
const NEWS_API_KEY = "pub_2e05f324ce3e439aa84093933adaf557";

/******************************************************************************************************** */

// Navbar Search

searchNavBtn.addEventListener("click", function () {
  cityNameInput.focus();
});

/******************************************************************************************************** */

// clear input/err msg

function clearInput() {
  cityNameInput.value = "";
  msg.innerHTML = "";
  searchHeaderBtn.disabled = !cityNameInput.value.trim();
}

clearInput();

// disable the header search btn

cityNameInput.addEventListener("input", function () {
  msg.innerHTML = "";
  if (cityNameInput.value.trim()) {
    searchHeaderBtn.disabled = false;
  } else {
    searchHeaderBtn.disabled = true;
  }
});

/******************************************************************************************************** */

// Weather Widget

async function getDaysWeather() {
  const cityName = cityNameInput.value ? cityNameInput.value : "cairo";
  const apiUrl = `${WEATHER_BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${cityName}&days=3`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errData = await response.json();
      console.error("Weather API HTTP Error:", errData);
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
    console.error("Weather API Fetch Error:", error);
    msg.innerHTML =
      "Failed to fetch weather data. Please check your internet connection.";
  }
}

function displayTodayWeather(data) {
  const date = new Date(
    data?.current?.last_updated ?? Date.now(),
  ).toDateString();

  todayWeather.innerHTML = `

                <div
                  class="location-date d-flex justify-content-between fw-semibold"
                >
                  <p>${data?.location?.name ?? "_"}</p>
                  <p>${date}</p>
                </div>

                <p class="display-1 text-center fw-medium">${data?.current?.temp_c ?? "_"}&deg;C</p>

                <div class="d-flex justify-content-center align-items-center">
                  <img src="https:${data?.current?.condition?.icon ?? ""}" alt="${data?.current?.condition?.text ?? "_"}" />
                  <span class="fs-5" >${data?.current?.condition?.text ?? "_"}</span>
                </div>

                <ul class="list-unstyled d-flex justify-content-around mt-5">
                  <li><i class="bi bi-droplet pe-2"></i><span>${data?.current?.humidity ?? "_"} %</span></li>
                  <li><i class="bi bi-wind pe-2"></i><span>${data?.current?.wind_kph ?? "_"} km/h</span></li>
                  <li><i class="bi bi-compass pe-2"></i><span>${data?.current?.wind_dir ?? "_"}</span></li>
                </ul>

`;
}

function displayNextDayWeather(data, n, c) {
  const nextDay = data?.forecast?.forecastday?.[n] ?? {};
  const date = new Date(nextDay?.date ?? Date.now());
  const day = date.toLocaleDateString("en-US", { weekday: "long" });

  c.innerHTML = `

                    <p>${day}</p>
                     <img src="https:${nextDay?.day?.condition?.icon ?? ""}" alt="${nextDay?.day?.condition?.text ?? "_"}" />
                    <p class="fs-3 fw-bold mb-1">${nextDay?.day?.maxtemp_c ?? "_"}&deg;C</p>
                    <p>${nextDay?.day?.mintemp_c ?? "_"}&deg;C</p>
                    <p class="fw-semibold">${nextDay?.day?.condition?.text ?? "_"}</p>

  `;
}

searchHeaderBtn.addEventListener("click", getDaysWeather);

/******************************************************************************************************** */

// Country Info Card

async function getCountryInfo(data) {
  const countryName = data?.location?.country ?? "egypt";
  const apiUrl = `${COUNTRY_BASE_URL}/${countryName}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errData = await response.json();
      console.error("Country API HTTP Error:", errData);
      msg.innerHTML = errData.message || "Something went wrong.";
      return;
    }

    const countryData = await response.json();
    displayCountryInfo(countryData);
    getNews(countryData);
  } catch (error) {
    console.error("Country API Fetch Error:", error);
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
                  src="${countryData[0].flags?.svg ?? "./Assets/flag-pic-alt.jpg"}"
                  alt="${countryData[0].flags?.alt ?? "_"}"
                />
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="country-info">
                <h2 class="fw-bold mb-1 display-3">${
                  countryData[0].name?.common ?? "_"
                }</h2>
                <h3 class="text-body-tertiary mb-3 fw-semibold">
                ${countryData[0].name?.official ?? "_"}
                </h3>

                <ul class="list-unstyled mb-3">
                  <li><strong>Capital:</strong> ${
                    countryData[0].capital?.["0"] ?? "_"
                  }</li>
                  <li><strong>Region:</strong> ${countryData[0].region ?? "_"}</li>
                  <li><strong>Subregion:</strong> ${
                    countryData[0].subregion ?? "_"
                  }</li>
                  <li><strong>Language:</strong> ${
                    Object.values(countryData[0].languages ?? {})[0] ?? "_"
                  }</li>
                  <li><strong>Currency:</strong> ${
                    Object.values(countryData[0].currencies ?? {})[0]?.name ??
                    "_"
                  }</li>
                  <li><strong>Timezone:</strong> ${
                    countryData[0].timezones?.["0"] ?? "_"
                  }</li>
                </ul>

                <a
                  href="${countryData[0].maps?.googleMaps ?? "#"}"
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
  const countryCode = countryData[0]?.cca2?.toLowerCase() ?? "eg";
  const apiUrl = `${NEWS_BASE_URL}?apikey=${NEWS_API_KEY}&country=${countryCode}`;

  countryNews.innerHTML = "";

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errData = await response.json();
      console.error("News API HTTP Error:", errData);
      msg.innerHTML = errData.message || "Something went wrong.";
      countryNews.innerHTML = `
        <div class="col-12">
          <p class="text-center fw-bold fs-5 mt-3">
            No news available for this country.
          </p>
        </div>
      `;
      return;
    }

    const NewsData = await response.json();

    displayNews(NewsData);
  } catch (error) {
    console.error("News API Fetch Error:", error);

    msg.innerHTML =
      "Failed to fetch News. Please check your internet connection.";
  }
}

function displayNews(NewsData) {
  let concatNews = "";
  const results = NewsData?.results ?? [];

  for (let i = 0; i < results.length; i++) {
    const textAlignClass =
      results[i]?.language === "arabic" ? "text-end" : "text-start";

    const btnDirectionClass =
      results[i]?.language === "arabic" ? "start-0 ms-3" : "end-0 me-3";

    concatNews += `
      <div class="col-md-4 col-12">
          <div class="news-card rounded shadow mb-4 overflow-hidden object-fit-cover">
              <div class="position-relative">
                  <img
                      src="${results[i]?.image_url ?? "./Assets/news-pic-alt.jpg"}"
                      alt="${results[i]?.title ?? "_"}"
                      class="w-100"
                  />

                  <span
                    class="badge position-absolute start-0 m-2 text-capitalize"
                    >${results[i]?.category?.[0] ?? "_"}</span
                  >
              </div>
              
              <div class="card-body p-3 position-relative ${textAlignClass}">
                <div class="news-title fw-bold fs-5">
                  ${results[i]?.title ?? "_"}                  
                </div>

                <div class="news-description my-2">
                  ${results[i]?.description ?? ""}
                </div>

                <div class="news-meta">
                  <p class="m-0"><strong>By:</strong> 
                  ${results[i]?.creator?.[0] ?? "_"}
                  </p>

                  <p class="m-0">
                  ${
                    results[i]?.pubDate
                      ? new Date(results[i].pubDate).toLocaleDateString("en-US")
                      : "_"
                  }
                  </p>
                </div>
                <a
                  href="${results[i]?.link ?? "_"}"
                  target="_blank"
                  class="position-absolute ${btnDirectionClass} mb-2 text-decoration-none rounded p-1"
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
