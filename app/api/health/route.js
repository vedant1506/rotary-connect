import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasUri = !!process.env.MONGO_URI;
  const hasAdminEmail = !!process.env.ADMIN_LOGIN_EMAIL;
  const hasAdminPassword = !!process.env.ADMIN_LOGIN_PASSWORD;
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  try {
    await dbConnect();
    return NextResponse.json(
      {
        success: true,
        message: 'OK',
        env: { MONGO_URI_set: hasUri, ADMIN_LOGIN_EMAIL_set: hasAdminEmail, ADMIN_LOGIN_PASSWORD_set: hasAdminPassword, GEMINI_API_KEY_set: hasGeminiKey, GEMINI_MODEL: geminiModel },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed. Check MONGO_URI in Vercel Environment Variables and Atlas Network Access (0.0.0.0/0).',
        error: error instanceof Error ? error.message : 'Unknown error',
        env: { MONGO_URI_set: hasUri, ADMIN_LOGIN_EMAIL_set: hasAdminEmail, ADMIN_LOGIN_PASSWORD_set: hasAdminPassword, GEMINI_API_KEY_set: hasGeminiKey, GEMINI_MODEL: geminiModel },
      },
      { status: 500 }
    );
  }
}
