const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
app.use(cors());
// Middleware
app.use(bodyParser.json());

// Helper to map OSM tags to your types
function getTypeFromTags(tags) {
    if (tags.tourism === 'attraction') return 'attraction';
    if (tags.tourism === 'hotel') return 'accommodation';
    if (tags.amenity === 'restaurant') return 'food';
    if (tags.amenity === 'hospital') return 'emergency';
    return 'unknown';
}

// POST endpoint for map details
app.post('/api/mapDetails', async (req, res) => {
    try {
        const { lat, lon } = req.body;
        
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }
        
        const radius = 1000; // in meters

        // Overpass API Query
        const overpassQuery = `
        [out:json];
        (
            node["tourism"="attraction"](around:${radius},${lat},${lon});
            node["tourism"="hotel"](around:${radius},${lat},${lon});
            node["amenity"="restaurant"](around:${radius},${lat},${lon});
            node["amenity"="hospital"](around:${radius},${lat},${lon});
        );
        out;
        `;

        const url = 'https://overpass-api.de/api/interpreter';
        
        const response = await axios.post(url, `data=${encodeURIComponent(overpassQuery)}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        console.log('Response:', response.data);
        const places = response.data.elements.map((place) => ({
            id: place.id.toString(),
            name: place.tags.name || 'Unnamed Place',
            type: getTypeFromTags(place.tags),
            position: [place.lat, place.lon],
            description: place.tags.description || 'No description available.',
        }));

        console.log('Places:', places);
        res.json(places);
    } catch (error) {
        console.error('Error fetching places:', error.message);
        res.status(500).json({ error: 'Failed to fetch map details' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
