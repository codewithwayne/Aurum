import "server-only";

const PAYHERO_BASE_URL = "https://backend.payhero.co.ke/api/v2";

function getAuthHeader() {
  const username = process.env.PAYHERO_API_USERNAME!;
  const password = process.env.PAYHERO_API_PASSWORD!;
  const credentials = `${username}:${password}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}

export async function initiateStkPush({
  amount,
  phoneNumber,
  externalReference,
}: {
  amount: number;
  phoneNumber: string;
  externalReference: string;
}) {
  const response = await fetch(`${PAYHERO_BASE_URL}/payments`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      phone_number: phoneNumber,
      channel_id: process.env.PAYHERO_CHANNEL_ID,
      provider: "m-pesa",
      external_reference: externalReference,
      callback_url: process.env.PAYHERO_CALLBACK_URL,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("PayHero STK Push failed:", data);
    throw new Error(data.message || "Failed to initiate STK Push");
  }

  return data;
}