const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function handler(req, res) {
    return(req + res);
}

//success_url: `${process.env.SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//cancel_url: `${process.env.SITE_URL}/cancel`