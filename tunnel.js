// tunnel.js
require('dotenv').config({ path: '.env.local' });
const ngrok = require('@ngrok/ngrok');

(async function() {
  try {
    // Establish connectivity to your Next.js app on port 3000
    const listener = await ngrok.forward({
      addr: 3000,
      authtoken_from_env: true,
    });

    console.log(`✅ Ingress established at: ${listener.url()}`);
    console.log('➡️  Copy the URL above and update PAYHERO_CALLBACK_URL in your .env.local file.');
    console.log('➡️  Remember to restart your Next.js dev server after updating the URL.');
  } catch (error) {
    console.error('❌ Failed to start ngrok tunnel:', error);
  }
})();

// Keep the process alive to maintain the tunnel
process.stdin.resume();