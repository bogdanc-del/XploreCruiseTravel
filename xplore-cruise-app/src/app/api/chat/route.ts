import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

const SYSTEM_PROMPT = `You are a friendly and knowledgeable cruise travel consultant for XploreCruiseTravel, a licensed tour operator (CAEN 7912) based in Romania since 2016.

Your role:
- Help customers find the perfect cruise based on their preferences (destination, budget, dates, interests)
- Provide accurate information about cruise lines, ships, destinations, and onboard experiences
- Recommend specific cruises from our catalog
- Answer questions about booking process, payment options, cancellation policies
- Share tips about cruise travel (what to pack, what to expect, shore excursions)

Key information:
- Company: XPLORE CRUISE TRAVEL SRL (CUI 36785800, J03/1962/2016)
- Contact: Ceausu Daniel Antonina
- Email: xplorecruisetravel@gmail.com
- Phone: +40 749 558 572
- We offer cruises from major lines: MSC, Costa, Royal Caribbean, Norwegian, Viking, Silversea, Celebrity, Princess
- Destinations: Mediterranean, Caribbean, Northern Europe (Fjords), River Cruises (Danube, Rhine), Alaska, Asia
- Prices start from €399/person for ocean cruises, €1,500/person for river cruises
- EUR to RON exchange rate: approximately 4.97

Guidelines:
- Be warm, professional, and enthusiastic about cruise travel
- If asked about specific prices, mention they are approximate and suggest contacting us for exact quotes
- Always encourage customers to reach out for personalized offers
- If you don't know something specific, say so honestly and suggest contacting our team
- For booking requests, guide them to use the booking form on our website or call us directly
- Keep responses concise but helpful (max 2-3 paragraphs unless detailed info is needed)
- When the locale is 'ro', respond in Romanian. When 'en', respond in English.`

export async function POST(request: NextRequest) {
  try {
    const { message, locale, history } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ reply: 'Please provide a message.' }, { status: 400 })
    }

    // If no API key, return a helpful fallback response
    if (!process.env.ANTHROPIC_API_KEY) {
      const fallbackRo = `Multumesc pentru mesaj! Sunt consilierul virtual XploreCruiseTravel.

In momentul de fata serviciul AI este in curs de configurare. Intre timp, va pot ajuta prin:
📧 Email: xplorecruisetravel@gmail.com
📞 Telefon: +40 749 558 572

Echipa noastra va poate oferi informatii personalizate despre croaziere!`

      const fallbackEn = `Thank you for your message! I'm the XploreCruiseTravel virtual advisor.

The AI service is currently being configured. In the meantime, I can help you through:
📧 Email: xplorecruisetravel@gmail.com
📞 Phone: +40 749 558 572

Our team can provide personalized cruise information!`

      return NextResponse.json({
        reply: locale === 'ro' ? fallbackRo : fallbackEn
      })
    }

    // Build conversation history for Claude
    const messages: { role: 'user' | 'assistant'; content: string }[] = [
      ...(history || []).slice(-10), // Keep last 10 messages for context
      { role: 'user' as const, content: `[User locale: ${locale}] ${message}` }
    ]

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    })

    const reply = response.content[0].type === 'text'
      ? response.content[0].text
      : 'I apologize, but I could not generate a response.'

    return NextResponse.json({ reply })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { reply: 'Sorry, something went wrong. Please try again or contact us directly at xplorecruisetravel@gmail.com' },
      { status: 500 }
    )
  }
}
