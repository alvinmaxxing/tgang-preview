const cats=["All",...new Set(P.map(p=>p[1]))],f=document.getElementById('filters'),g=document.getElementById('grid');
const art=(t,ph)=>{if(ph)return `<img src="assets/${ph}" alt="" loading="lazy">`;const d={Sets:'<path d="M35 18h30l4 14H31z M33 40h34l-3 50H56l-6-30-6 30H36z"/>',Bodysuits:'<path d="M36 15h28v20c0 18-4 30-6 40h-16c-2-10-6-22-6-40z"/>',Rompers:'<path d="M34 15h32v24l3 36H54l-4-16-4 16H31l3-36z"/>',Leggings:'<path d="M36 12h28l-1 78H54l-4-58-4 58h-9z"/>',Tops:'<path d="M32 30l10-10h16l10 10-4 22H36z"/>'}[t];return `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"><g fill="currentColor" opacity=".18">${d}</g></svg>`};
const naira=n=>'₦'+n.toLocaleString();
f.innerHTML=cats.map((c,i)=>`<button class="${i?'':'on'}">${c}</button>`).join('');
function draw(c){g.innerHTML=P.map((p,i)=>[p,i]).filter(([p])=>c=="All"||p[1]==c).map(([p,i])=>`<div class="card reveal in" data-i="${i}"><div class="art ${p[2]}"><span class="tag">Example</span>${art(p[1],p[4])}</div><h3>${p[0]}</h3><p>${p[2][0].toUpperCase()+p[2].slice(1)} · ${naira(p[3])}</p></div>`).join('')}
draw("All");f.onclick=e=>{if(e.target.tagName!="BUTTON")return;f.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b==e.target));draw(e.target.textContent)};
const m=document.getElementById('modal');let cur,size;
g.onclick=e=>{const c=e.target.closest('.card');if(!c)return;cur=P[c.dataset.i];size=null;
document.getElementById('mart').className='m-art '+cur[2];document.getElementById('mart').innerHTML=art(cur[1],cur[4]);
mcat.textContent=cur[1];mname.textContent=cur[0];mprice.textContent=naira(cur[3]);
msizes.innerHTML=["XS","S","M","L","XL"].map(s=>`<button>${s}</button>`).join('');upd();m.classList.add('open');m.setAttribute('aria-hidden','false')};
msizes.onclick=e=>{if(e.target.tagName!="BUTTON")return;size=e.target.textContent;msizes.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b==e.target));upd()};
function upd(){mbuy.href='https://wa.me/2349159999813?text='+encodeURIComponent(`Hi T.GANG! I'd like to order the ${cur[0]} (${cur[2]})${size?', size '+size:''}.`)}
const shut=()=>{m.classList.remove('open');m.setAttribute('aria-hidden','true')};close.onclick=shut;m.onclick=e=>{if(e.target==m)shut()};addEventListener('keydown',e=>e.key=="Escape"&&shut());
const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&(x.target.classList.add('in'),io.unobserve(x.target))),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
