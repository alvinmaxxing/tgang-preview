// T.GANG CHECKOUT CONFIG — the only file to edit to go live.
// Paste T.GANG's own Paystack PUBLIC key (pk_test_... or pk_live_...). Leave '' for DEMO mode.
// NEVER put a secret key (sk_...) in this file or anywhere in the website.
window.TG_CONFIG={
  PAYSTACK_PUBLIC_KEY:'',
  // Paste T.GANG's own Flutterwave PUBLIC key (FLWPUBK_TEST-... or FLWPUBK-...). Leave '' for DEMO mode.
  FLUTTERWAVE_PUBLIC_KEY:'',
  // Flutterwave docs list 'opay' as an NGN payment option (OPay e-wallet).
  FLW_OPTIONS:'card, banktransfer, ussd, mobilemoneyghana, opay',
  DEFAULT_GATEWAY:'flutterwave', // 'paystack' or 'flutterwave'
  CURRENCY:'NGN',
  // Paystack Inline channels. Note: Paystack docs list no OPay channel; mobile_money works for Ghana (GHS) accounts only.
  CHANNELS:['card','bank','bank_transfer','ussd','mobile_money'],
  WHATSAPP:'2349159999813',
  // With Paystack (no OPay channel in its docs), OPay falls back to a manual transfer. EXAMPLE details below: replace with T.GANG's real OPay account.
  OPAY:{number:'0000000000 (example)',name:'T.GANG Store (example)'},
  // Optional: your server endpoint that verifies a reference with the secret key, e.g. '/api/verify?reference='
  VERIFY_URL:''
};

// NEW DROP COUNTDOWN: edit the date (ISO with timezone) and name here. EXAMPLE date.
window.TG_DROP={name:'The Atelier Edit',date:'2026-11-28T19:00:00+01:00'};
// Example bundle discount for "Build your set" (0.10 = 10% off when you take 2+ pieces).
window.TG_BUNDLE=0.10;
