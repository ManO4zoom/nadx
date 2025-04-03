import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { postUrl, platform, budget, selectedCountries } = req.body;

  try {
    const prompt = `
      Analyze this ${platform} post: ${postUrl}
      Then generate optimal ad campaign settings with:
      - Target audience demographics
      - 10-15 precise interests
      - Recommended bid strategy for $${budget}/day budget
      - Target countries: ${selectedCountries.join(', ')}

      Respond in this strict JSON format:
      {
        "platform": "${platform}",
        "targetAudience": {
          "demographics": {
            "age": "range",
            "gender": "string",
            "locations": ["array"],
            "language": "string"
          },
          "interests": ["array"],
          "behaviors": ["array"]
        },
        "budgetRecommendations": {
          "dailyBudget": ${budget},
          "recommendedBid": "string",
          "bidStrategy": "string"
        }
      }
    `;

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = JSON.parse(response.data.choices[0].message.content);
    res.status(200).json(aiResponse);
  } catch (error) {
    console.error('DeepSeek API error:', error);
    res.status(500).json({ error: 'Failed to generate campaign' });
  }
}
