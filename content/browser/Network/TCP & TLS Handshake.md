# 🔐 TCP & TLS Handshake

## 💡 Core idea

> Everything before the first byte of an HTTP response is a chain of handshakes, each paying for the guarantee the next layer needs — a reliable byte stream (TCP), then a trusted encrypted channel (TLS). Understanding *why* each round trip exists explains why HTTPS is almost never the bottleneck in practice.

---
# 🧭 The full chain

```
DNS resolution (hostname → IP)
  → TCP three-way handshake (SYN / SYN-ACK / ACK)     — 1 RTT, transport layer
      → TLS handshake, HTTPS only                      — ~1 RTT more (TLS 1.3)
          → HTTP request  (method + path + headers + body)
              → HTTP response (status + headers + body)
                  → keep-alive: connection stays open, next request reuses it
```

## DNS resolution

Routers forward packets by IP only (network layer) — the domain name is a purely human-facing layer on top. The browser physically cannot build a TCP SYN packet without a numeric IP in the header, so DNS must resolve before TCP.

Lookup order: browser cache → OS cache/hosts file → recursive resolver (ISP or public, e.g. 8.8.8.8) → if uncached, the resolver walks the hierarchy: root servers → TLD servers (`.com`) → the domain's authoritative nameserver → the IP is returned and cached for its TTL. Transport is usually UDP/53 (or DoH/DoT over HTTPS/TLS for privacy).

---
# 🤝 TCP handshake

```
Client --- SYN (seq=x) --------------> Server
Client <-- SYN-ACK (seq=y, ack=x+1) -- Server
Client --- ACK (ack=y+1) -------------> Server
```

- **SYN** — the client sends a random initial sequence number `seq=x`, the starting point for numbering every byte it will send (needed to detect loss/duplication/reordering).
- **SYN-ACK** — the server acknowledges the client's SYN (`ack=x+1`) **and simultaneously** sends its own SYN (`seq=y`). Both flags in one packet — a piggyback: TCP is full-duplex (two independent byte streams, each with its own counter), and if the server sent the ACK and its own SYN separately, that would add a whole extra round trip (4 messages / 2 RTT instead of 3 / 1 RTT).
- **ACK** — the client acknowledges the server's `seq=y` (`ack=y+1`). Data can flow immediately after; the client fires this final ACK without waiting for a reply to it, which is why the whole three-way handshake fits in **1 RTT**, not 3.

This establishes a reliable, ordered byte stream **before** a single byte of HTTP can move — the price of TCP's reliability guarantee (delivery + ordering).

---
# 🔒 TLS handshake (TLS 1.3)

Layered on top of the already-established TCP connection, for `https://`.

