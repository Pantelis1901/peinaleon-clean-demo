# peinaleon-clean-demo

Clean demo for "Ο Πειναλέων" — AI telephone order receiver (no email).

Quick steps:
1. copy `.env.example` -> `.env` and add your keys.
2. npm install
3. npm start
4. run `ngrok http 3000` and set Twilio webhook to {NGROK_URL}/twilio/voice

Notes:
- This version has NO email sending. It only answers calls, transcribes and confirms orders.
- Don't commit .env to git.
