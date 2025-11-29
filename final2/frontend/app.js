const state={page:1,pageSize:9,q:"",status:""};
const API = (location.port==='5500' ? 'http://localhost:3000/api' : '/api');
const grid=document.getElementById("grid");
const searchInput=document.getElementById("searchInput");
const pageSizeInput=document.getElementById("pageSize");
const prevBtn=document.getElementById("prevBtn");
const nextBtn=document.getElementById("nextBtn");
const pageInfo=document.getElementById("pageInfo");

document.querySelectorAll('.chip').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    state.status=b.dataset.status||"";
    state.page=1;
    load();
  });
});

searchInput.addEventListener('keydown',e=>{if(e.key==='Enter'){state.q=searchInput.value.trim();state.page=1;load();}});
pageSizeInput.addEventListener('change',()=>{state.pageSize=Math.max(3,Math.min(24,Number(pageSizeInput.value)||9));state.page=1;load();});
prevBtn.addEventListener('click',()=>{if(state.page>1){state.page--;load();}});
nextBtn.addEventListener('click',()=>{state.page++;load();});

async function load(){
  const params=new URLSearchParams({page:state.page,pageSize:state.pageSize});
  if(state.q)params.set('q',state.q);
  if(state.status)params.set('status',state.status);
  try{
    const res=await fetch(`${API}/news?${params.toString()}`);
    const data=await res.json();
    render(data);
  }catch{
    const items=[1,2,3,4,5,6,7,8,9].map(i=>({
      id:i,
      title:`Sample News ${i}`,
      shortDesc:`Demo summary for item ${i}.`,
      status:i%3===0?'LikelyFake':i%3===1?'LikelyReal':'Unknown',
      authorName: i%2? 'John Doe':'Admin User',
      createdAt:new Date(Date.now()-i*86400000).toISOString(),
      votesCount:Math.floor(Math.random()*50)+i,
      commentsCount:Math.floor(Math.random()*10),
      imageUrl:`https://picsum.photos/seed/demo${i}/800/400`
    }));
    render({items,total:items.length,page:1,pageSize:items.length,pages:1});
  }
}

function fmtDate(s){const d=new Date(s);const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,'0');const day=String(d.getDate()).padStart(2,'0');return `${y}/${m}/${day}`}

function render(data){
  grid.innerHTML='';
  data.items.forEach(n=>{
    const statusClass=n.status==='LikelyFake'?'fake':n.status==='LikelyReal'?'real':'';
    const statusLabel=n.status==='LikelyFake'?'Likely Fake':n.status==='LikelyReal'?'Likely Real':'Unknown';
    const el=document.createElement('article');
    el.className='card';
    el.innerHTML=`
      <img src="${n.imageUrl||''}" alt=""/>
      <div class="content">
        <div class="meta">${fmtDate(n.createdAt)} • By ${n.authorName} <span class="status ${statusClass}">${statusLabel}</span></div>
        <div class="title">${n.title}</div>
        <div class="desc">${n.shortDesc}</div>
      </div>
      <div class="foot"><span>${n.votesCount} Votes</span><span>${n.commentsCount} Comments</span></div>
      <div class="actions" style="display:flex;gap:8px;padding:8px 12px">
        <button class="mini-btn" data-act="detail">Detail</button>
        <button class="mini-btn" data-act="vote" data-id="${n.id}">Vote</button>
      </div>
    `;
    el.querySelector('[data-act="detail"]').addEventListener('click',()=>{location.href=`/news.html?id=${n.id}`});
    el.querySelector('[data-act="vote"]').addEventListener('click',()=>openVote(n.id));
    grid.appendChild(el);
  });
  state.page=data.page;state.pageSize=data.pageSize;pageInfo.textContent=`Page ${data.page} / ${data.pages}`;
  prevBtn.disabled=data.page<=1;nextBtn.disabled=data.page>=data.pages;
}

async function openVote(id){
  const choice = await chooseVote();
  if(!choice)return;
  const token=localStorage.getItem('token')||'';
  try{
    const res=await fetch(`${API}/news/${id}/votes`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({choice})});
    if(res.ok){await load();} else {alert('投票失败，请先登录或稍后重试');}
  }catch{alert('后端不可用，无法投票');}
}

function chooseVote(){
  return new Promise(resolve=>{
    const overlay=document.createElement('div');
    overlay.style.position='fixed';overlay.style.inset='0';overlay.style.background='rgba(0,0,0,0.25)';overlay.style.display='flex';overlay.style.alignItems='center';overlay.style.justifyContent='center';
    const panel=document.createElement('div');
    panel.style.background='#fff';panel.style.padding='16px';panel.style.borderRadius='10px';panel.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)';
    panel.innerHTML=`<div style="font-weight:600;margin-bottom:8px">选择投票</div><div style="display:flex;gap:10px"><button class="mini-btn">Vote Real</button><button class="mini-btn" style="background:#ef4444">Vote Fake</button></div>`;
    const [btnReal, btnFake]=panel.querySelectorAll('button');
    btnReal.addEventListener('click',()=>{document.body.removeChild(overlay);resolve('Real');});
    btnFake.addEventListener('click',()=>{document.body.removeChild(overlay);resolve('Fake');});
    overlay.addEventListener('click',e=>{if(e.target===overlay){document.body.removeChild(overlay);resolve(null);}});
    overlay.appendChild(panel);document.body.appendChild(overlay);
  });
}

load();
