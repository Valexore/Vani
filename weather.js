
function getCurrentTimeInPhilippines() {
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000; 
    const philippinesTime = new Date(utcTime + 8 * 3600000); 
    return philippinesTime;
  }
  
  //format time as HH:MM:SS
  function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  
  // update the current time display
  function updateCurrentTime() {
    const philippinesTime = getCurrentTimeInPhilippines();
    const timeElement = document.getElementById('philippines-time');
    timeElement.textContent = formatTime(philippinesTime);
  }
  
  // update weather based on time
  function updateWeather() {
    const hour = getCurrentTimeInPhilippines().getHours();
    const manilaCondition = document.querySelector('.weather-card:nth-child(1) .weather-condition');
    const manilaTemperature = document.querySelector('.weather-card:nth-child(1) .weather-temperature');
    const infantaCondition = document.querySelector('.weather-card:nth-child(2) .weather-condition');
    const infantaTemperature = document.querySelector('.weather-card:nth-child(2) .weather-temperature');
  
    if (hour >= 6 && hour < 12) {
      manilaCondition.textContent = "Sunny";
      manilaTemperature.textContent = "32°C";
      infantaCondition.textContent = "Partly Cloudy";
      infantaTemperature.textContent = "28°C";
    } else if (hour >= 12 && hour < 18) {
      manilaCondition.textContent = "Cloudy";
      manilaTemperature.textContent = "30°C";
      infantaCondition.textContent = "Light Rain";
      infantaTemperature.textContent = "26°C";
    } else if (hour >= 18 && hour < 24) {
      manilaCondition.textContent = "Clear";
      manilaTemperature.textContent = "28°C";
      infantaCondition.textContent = "Foggy";
      infantaTemperature.textContent = "24°C";
    } else {
      manilaCondition.textContent = "Clear";
      manilaTemperature.textContent = "26°C";
      infantaCondition.textContent = "Clear";
      infantaTemperature.textContent = "22°C";
    }
  }
  
  // update traffic based on time
  function updateTraffic() {
    const hour = getCurrentTimeInPhilippines().getHours();
    const manilaToInfantaCondition = document.querySelector('.traffic-card:nth-child(1) .traffic-condition');
    const manilaToInfantaDelay = document.querySelector('.traffic-card:nth-child(1) .traffic-delay');
    const infantaToManilaCondition = document.querySelector('.traffic-card:nth-child(2) .traffic-condition');
    const infantaToManilaDelay = document.querySelector('.traffic-card:nth-child(2) .traffic-delay');
  
    if (hour >= 7 && hour < 9) {
      manilaToInfantaCondition.textContent = "Heavy Traffic";
      manilaToInfantaDelay.textContent = "Expected Delay: 30 mins";
      infantaToManilaCondition.textContent = "Moderate Traffic";
      infantaToManilaDelay.textContent = "Expected Delay: 20 mins";
    } else if (hour >= 9 && hour < 12) {
      manilaToInfantaCondition.textContent = "Moderate Traffic";
      manilaToInfantaDelay.textContent = "Expected Delay: 15 mins";
      infantaToManilaCondition.textContent = "Light Traffic";
      infantaToManilaDelay.textContent = "Expected Delay: 10 mins";
    } else if (hour >= 12 && hour < 14) {
      manilaToInfantaCondition.textContent = "Light Traffic";
      manilaToInfantaDelay.textContent = "Expected Delay: 5 mins";
      infantaToManilaCondition.textContent = "Moderate Traffic";
      infantaToManilaDelay.textContent = "Expected Delay: 15 mins";
    } else if (hour >= 14 && hour < 17) {
      manilaToInfantaCondition.textContent = "Moderate Traffic";
      manilaToInfantaDelay.textContent = "Expected Delay: 20 mins";
      infantaToManilaCondition.textContent = "Heavy Traffic";
      infantaToManilaDelay.textContent = "Expected Delay: 30 mins";
    } else if (hour >= 17 && hour < 20) {
      manilaToInfantaCondition.textContent = "Heavy Traffic";
      manilaToInfantaDelay.textContent = "Expected Delay: 40 mins";
      infantaToManilaCondition.textContent = "Heavy Traffic";
      infantaToManilaDelay.textContent = "Expected Delay: 40 mins";
    } else {
      manilaToInfantaCondition.textContent = "Light Traffic";
      manilaToInfantaDelay.textContent = "No Delays";
      infantaToManilaCondition.textContent = "Light Traffic";
      infantaToManilaDelay.textContent = "No Delays";
    }
  }
  
  function updateSections() {
    updateCurrentTime();
    updateWeather();
    updateTraffic();
  }
  updateSections();
  setInterval(updateSections, 1000);



  