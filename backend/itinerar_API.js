const axios = require('axios');
// require('dotenv').config();

const API_KEY = "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";

async function getTravelItinerary(location, startDate, days) {
  const prompt = `
Create a detailed ${days}-day travel itinerary for ${location}, starting from ${startDate}.
Include time, title, description, location, type (transport, food, accommodation, attraction), cost if applicable, and optional notes for each activity.
Return the result in a structured JSON format as:
[
  {
    date: "DATE",
    activities: [
      {
        time: "HH:MM AM/PM",
        title: "TITLE",
        description: "DESCRIPTION",
        location: "LOCATION",
        type: "TYPE",
        cost: COST_NUMBER,
        notes: "NOTES"
      }
    ]
  }
]
`;

  try {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    console.log('Raw Reply:', reply);

    // Try to parse JSON from response if returned as code block
    const jsonMatch = reply.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    const jsonString = jsonMatch ? jsonMatch[1] : reply;

    const itinerary = JSON.parse(jsonString);
    console.log('Structured Itinerary:', JSON.stringify(itinerary, null, 2));

    return itinerary;

  } catch (error) {
    console.error('Error fetching itinerary:', error.response?.data || error.message);
  }
}

// Example usage
getTravelItinerary('Darjeeling', 'June 15, 2023', 2);
