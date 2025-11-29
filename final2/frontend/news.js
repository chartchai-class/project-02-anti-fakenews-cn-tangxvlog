const params=new URLSearchParams(location.search);const id=params.get('id');
const API = (location.port==='5500' ? 'http://localhost:3000/api' : '/api');
const newsEl=document.getElementById('news');
const commentsEl=document.getElementById('comments');
const voteReal=document.getElementById('voteReal');
const voteFake=document.getElementById('voteFake');
const form=document.getElementById('commentForm');
const prevC=document.getElementById('prevC');
const nextC=document.getElementById('nextC');
const infoC=document.getElementById('infoC');
const stateC={page:1,pageSize:8};

function fmtDate(s){const d=new Date(s);const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,'0');const day=String(d.getDate()).padStart(2,'0');return `${y}/${m}/${day}`}

async function loadNews(){
  const res=await fetch(`${API}/news/${id}`);const n=await res.json();
  const statusClass=n.status==='LikelyFake'?'fake':n.status==='LikelyReal'?'real':'';
  const statusLabel=n.status==='LikelyFake'?'Likely Fake':n.status==='LikelyReal'?'Likely Real':'Unknown';
  newsEl.className='card';
  newsEl.innerHTML=`<img src="${n.imageUrl||''}"/><div class="content"><div class="meta">${fmtDate(n.createdAt)} • By ${n.authorName} <span class="status ${statusClass}">${statusLabel}</span></div><div class="title">${n.title}</div><div class="desc">${n.fullDesc}</div></div><div class="foot"><span>${n.votesCount} Votes</span><span>${n.commentsCount} Comments</span></div>`;
}

async function loadComments(){
  const params=new URLSearchParams({page:stateC.page,pageSize:stateC.pageSize});
  const res=await fetch(`${API}/news/${id}/comments?${params.toString()}`);
  const data=await res.json();
  commentsEl.innerHTML='';
  data.items.forEach(c=>{
    const el=document.createElement('div');
    el.className='card';
    el.innerHTML=`<div class="content"><div class="meta">${fmtDate(c.createdAt)} • ${c.user.name}</div><div class="desc">${c.text}</div>${c.imageUrl?`<img src="${c.imageUrl}" style="margin-top:8px;height:180px;object-fit:cover"/>`:''}</div>`;
    commentsEl.appendChild(el);
  });
  infoC.textContent=`Page ${data.page} / ${data.pages}`;
  prevC.disabled=data.page<=1;nextC.disabled=data.page>=data.pages;
}

voteReal.addEventListener('click',()=>vote('Real'));
voteFake.addEventListener('click',()=>vote('Fake'));
async function vote(choice){
  const token=localStorage.getItem('token')||'';
  const res=await fetch(`${API}/news/${id}/votes`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({choice})});
  if(res.ok){await loadNews();} else {alert('Vote failed');}
}

form.addEventListener('submit',async(e)=>{
  e.preventDefault();
  const token=localStorage.getItem('token')||'';
  const fd=new FormData(form);
  const res=await fetch(`${API}/news/${id}/comments`,{method:'POST',headers:{Authorization:`Bearer ${token}`},body:fd});
  if(res.ok){form.reset();await loadNews();await loadComments();} else {alert('Post failed');}
});

prevC.addEventListener('click',()=>{if(stateC.page>1){stateC.page--;loadComments();}});
nextC.addEventListener('click',()=>{stateC.page++;loadComments();});

loadNews();
loadComments();
