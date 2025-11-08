import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export async function textToSpeechBase64(text) {
  const VOICE_ID = process.env.VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // placeholder
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVEN_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      voice_settings: { stability: 0.6, similarity_boost: 0.8 }
    })
  });
  if (!response.ok) {
    const txt = await response.text();
    throw new Error('ElevenLabs TTS error: ' + txt);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('base64');
}
