# Vercel environment variable setup (real-time speech analysis only)

1. Open your Vercel project -> Settings -> Environment Variables.
2. Add `GEMINI_API_KEY` and paste a newly generated Google Gemini API key as its value.
3. Enable Production and Preview as needed, save, and redeploy the project.
4. The real-time speech analysis frontend calls `/api/gemini-speech-review`. This Vercel serverless function reads `process.env.GEMINI_API_KEY` server-side and forwards the request to Gemini.

## Important

- Do not use a `NEXT_PUBLIC_` variable or put the key in frontend JavaScript/HTML.
- Any key previously hardcoded in the frontend should be considered exposed. Revoke it in Google AI Studio / Google Cloud and create a replacement key before deploying.
- Apply API restrictions, quotas, and billing alerts where available.
- This project uses Vercel's Node.js serverless-function runtime; use a Node.js runtime with native `fetch` (Node 18+).
- The chatbot is not configured as part of this setup. Only real-time speech analysis is proxied through the server-side API function.
