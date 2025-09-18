import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    } 

    try {
        const { productId, quantity } = JSON.parse(event.body || "{}");

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: productId,
                    quantity: parseInt(quantity, 10) || 1
                }
            ],
            mode: 'payment',
            success_url: `${process.env.SITE_URL}/success.html`,
            cancel_url: `${process.env.SITE_URL}/cancel.html`
        })

        return {
            statusCode: 303,
            headers: {
                Location: session.url
            },
            body: JSON.stringify(
                {
                    message: "It really whips the llama's ass!"
                }
            )
        };
    } catch(err) {
        return {
            statusCode: 400,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({error: err.message})
        };
    }
}

//success_url: `${process.env.SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//cancel_url: `${process.env.SITE_URL}/cancel`