const { Mistral } = require('@mistralai/mistralai');

async function runMistralChat() {
  try {
    const apiKey = process.env.MISTRAL_API_KEY;
    
    if (!apiKey) {
      console.error('Error: MISTRAL_API_KEY environment variable is not set');
      return;
    }
    
    const client = new Mistral({apiKey});
    
    const chatResponse = await client.chat.complete({
      model: 'ft:mistral-large-latest:bc0f206a:20250302:e08ef653',
      messages: [{role: 'user', content: 'Write a blog on What is the Javascript?'}],
    });
    
    // Check if chatResponse and choices exist before accessing properties
    if (chatResponse && chatResponse.choices && chatResponse.choices.length > 0) {
      console.log('Chat:', chatResponse.choices[0].message.content);
    } else {
      console.log('No response received or empty choices array');
    }
  } catch (error) {
    console.error('Error calling Mistral API:', error);
  }
}

// Execute the function
runMistralChat();