# 🚧 CORS

## 💡 Core idea

> CORS is a browser-side security mechanism, not a server-side one — it decides whether *frontend JS* is allowed to read a cross-origin response, not whether the request itself can be sent. It cannot be fixed from the client if the server doesn't send the right headers.

---
# 🌐 Origin

An origin is the triple `scheme + host + port`. Two URLs are same-origin only if all three match exactly — `http://` vs `https://`, or `:3000` vs `:8080` on the same host, count as *different* origins.

---
# 🔀 Simple vs preflighted requests

- **Simple requests** (GET/HEAD/POST with only a small set of standard headers and content types) go straight to the server. The response comes back, and the browser decides *after the fact* whether JS is allowed to read it, based on `Access-Control-Allow-Origin`.
- **Preflighted requests** — anything using a non-simple method (PUT, DELETE, PATCH) or custom headers (`Authorization`, `Content-Type: application/json`, etc.) — trigger an `OPTIONS` request first, asking the server what's allowed, *before* the real request is sent. Only if the server's preflight response permits the method/headers does the browser send the actual request.

---
# ⚙️ Server-side configuration

- Explicitly allow the needed `Origin`, methods, and headers — don't rely on defaults.
- Never combine `Access-Control-Allow-Origin: *` with `Access-Control-Allow-Credentials: true` — the spec forbids it, and browsers reject the combination.
- For an API proxy (e.g. a Nuxt/Node backend-for-frontend), routing requests through your own server removes the cross-origin hop between browser and backend entirely — no CORS headers needed.

```ts
app.use(cors({
  origin: ['https://app.example.com'],
  credentials: true,
  allowedHeaders: ['content-type', 'authorization'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}))
```

---
# 🐞 Debugging

- CORS errors can't be fixed on the client if the server isn't sending the right headers — no client-side workaround exists (short of a proxy).
- Check the Network tab for the preflight `OPTIONS` request's response and the browser's "blocked reason".
- If cookies aren't being sent cross-origin, check `Access-Control-Allow-Credentials` on the server *and* `credentials: 'include'` on the client — and that `Access-Control-Allow-Origin` names the exact origin, not `*`.

[[browser/Network/index|HTTP & Network]]
[[browser/Network/Cookies & Storage|Cookies & Storage — SameSite and cross-origin cookies]]
#browser
