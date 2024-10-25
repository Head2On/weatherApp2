const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const notFoundSection = document.querySelector('.not-found');
const weatherInfoSection = document.querySelector('.weather-info');
const searchCitySection = document.querySelector('.search-city');

const countryTxt = document.querySelector('.country-text');
const tempTxt = document.querySelector('.temp-text');
const conditionTxt = document.querySelector('.condition-txt');
const humidityTxt = document.querySelector('.humidity-value-txt');
const windTxt = document.querySelector('.wind-value-txt');
const weatherSummaryimg = document.querySelector('.weather-summary-img')
const currDataTxt = document.querySelector('.current-date-text');
const forecastsItemsContainer = document.querySelector('.forecast-items-container');


const apikey = '86691b2c26e38420e2bb2756b9a77cab';

// Event listeners for search
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value.trim());
        cityInput.value = '';
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value.trim());
        cityInput.value = '';
        cityInput.blur();
    }
});

// Function to fetch weather data
async function getFetchData(endpoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apikey}&units=metric`;
    try {
        const response = await fetch(apiUrl);
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return { cod: 500 };  // Custom error code for handling network issues
    }
}

function getweatherIcon(id){
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 711) return 'smoke.svg'
    if (id <= 721) return 'haze.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id === 800) return 'sun.svg'
    else return 'cloudy.svg'
}

function getCurrentDate(){
    const currentDate = new Date()
    const options = {
        weekday:'short',
        day:'2-digit',
        month:'short'
    }
    return currentDate.toLocaleDateString('en-GB', options);
}

// Function to update weather information on the page
async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);

    if (weatherData.cod !== 200) {
        showDisplaySection(notFoundSection);
        return;
    }
  
    const {
        name:country,
        main: { temp, humidity },
        wind: { speed },
        weather: [{ id,main }]
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + '°C'
    conditionTxt.textContent = main
    humidityTxt.textContent = humidity + '%'
    windTxt.textContent = Math.round(speed) +'M/s'

    currDataTxt.textContent = getCurrentDate()
    weatherSummaryimg.src = `assets/weather/${getweatherIcon(id)}`

    await updateForecastsInfo(city)
    
    showDisplaySection(weatherInfoSection);
    // Here you would update `weatherInfoSection` with `weatherData` content
}

async function updateForecastsInfo(city){
    const forecastsData = await getFetchData('forecast', city);
    
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastsItemsContainer.innerHTML =''
    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken)&
        !forecastWeather.dt_txt.includes(todayDate)){
        updateForecastsItems(forecastWeather)
        }
    })
    function updateForecastsItems(weatherData){
        console.log(weatherData)
        const{
            dt_txt:date,
            weather:[{ id }],
            main: { temp }
        }=weatherData

        const dateTaken = new Date(date)
        const dateOption={
            day:'2-digit',
            month:'short'
        }
        const dateResult = dateTaken.toLocaleDateString('en-us',dateOption)

        const forecastsItem = `
        <div class="forecast-item">
                    <h5 class="forecast-item-data regular-txt">${dateResult}</h5>
                    <img src="assets/weather/${getweatherIcon(id)}"class="forecast-item-img">
                    <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
        `
        forecastsItemsContainer.insertAdjacentHTML('beforeend', forecastsItem)
    }

}
// Function to control display of different sections
function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none');

    section.style.display = 'flex';
}
