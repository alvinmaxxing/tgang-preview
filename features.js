// T.GANG v2 features: wishlist, restock alerts, shop the look, set builder, drop countdown, style quiz.
(()=>{const $=id=>document.getElementById(id),N=n=>TGM.fmt(n),SZ=["XS","S","M","L","XL"];
const ls=(k,d)=>{try{return JSON.parse(localStorage[k]||'')}catch(e){return d}};
const key=p=>p[0]+'|'+p[2],cap=s=>s[0].toUpperCase()+s.slice(1);
const toast=t=>{const el=$('toast');el.textContent=t;el.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('on'),2600)};
const addItems=(items,size,disc=0)=>{items.forEach(i=>{const p=P[i];bag.push([p[0]+(disc?' (set)':''),p[1],p[2],Math.round(p[3]*(1-disc)),p[4],size])});rb()};
const sizeRow=(el,def)=>{el.innerHTML=SZ.map(s=>`<button type="button" aria-pressed="${s==def}" class="${s==def?'on':''}">${s}</button>`).join('');el.dataset.v=def;
 el.onclick=e=>{const b=e.target.closest('button');if(!b)return;el.dataset.v=b.textContent;el.querySelectorAll('button').forEach(x=>{x.classList.toggle('on',x==b);x.setAttribute('aria-pressed',x==b)})}};
const sold=p=>(window.SOLD_OUT||[]).includes(p[0]);

// ---------- Wishlist ----------
let wish=ls('tgwish',[]);
window.paintHearts=()=>document.querySelectorAll('.heart').forEach(h=>{const on=wish.includes(key(P[h.dataset.w]));h.classList.toggle('on',on);h.setAttribute('aria-pressed',on)});
function rw(){if(!(window.ACCT&&ACCT.user()))localStorage.tgwish=JSON.stringify(wish);$('wishn').textContent=wish.length;paintHearts();
 const items=wish.map(k=>P.findIndex(p=>key(p)==k)).filter(i=>i>=0);
 $('wishitems').innerHTML=items.length?items.map(i=>{const p=P[i];return `<div class="bi"><img class="ld" src="${TI(p[4])}" alt=""><div><b>${p[0]}</b><p>${cap(p[2])} · ${N(p[3])}</p></div><div class="wact"><button data-o="${i}">${sold(p)?'Notify me':'View'}</button><button data-d="${i}">Remove</button></div></div>`}).join(''):'<p class="empty">Tap ♥ on any piece to save it here.</p>'}
window.toggleWish=i=>{const k=key(P[i]),on=wish.includes(k);wish=on?wish.filter(x=>x!=k):[...wish,k];rw();window.ACCT&&ACCT.wishSet(k,!on);toast(on?'Removed from wishlist':'Saved to your wishlist ♥')};
$('wishitems').onclick=e=>{const d=e.target.dataset;if(d.d)toggleWish(+d.d);if(d.o){$('wish').classList.remove('open');openProduct(+d.o);if(sold(P[d.o]))$('mnotify').click()}};
$('wishbtn').onclick=()=>$('wish').classList.add('open');$('wishx').onclick=()=>$('wish').classList.remove('open');rw();
window.SHOP_WISH_COUNT=()=>wish.length;window.SHOP_TOAST=toast;if(window.SHOP_AUTH)SHOP_AUTH.onWishOpen=()=>$('wish').classList.add('open');
if(window.ACCT){let had=false;ACCT.onChange(async u=>{if(u){had=true;const local=ls('tgwish',[]);await ACCT.wishMerge(local);const db=await ACCT.wishLoad();if(db){wish=[...new Set([...db,...local,...wish])];rw()}}else if(had){wish=ls('tgwish',[]);rw()}})}

// ---------- Restock alerts (demo) ----------
let curI;window.onProductOpen=i=>{curI=i;const s=sold(P[i]);$('madd').disabled=s;$('madd').textContent=s?'Sold out (example)':'Add to bag';
 $('nform').hidden=true;$('nmsg').textContent='';$('mnotify').hidden=false;$('mnotify').textContent=s?'Notify me when it’s back in stock':'Notify me about restocks'};
$('mnotify').onclick=()=>{$('nform').hidden=false;$('mnotify').hidden=true;$('nform').querySelector('input').focus()};
$('nform').onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target)),f=e.target,b=f.querySelector('button');b.disabled=true;
 const ok=window.ACCT?await ACCT.restock({name:d.name,contact:d.wa,product_key:key(P[curI])}):false;b.disabled=false;
 if(!ok){$('nmsg').textContent='Sorry, that didn’t go through. Please try again.';return}f.reset();f.hidden=true;
 $('nmsg').textContent=`Thank you, ${d.name.split(' ')[0]}! We’ll message you when the ${P[curI][0]} is back.`};

