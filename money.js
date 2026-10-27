// Location-based currency. Base prices are NGN (products.js). Every price on the site goes through TGM.fmt(ngn).
// Country + live FX rates come from the Supabase Edge Function `geo` (cached 1h there and 1h here); the visitor can override via the header switcher.
(()=>{const CUR={NG:'NGN',US:'USD',GB:'GBP',GH:'GHS',KE:'KES',UG:'UGX',ZA:'ZAR',CA:'CAD',AE:'AED',TZ:'TZS',RW:'RWF',SN:'XOF',CI:'XOF',BJ:'XOF',TG:'XOF',CM:'XAF',EG:'EGP',SA:'SAR',QA:'QAR',IN:'INR',CN:'CNY',JP:'JPY',AU:'AUD',CH:'CHF',
DE:'EUR',FR:'EUR',IT:'EUR',ES:'EUR',NL:'EUR',BE:'EUR',IE:'EUR',PT:'EUR',AT:'EUR',FI:'EUR',GR:'EUR'};
const LIST=[['NG','Nigeria'],['GH','Ghana'],['KE','Kenya'],['UG','Uganda'],['ZA','South Africa'],['TZ','Tanzania'],['RW','Rwanda'],['SN','Senegal'],['CM','Cameroon'],['EG','Egypt'],['GB','United Kingdom'],['IE','Ireland'],['FR','France'],['DE','Germany'],['IT','Italy'],['ES','Spain'],['NL','Netherlands'],['US','United States'],['CA','Canada'],['AE','United Arab Emirates'],['SA','Saudi Arabia'],['QA','Qatar'],['IN','India'],['CN','China'],['JP','Japan'],['AU','Australia']];
// Fallback NGN→X rates (approximate, used only if the live rate service is unreachable).
const FALLBACK={NGN:1,USD:0.00065,GBP:0.00049,EUR:0.00056,GHS:0.0099,KES:0.084,UGX:2.4,ZAR:0.0115,CAD:0.0009,AED:0.0024,TZS:1.75,RWF:0.93,XOF:0.37,XAF:0.37,EGP:0.032,SAR:0.0024,QAR:0.0024,INR:0.056,CNY:0.0046,JPY:0.098,AUD:0.001,CHF:0.00052};
const DEC={UGX:0,TZS:0,RWF:0,XOF:0,XAF:0,JPY:0,NGN:0,KES:0};
const ls=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
const pick=ls('tgcountry'),cache=ls('tgfx');
const M=window.TGM={list:LIST,name:c=>(LIST.find(x=>x[0]==c)||[c,c])[1],curOf:c=>CUR[c]||'USD',
 country:pick||(cache&&cache.country)||'NG',rates:(cache&&cache.rates)||FALLBACK,live:!!(cache&&cache.live),manual:!!pick};
M.currency=M.curOf(M.country);
M.rate=()=>M.rates[M.currency]||FALLBACK[M.currency]||1;
M.conv=n=>n*M.rate();
M.fmt=n=>{const c=M.currency,v=M.conv(Number(n)||0);if(c=='NGN')return '₦'+Math.round(v).toLocaleString('en-NG');
 const d=DEC[c]??(v>=100?0:2);try{return new Intl.NumberFormat(undefined,{style:'currency',currency:c,minimumFractionDigits:d,maximumFractionDigits:d}).format(v)}catch(e){return c+' '+v.toFixed(d)}};
M.set=c=>{localStorage.setItem('tgcountry',JSON.stringify(c));location.reload()};
const A=window.SHOP_AUTH;
// Refresh country/rates in the background; reload once only if the shown currency changes on a first visit.
if(!cache||Date.now()-cache.t>3600e3)fetch(A.url+'/functions/v1/geo',{headers:{apikey:A.key,Authorization:'Bearer '+A.key}}).then(r=>r.json()).then(g=>{
 if(!g||!g.rates)return;const before=M.currency;localStorage.setItem('tgfx',JSON.stringify({t:Date.now(),country:g.country||'NG',rates:g.rates,live:!!g.live}));
 M.rates=g.rates;M.live=!!g.live;if(!pick&&g.country&&M.curOf(g.country)!=before)location.reload()}).catch(()=>{});
// Header switcher.
document.addEventListener('DOMContentLoaded',()=>{const nav=document.querySelector('.navr');if(!nav)return;const s=document.createElement('select');
 s.id='ccy';s.className='ccy';s.setAttribute('aria-label','Country and currency');
 s.innerHTML=LIST.map(([c,n])=>`<option value="${c}"${c==M.country?' selected':''}>${n} · ${M.curOf(c)}</option>`).join('');
 if(!LIST.some(x=>x[0]==M.country))s.insertAdjacentHTML('afterbegin',`<option value="${M.country}" selected>${M.country} · ${M.currency}</option>`);
 s.onchange=()=>M.set(s.value);nav.prepend(s);
 const n=document.createElement('p');n.className='fxnote';n.textContent=M.currency=='NGN'?'Prices in Nigerian naira (₦).':`Prices shown in ${M.currency}, converted from naira at today's rate${M.live?'':' (approximate)'}. Payment is processed in NGN by Flutterwave or Paystack; your bank sets the final amount.`;
 const g=document.getElementById('grid');g&&g.parentNode.insertBefore(n,g)});
})();
