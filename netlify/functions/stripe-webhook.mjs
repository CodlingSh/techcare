import Stripe from "stripe";
const webhookKey = process.env.STRIPE_WEBHOOK_SECRET;
const resendKey = process.env.RESEND_KEY;

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
        if (webhookKey) {
            console.log("I have the webhook key");
            if (resendKey) {
                console.log("I also have the  key");
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
                        html: "<p>This is coming from the <strong>website</strong>!</p>"
                    })
                });

                return {
                    statusCode: 200,
                    headers: {...cors, "Content-Type": "application/json"},
                    body: JSON.stringify({message: "I HAVE THE KEY"})
                };
            };
        };
    }
    catch(err) {
        return {
        statusCode: 400,
        headers: {...cors, "Content-Type": "application/json"},
        body: JSON.stringify({error: err.message})
    }
    }
}