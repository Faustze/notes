# 📦 HTTP Headers & Caching

## 💡 Core idea

> Caching's whole value is skipping the network chain in [[browser/Network/TCP & TLS Handshake|TCP & TLS Handshake]] entirely, or at least skipping the most expensive part of it — the response body.

---
# 🏷 Header categories

- **General** — not tied to request or response specifically: `Date`, `Connection` (`keep-alive`), `Cache-Control` (used in both).
- **Request** — request context: `Host`, `User-Agent`, `Accept`, `Authorization`, `If-None-Match`.
- **Response** — response context: `Server`, `Set-Cookie`, `Location`.
- **Entity/Representation** — describe the body regardless of direction: `Content-Type`, `Content-Length`, `Content-Encoding`, `ETag`, `Last-Modified`.

The split isn't formal — it's a hint about where a header even makes sense (`Content-Length` is meaningless without a body).

---
# 🗄 Cache-Control

- `max-age=N` — seconds the response is considered fresh; during that window the browser serves the cached copy instantly, without contacting the server at all.
- `no-cache` — misleading name: caching is allowed, but every serve requires revalidation with the server via a conditional request (see ETag below).
- `no-store` — no caching at all, in any form.
- `private` / `public` — cacheable only in the user's browser / cacheable anywhere along the chain (including CDNs/proxies).

Key distinction: `no-cache` = "cache it, but always revalidate"; `no-store` = "don't cache it at all".

## ETag and conditional requests

1. First response: `200 OK` + body + `ETag: "abc123"` (a fingerprint of this specific version of the resource).
2. Cached copy is stale / `no-cache` — the browser sends `If-None-Match: "abc123"` instead of blindly re-downloading.
3. Server compares: match → **`304 Not Modified`, no body** (saves the entire response body's worth of traffic); no match → `200 OK` + new body + new `ETag`.

`If-Modified-Since`/`Last-Modified` follow the same principle by timestamp instead of hash — coarser (second-level precision), but doesn't require computing a hash server-side.

`304` responses have nothing beyond the headers — no body, no extra structure.

## Where caching sits in the chain

Caching kicks in **before** the network: if `max-age` hasn't expired, no connection opens at all (no DNS, no TCP, no TLS). `no-cache`/`304` is a partial win — the round trip still happens, but the most expensive part (the response body) is saved.

---
# 🌍 Cache locations and strategies

Three points along the request path, each a potential "warehouse" holding a ready copy — from closest/fastest to farthest/slowest:

1. **Browser cache** — a copy on the user's disk/memory. No network at all.
2. **CDN** — a copy on a server geographically close to the user (not the site's origin server). Needs the network, but a shorter path. Only used if the response is marked `Cache-Control: public`; `private` allows a copy only in the browser cache, never on a CDN/shared proxy.
3. **Origin server** — where the code and data actually live. The farthest option, reached only if there's nowhere closer to get a copy.

## Strategies

- **cache-first** — if something's in the cache, serve it, never touch the network (zero checks, not "constant revalidation"). Safe for resources that never change under the same URL (a hashed filename — a change produces a new filename/URL, so the old cached copy can never become "wrong").
- **network-first** — try the network for a fresh copy first; the cache is only a fallback when the network is unavailable. For frequently-changing data (a feed, an exchange rate) where freshness matters.
- **stale-while-revalidate** — hybrid: serve whatever's cached **immediately** (even if stale), and **in parallel, in the background**, fire a normal network request to refresh the cache for next time. The user never waits on the network, but doesn't always see the newest version either.

[[browser/Network/index|HTTP & Network]]
[[browser/Network/TCP & TLS Handshake|TCP & TLS Handshake — what caching lets you skip]]
[[browser/Network/CORS|CORS — the other browser-side network gate]]
#browser
