import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    } 

    try {
        const { priceID, quantity } = JSON.parse(event.body || "{}");

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceID,
                    quantity: parseInt(quantity, 10) || 1
                }
            ],
            mode: 'payment',
            success_url: `https://${process.env.SITE_URL}/success.html`,
            cancel_url: `https://${process.env.SITE_URL}/cancel.html`
        })

        return {
            statusCode: 200,
            headers: {
                ...cors,
                "Content-Type": "application/json" ,
                Location: session.url
            },
            body: JSON.stringify(
                {
                    url: session.url
                }
            )
        };
    } catch(err) {
        console.log("ERROR!");
        return {
            statusCode: 400,
            headers: {...cors, "Content-Type": "application/json"},
            body: JSON.stringify({error: err.message})
        };
    }
}

//success_url: `${process.env.SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//cancel_url: `${process.env.SITE_URL}/cancel`