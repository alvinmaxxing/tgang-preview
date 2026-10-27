const cats=[...new Set(["All","Sale","Lounge Outfits","Active Wear","Accessories",...P.map(p=>p[1])])],f=document.getElementById('filters'),g=document.getElementById('grid');
const art=(t,ph,big)=>{if(ph)return `<img src="${TI(ph,big)}" alt="" loading="lazy" decoding="async">`;const d={Sets:'<path d="M35 18h30l4 14H31z M33 40h34l-3 50H56l-6-30-6 30H36z"/>',Bodysuits:'<path d="M36 15h28v20c0 18-4 30-6 40h-16c-2-10-6-22-6-40z"/>',Rompers:'<path d="M34 15h32v24l3 36H54l-4-16-4 16H31l3-36z"/>',Leggings:'<path d="M36 12h28l-1 78H54l-4-58-4 58h-9z"/>',Tops:'<path d="M32 30l10-10h16l10 10-4 22H36z"/>'}[t];return `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"><g fill="currentColor" opacity=".18">${d}</g></svg>`};
const naira=n=>TGM.fmt(n);
f.innerHTML=cats.map((c,i)=>`<button class="${i?'':'on'}">${c}</button>`).join('');
function draw(c){g.innerHTML=P.map((p,i)=>[p,i]).filter(([p])=>c=="All"||(c=="Sale"?!!wasOf(p):COLL[c]?collOf(p)==c:p[1]==c)).map(([p,i])=>`<div class="card reveal in" data-i="${i}"><div class="art ${p[2]}">${art(p[1],p[4])}<button class="heart" data-w="${i}" aria-label="Save ${p[0]} (${p[2]}) to wishlist" aria-pressed="false">♥</button>${(window.SOLD_OUT||[]).includes(p[0])?'<span class="tag">Sold out · example</span>':wasOf(p)?`<span class="tag sale">Sale</span>`:isNew(p)?'<span class="tag new">New</span>':''}</div><h3>${p[0]}</h3><p>${p[2][0].toUpperCase()+p[2].slice(1)} · ${priceHTML(p)}</p></div>`).join('');window.paintHearts&&paintHearts()}
draw("All");f.onclick=e=>{if(e.target.tagName!="BUTTON")return;f.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b==e.target));draw(e.target.textContent)};
const m=document.getElementById('modal');let cur,size;
g.onclick=e=>{const h=e.target.closest('.heart');if(h){toggleWish(+h.dataset.w);return}const c=e.target.closest('.card');if(c)openProduct(+c.dataset.i)};
window.openProduct=i=>{cur=P[i];size=null;window.onProductOpen&&onProductOpen(i);
document.getElementById('mart').className='m-art '+cur[2];document.getElementById('mart').innerHTML=art(cur[1],cur[4],1)+(cur[5]?`<div class="mthumbs">${[cur[4],cur[5]].map((s,k)=>`<button type="button" class="${k?'':'on'}" data-src="${s}" aria-label="Photo ${k+1}"><img src="${TI(s)}" alt="" decoding="async"></button>`).join('')}</div>`:'');let md=document.getElementById('mdesc');if(!md){md=document.createElement('p');md.id='mdesc';md.className='mdesc';mprice.after(md)}md.textContent=cur[6]||'';md.hidden=!cur[6];
mcat.textContent=cur[1];mname.textContent=cur[0];mprice.innerHTML=priceHTML(cur)+(wasOf(cur)?` <span class="mtag">Sale</span>`:isNew(cur)?` <span class="mtag">New</span>`:'');
msizes.innerHTML=(cur[1]=="Accessories"?["One size"]:["XS","S","M","L","XL"]).map(s=>`<button>${s}</button>`).join('');upd();m.classList.add('open');m.setAttribute('aria-hidden','false')};
msizes.onclick=e=>{if(e.target.tagName!="BUTTON")return;size=e.target.textContent;msizes.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b==e.target));upd()};
function upd(){mbuy.href='https://wa.me/2349159999813?text='+encodeURIComponent(`Hi T.GANG! I'd like to order the ${cur[0]} (${cur[2]})${size?', size '+size:''}.`)}
const shut=()=>{m.classList.remove('open');m.setAttribute('aria-hidden','true')};document.getElementById('close').onclick=shut;m.onclick=e=>{if(e.target==m)shut()};addEventListener('keydown',e=>e.key=="Escape"&&shut());
window.closeProduct=()=>shut();
const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&(x.target.classList.add('in'),io.unobserve(x.target))),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
document.addEventListener('load',e=>{if(e.target.tagName=='IMG')e.target.classList.add('ld')},true);document.querySelectorAll('img').forEach(i=>i.complete&&i.classList.add('ld'));
let hi=0;const hs=document.querySelectorAll('.hs');setInterval(()=>{hs[hi].classList.remove('on');hi=(hi+1)%hs.length;hs[hi].classList.add('on')},4500);