1. **Client Hello** — supported cipher suites, TLS version, a random number. Nothing is encrypted yet at this point.
2. **Server Hello + certificate** — the server's public key (inside the certificate), the chain of signatures up to a CA, and the chosen cipher suite.
3. **Certificate verification.** A certificate is a set of fields (server's public key, domain, validity period) signed by the **CA's private key** — not the server's. Signing mechanics: the CA hashes those fields → encrypts the hash with its own private key → attaches the result as the signature. The browser takes the CA's *public* key from the **trust store** (a list of trusted root CAs preinstalled in the OS/browser — never fetched over the network), decrypts the signature to recover the hash the CA computed, and independently recomputes the hash from the same fields itself. If they match, the CA has vouched that this public key belongs to this domain. Mismatch or broken chain → `NET::ERR_CERT_*`.
4. **Proof of private-key possession (transcript signature).** A certificate is public and can be copied — a MITM could present someone else's valid certificate. So the server separately signs, with **its own** private key, a hash of the *transcript*: the full sequence of messages exchanged in this specific handshake. The client verifies that signature with the server's public key (from the certificate). This closes the trust chain: the CA vouched the key belongs to the domain, and the transcript signature proves the party on the other end, right now, actually holds that key — not just a forwarded copy of the certificate.
5. **Key exchange (ephemeral Diffie-Hellman / ECDHE).** The session secret itself is never sent over the network — both sides exchange only public DH values and each independently computes the same secret. The exponents are **ephemeral**: generated fresh per handshake and destroyed immediately after. The certificate's private key never participates in this computation — it only signs (step 4). This is the source of **forward secrecy**: even if the certificate's private key leaks later, it doesn't help decrypt past traffic, because that traffic's secret was derived from already-destroyed ephemeral values, not from the certificate key. (An observer sees only the public values in transit — recovering the secret from them means solving the discrete logarithm problem, computationally infeasible.)
6. **Switch to symmetric encryption** — all subsequent traffic uses a fast symmetric cipher (AES, etc.) keyed by the secret from step 5.

TLS 1.3 fits the entire handshake into **1 RTT** (TLS 1.2 needed 2).

## Asymmetric cryptography ≠ asymmetric encryption

Asymmetric cryptography is an umbrella term for at least three distinct operations on a key pair: (a) encrypt with the public key / decrypt with the private key — e.g. PGP mail; (b) sign with the private key / verify with the public key — steps 3–4 above; (c) agree on a shared secret without encrypting anything — ECDHE, step 5. Only (a) is literally "asymmetric encryption of data", and it's exactly what TLS 1.3 doesn't use at all. Concrete contrast: pre-TLS-1.3 versions encrypted the pre-master secret with the server's public key — classic asymmetric encryption (operation a), but without forward secrecy, since the same long-lived private key could decrypt it if leaked later. TLS 1.3 replaced this with ECDHE (operation c) specifically for forward secrecy.

---
# ♻️ Keep-alive vs session resumption

Two different mechanisms for avoiding a fresh handshake, at two different layers:

- **Keep-alive** (HTTP layer, `Connection: keep-alive`, the default behavior in HTTP/1.1) — keeps an **already open** TCP+TLS connection alive between requests; the next request reuses it with no new handshake at all. Dies on tab/browser close or idle timeout.
- **Session resumption** (TLS layer) — for a **new** connection (the old one is already closed: new tab, next-day visit). On the first handshake, the server issues an encrypted **session ticket**. On a new connection, the client presents the ticket and both sides run an abbreviated handshake instead of a full one. Survives browser restarts (tickets live for hours/days).

**Test to tell them apart:** same connection, never closed → keep-alive. New connection, but the handshake is noticeably faster than a full one → session resumption.

## TLS 1.3 0-RTT

Builds on the same session ticket as resumption, but goes one step further: the client sends encrypted application data (e.g. the actual HTTP request) **in the very first packet**, alongside the Client Hello — without waiting for any reply. This works because the ticket carries a pre-shared key (PSK) from the previous connection. "0" refers to the number of **additional round trips before real data can move**, not to the handshake itself completing instantly.

There are really three tiers, not two:

1. **Full handshake** — 1 RTT, certificate verified from scratch.
2. **Session resumption without 0-RTT** — still 1 RTT, but the handshake is abbreviated via the PSK; no certificate re-verification needed.
3. **0-RTT** — data leaves before any round trip completes at all.

**Why 0-RTT data is risky: replay, not key theft.** A MITM can't decrypt or forge 0-RTT data — encryption still protects confidentiality and integrity. But it *can* capture the encrypted packet and resend it to the server multiple times. Normally, freshness is guaranteed by fresh random values exchanged interactively over a round trip; 0-RTT data is sent before that interactive confirmation exists, so the server has no built-in way to tell a replay from a genuinely new request.

This is why 0-RTT is restricted to **idempotent** operations. Idempotent = replaying the same request any number of times produces the same end state (GET, PUT, DELETE — repeat once or ten times, same result). Non-idempotent (POST, e.g. `transfer $100`) creates a new effect on every call — replay it 5 times, 5 transfers happen.

In practice (RFC 8470), two layers of defense combine:

1. **HTTP layer** — requests that arrived as 0-RTT are tagged `Early-Data: 1`. The application checks the method: safe (GET) → process normally; unsafe (POST/PUT/DELETE) → respond `425 Too Early` without executing it, and the client retries the same request once the full handshake has completed.
2. **TLS layer** — servers can maintain a bounded anti-replay window of already-seen tickets/nonces, but this scales poorly across multiple servers behind a load balancer — a secondary defense, not the primary one.

---
# 🧠 Why HTTPS is barely slower than HTTP in practice

The handshake is paid **once per connection**, not once per request. `keep-alive` holds TCP+TLS open, HTTP/2 multiplexes many requests over one connection. The overhead is only noticeable where the browser opens **many new connections** to different origins (a first visit to a page loaded with third-party domains — every new origin means its own TCP+TLS handshake).

[[browser/Network/index|HTTP & Network]]
[[browser/Network/HTTP Headers & Caching|HTTP Headers & Caching]]
#browser
