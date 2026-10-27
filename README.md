# T.GANG preview store

Plain HTML/CSS/JS. Products and prices: `products.js`. Checkout settings: `config.js`.

## Checkout & payments

Bag → **Checkout** (name, phone, email, address, city, country) → choose **Card**, **Bank transfer**, **OPay**, **USSD / Mobile money** or **Order on WhatsApp** → payment → success screen with order reference and a "Send confirmation on WhatsApp" button.

- **Demo mode** (`PAYSTACK_PUBLIC_KEY: ''`): payment is simulated. Nothing is charged; the payment sheet says "Demo mode — no money is charged".
- **Live mode** (`pk_test_…` or `pk_live_…` set): Paystack Inline (`https://js.paystack.co/v1/inline.js`) opens with amount in kobo, NGN, the customer's email, and metadata (items, sizes, phone, address).
- **OPay**: Paystack's payment-channels docs do not list OPay, so OPay is a manual transfer to T.GANG's OPay number (example details in `config.js`). Flutterwave supports OPay if a direct integration is wanted.
- **Mobile money** on Paystack is for Ghana (GHS) accounts; USSD is for Nigeria.

## Flutterwave (second gateway, and the one for OPay)

The payment step lets the customer pick **Flutterwave** or **Paystack**. Flutterwave Inline (`https://checkout.flutterwave.com/v3.js`, `FlutterwaveCheckout`) uses `FLUTTERWAVE_PUBLIC_KEY` and `FLW_OPTIONS` in `config.js` (`card, banktransfer, ussd, mobilemoneyghana, opay`). Flutterwave's docs list `opay` as an NGN payment option, so OPay through Flutterwave is a real in-app OPay payment; with Paystack, OPay falls back to a manual transfer.

Going live: T.GANG opens a Flutterwave business account with their settlement bank, puts the **public key** (`FLWPUBK-…`) in `config.js`, keeps the **secret key on a server only**, verifies every payment server-side with `GET https://api.flutterwave.com/v3/transactions/:id/verify` (check status `successful`, amount, currency, tx_ref), and sets a webhook (`charge.completed`, check the `verif-hash` header against your secret hash). Each gateway runs in demo mode while its key is empty.

## Going live with T.GANG's own Paystack account

1. T.GANG signs up at paystack.com as the business, completes compliance (CAC docs, ID) and adds **their own settlement bank account**, so payouts go straight to T.GANG.
2. Dashboard → Settings → API Keys: copy the **public key** into `config.js` → `PAYSTACK_PUBLIC_KEY`. Test with `pk_test_…` first, then switch to `pk_live_…`.
3. The **secret key (`sk_…`) must never go in this website**. Keep it only on a server (e.g. a Netlify/Vercel/Cloudflare function).
4. Verification: the browser callback is not proof of payment. On the server, call `GET https://api.paystack.co/transaction/verify/:reference` with the secret key and check status `success`, amount and currency; set `VERIFY_URL` in `config.js` to that endpoint.
5. Webhook: in Dashboard → Settings → API Keys & Webhooks set a webhook URL on the server; verify the `x-paystack-signature` header (HMAC SHA512 of the body with the secret key) and mark orders paid on `charge.success`. Bank transfer and USSD payments complete offline, so they need the webhook.
6. Enable the wanted channels in the Paystack dashboard and replace the example OPay details in `config.js`.
