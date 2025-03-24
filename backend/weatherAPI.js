const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.WEATHER_API_KEY;
const CURRENT_URL = 'https://api.weatherbit.io/v2.0/current';
const ALERTS_URL = 'https://api.weatherbit.io/v2.0/alerts';

// Get lat/lon from city name
async function getLatLon(city) {
    try {
        const response = await axios.get(CURRENT_URL, {
            params: {
                key: API_KEY,
                city: city,
            },
        });

        const data = response.data.data[0];
        const lat = data.lat;
        const lon = data.lon;

        return { name: city, lat, lon };
    } catch (error) {
        console.error(`❌ Error fetching coordinates for ${city}:`, error.response?.data || error.message);
        return null;
    }
}

// Get current weather for a location
async function getCurrentWeather(lat, lon, cityName) {
    try {
        const response = await axios.get(CURRENT_URL, {
            params: {
                key: API_KEY,
                lat: lat,
                lon: lon,
            },
        });

        const data = response.data.data[0];
        return {
            temp: data.temp,
            description: data.weather.description,
            humidity: data.rh,
            windSpeed: data.wind_spd,
            cityName: cityName
        };
    } catch (error) {
        console.error(`❌ Error fetching current weather for ${cityName}:`, error.response?.data || error.message);
        return null;
    }
}

// Get alerts using lat/lon
async function getOfficialWeatherAlertsForCities(cityNames) {
    const alerts = [];
    let alertId = 1;

    for (const city of cityNames) {
        const loc = await getLatLon(city);
        if (!loc) continue;

        try {
            const response = await axios.get(ALERTS_URL, {
                params: {
                    key: API_KEY,
                    lat: loc.lat,
                    lon: loc.lon,
                },
            });

            const data = response.data;

            if (data.alerts && data.alerts.length > 0) {
                for (const alert of data.alerts) {
                    alerts.push({
                        id: alertId.toString(),
                        title: alert.title,
                        description: alert.description.replace(/\n/g, ' '),
                        severity: alert.severity.toLowerCase(),
                        date: alert.effective_local.split('T')[0],
                        location: loc.name,
                    });
                    alertId++;
                }
            } else {
                // No active alerts, show current weather instead
                const weather = await getCurrentWeather(loc.lat, loc.lon, loc.name);
                if (weather) {
                    alerts.push({
                        id: alertId.toString(),
                        title: `Current Weather for ${loc.name}`,
                        description: `Temperature: ${weather.temp}°C, ${weather.description}, Humidity: ${weather.humidity}%, Wind: ${weather.windSpeed} m/s`,
                        severity: "info",
                        date: new Date().toISOString().split('T')[0],
                        location: loc.name,
                    });
                } else {
                    alerts.push({
                        id: alertId.toString(),
                        title: `Weather Data Unavailable`,
                        description: `Unable to retrieve weather data for ${loc.name}.`,
                        severity: "none",
                        date: new Date().toISOString().split('T')[0],
                        location: loc.name,
                    });
                }
                alertId++;
            }

        } catch (error) {
            console.error(`❌ Error fetching alerts for ${loc.name}:`, error.response?.data || error.message);
        }
    }

    console.log(alerts);
    return alerts;
}

const cities = ['sonmarg', 'srinagar', 'pahalgam', 'gulmarg', 'kashmir', 'ladakh'];

getOfficialWeatherAlertsForCities(cities);
