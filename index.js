import { useState } from 'react';
import axios from 'axios';

const COUNTRIES = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'IN', 'BR'];

export default function Home() {
  const [input, setInput] = useState({
    postUrl: '',
    platform: 'meta',
    budget: 100,
    selectedCountries: ['US']
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('/api/generate', input);
      setResults(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCountry = (country) => {
    setInput(prev => ({
      ...prev,
      selectedCountries: prev.selectedCountries.includes(country)
        ? prev.selectedCountries.filter(c => c !== country)
        : [...prev.selectedCountries, country]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">NAdX.ai Post Analyzer</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block mb-2">Post URL</label>
          <input
            type="url"
            value={input.postUrl}
            onChange={(e) => setInput({...input, postUrl: e.target.value})}
            placeholder="https://www.instagram.com/p/..."
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Platform</label>
          <select
            value={input.platform}
            onChange={(e) => setInput({...input, platform: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="meta">Meta (Facebook/Instagram)</option>
            <option value="tiktok">TikTok</option>
            <option value="google">Google Ads</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Target Countries</label>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map(country => (
              <button
                key={country}
                type="button"
                onClick={() => toggleCountry(country)}
                className={`px-3 py-1 rounded-full text-sm ${
                  input.selectedCountries.includes(country)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Generate Campaign'}
        </button>
      </form>

      {results && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">AI-Generated Campaign</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Target Audience</h3>
              <p>Age: {results.targetAudience.demographics.age}</p>
              <p>Gender: {results.targetAudience.demographics.gender}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {results.targetAudience.interests.map((interest, i) => (
                  <span key={i} className="bg-gray-100 px-2 py-1 rounded">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Countries</h3>
              <p>{results.targetAudience.demographics.locations.join(', ')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
