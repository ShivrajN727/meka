export async function getWeather(location = 'New York') {
  try {
    // First get coordinates for the location
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return `Could not find weather for "${location}".`;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Then get weather for those coordinates
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m&temperature_unit=celsius`
    );
    const weatherData = await weatherRes.json();
    const current = weatherData.current;

    return `Weather in ${name}, ${country}: ${current.temperature_2m}°C, wind speed ${current.windspeed_10m} km/h.`;
  } catch (err) {
    console.error('Weather error:', err);
    throw new Error('Weather lookup failed');
  }
}
