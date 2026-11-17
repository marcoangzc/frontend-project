// Layout defect audit for design/index.html (every frame, at 100% zoom):
//  1. covered: text or icon whose sample points are painted over by an unrelated element (or another element's ::before/::after)
//  2. clipped: content cut off by an overflow:hidden ancestor, or sticking out of the device frame
//  3. wrapped: buttons, badges, tabs and chips whose label breaks onto two lines
//  4. squeezed: text boxes narrower than ~3 characters (crushed by a flex sibling)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:1000}});
await p.goto('file:///home/user/frontend-project/design/index.html');await p.evaluate(()=>document.fonts.ready);
await p.evaluate(()=>{const b=document.getElementById('board');b.classList.remove('fit');
  // let every row lay out on one line so each frame can be scrolled into view
  document.querySelectorAll('.states').forEach(s=>{s.style.overflow='visible';s.style.width='max-content'})});
const n=await p.evaluate(()=>document.querySelectorAll('.dev').length);
const res={covered:[],clipped:[],wrapped:[],squeezed:[]};
for(let k=0;k<n;k++){
 const r=await p.evaluate(async(k)=>{
  const dev=document.querySelectorAll('.dev')[k];const name=dev.closest('figure').querySelector('figcaption').textContent;
  const out={covered:[],clipped:[],wrapped:[],squeezed:[]};
  const hasOverlay=!!dev.querySelector('.qs-overlay');
  const scope=hasOverlay?dev.querySelector('.qs-modal'):dev;
  const label=el=>(el.textContent.trim()||el.getAttribute('aria-label')||el.className||el.tagName).toString().replace(/\s+/g,' ').slice(0,40);
  const related=(a,b)=>a===b||a.contains(b)||b.contains(a);
  // targets: icons and elements with their own text
  const targets=[...scope.querySelectorAll('i.bi, *')].filter(el=>{if(el.closest('svg'))return false;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none')return false;
    return el.matches('i.bi')||[...el.childNodes].some(t=>t.nodeType===3&&t.textContent.trim())});
  const devR=dev.getBoundingClientRect();
  for(const el of targets){
   const rc=el.getBoundingClientRect();if(!rc.width||!rc.height)continue;
   el.scrollIntoView({block:'center',inline:'center'});
   const r2=el.getBoundingClientRect();
   // 1. covered: sample 5 points inset 25% from the edges
   const pts=[[.5,.5],[.25,.3],[.75,.3],[.25,.7],[.75,.7]];let hit=null;
   for(const [fx,fy] of pts){const x=r2.left+r2.width*fx,y=r2.top+r2.height*fy;const top=document.elementFromPoint(x,y);
     if(!top||!dev.contains(top))continue;
     if(!related(top,el)){hit=top;break}
     // pseudo-element of a sibling-or-cousin container painted over the target? check ::before/::after boxes of non-ancestors near the point
   }
   if(hit)out.covered.push(name+' | "'+label(el)+'" covered by .'+(hit.className||hit.tagName).toString().split(' ').join('.'));
   // pseudo-element overlap: any ::before/::after of an element that is not an ancestor of el, intersecting el's centre
   // 2. clipped by an overflow-hidden ancestor (inside the frame) or sticking out of the frame
   if(!el.matches('i.bi')){
     if(r2.right>dev.getBoundingClientRect().right+1||r2.left<dev.getBoundingClientRect().left-1)out.clipped.push(name+' | "'+label(el)+'" sticks out of the frame');
     for(let a=el.parentElement;a&&a!==dev;a=a.parentElement){const cs=getComputedStyle(a);if(cs.overflowX!=='visible'||cs.overflowY!=='visible'){const ar=a.getBoundingClientRect();
       if(cs.overflowX==='auto'||cs.overflowX==='scroll')break;
       if(r2.right>ar.right+1||r2.bottom>ar.bottom+1||r2.left<ar.left-1||r2.top<ar.top-1)out.clipped.push(name+' | "'+label(el)+'" clipped by .'+a.className.toString().split(' ')[0]);break}}
     if(el.scrollWidth>el.clientWidth+1&&getComputedStyle(el).overflowX==='hidden')out.clipped.push(name+' | "'+label(el)+'" text cut off');
     // 4. squeezed
     const cs=getComputedStyle(el);if(r2.width<parseFloat(cs.fontSize)*1.2&&el.textContent.trim().length>3)out.squeezed.push(name+' | "'+label(el)+'" only '+Math.round(r2.width)+'px wide');
   }
  }
  // 3. single-line controls that wrap
  scope.querySelectorAll('.btn, .badge, .nav-link, .qs-cat, .qs-lang button, .qs-tabbar a > span:last-child, .qs-qrow .px, .qs-t span, .qs-low').forEach(el=>{
    const cs=getComputedStyle(el);if(cs.display==='none')return;const lh=parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.5;
    const tops=[];const walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let tn;
    while((tn=walk.nextNode())){if(!tn.textContent.trim()||tn.parentElement.closest('i.bi'))continue;const range=document.createRange();range.selectNodeContents(tn);for(const r of range.getClientRects())if(r.width>1)tops.push(r.top)}
    tops.sort((a,b)=>a-b);let lines=tops.length?1:0;for(let q=1;q<tops.length;q++)if(tops[q]-tops[q-1]>lh*0.6)lines++;lines={size:lines};
    if(lines.size>1&&!el.matches('.qs-cat'))out.wrapped.push(name+' | "'+label(el)+'" wraps onto '+lines.size+' lines');});
  // pseudo-element overlap check (lines, notches): for each ::before/::after with a box, does it cross an icon/dot of a non-ancestor?
  scope.querySelectorAll('*').forEach(owner=>{for(const ps of ['::before','::after']){const cs=getComputedStyle(owner,ps);if(cs.content==='none'||cs.content==='normal'||cs.display==='none'||cs.position!=='absolute')continue;
    const or=owner.getBoundingClientRect();const L=parseFloat(cs.left),T=parseFloat(cs.top),W=parseFloat(cs.width),H=parseFloat(cs.height);if(isNaN(L)||isNaN(T)||isNaN(W)||isNaN(H)||!W||!H)continue;
    const box={l:or.left+L,t:or.top+T,r:or.left+L+W,b:or.top+T+H};
    const z=+cs.zIndex||0;
    owner.parentElement&&owner.parentElement.querySelectorAll('.dot, i.bi, .qs-tile').forEach(t=>{if(owner.contains(t))return;const tr=t.getBoundingClientRect();
      const ix=Math.min(box.r,tr.right)-Math.max(box.l,tr.left),iy=Math.min(box.b,tr.bottom)-Math.max(box.t,tr.top);
      if(ix>2&&iy>1){const tz=+getComputedStyle(t.closest('.dot')||t).zIndex||0;
        // owner comes later in the DOM than t, so its pseudo-element paints on top unless t has a higher z-index
        if((owner.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_PRECEDING)&&tz<=z)out.covered.push(name+' | line ('+owner.className+ps+') crosses '+Math.round(ix)+'px into "'+label(t.closest('div')||t)+'"');}})}});
  return out},k);
 for(const key in res)res[key].push(...r[key]);
}
for(const key in res){const u=[...new Set(res[key])];console.log('\n'+key+': '+u.length);u.slice(0,40).forEach(x=>console.log('  '+x))}
await b.close()})();
