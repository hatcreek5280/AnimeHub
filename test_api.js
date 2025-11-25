import { getTopCharacters } from './src/utils/api.js';

// Mock fetch for node environment if needed, but we can just use the real API if we run with node 18+
// Actually, the project is using "type": "module", so we can run this with node.

const testApi = async () => {
    try {
        console.log('Fetching top characters...');
        // We need to mock fetchJikan or just import it. 
        // Since api.js uses `fetch` which is available in Node 18+, it should work.

        // However, api.js exports specific functions.
        // Let's just copy the fetch logic here to be self-contained and avoid import issues with relative paths if run from root.

        const response = await fetch('https://api.jikan.moe/v4/top/characters?page=1&limit=5');
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            const char = data.data[0];
            console.log('First Character Structure:');
            console.log('Name:', char.name);
            console.log('Images:', JSON.stringify(char.images, null, 2));
            console.log('Nicknames:', char.nicknames);
        } else {
            console.log('No data found');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

testApi();