// ---------- Shop the look ----------
const LOOKS=[{img:'tg-04.jpg',name:'Turquoise Studio',pos:'50% 30%',items:[[8,48,36],[11,40,72]]},
 {img:'tg-09.jpg',name:'Pilates Princess',pos:'50% 35%',items:[[9,58,55],[13,36,78]]},
 {img:'tg-12.jpg',name:'Off-Duty Glam',pos:'50% 25%',items:[[17,40,52],[14,58,86]]},
 {img:'tg-06.jpg',name:'Jet Set',pos:'50% 30%',items:[[0,52,55]]}];
const lsum=l=>l.items.reduce((a,[i])=>a+P[i][3],0);
$('looks').innerHTML=LOOKS.map((l,n)=>`<figure class="lookc reveal"><div class="limg"><img src="${TI(l.img)}" alt="${l.name} look" loading="lazy" style="object-position:${l.pos}">${l.items.map(([i,x,y])=>`<button class="hot" style="left:${x}%;top:${y}%" data-p="${i}" aria-label="${P[i][0]}, ${N(P[i][3])}"><span>${P[i][0]} · ${N(P[i][3])}</span></button>`).join('')}</div><figcaption><div><b>${l.name}</b><small>${l.items.length} piece${l.items.length>1?'s':''} · ${N(lsum(l))}</small></div><button class="btn sm" data-l="${n}">Shop this look</button></figcaption></figure>`).join('');
let curL;$('looks').onclick=e=>{const h=e.target.closest('.hot');if(h){openProduct(+h.dataset.p);return}const b=e.target.closest('[data-l]');if(!b)return;
 curL=LOOKS[b.dataset.l];$('lart').className='m-art';$('lart').innerHTML=`<img class="ld" src="${TI(curL.img,1)}" alt="" style="object-position:${curL.pos}">`;$('lname').textContent=curL.name;
 $('litems').innerHTML=curL.items.map(([i])=>`<div class="li"><img class="ld" src="${TI(P[i][4])}" alt=""><span>${P[i][0]}<small>${cap(P[i][2])}</small></span><b>${N(P[i][3])}</b></div>`).join('')+`<div class="li t"><span>Look total</span><b>${N(lsum(curL))}</b></div>`;
 sizeRow($('lsizes'),'M');$('lookm').classList.add('open');$('lookm').setAttribute('aria-hidden','false');$('ladd').focus()};
const lshut=()=>{$('lookm').classList.remove('open');$('lookm').setAttribute('aria-hidden','true')};$('lookx').onclick=lshut;$('lookm').onclick=e=>{if(e.target==$('lookm'))lshut()};
$('ladd').onclick=()=>{addItems(curL.items.map(x=>x[0]),$('lsizes').dataset.v);lshut();$('bag').classList.add('open');toast(curL.name+' look added to your bag')};
addEventListener('keydown',e=>{if(e.key=='Escape'){lshut();$('wish').classList.remove('open');$('bag').classList.remove('open')}});

// ---------- Build your set ----------
const D=window.TG_BUNDLE||0,grp=c=>P.map((p,i)=>[p,i]).filter(([p])=>p[1]==c&&!sold(p));
const SLOTS=[['Top','Tops'],['Bottom','Leggings'],['Layer','Layers']];let pick={Top:null,Bottom:null,Layer:null};
$('bld').innerHTML=SLOTS.map(([s,c])=>`<fieldset><legend>${s}</legend><div class="opts" data-s="${s}"><button type="button" class="none on" data-i="" aria-pressed="true">None</button>${grp(c).map(([p,i])=>`<button type="button" data-i="${i}" aria-pressed="false" title="${p[0]} (${p[2]}) ${N(p[3])}"><img src="${TI(p[4])}" alt="" loading="lazy"><span>${p[0].replace(/ (Top|Leggings|Jacket|Hoodie)$/,'')}<small>${cap(p[2])} · ${N(p[3])}</small></span></button>`).join('')}</div></fieldset>`).join('')
+`<fieldset><legend>Size</legend><div class="sizes" id="bsizes"></div></fieldset><div class="btotal" aria-live="polite"><div id="bline"></div><button class="btn wide" id="badd" disabled>Add my set to bag</button><p class="note">Example bundle discount: ${Math.round(D*100)}% off when you take 2+ pieces.</p></div>`;
sizeRow($('bsizes'),'M');
$('bld').onclick=e=>{const b=e.target.closest('.opts button');if(!b)return;const o=b.parentNode;pick[o.dataset.s]=b.dataset.i===''?null:+b.dataset.i;
 o.querySelectorAll('button').forEach(x=>{x.classList.toggle('on',x==b);x.setAttribute('aria-pressed',x==b)});bupd()};
function bupd(){const it=Object.values(pick).filter(x=>x!=null),sub=it.reduce((a,i)=>a+P[i][3],0),d=it.length>1?D:0;
 $('bline').innerHTML=it.length?`<span>${it.length} piece${it.length>1?'s':''}</span>${d?`<s>${N(sub)}</s> <b>${N(sub*(1-d))}</b> <em class="save">Set price · save ${N(sub*d)} (example)</em>`:`<b>${N(sub)}</b>${it.length==1?' <em class="hint">Add one more piece for the set price</em>':''}`}`:'<span>Pick your pieces</span>';
 $('badd').disabled=!it.length}
