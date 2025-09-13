import Strip from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not Allowed" }

    try {
        const { priceId, quantity = 1 } = JSON.parse(event.body || "{}");

        const session = await stripe.checkout.session.create({
            mode: "payment",
            line_items: [{ price: priceId, quantity }],
            success_url: `${process.env.SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.SITE_URL}/cancel`
        });

        return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
    } catch(err) {
        return { statusCode: 400, body: JSON.stringify({ error: err.message }) };
    }
}