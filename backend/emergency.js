const axios = require('axios');

async function getTripAdvisorPlaces(location) {
    const options = {
        method: 'GET',
        url: 'https://real-time-tripadvisor-scraper-api.p.rapidapi.com/tripadvisor_restaurants_search_v2',
        params: { location: location }, // e.g., "new york"
        headers: {
            'x-rapidapi-host': 'real-time-tripadvisor-scraper-api.p.rapidapi.com',
            'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY'  // Replace with your key
        }
    };

    try {
        const response = await axios.request(options);
        const data = response.data.data;

        const results = data.map(place => ({
            name: place.name,
            contactNO: place.telephone || 'Not Available',
            LocationOfStay: place.address?.fullAddress || 'Not Available'
        }));

        return results;

    } catch (error) {
        console.error('API Error:', error.message);
        return [];
    }
}

// Example usage
getTripAdvisorPlaces('siliguri').then(places => {
    console.log(places);
});