bupd();$('badd').onclick=()=>{const it=Object.values(pick).filter(x=>x!=null);addItems(it,$('bsizes').dataset.v,it.length>1?D:0);$('bag').classList.add('open');toast('Your set is in the bag')};

// ---------- Drop countdown ----------
const T=new Date((window.TG_DROP||{}).date||Date.now()).getTime();$('dname').textContent=(window.TG_DROP||{}).name||'New collection';
const pad=n=>String(n).padStart(2,'0');function tick(){let s=Math.max(0,Math.floor((T-Date.now())/1000));
 $('cdd').textContent=pad(Math.floor(s/86400));$('cdh').textContent=pad(Math.floor(s%86400/3600));$('cdm').textContent=pad(Math.floor(s%3600/60));$('cds').textContent=pad(s%60)}
tick();setInterval(tick,1000);
$('wl').onsubmit=async e=>{e.preventDefault();const f=e.target,d=Object.fromEntries(new FormData(f)),b=f.querySelector('button');b.disabled=true;
 const ok=window.ACCT?await ACCT.waitlist({name:d.name,contact:d.wa,drop_name:(window.TG_DROP||{}).name}):false;b.disabled=false;
 if(!ok){$('wlmsg').textContent='Sorry, that didn’t go through. Please try again.';return}f.reset();
 $('wlmsg').textContent=`You’re on the list, ${d.name.split(' ')[0]} We’ll WhatsApp you first.`};

// ---------- Style quiz ----------
const Q=[['Where are you wearing it?',[['Gym or pilates','gym'],['Travel day','jet'],['Brunch & errands','brunch'],['Lounging, but cute','cosy']]],
 ['Pick your colour mood',[['Rose & blush','gym'],['All black everything','jet'],['Soft pastels','brunch'],['Cream & neutrals','cosy']]],
 ['How do you like the fit?',[['Snatched & sculpting','gym'],['Sleek one-piece','jet'],['Matching two-piece','brunch'],['Relaxed & oversized','cosy']]],
 ['Your signature move?',[['Hitting a PR','gym'],['Boarding first class','jet'],['Mirror selfie','brunch'],['Sunday reset','cosy']]]];
const M={gym:{n:'Pilates Princess',d:'Sculpted, soft and always on the reformer.',p:[2,9,13]},jet:{n:'Jet-Set Babe',d:'Sleek black, airport-ready, effortlessly expensive.',p:[0,1,12]},
 brunch:{n:'Brunch Baddie',d:'Matching sets that go gym to mimosas.',p:[5,3,15]},cosy:{n:'Cosy Glam Girl',d:'Soft layers, still serving.',p:[7,17,14]}};
let qi=0,sc={};const qz=$('qz');
function qdraw(){if(qi<Q.length){const [q,a]=Q[qi];qz.innerHTML=`<p class="eyebrow">Style quiz · ${qi+1} of ${Q.length}</p><div class="qbar"><i style="width:${qi/Q.length*100}%"></i></div><h2>${q}</h2><div class="qa">${a.map(([t,k])=>`<button type="button" data-k="${k}">${t}</button>`).join('')}</div>`;return}
 const k=Object.keys(sc).sort((a,b)=>sc[b]-sc[a])[0],m=M[k],share=`I'm a ${m.n} ${m.d} Take the T.GANG style quiz: ${location.href.split('#')[0]}#quiz`;
 qz.innerHTML=`<p class="eyebrow">Your TG Babe match</p><h2>You're a <em>${m.n}</em></h2><p class="lede">${m.d}</p><div class="qrec">${m.p.map(i=>`<div class="qr"><img src="${TI(P[i][4])}" alt="" loading="lazy"><b>${P[i][0]}</b><small>${cap(P[i][2])} · ${N(P[i][3])}</small><button class="btn sm" data-add="${i}">Add · size M</button></div>`).join('')}</div><div class="qend"><button class="btn" id="qshare">Share my match</button><button class="link" id="qagain" type="button">Retake quiz</button></div><p class="note" id="qmsg" aria-live="polite"></p>`;
 $('qshare').onclick=async()=>{try{if(navigator.share){await navigator.share({title:'My TG Babe match',text:share});return}await navigator.clipboard.writeText(share);$('qmsg').textContent='Copied: '+share}catch(e){$('qmsg').textContent=share}};
 $('qagain').onclick=()=>{qi=0;sc={};qdraw()}}
qz.onclick=e=>{const b=e.target.closest('[data-k]');if(b){sc[b.dataset.k]=(sc[b.dataset.k]||0)+1;qi++;qdraw();return}const a=e.target.closest('[data-add]');if(a){addItems([+a.dataset.add],'M');a.textContent='Added ✓';toast(P[a.dataset.add][0]+' added to your bag')}};
qdraw();
// re-run lazy reveal & image fade for injected content
const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&(x.target.classList.add('in'),io.unobserve(x.target))),{threshold:.12});document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el));
})();
