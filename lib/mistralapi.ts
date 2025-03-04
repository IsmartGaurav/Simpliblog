import { tvly } from "./tavily";

const { Mistral } = require('@mistralai/mistralai');

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({apiKey});

export const generateTopic = async (theme: string,description:string,style:string,numTopic:number) => {
    const response = await client.chat.complete({
        model: "ft:mistral-large-latest:bc0f206a:20250302:e08ef653",
        messages: [
            {
                role: 'system', content: 'You are a helpful assistant that generate topic for a blog post.given theme and description. Respond in JSON format of {title:string[]}'
            },
            {
                role: 'user', content: `Theme: ${theme}, Description: ${description}, Style: ${style}, Number Of Topic: ${numTopic}`
            }
        ],
        response_format: {type:'json_object'}
    })
    const data = await response.json()
    return JSON.parse(data.choices[0].message.content)["titles"] as string[]
}

export const generateBlogPost = async (title:string,style:string) => {
    const context = await tvly.search(title,[])
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
                content: `Generate a 500-word blog post with the following details:
                Title: ${title}
                Writing Style: ${style}
                
                You will be using the following context for reference and citations:
                ${context}
                
                Ensure the post is engaging, informative, and includes proper citations to the provided context.`
            }
        ],
        response_format: {type:'json_object'}
    })
    const data = await response.json()
    return JSON.parse(data.choices[0].message.content)["content"] as string[]
}