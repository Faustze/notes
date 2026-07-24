# 🍪 Cookies & Client Storage

## 💡 Core idea

> All three security flags on a cookie sound like "protects against XSS" if you skim them — but each one defends against a *different* attack. Conflating them is the most common mistake here.

---
# Cookies

Small key/value pairs the browser automatically attaches to matching requests via the `Cookie` header. Flags — `HttpOnly`, `Secure`, `SameSite`, `Path`, `Domain`, `Max-Age` — control security and scope.

## Three flags, three different threats

- **`HttpOnly` → XSS.** Doesn't stop a malicious script from running — it stops that script from reading *this specific cookie* via `document.cookie`. XSS still executes; it just can't steal the protected cookie.
- **`Secure` → network interception / MITM.** The cookie is never sent over plain HTTP, even if the user accidentally lands on the HTTP version of an HTTPS site.
- **`SameSite` → CSRF (Cross-Site Request Forgery).** Stops another site from making the browser attach your cookie to a request against your domain.
  - `Strict` — the cookie never goes with any cross-site request.
  - `Lax` — goes only with top-level navigation (clicking a link), not with forms/fetch/XHR from another site.
  - `None` — always sent, but must be paired with `Secure`.

For a session token, `HttpOnly` cookies are generally safer than `localStorage`: `localStorage` is fully readable by any JS on the page, including malicious code injected via XSS — an `HttpOnly` cookie is invisible to JS entirely.

```ts
setCookie(event, 'session', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
})
```

---
# cookies vs localStorage vs sessionStorage

| Criterion | `cookies` | `localStorage` | `sessionStorage` |
|---|---|---|---|
| Lifetime | until browser close by default; `Max-Age`/`Expires` for a fixed duration | forever, until explicitly removed | until the tab closes (survives a page reload) |
| Server visibility | sent automatically with every HTTP request (`Cookie` header) | client-only, JS must send it explicitly | client-only, JS must send it explicitly |
| Size | ~4 KB | ~5-10 MB | ~5-10 MB |
| API | `document.cookie` (a raw string you parse yourself) | `.setItem()/.getItem()/.removeItem()` | `.setItem()/.getItem()/.removeItem()` |
| Security flags | `HttpOnly`, `Secure`, `SameSite` | none — fully accessible from JS | none — fully accessible from JS |
| Use it for | a session token that needs to travel to the server with every request | data that should persist across visits (theme setting, a long-lived draft) | data scoped to one tab/session (a form draft, wizard step) |

---
# Beyond cookies: other client storage

- **`localStorage` / `sessionStorage`** — synchronous, small, string-only (serialize objects with `JSON.stringify`/`parse`). Not a source of truth — fully visible and editable by the user.
- **IndexedDB** — asynchronous, handles large structured data, the right choice once `localStorage`'s size/sync limits become a problem.
- **Cache API** — pairs with a service worker for offline/asset caching.

Practical notes: version your stored data shape (`settings:v2`) and handle migrations; listen for the `storage` event to sync state across tabs; guard against `window` being unavailable during SSR.

[[browser/Network/index|HTTP & Network]]
[[browser/Network/CORS|CORS — credentials and cross-origin cookies]]
#browser
