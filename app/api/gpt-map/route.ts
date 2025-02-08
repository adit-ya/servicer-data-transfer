import { NextResponse } from 'next/server'
import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
    try {
        const body = await request.json()

        if (!body.messages) {
            return NextResponse.json(
                { error: 'No messages provided in request body' },
                { status: 400 }
            )
        }

        const systemMessage = {
            role: 'system',
            content: `You are an expert in data mapping and financial terminology. Analyze the field names and suggest mappings between source and target fields. Return only fields where you're reasonably confident (>80%) about the mapping.
            
            IMPORTANT: Your response must be valid JSON in this exact format:
            {
                "mappings": [
                    {
                        "sourceId": "string",
                        "targetId": "string",
                        "confidence": number
                    }
                ]
            }`,
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [systemMessage, ...body.messages],
            temperature: 0.3,
        })

        const content = completion.choices[0].message.content
        console.log('Received response from OpenAI:', content)

        if (!content) {
            return NextResponse.json(
                { error: 'Empty response from OpenAI' },
                { status: 500 }
            )
        }

        try {
            const parsedResponse = JSON.parse(content)
            return NextResponse.json({
                mappings: parsedResponse.mappings || [],
            })
        } catch (parseError) {
            console.error('Error parsing OpenAI response:', parseError)
            return NextResponse.json(
                {
                    error: 'Invalid JSON response from OpenAI',
                    details: content,
                },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error('Error in GPT mapping:', error)

        return NextResponse.json(
            {
                error: 'Failed to process mapping request',
                details:
                    error instanceof Error ? error.message : 'Unknown error',
            },
            {
                status: 500,
            }
        )
    }
}
