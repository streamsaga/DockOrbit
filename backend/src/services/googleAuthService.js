// googleAuthService.js
//
// Verifies the ID token ("credential") sent by Google's Sign In With
// Google button on the frontend. This confirms the token was really
// issued by Google for YOUR app (matching GOOGLE_CLIENT_ID) and hasn't
// been tampered with, then hands back the verified profile info.

import { OAuth2Client } from "google-auth-library";

function getClient() {
  // Read lazily (inside a function) so it's read after .env has
  // loaded, same fix as the YouTube API key timing issue earlier.
  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
}

export async function verifyGoogleToken(credential) {
  const client = getClient();
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return {
    sub: payload.sub, // Google's stable unique ID for this user
    email: payload.email,
    name: payload.name,
  };
}