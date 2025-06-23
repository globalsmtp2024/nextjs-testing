import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array is required" },
        { status: 400 }
      );
    }

    // Add system message to guide the model to search for travel options
    const enhancedMessages = [
      {
        role: "system",
        content: `You are a travel assistant that provides real-time travel package information. When users ask about travel options, use the following format to present available packages:

[Package Type] - [Provider]
Price: $[amount]
Details: [brief description]
Book Now: [booking link]

For example:
Flight Package - Expedia
Price: $899
Details: Round-trip from New York to Paris, including 7-night hotel stay
Book Now: https://expedia.com/package123

Hotel Package - Booking.com
Price: $1299
Details: 5-star resort in Bali with breakfast included
Book Now: https://booking.com/hotel123

Please provide specific, current pricing and availability information.`
      },
      ...messages
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using GPT-3.5-turbo as it's more cost-effective
      messages: enhancedMessages.map((m) => ({ role: m.role, content: m.content })),
      max_tokens: 1024,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content;
    
    if (!reply) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error in chat completion:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI. Please try again." },
      { status: 500 }
    );
  }
} 