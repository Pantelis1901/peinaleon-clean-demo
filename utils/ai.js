import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export async function processOrderText(orderText) {
  const promptSystem = `Εσύ είσαι τηλεφωνήτρια που δέχεται παραγγελίες για το σουβλατζίδικο "Ο Πειναλέων".
Βγάλε μια σύντομη, σαφή επιβεβαίωση της παραγγελίας και συμπεριέλαβε πεδία: είδη, ποσότητες, διεύθυνση (αν δόθηκε), τρόπος πληρωμής (αν ανέφερε).`;

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: promptSystem },
      { role: 'user', content: orderText }
    ],
    temperature: 0.1,
    max_tokens: 300
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error('OpenAI error: ' + txt);
  }

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content?.trim() || 'Η παραγγελία καταχωρήθηκε.';
  return reply;
}
