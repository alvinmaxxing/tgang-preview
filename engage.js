/* v18: quick Add to bag on cards, gold-star reviews (owner-approved), welcome pop-up, cookie notice */
(function(){
const LS=localStorage,$=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pid=p=>(p[0]+'-'+p[2]).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80);
const stars=(r,cls)=>{let h='';for(let k=1;k<=5;k++)h+=`<i class="${r>=k-.25?'f':r>=k-.75?'h':''}">★</i>`;return `<span class="stars ${cls||''}" aria-hidden="true">${h}</span>`};
let db=null;try{const C=window.SHOP_AUTH;if(C&&window.supabase)db=supabase.createClient(C.url,C.key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false,storageKey:'tg-reviews'}})}catch(e){}
const R={};let loaded=false;
async function loadReviews(){if(!db)return;const{data,error}=await db.from('product_reviews').select('product_id,name,rating,body,created_at').order('created_at',{ascending:false}).limit(1000);if(error)return;(data||[]).forEach(r=>(R[r.product_id]=R[r.product_id]||[]).push(r));loaded=true;decorate(true)}
const summ=p=>{const a=R[pid(p)]||[];if(!a.length)return `<button type="button" class="rv0" data-rv>${stars(0,'e')}<span>Be the first to review</span></button>`;const avg=a.reduce((s,r)=>s+r.rating,0)/a.length;return `<button type="button" class="rv0" data-rv aria-label="Rated ${avg.toFixed(1)} of 5 from ${a.length} reviews">${stars(avg)}<span>${avg.toFixed(1)} (${a.length})</span></button>`};
const sizesOf=p=>p[1]=="Accessories"?["One size"]:["XS","S","M","L","XL"];
/* ---- cards ---- */
const g=document.getElementById('grid');
function decorate(force){if(!g||typeof P=='undefined')return;g.querySelectorAll('.card').forEach(c=>{const p=P[+c.dataset.i];if(!p)return;let x=c.querySelector('.qx');if(x&&!force)return;if(!x){x=document.createElement('div');x.className='qx';c.appendChild(x)}
x.innerHTML=`<div class="rvc">${summ(p)}</div>${(window.SOLD_OUT||[]).includes(p[0])?'<button type="button" class="qa so" disabled>Sold out</button>':'<button type="button" class="qa">Add to bag</button>'}<div class="qs" hidden><span>Select size</span>${sizesOf(p).map(s=>`<button type="button" data-s="${s}">${s}</button>`).join('')}</div>`})}
if(g){new MutationObserver(()=>decorate()).observe(g,{childList:true});decorate();
g.addEventListener('click',e=>{const c=e.target.closest('.card');if(!c)return;const p=P[+c.dataset.i];
if(e.target.closest('.qa.so'))return e.stopPropagation();if(e.target.closest('.qa')){e.stopPropagation();const s=sizesOf(p);if(s.length==1)return add(c,p,s[0]);c.querySelector('.qa').hidden=true;c.querySelector('.qs').hidden=false;return}
const sb=e.target.closest('.qs button');if(sb){e.stopPropagation();return add(c,p,sb.dataset.s)}
if(e.target.closest('.qs'))return e.stopPropagation();
if(e.target.closest('[data-rv]')){e.stopPropagation();openProduct(+c.dataset.i);setTimeout(()=>{const w=$('#rvbox');w&&w.scrollIntoView({behavior:'smooth',block:'start'})},250)}},true)}
function add(c,p,s){try{bag.push([...p.slice(0,5),s]);rb()}catch(e){return}const b=c.querySelector('.qa'),q=c.querySelector('.qs');q.hidden=true;b.hidden=false;b.textContent='Added ✓';b.classList.add('ok');const n=$('#bagn');n&&(n.classList.remove('pop'),void n.offsetWidth,n.classList.add('pop'));toast(`${p[0]} · ${s} added to your bag`);setTimeout(()=>{b.textContent='Add to bag';b.classList.remove('ok')},1800)}
let tt;function toast(t){let el=$('#tgtoast');if(!el){el=document.createElement('div');el.id='tgtoast';el.setAttribute('role','status');document.body.appendChild(el)}el.innerHTML=`<span>${esc(t)}</span><button type="button">View bag</button>`;el.querySelector('button').onclick=()=>{el.classList.remove('on');$('#bag')&&$('#bag').classList.add('open')};el.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>el.classList.remove('on'),3200)}
/* ---- product modal reviews ---- */
const prev=window.onProductOpen;
window.onProductOpen=i=>{prev&&prev(i);setTimeout(()=>paintModal(P[i]),0)};
function paintModal(p){const body=document.querySelector('#modal .m-body');if(!body||!p)return;let w=$('#rvbox');if(!w){w=document.createElement('section');w.id='rvbox';w.className='rvbox';body.appendChild(w)}
const a=R[pid(p)]||[],avg=a.length?a.reduce((s,r)=>s+r.rating,0)/a.length:0;
w.innerHTML=`<div class="rvh"><p class="lbl">Reviews</p>${a.length?`<span>${stars(avg)} ${avg.toFixed(1)} · ${a.length} review${a.length>1?'s':''}</span>`:`<span>${stars(0,'e')} Be the first to review</span>`}</div>
<div class="rvl">${a.slice(0,6).map(r=>`<blockquote>${stars(r.rating)}<p>${esc(r.body)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</div>
<button type="button" class="link rvopen">Write a review</button>
<form class="rvf" hidden novalidate><p class="lbl">Your rating</p><div class="pick" role="radiogroup" aria-label="Rating">${[1,2,3,4,5].map(k=>`<button type="button" role="radio" aria-checked="false" aria-label="${k} star${k>1?'s':''}" data-k="${k}">★</button>`).join('')}</div>
<input name="n" maxlength="60" placeholder="Your name" autocomplete="given-name" required><textarea name="b" maxlength="600" rows="3" placeholder="How did it fit and feel?" required></textarea>
<button class="btn wide" type="submit">Submit review</button><p class="rvmsg" role="status"></p><p class="note">Reviews are checked by T.GANG before they appear.</p></form>`;
const f=w.querySelector('.rvf');let k=0;w.querySelector('.rvopen').onclick=e=>{e.currentTarget.hidden=true;f.hidden=false;f.querySelector('.pick button').focus()};
const pick=f.querySelector('.pick');const paint=n=>pick.querySelectorAll('button').forEach(b=>{b.classList.toggle('on',+b.dataset.k<=n);b.setAttribute('aria-checked',+b.dataset.k==k)});
pick.onclick=e=>{const b=e.target.closest('button');if(!b)return;k=+b.dataset.k;paint(k)};pick.onmouseover=e=>{const b=e.target.closest('button');b&&paint(+b.dataset.k)};pick.onmouseleave=()=>paint(k);
f.onsubmit=async e=>{e.preventDefault();const m=f.querySelector('.rvmsg'),n=f.n.value.trim(),b=f.b.value.trim();if(!k)return m.textContent='Please choose a star rating.';if(!n)return m.textContent='Please add your name.';if(b.length<3)return m.textContent='Please write a few words.';
if(!db)return m.textContent="Sorry, reviews aren't available right now.";const btn=f.querySelector('[type=submit]');btn.disabled=true;m.textContent='Sending…';
const{error}=await db.from('product_reviews').insert({product_id:pid(p),name:n,rating:k,body:b});btn.disabled=false;
if(error){m.textContent="Sorry, that didn't go through. Please try again.";return}f.innerHTML='<p class="rvok">Thank you. Your review will appear once T.GANG has checked it.</p>'}}
/* ---- cookie notice + welcome pop-up ---- */
function cookie(done){if(LS.tgcookie){done();return}const el=document.createElement('div');el.className='tgck';el.setAttribute('role','region');el.setAttribute('aria-label','Cookie notice');
el.innerHTML=`<p>We use essential browser storage to keep your bag, favourites, sign-in and currency working. No advertising cookies. <a href="privacy.html">Privacy policy</a></p><div><button type="button" class="ckd">Decline</button><button type="button" class="cka">Accept</button></div>`;
document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('on'));const fin=v=>{LS.tgcookie=v;el.classList.remove('on');setTimeout(()=>el.remove(),400);done()};el.querySelector('.cka').onclick=()=>fin('accept');el.querySelector('.ckd').onclick=()=>fin('decline')}
function welcome(){if(LS.tgwelcome||!document.getElementById('shop'))return;setTimeout(()=>{if(document.querySelector('.modal.open'))return;LS.tgwelcome='1';const el=document.createElement('div');el.className='tgw';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','tgwt');
el.innerHTML=`<div class="tgwc"><button type="button" class="x" aria-label="Close">×</button><img src="assets/logo.jpg" alt="" class="tgwl"><p class="eyebrow">Welcome to T.GANG</p><h2 id="tgwt">Chic &amp; gym wear, <em>made to move.</em></h2><p>Join our email list for <b>10% off your first order</b>, plus first look at new drops.</p>${LS.tgsignup?'<p class="tgwcode">Your code <b>TGWELCOME10</b></p>':'<form class="tgwf" novalidate><input type="email" placeholder="Your email address" autocomplete="email" aria-label="Email address" required><button class="btn" type="submit">Get 10% off</button></form><p class="tgwm" role="status"></p>'}<p class="tgws">One use per customer, new orders only; the shop confirms your code.</p><div class="tgwa"><a href="#shop" class="btn btn-line">Shop now</a><a href="rewards.html" class="link">Join TG Rewards</a></div></div>`;
document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('on'));const close=()=>{el.classList.remove('on');removeEventListener('keydown',kd);setTimeout(()=>el.remove(),400)},kd=e=>{if(e.key=='Escape')close()};
addEventListener('keydown',kd);el.querySelector('.x').onclick=close;el.onclick=e=>{if(e.target==el)close()};el.querySelector('.btn').onclick=e=>{e.preventDefault();close();document.getElementById('shop').scrollIntoView({behavior:'smooth'})};const fm=el.querySelector('.tgwf');if(fm)fm.onsubmit=async e=>{e.preventDefault();const em=fm.querySelector('input').value.trim().toLowerCase(),m=el.querySelector('.tgwm');
if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)||em.length>254)return m.textContent='Please enter a valid email address.';if(!db)return m.textContent='Sorry, sign-up is unavailable right now.';
const bt=fm.querySelector('button');bt.disabled=true;m.textContent='Saving…';const{error}=await db.from('email_signups').insert({email:em,source:'tgang-welcome'});bt.disabled=false;
if(error&&error.code!='23505')return m.textContent="Sorry, that didn't go through. Please try again.";LS.tgsignup='1';fm.outerHTML='<p class="tgwcode">Thank you. Your code <b>TGWELCOME10</b></p><p class="tgws">Enter it in your bag for 10% off.</p>';m.textContent=''};
el.querySelector('.x').focus()},1200)}
const go=()=>{cookie(welcome);loadReviews()};document.readyState=='loading'?addEventListener('DOMContentLoaded',go):go();
})();
