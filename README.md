# T.GANG preview store

Plain HTML/CSS/JS. Products and prices: `products.js`. Checkout settings: `config.js`.

## Checkout & payments

Bag → **Checkout** (name, phone, email, address, city, country) → choose **Card**, **Bank transfer**, **OPay**, **USSD / Mobile money** or **Order on WhatsApp** → payment → success screen with order reference and a "Send confirmation on WhatsApp" button.

- **Demo mode** (`PAYSTACK_PUBLIC_KEY: ''`): payment is simulated. Nothing is charged; the payment sheet says "Demo mode — no money is charged".
- **Live mode** (`pk_test_…` or `pk_live_…` set): Paystack Inline (`https://js.paystack.co/v1/inline.js`) opens with amount in kobo, NGN, the customer's email, and metadata (items, sizes, phone, address).
- **OPay**: Paystack's payment-channels docs do not list OPay, so OPay is a manual transfer to T.GANG's OPay number (example details in `config.js`). Flutterwave supports OPay if a direct integration is wanted.
- **Mobile money** on Paystack is for Ghana (GHS) accounts; USSD is for Nigeria.

## Going live with T.GANG's own Paystack account

1. T.GANG signs up at paystack.com as the business, completes compliance (CAC docs, ID) and adds **their own settlement bank account**, so payouts go straight to T.GANG.
2. Dashboard → Settings → API Keys: copy the **public key** into `config.js` → `PAYSTACK_PUBLIC_KEY`. Test with `pk_test_…` first, then switch to `pk_live_…`.
3. The **secret key (`sk_…`) must never go in this website**. Keep it only on a server (e.g. a Netlify/Vercel/Cloudflare function).
4. Verification: the browser callback is not proof of payment. On the server, call `GET https://api.paystack.co/transaction/verify/:reference` with the secret key and check status `success`, amount and currency; set `VERIFY_URL` in `config.js` to that endpoint.
5. Webhook: in Dashboard → Settings → API Keys & Webhooks set a webhook URL on the server; verify the `x-paystack-signature` header (HMAC SHA512 of the body with the secret key) and mark orders paid on `charge.success`. Bank transfer and USSD payments complete offline, so they need the webhook.
6. Enable the wanted channels in the Paystack dashboard and replace the example OPay details in `config.js`.
