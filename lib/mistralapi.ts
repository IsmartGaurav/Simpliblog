import { tvly } from "./tavily";

const { Mistral } = require('@mistralai/mistralai');

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({apiKey});

export const generateTopic = async (theme: string, description: string, style: string, numTopic: number) => {
    const response = await client.chat.complete({
        model: "ft:mistral-large-latest:bc0f206a:20250302:e08ef653",
        messages: [
            {
                role: 'system', content: 'You are a helpful assistant that generate topic for a blog post.given theme and description. Respond in JSON format of {titles:string[]}'
            },
            {
                role: 'user', content: `Theme: ${theme}, Description: ${description}, Style: ${style}, Number Of Topic: ${numTopic}`
            }
        ],
        response_format: {type:'json_object'}
    });

    if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
        throw new Error('Invalid response format');
    }

    try {
        const content = response.choices[0].message.content.trim();
        const jsonContent = content.startsWith('```json') ? content.slice(7, -3).trim() : content;
        return JSON.parse(jsonContent)["titles"] as string[];
    } catch (error) {
        throw new Error(`Error parsing JSON: ${error.message}`);
    }
}

export const generateBlogPost = async (title:string,style:string) => {
    if (!title || !style) {
        throw new Error('Title and style are required');
    }

    try {
        const context = await tvly.search(title, {searchDepth: "advanced"});
        if (!context) {
            throw new Error('Failed to fetch context for the blog post');
        }

        const response = await client.chat.complete({
            model: "ft:mistral-large-latest:bc0f206a:20250302:e08ef653",
            messages: [
                {
                    role: 'system',
                    content: `You are an expert blog writer specializing in creating engaging and well-structured content.
                    Create blog posts following this specific format:
                    1. Start with an attention-grabbing hook
                    2. Write an intriguing first paragraph that sets the tone
                    3. Create scannable body content with clear sections and subheadings
                    4. Provide a meaningful conclusion
                    5. End with a compelling call to action
                    6. Include properly attributed references from the provided context
                    
                    Maintain a professional yet conversational tone throughout.
                    Return the response in JSON format: {content: string}
                    The content should be in markdown format.`
                },
                {
                    role: 'user',
                    content: `Generate a 1000-word blog post with the following details:
                    Title: ${title}
                    Writing Style: ${style}
                    
                    You will be using the following context for reference and citations:
                    ${context}
                    
                    Ensure the post is engaging, informative, and includes proper citations to the provided context.`
                }
            ],
            response_format: {type:'json_object'}
        });

        if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
            throw new Error('Invalid response from Mistral API');
        }

        const content = response.choices[0].message.content.trim();
        if (!content) {
            throw new Error('Empty content received from Mistral API');
        }

        const jsonContent = content.startsWith('```json') ? content.slice(7, -3).trim() : content;
        const parsedContent = JSON.parse(jsonContent);

        if (!parsedContent.content || typeof parsedContent.content !== 'string' || parsedContent.content.trim().length === 0) {
            throw new Error('Invalid or empty content in API response');
        }

        return parsedContent.content.trim();
    } catch (error) {
        console.error('Error in generateBlogPost:', error);
        throw new Error(`Failed to generate blog post: ${error.message}`);
    }
}