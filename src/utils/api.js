const API_BASE = 'https://api.jikan.moe/v4';

// Rate limiting: Jikan allows ~3 requests per second
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 350; // ms between requests

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchJikan = async (endpoint) => {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await wait(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
    }
    lastRequestTime = Date.now();

    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) {
            if (response.status === 429) {
                // Too many requests, wait longer and retry once
                await wait(1000);
                return fetchJikan(endpoint);
            }
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Jikan API Error:', error);
        throw error;
    }
};

export const searchAnime = async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchJikan(`/anime?${queryString}`);
};

export const getTopAnime = async (page = 1) => {
    return fetchJikan(`/top/anime?page=${page}&limit=24&sfw=true`);
};

export const getAnimeDetails = async (id) => {
    return fetchJikan(`/anime/${id}`);
};

export const getTopCharacters = async (page = 1) => {
    return fetchJikan(`/top/characters?page=${page}&limit=24`);
};

export const getCharacterDetails = async (id) => {
    return fetchJikan(`/characters/${id}/full`);
};

export const getRandomCharacters = async () => {
    // Jikan doesn't have a true random character endpoint that returns useful data reliably,
    // so we'll fetch a random page of top characters.
    const randomPage = Math.floor(Math.random() * 10) + 1;
    return getTopCharacters(randomPage);
};
