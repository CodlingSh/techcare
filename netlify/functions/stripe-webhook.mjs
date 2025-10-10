import Stripe from "stripe";
const webhookKey = process.env.STRIPE_WEBHOOK_SECRET;
const resendKey = process.env.RESEND_KEY;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const sig = event.headers["stripe-signature"];
    const rawbody = event.body;

    let stripeEvent;
    try {
        stripeEvent = stripe.webhooks.constructEvent(rawbody, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch(err) {
        return {statusCode: 400, body: `Webhook Error: ${err.message}`};
    }

    if (stripeEvent.type === "checkout.session.completed") {
        const session = stripeEvent.data.object;
        const { name, email, phone, preferredDate, backupDate, backupDate2, anythingElse } = session.metadata || {};

        await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${resendKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "onboarding@resend.dev",
                to: "shelcod@gmail.com",
                subject: "New Form Submission",
                html: `
                        <p>Field: ${name}</p>
                        <p>Field: ${email}</p>
                        <p>Field: ${phone}</p>
                        <p>Field: ${preferredDate}</p>
                        <p>Field: ${backupDate}</p>
                        <p>Field: ${backupDate2}</p>
                        <p>Field: ${anythingElse}</p>
                        `
            })
        });

        return {statusCode: 200, body: "ok"};
    }
}

    // try {
    //     if (webhookKey) {
    //         console.log("I have the webhook key");
    //         if (resendKey) {
    //             console.log("I also have the key");
    //             await fetch("https://api.resend.com/emails", {
    //                 method: "POST",
    //                 headers: {
    //                     Authorization: `Bearer ${resendKey}`,
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     from: "onboarding@resend.dev",
    //                     to: "shelcod@gmail.com",
    //                     subject: "New Form Submission",
    //                     html: "<p>This is coming from the <strong>website</strong>!</p>"
    //                 })
    //             });

    //             return {
    //                 statusCode: 200,
    //                 headers: {...cors, "Content-Type": "application/json"},
    //                 body: JSON.stringify({message: "I HAVE THE KEY"})
    //             };
    //         };
    //     };
    // }
    // catch(err) {
    //     return {
    //     statusCode: 400,
    //     headers: {...cors, "Content-Type": "application/json"},
    //     body: JSON.stringify({error: err.message})
    // }
    // }
