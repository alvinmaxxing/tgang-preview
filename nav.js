// v11 luxe header: Discover dropdown, mobile menu, scroll shadow, compact currency, counts
(()=>{const $=s=>document.querySelector(s);
function init(){const h=$('.nav.lux');if(!h)return;
 const sc=()=>h.classList.toggle('scrolled',scrollY>8);addEventListener('scroll',sc,{passive:true});sc();
 const more=h.querySelector('.more'),mb=h.querySelector('.morebtn'),mm=h.querySelector('.moremenu');
 if(more){const set=o=>{more.classList.toggle('open',o);mb.setAttribute('aria-expanded',o)};
  let t;more.addEventListener('mouseenter',()=>{clearTimeout(t);matchMedia('(hover:hover)').matches&&set(true)});
  more.addEventListener('mouseleave',()=>{t=setTimeout(()=>set(false),180)});
  mb.addEventListener('click',e=>{e.stopPropagation();set(!more.classList.contains('open'))});
  mb.addEventListener('keydown',e=>{if(e.key=='ArrowDown'){e.preventDefault();set(true);mm.querySelector('a').focus()}});
  mm.addEventListener('keydown',e=>{const a=[...mm.querySelectorAll('a')],i=a.indexOf(document.activeElement);
   if(e.key=='ArrowDown'){e.preventDefault();a[(i+1)%a.length].focus()}else if(e.key=='ArrowUp'){e.preventDefault();a[(i-1+a.length)%a.length].focus()}});
  more.addEventListener('focusout',e=>{if(!more.contains(e.relatedTarget))set(false)});
  document.addEventListener('click',e=>{if(!more.contains(e.target))set(false)});
  document.addEventListener('keydown',e=>{if(e.key=='Escape'&&more.classList.contains('open')){set(false);mb.focus()}});
  mm.addEventListener('click',()=>set(false))}
 const bg=h.querySelector('.burger'),mn=$('#mnav');
 if(bg&&mn){const set=o=>{mn.classList.toggle('open',o);bg.setAttribute('aria-expanded',o);mn.setAttribute('aria-hidden',!o);document.body.classList.toggle('mopen',o)};
  bg.onclick=()=>set(!mn.classList.contains('open'));mn.addEventListener('click',e=>{if(e.target.closest('a'))set(false)});
  document.addEventListener('keydown',e=>{if(e.key=='Escape')set(false)});addEventListener('resize',()=>{if(innerWidth>999)set(false)})}
 // compact currency: show code only
 const wrap=()=>{const s=$('#ccy');if(!s||s.parentNode.classList.contains('ccyw'))return!!s;
  const w=document.createElement('label');w.className='ccyw';const l=document.createElement('span');l.className='ccyl';
  const ch=document.createElement('span');ch.className='chev';ch.setAttribute('aria-hidden','true');
  const upd=()=>{const t=s.options[s.selectedIndex]?.text||'';l.textContent=(t.split('·').pop()||'').trim()||(window.M&&M.currency)||''};
  s.before(w);w.append(l,ch,s);upd();s.addEventListener('change',upd);return true};
 if(!wrap()){let n=0;const iv=setInterval(()=>{if(wrap()||++n>40)clearInterval(iv)},100)}
 // hide zero counts
 document.querySelectorAll('.hn').forEach(e=>{const u=()=>e.dataset.z=(e.textContent.trim()==''||e.textContent.trim()=='0')?'1':'0';u();new MutationObserver(u).observe(e,{childList:true,characterData:true,subtree:true})});
}
document.readyState=='loading'?document.addEventListener('DOMContentLoaded',init):init()})();
