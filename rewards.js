/* TG Rewards + gift cards (v10). Points/tier rules here; balances live in Supabase (read-only from the browser).
   Points are only ADDED server-side (award_loyalty_points, service_role) once an order is verified as paid. */
window.TG_REWARDS={PER_1000:1,REDEEM_PTS:100,REDEEM_NGN:1000,
 TIERS:[{n:'Babe',min:0,perks:['Early access to every drop','A birthday treat each year']},
  {n:'Insider',min:500,perks:['Everything in Babe','Free standard shipping in Nigeria','Members-only previews']},
  {n:'VIP',min:1500,perks:['Everything in Insider','Free express shipping worldwide','Private styling on WhatsApp']}]};
window.TG_GIFT=[25000,50000,100000,200000];
(()=>{const R=TG_REWARDS,$=id=>document.getElementById(id),N=n=>window.TGM?TGM.fmt(n):'₦'+n;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const tierOf=l=>[...R.TIERS].reverse().find(t=>l>=t.min);
const nextOf=l=>R.TIERS.find(t=>t.min>l);
let acct=null;const D=window.TGD={pts:0,gift:0,code:''};
window.tgDisc=s=>Math.min(s,D.pts/R.REDEEM_PTS*R.REDEEM_NGN+D.gift);
async function load(){acct=null;if(!window.ACCT||!ACCT.user())return null;const {data}=await ACCT.sb.from('loyalty_accounts').select('points,lifetime_points').maybeSingle();acct=data||null;return acct}
function card(a){const l=a?a.lifetime_points:0,t=tierOf(l),nx=nextOf(l),pc=nx?Math.round((l-t.min)/(nx.min-t.min)*100):100;
 return `<div class="tgr-card"><div class="tgr-top"><span class="eyebrow">TG Rewards</span><span class="tgr-tier">${t.n}</span></div>
 <div class="tgr-pts"><b>${a?a.points.toLocaleString():0}</b> points</div><div class="tgr-bar" role="progressbar" aria-valuenow="${pc}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pc}%"></i></div>
 <small>${nx?`${(nx.min-l).toLocaleString()} points to ${nx.n}`:'You\'re at our highest tier'}</small>${a?'':'<button type="button" class="sa-ghost" id="tgr-join">Join TG Rewards</button>'}
 <small class="tgr-n">Points are added once a paid order is confirmed. <a href="rewards.html">How it works</a></small></div>`}
window.TGR_ACCOUNT=async el=>{if(!el)return;el.innerHTML=card(await load());const j=$('tgr-join');if(j)j.onclick=async()=>{await ACCT.sb.rpc('join_rewards');el.innerHTML=card(await load());ACCT.toast('Welcome to TG Rewards')}};
// Bag extras (home page only)
const items=$('bagitems');
function paint(){const x=$('bagx2');if(!x)return;if(!bag.length){x.innerHTML='';return}
 const can=acct&&acct.points>=R.REDEEM_PTS,max=can?Math.floor(acct.points/R.REDEEM_PTS)*R.REDEEM_PTS:0;if(D.pts>max)D.pts=0;
 x.innerHTML=`<div class="bx"><b>TG Rewards</b>${!ACCT||!ACCT.user()?`<p><a href="#" id="bx-in">Log in</a> to use your points.</p>`:can?`<label class="bx-chk"><input type="checkbox" id="bx-pts" ${D.pts?'checked':''}> Use ${max} points for ${N(max/R.REDEEM_PTS*R.REDEEM_NGN)} off</label>`:`<p>${acct?acct.points:0} points. ${R.REDEEM_PTS} points = ${N(R.REDEEM_NGN)} off.</p>`}</div>
 <div class="bx"><b>Have a gift card?</b><form id="bx-gf" class="bx-row"><input id="bx-gc" placeholder="TG-XXXX-XXXX-XXXX" value="${esc(D.code)}" autocomplete="off" aria-label="Gift card code"><button>Apply</button></form><p id="bx-gm" class="bx-m">${D.gift?`${N(D.gift)} gift card credit applied`:esc(D.msg||'')}</p></div>`;
 const i=$('bx-in');if(i)i.onclick=e=>{e.preventDefault();ACCT.open('login')};
 const p=$('bx-pts');if(p)p.onchange=()=>{D.pts=p.checked?max:0;rb()};
 $('bx-gf').onsubmit=async e=>{e.preventDefault();const c=$('bx-gc').value.trim().toUpperCase(),m=$('bx-gm');D.code=c;D.gift=0;D.msg='';
  if(!/^TG-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(c)){D.msg='Please check the code format.';rb();return}m.textContent='Checking…';
  const {data,error}=await ACCT.sb.rpc('check_gift_card',{p_code:c});const b=Number(data)||0;
  if(error||!b){D.msg=error?'Please try again in a minute.':'That code isn\'t valid or has no balance.';rb();return}
  D.gift=b;rb()}}
if(items&&typeof rb=='function'){items.insertAdjacentHTML('afterend','<div id="bagx2"></div>');
 const orb=rb;window.rb=rb=function(){orb();const s=bag.reduce((a,b)=>a+b[3],0),d=tgDisc(s);if(bag.length&&d)btot.innerHTML=`<span class="bx-was">${N(s)}</span> Total ${N(s-d)}`;paint()};rb();
 if(window.ACCT){ACCT.onChange(async()=>{await load();rb()});const op=ACCT.placeOrder;ACCT.placeOrder=async o=>{const ref=await op(o);if(ref&&D.pts)ACCT.sb.rpc('redeem_loyalty_points',{p_points:D.pts,p_order_ref:ref}).then(({error})=>{if(!error){D.pts=0;load().then(rb)}});return ref}}
 const h=location.hash;if(h=='#bag')setTimeout(()=>$('bag').classList.add('open'),200);if(h=='#join')setTimeout(()=>ACCT&&ACCT.open('signup'),600)}
// Gift card page
const gp=$('gcpage');if(gp){let amt=TG_GIFT[1];const d=$('gcden');
 d.innerHTML=TG_GIFT.map(v=>`<button type="button" data-v="${v}" class="${v==amt?'on':''}">${N(v)}</button>`).join('');
 d.onclick=e=>{const b=e.target.closest('button');if(!b)return;amt=+b.dataset.v;d.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x==b));$('gcprev').textContent=N(amt)};$('gcprev').textContent=N(amt);
 $('gcf').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),g=k=>String(f.get(k)||'').trim(),to=g('to').slice(0,60),msg=g('msg').slice(0,200),te=g('toemail'),fr=g('from').slice(0,60),fe=g('fromemail'),RE=GiftSend.EMAIL_RE,er=$('gcerr');
  if(!to)return er.textContent='Enter the recipient’s name.';if(!RE.test(te))return er.textContent='Enter a valid recipient email.';if(!fr)return er.textContent='Enter your name.';if(!RE.test(fe))return er.textContent='Enter a valid email for you.';er.textContent='';
  localStorage.tggift=JSON.stringify({amount:amt,to,msg,toEmail:te,from:fr,fromEmail:fe});
  const b=JSON.parse(localStorage.tgbag||'[]');b.push(['T.GANG Gift Card','Gift card','For '+to+' · email to '+te+' · from '+fr+' ('+fe+')'+(msg?' · “'+msg+'”':''),amt,'giftcard.svg','Gift card']);localStorage.tgbag=JSON.stringify(b);location.href='index.html#bag'};
 GiftSend.init({mount:'gift-send',shop:'T.GANG',slug:'tgang',url:'https://alvinmaxxing.github.io/tgang-preview/',bagWord:'bag',amtLabel:'Amount (₦, as purchased)',codePh:'TG-XXXX-XXXX-XXXX',codeRe:/^TG-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/,fmt:N,
  serverEnabled:false,fnUrl:SHOP_AUTH.url+'/functions/v1/send-gift-card',anonKey:SHOP_AUTH.key,prefill:()=>{try{return JSON.parse(localStorage.tggift||'{}')}catch(e){return {}}},
  theme:{bg:'#fbf9f5',ink:'#151311',accent:'#151311',line:'#a8875a',muted:'#6d655c',serif:'"Cormorant Garamond", Georgia, serif',sans:'Manrope, Arial, sans-serif'}})}
// Rewards page CTA
const rp=$('rwcta');if(rp&&window.ACCT){ACCT.onChange(async u=>{await load();rp.textContent=acct?'View my points':'Join TG Rewards'});rp.onclick=async e=>{e.preventDefault();if(!ACCT.user())return ACCT.open('signup');if(!acct){await ACCT.sb.rpc('join_rewards');await load();ACCT.toast('Welcome to TG Rewards');rp.textContent='View my points'}ACCT.open('account')}}
})();
