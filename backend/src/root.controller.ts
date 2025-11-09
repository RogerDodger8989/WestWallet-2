// filepath: /workspaces/WestWallet/west-wallet/backend/src/root.controller.ts
import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class RootController {
  @Get()
  @Header('Content-Type', 'text/html')
  root() {
    return `<!doctype html>
<html>
<head><meta charset="utf-8"><title>WestWallet - demo</title></head>
<body>
  <h1>WestWallet — demo</h1>
  <p>Testa register / login mot backend.</p>

  <h2>Register</h2>
  <input id="reg-username" placeholder="username"><input id="reg-password" placeholder="password" type="password">
  <button onclick="register()">Register</button>
  <pre id="reg-result"></pre>

  <h2>Login</h2>
  <input id="log-username" placeholder="username"><input id="log-password" placeholder="password" type="password">
  <button onclick="login()">Login</button>
  <pre id="log-result"></pre>

  <h2>Profile (users/me)</h2>
  <button onclick="me()">Get /users/me</button>
  <pre id="me-result"></pre>

  <script>
    async function register(){
      const u=document.getElementById('reg-username').value;
      const p=document.getElementById('reg-password').value;
      const res=await fetch('/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})});
      document.getElementById('reg-result').textContent=JSON.stringify(await res.json(),null,2);
    }
    async function login(){
      const u=document.getElementById('log-username').value;
      const p=document.getElementById('log-password').value;
      const res=await fetch('/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})});
      const j=await res.json();
      document.getElementById('log-result').textContent=JSON.stringify(j,null,2);
      if(j.access_token) localStorage.setItem('ww_token', j.access_token);
    }
    async function me(){
      const t=localStorage.getItem('ww_token')||'';
      const res=await fetch('/users/me',{headers:{'Authorization':'Bearer '+t}});
      document.getElementById('me-result').textContent=JSON.stringify(await res.json(),null,2);
    }
  </script>
</body>
</html>`;
  }
}
