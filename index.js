import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import twilio from 'twilio';
import { processOrderText } from './utils/ai.js';
import { textToSpeechBase64 } from './utils/eleven.js';

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

console.log('DEBUG env -> TWILIO_SID:', !!process.env.TWILIO_SID, 'OPENAI:', !!process.env.OPENAI_API_KEY);

app.post('/twilio/voice', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  const gather = twiml.gather({
    input: 'speech',
    speechTimeout: 'auto',
    action: '/twilio/process',
    language: 'el-GR'
  });
  gather.say('Καλησπέρα σας, καλέσατε το σουβλατζίδικο Ο Πειναλέων. Τι θα θέλατε να παραγγείλετε;');
  res.type('text/xml').send(twiml.toString());
});

app.post('/twilio/process', async (req, res) => {
  try {
    const orderText = req.body.SpeechResult || '';
    const aiReply = await processOrderText(orderText);
    const base64Audio = await textToSpeechBase64(aiReply);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.play({ contentType: 'audio/mpeg' }, `data:audio/mpeg;base64,${base64Audio}`);
    res.type('text/xml').send(twiml.toString());
  } catch (err) {
    console.error('Processing error:', err);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Συγγνώμη, παρουσιάστηκε κάποιο σφάλμα. Προσπαθήστε ξανά αργότερα.');
    res.type('text/xml').send(twiml.toString());
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
