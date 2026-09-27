// send-quote.js
// Fetches a random motivational quote and sends it to WhatsApp via CallMeBot's free API.
// Requires two environment variables: PHONE_NUMBER, CALLMEBOT_APIKEY

const PHONE_NUMBER = process.env.PHONE_NUMBER;
const API_KEY = process.env.CALLMEBOT_APIKEY;

if (!PHONE_NUMBER || !API_KEY) {
  console.error("Missing PHONE_NUMBER or CALLMEBOT_APIKEY environment variables.");
  process.exit(1);
}

async function getQuote() {
  try {
    const res = await fetch("https://zenquotes.io/api/random");
    const data = await res.json();
    const { q, a } = data[0]; // q = quote text, a = author
    return `"${q}" — ${a}`;
  } catch (err) {
    console.error("Failed to fetch quote, using fallback.", err);
    return "The best time to start was yesterday. The next best time is now.";
  }
}

async function sendWhatsApp(message) {
  const url = `https://api.callmebot.com/whatsapp.php?phone=${PHONE_NUMBER}&text=${encodeURIComponent(
    message
  )}&apikey=${API_KEY}`;

  const res = await fetch(url);
  const text = await res.text();
  console.log("CallMeBot response:", text);
}

(async () => {
  const quote = await getQuote();
  console.log("Sending quote:", quote);
  await sendWhatsApp(quote);
})();
