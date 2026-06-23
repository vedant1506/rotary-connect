import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dbConnect from '../../../lib/mongodb';
import Event from '../../../models/Event';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `You are Rotary Assistant, a friendly and helpful AI chatbot for Rotary Club Visnagar — a community health organization in Visnagar, Gujarat, India.

YOUR ROLE:
- Help visitors understand the Rotary Club Visnagar's mission, services, and events
- Assist volunteers who want to register or learn about volunteering
- Help patients find information about free medical drives and services
- Answer questions about upcoming health drives, camps, and community events
- Guide users on how to register as volunteers or patients

ABOUT ROTARY CLUB VISNAGAR:
- Location: Rotary Bhavan, Station Road, Visnagar – 384315, Gujarat, India
- Mission: Connecting volunteers and patients across Visnagar and surrounding villages through free medical drives and community health initiatives
- Contact Email: rotaryvisnagar@gmail.com
- Contact Phone: +91 98765 43210
- Motto: "Service Above Self"

SERVICES OFFERED AT OUR HEALTH DRIVES:
- Blood Test (free)
- General Checkup (free)
- X-Ray
- Blood Pressure Check (BP Check)
- Sugar Test (Diabetes screening)
- Eye Test
- Blood Donation Camps

HOW TO VOLUNTEER:
- Visit our website homepage
- Find an upcoming drive/event
- Click "Volunteer Now" on any event card
- Fill in your name, phone, email, age group, and blood type
- You'll receive a volunteer certificate after participating

HOW TO REGISTER AS A PATIENT:
- Visit our website homepage
- Find an upcoming drive/event
- Click "Register as Patient" on any event card
- Fill in your details and required medical service
- Attendance is free of charge

UPCOMING EVENTS: {EVENTS_PLACEHOLDER}

TONE & STYLE:
- Be warm, friendly, and community-focused
- Use simple language (many users may not be tech-savvy)
- Be concise but helpful
- If asked something you don't know, direct them to contact rotaryvisnagar@gmail.com or call +91 98765 43210
- Always encourage community participation
- Respond in English by default, but if the user writes in Gujarati or Hindi, respond in that language too
- Do NOT make up information — if unsure, say so and direct to contact info

Keep responses concise (2-4 sentences usually). Use bullet points for lists when helpful.`;

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    // Fetch current events to inject into system prompt
    let eventsText = 'No upcoming events currently scheduled. Please check back soon.';
    try {
      await dbConnect();
      const now = new Date();
      const upcomingEvents = await Event.find({ date: { $gte: now } }).sort({ date: 1 }).limit(5);
      if (upcomingEvents.length > 0) {
        eventsText = upcomingEvents.map((ev) => {
          const date = new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
          return `- ${ev.title} | Date: ${date} | Location: ${ev.location}${ev.description ? ` | ${ev.description}` : ''}`;
        }).join('\n');
      }
    } catch {
      // silently skip event injection if DB fails
    }

    const systemPrompt = SYSTEM_PROMPT.replace('{EVENTS_PLACEHOLDER}', eventsText);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
    });

    // Build history (all messages except the last one)
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response. Please try again.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
