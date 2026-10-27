(()=>{const C=window.TG_CONFIG,$=id=>document.getElementById(id),N=n=>'₦'+n.toLocaleString();
const ck=$('ck'),live=/^pk_(test|live)_/.test(C.PAYSTACK_PUBLIC_KEY||'');let method='card',order;
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
if(method=='wa'){window.open(waLink('Hi T.GANG! I\'d like to order:'),'_blank');return}
if(method=='opay'){$('pmeth').textContent='OPay transfer';$('pbody').innerHTML=`<p>Send <b>${N(order.total)}</b> to:</p><div class="acct"><span>OPay number</span><b>${C.OPAY.number}</b><span>Account name</span><b>${C.OPAY.name}</b><span>Reference</span><b>${order.ref}</b></div><p class="note">Delivery fee is confirmed on WhatsApp. Example details for this preview.</p>`;$('pgo').textContent="I've sent the money";open('pay');return}
if(live)return payLive();
$('pmeth').textContent=ML[method];
$('pbody').innerHTML={card:`<label>Card number<input value="4084 0840 8408 4081" inputmode="numeric"></label><div class="two"><label>Expiry<input value="12 / 29"></label><label>CVV<input value="408"></label></div>`,
bank_transfer:`<p>Transfer <b>${N(order.total)}</b> to this one-time account:</p><div class="acct"><span>Bank</span><b>Demo Bank</b><span>Account</span><b>0123456789</b><span>Expires</span><b>in 30 minutes</b></div>`,
ussd:`<p>Nigeria: dial on your phone</p><div class="ussd">*737*000*${order.total}#</div><p class="note">Ghana: approve the MoMo prompt sent to ${order.phone}</p>`}[method];
$('pgo').textContent=method=='card'?'Pay '+N(order.total):"I've completed payment";open('pay')};
$('pback').onclick=()=>open('form');
$('pgo').onclick=()=>{open('proc');setTimeout(done,2200)};
function waLink(h){return `https://wa.me/${C.WHATSAPP}?text=`+encodeURIComponent(h+'\n'+order.items.map(i=>`• ${i.name} (${i.colour}), size ${i.size}: ${N(i.price)}`).join('\n')+`\nTotal: ${N(order.total)} + delivery\nName: ${order.name}\nPhone: ${order.phone}\nDeliver to: ${order.address}, ${order.city}, ${order.country}`)}
function done(status){$('sref').textContent=order.ref;$('sname').textContent=order.name.split(' ')[0];
$('smeth').textContent=(order.method=='opay'?'OPay transfer (awaiting confirmation)':ML[order.method])+(live?'':' · demo');
$('swa').href=waLink(`Hi T.GANG! Order ${order.ref} — paid via ${ML[order.method]}${live?'':' (demo)'}${status?' ['+status+']':''}.`);
bag=[];rb();open('ok')}
function payLive(){const go=()=>PaystackPop.setup({key:C.PAYSTACK_PUBLIC_KEY,email:order.email,amount:order.total*100,currency:C.CURRENCY,ref:order.ref,
channels:method=='card'?['card']:method=='bank_transfer'?['bank_transfer','bank']:method=='ussd'?['ussd','mobile_money']:C.CHANNELS,
metadata:{items:order.items,phone:order.phone,address:`${order.address}, ${order.city}, ${order.country}`,custom_fields:[{display_name:'Phone',variable_name:'phone',value:order.phone}]},
callback:r=>{open('proc');if(C.VERIFY_URL)fetch(C.VERIFY_URL+encodeURIComponent(r.reference)).then(x=>x.json()).then(v=>done(v.status||'verify-pending')).catch(()=>done('verify-pending'));else done('pending server verification')},
onClose:()=>{}}).openIframe();
if(window.PaystackPop)go();else{const s=document.createElement('script');s.src='https://js.paystack.co/v1/inline.js';s.onload=go;document.head.appendChild(s)}}
$('ckdemo').hidden=live;})();
