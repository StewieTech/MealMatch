// Ensure tests never make real OpenAI calls by clearing the API key
// before any module reads it. This runs before dotenv is loaded.
process.env.OPENAI_API_KEY = '';
