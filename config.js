// T.GANG CHECKOUT CONFIG — the only file to edit to go live.
// Paste T.GANG's own Paystack PUBLIC key (pk_test_... or pk_live_...). Leave '' for DEMO mode.
// NEVER put a secret key (sk_...) in this file or anywhere in the website.
window.TG_CONFIG={
  PAYSTACK_PUBLIC_KEY:'',
  CURRENCY:'NGN',
  // Paystack Inline channels. Note: Paystack docs list no OPay channel; mobile_money works for Ghana (GHS) accounts only.
  CHANNELS:['card','bank','bank_transfer','ussd','mobile_money'],
  WHATSAPP:'2349159999813',
  // OPay is offered as a manual transfer. EXAMPLE details below: replace with T.GANG's real OPay account.
  OPAY:{number:'0000000000 (example)',name:'T.GANG Store (example)'},
  // Optional: your server endpoint that verifies a reference with the secret key, e.g. '/api/verify?reference='
  VERIFY_URL:''
};