let bag=JSON.parse(localStorage.tgbag||'[]');const B=document.getElementById('bag');
function rb(){localStorage.tgbag=JSON.stringify(bag);bagn.textContent=bag.length;
bagitems.innerHTML=bag.length?bag.map((b,i)=>`<div class="bi"><img class="ld" src="${TI(b[4])}" alt=""><div><b>${b[0]}</b><p>${b[2]}${b[1]=='Gift card'?'':' · Size '+b[5]} · ${naira(b[3])}</p></div><button data-r="${i}">Remove</button></div>`).join(''):'<p class="empty">Your bag is empty.</p>';
const t=bag.reduce((a,b)=>a+b[3],0);btot.textContent=bag.length?'Total '+naira(t):'';
bagwa.href='https://wa.me/2349159999813?text='+encodeURIComponent("Hi T.GANG! I'd like to order:\n"+bag.map(b=>`• ${b[0]} (${b[2]}), size ${b[5]}: ${naira(b[3])}`).join('\n')+`\nTotal: ${naira(t)}`);bagwa.style.display=bagck.style.display=bag.length?'':'none'}
rb();bagitems.onclick=e=>{if(e.target.dataset.r){bag.splice(e.target.dataset.r,1);rb()}};
madd.onclick=()=>{if(!size){msizes.classList.add('need');setTimeout(()=>msizes.classList.remove('need'),600);return}bag.push([...cur.slice(0,5),size]);rb();shut();B.classList.add('open')};
bagbtn.onclick=()=>B.classList.add('open');bagx.onclick=()=>B.classList.remove('open');
nf.onsubmit=async e=>{e.preventDefault();const ok=window.ACCT&&await ACCT.newsletter(nf.querySelector('input').value);nfmsg.textContent=ok?"Thank you, you're on the list":"Sorry, that didn't go through. Please try again.";if(ok)nf.reset()};
document.getElementById('salelink').onclick=()=>{const b=[...f.querySelectorAll('button')].find(x=>x.textContent=='Sale');b&&b.click()};

document.getElementById('mart').addEventListener('click',e=>{const b=e.target.closest('.mthumbs button');if(!b)return;e.stopPropagation();const im=document.querySelector('#mart > img');if(im)im.src=TI(b.dataset.src,1);b.parentNode.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x==b))});
/* v7 videos: poster/photo first, video only when allowed, starts after load, pauses offscreen */
(function(){const c=navigator.connection||{},rm=matchMedia('(prefers-reduced-motion: reduce)').matches,save=c.saveData||/(^|-)2g$/.test(c.effectiveType||'');
const pick=v=>(innerWidth*(devicePixelRatio||1)>900&&innerWidth>860)?v.dataset.src720:v.dataset.src480;
function arm(v,onPlay){if(save||rm)return;let loaded=false;const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){if(!loaded){v.src=pick(v);v.preload='auto';loaded=true}const p=v.play();p&&p.then(()=>onPlay&&onPlay()).catch(()=>{})}else if(loaded)v.pause()}),{threshold:.25});io.observe(v)}
const go=()=>setTimeout(()=>{const l=document.querySelector('.lv');if(l)arm(l)},300);
document.readyState==='complete'?go():addEventListener('load',go)})();

window.shopCat=c=>{const b=[...f.querySelectorAll('button')].find(x=>x.textContent==c);b&&b.click();document.getElementById('shop').scrollIntoView({behavior:'smooth'})};
document.addEventListener('click',e=>{const t=e.target.closest('[data-cat]');if(t){e.preventDefault();shopCat(t.dataset.cat)}});
