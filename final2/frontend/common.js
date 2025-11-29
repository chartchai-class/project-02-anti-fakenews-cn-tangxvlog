const API = (location.port==='5500' ? 'http://localhost:3000/api' : '/api');
async function fetchMe(){
  const token=localStorage.getItem('token')||'';
  const res=await fetch(`${API}/auth/me`,{headers:{Authorization:`Bearer ${token}`}});
  const data=await res.json();
  return data.user;
}

function renderNavbar(user){
  const nav=document.querySelector('.topbar .nav');
  if(!nav)return;
  if(user){
    const role=user.role;
    const badgeClass=role==='Administrator'?'badge-red':role==='Member'?'badge-blue':'badge-green';
    nav.innerHTML=`
      <div class="hidden-sm" style="display:flex;align-items:center;gap:8px">
        <span class="muted">Welcome,</span>
        <span class="bold">${user.firstName||user.username||user.email}</span>
        <span class="role-badge ${badgeClass}">${role}</span>
      </div>
      ${role==='Member'||role==='Administrator'?`<a class="btn" href="/submit.html">Report News</a>`:''}
      <button class="link" id="logoutBtn">Logout</button>
      ${user.avatarUrl?`<img src="${user.avatarUrl}" class="avatar" alt="avatar"/>`:''}
    `;
    const logout=document.getElementById('logoutBtn');
    if(logout){logout.addEventListener('click',()=>{localStorage.removeItem('token');location.href='/';});}
  }else{
    nav.innerHTML=`
      <a class="link indigo" href="/login.html">Login</a>
      <a class="btn" href="/signup.html">Register</a>
    `;
  }
}

async function initNavbar(){
  try{const u=await fetchMe();renderNavbar(u);}catch{renderNavbar(null)}
}

document.addEventListener('DOMContentLoaded',initNavbar);
