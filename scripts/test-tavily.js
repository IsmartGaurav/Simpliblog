// Test script for Tavily API
require('dotenv').config();
const { tavily } = require('@tavily/core');

const tvly = tavily({
    apiKey: process.env.TAVILY_API_KEY
});

async function testTavilySearch() {
    try {
        console.log('Testing Tavily API with search depth: advanced');
        const result = await tvly.search('Google 2.5 Pro Exp. Ai Model Coding Benchmark', {
            searchDepth: 'advanced'
        });
        
        console.log('\nTavily API Response Structure:');
        console.log('Response type:', typeof result);
        console.log('\nSample of response content:');
        console.log(JSON.stringify(result, null, 2).substring(0, 2000) + '...');
        
        return result;
    } catch (error) {
        console.error('Error testing Tavily API:', error.message);
        throw error;
    }
}

// Execute the test function
testTavilySearch()
    .then(() => console.log('\nTavily API test completed successfully!'))
    .catch(err => console.error('\nTavily API test failed:', err));