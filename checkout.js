(()=>{const C=window.TG_CONFIG,$=id=>document.getElementById(id),N=n=>'₦'+n.toLocaleString();
const ck=$('ck');let method='card',order,gw=C.DEFAULT_GATEWAY||'flutterwave';
const isLive=g=>g=='paystack'?/^pk_(test|live)_/.test(C.PAYSTACK_PUBLIC_KEY||''):/^FLWPUBK(_TEST)?-/.test(C.FLUTTERWAVE_PUBLIC_KEY||'');let live=false;
const total=()=>bag.reduce((a,b)=>a+b[3],0);
const open=v=>{ck.dataset.v=v;ck.classList.add('open');ck.scrollTop=0;ck.querySelector('.ckin').scrollTop=0};
window.openCheckout=()=>{if(!bag.length)return;B.classList.remove('open');
$('cksum').innerHTML=bag.map(b=>`<div class="cs"><img src="assets/${b[4]}" alt=""><span>${b[0]}<small>${b[2]} · Size ${b[5]}</small></span><b>${N(b[3])}</b></div>`).join('')+`<div class="cs t"><span>Delivery</span><b>To be confirmed</b></div><div class="cs t big"><span>Total</span><b>${N(total())}</b></div>`;open('form')};
$('ckx').onclick=()=>ck.classList.remove('open');
$('pm').onclick=e=>{const b=e.target.closest('button');if(!b)return;method=b.dataset.m;$('pm').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x==b))};
const ref=()=>'TG-'+Date.now().toString(36).toUpperCase().slice(-6)+Math.random().toString(36).slice(2,5).toUpperCase();
const ML={card:'Card',bank_transfer:'Bank transfer',opay:'OPay',ussd:'USSD / Mobile money'};
$('ckf').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),d=Object.fromEntries(f);
order={...d,ref:ref(),method,total:total(),items:bag.map(b=>({name:b[0],colour:b[2],size:b[5],price:b[3]}))};
if(method=='wa'){saveOrder('whatsapp','whatsapp-request');window.open(waLink('Hi T.GANG! I\'d like to order:'),'_blank');return}
render();open('pay')};
const saveOrder=(ch,status)=>window.ACCT&&ACCT.placeOrder({ref:order.ref,channel:ch,name:order.name,email:order.email,phone:order.phone,address:order.address,city:order.city,country:order.country,method:order.method,gateway:ch=='whatsapp'?null:gw,total:order.total,status:status||(live?'paid-unverified':'demo'),items:order.items.map(i=>({key:i.name.replace(' (set)','')+'|'+i.colour,name:i.name,colour:i.colour,size:i.size,price:i.price}))});
const GN={paystack:'Paystack',flutterwave:'Flutterwave'};
function render(){live=isLive(gw);$('gw').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.g==gw));
$('ckdemo').hidden=live;const manual=method=='opay'&&gw=='paystack';
$('pmeth').textContent=manual?'OPay transfer':ML[method];
if(live&&!manual){$('pbody').innerHTML=`<p>You'll pay <b>${N(order.total)}</b> securely in the ${GN[gw]} window.</p>`;$('pgo').textContent='Pay '+N(order.total)+' with '+GN[gw];return}
$('pbody').innerHTML=manual?`<p>Send <b>${N(order.total)}</b> to:</p><div class="acct"><span>OPay number</span><b>${C.OPAY.number}</b><span>Account name</span><b>${C.OPAY.name}</b><span>Reference</span><b>${order.ref}</b></div><p class="note">Paystack has no OPay channel, so this is a manual transfer. Choose Flutterwave to pay in the OPay app. Example details.</p>`:{card:`<label>Card number<input value="4084 0840 8408 4081" inputmode="numeric"></label><div class="two"><label>Expiry<input value="12 / 29"></label><label>CVV<input value="408"></label></div>`,
bank_transfer:`<p>Transfer <b>${N(order.total)}</b> to this one-time account:</p><div class="acct"><span>Bank</span><b>Demo Bank</b><span>Account</span><b>0123456789</b><span>Expires</span><b>in 30 minutes</b></div>`,
opay:`<p>Approve <b>${N(order.total)}</b> in your OPay app</p><div class="acct"><span>OPay wallet</span><b>${order.phone}</b><span>Via</span><b>Flutterwave</b></div>`,
ussd:`<p>Nigeria: dial on your phone</p><div class="ussd">*737*000*${order.total}#</div><p class="note">Ghana: approve the MoMo prompt sent to ${order.phone}</p>`}[method];
$('pgo').textContent=manual?"I've sent the money":method=='card'?'Pay '+N(order.total):"I've completed payment"}
$('gw').onclick=e=>{const b=e.target.closest('button');if(b){gw=b.dataset.g;render()}};
$('pback').onclick=()=>open('form');
$('pgo').onclick=()=>{if(live&&!(method=='opay'&&gw=='paystack'))return gw=='paystack'?payLive():payFlw();open('proc');setTimeout(done,2200)};
function waLink(h){return `https://wa.me/${C.WHATSAPP}?text=`+encodeURIComponent(h+'\n'+order.items.map(i=>`• ${i.name} (${i.colour}), size ${i.size}: ${N(i.price)}`).join('\n')+`\nTotal: ${N(order.total)} + delivery\nName: ${order.name}\nPhone: ${order.phone}\nDeliver to: ${order.address}, ${order.city}, ${order.country}`)}
function done(status){saveOrder('checkout',status);$('sref').textContent=order.ref;$('sname').textContent=order.name.split(' ')[0];
$('smeth').textContent=(order.method=='opay'&&gw=='paystack'?'OPay transfer (awaiting confirmation)':ML[order.method])+' · '+GN[gw]+(live?'':' · demo');
$('swa').href=waLink(`Hi T.GANG! Order ${order.ref} — paid via ${ML[order.method]} (${GN[gw]})${live?'':' (demo)'}${status?' ['+status+']':''}.`);
bag=[];rb();open('ok')}
function payLive(){const go=()=>PaystackPop.setup({key:C.PAYSTACK_PUBLIC_KEY,email:order.email,amount:order.total*100,currency:C.CURRENCY,ref:order.ref,
channels:method=='card'?['card']:method=='bank_transfer'?['bank_transfer','bank']:method=='ussd'?['ussd','mobile_money']:C.CHANNELS,
metadata:{items:order.items,phone:order.phone,address:`${order.address}, ${order.city}, ${order.country}`,custom_fields:[{display_name:'Phone',variable_name:'phone',value:order.phone}]},
callback:r=>{open('proc');if(C.VERIFY_URL)fetch(C.VERIFY_URL+encodeURIComponent(r.reference)).then(x=>x.json()).then(v=>done(v.status||'verify-pending')).catch(()=>done('verify-pending'));else done('pending server verification')},
onClose:()=>{}}).openIframe();
if(window.PaystackPop)go();else{const s=document.createElement('script');s.src='https://js.paystack.co/v1/inline.js';s.onload=go;document.head.appendChild(s)}}
function payFlw(){const go=()=>{const m=FlutterwaveCheckout({public_key:C.FLUTTERWAVE_PUBLIC_KEY,tx_ref:order.ref,amount:order.total,currency:C.CURRENCY,
payment_options:{card:'card',bank_transfer:'banktransfer',opay:'opay',ussd:'ussd, mobilemoneyghana'}[method]||C.FLW_OPTIONS,
customer:{email:order.email,phone_number:order.phone,name:order.name},meta:{phone:order.phone,address:`${order.address}, ${order.city}, ${order.country}`,items:JSON.stringify(order.items)},
customizations:{title:'T.GANG',description:'Order '+order.ref},
callback:r=>{m.close();open('proc');if(C.VERIFY_URL)fetch(C.VERIFY_URL+encodeURIComponent(r.transaction_id)+'&gateway=flutterwave').then(x=>x.json()).then(v=>done(v.status||'verify-pending')).catch(()=>done('verify-pending'));else done(r.status+', pending server verification')},onclose:()=>{}})};
if(window.FlutterwaveCheckout)go();else{const s=document.createElement('script');s.src='https://checkout.flutterwave.com/v3.js';s.onload=go;document.head.appendChild(s)}}})();
