export async function GET() {
  return Response.json({
    hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    apiKeyLength: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.length || 0,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || null,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || null,
    hasAppId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
}
