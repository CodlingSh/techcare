const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookKey = process.env.STRIPE_WEBHOOK_SECRET;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    } 

    if (webhookKey) {
        console.log("STRIPE HIT ME!")
        return {
            statusCode: 200,
            headers: {...cors, "Content-Type": "application/json"},
            body: JSON.stringify({message: "I HAVE THE KEY"})
        }
    }
}