# Security Policy

## 📋 Table of Contents

- [Supported Versions](#supported-versions)
- [Reporting a Vulnerability](#reporting-a-vulnerability)
- [Response Timeline](#response-timeline)
- [Security Measures](#security-measures)
- [Scope](#scope)
- [Known Limitations](#known-limitations)
- [Security Headers](#security-headers)
- [Responsible Disclosure](#responsible-disclosure)

---

## Supported Versions

| Version | Status | Notes |
|---------|--------|-------|
| `2.0.x` | ✅ **Active support** | Security patches applied promptly |
| `1.x` | ❌ **End of life** | No longer receives updates |

We recommend always running the latest version. Check your version at [`/api/v1/health`](https://shineiapi.vercel.app/api/v1/health).

---

## Reporting a Vulnerability

**🔒 Please do NOT open a public GitHub issue for security vulnerabilities.**

### How to Report

1. Go to [GitHub Security Advisories](https://github.com/Shineii86/ShineiAPI/security/advisories/new)
2. Click **"New draft security advisory"**
3. Fill in the details using the template below

### What to Include

| Field | Description |
|-------|-------------|
| **Description** | Clear explanation of the vulnerability |
| **Steps to Reproduce** | Numbered steps to trigger the issue |
| **Impact** | What an attacker could achieve |
| **Affected Endpoint(s)** | Which API routes are involved |
| **Proof of Concept** | Request/response examples (redact any real data) |
| **Suggested Fix** | If you have ideas for remediation |
| **Your Contact** | So we can follow up with questions |

### What NOT to Report

The following are **not** security vulnerabilities:

- Rate limiting being too restrictive
- Upstream data accuracy issues (contact [Toraka](https://toraka.com) instead)
- Missing features or API enhancements
- Deprecation warnings in dependencies

---

## Response Timeline

| Phase | Target |
|-------|--------|
| **Acknowledgment** | Within 48 hours |
| **Initial Assessment** | Within 1 week |
| **Critical Fix** | Within 24 hours |
| **High Severity Fix** | Within 1 week |
| **Medium/Low Fix** | Next release cycle |
| **Public Disclosure** | After fix is deployed |

We will keep you informed of progress via the security advisory. If we cannot fix an issue promptly, we'll explain why and provide a timeline.

---

## Security Measures

### Rate Limiting

- **60 requests per minute** per IP address (sliding window)
- Rate limit headers on every response (`X-RateLimit-Limit`, `X-RateLimit-Remaining`)
- `429 Too Many Requests` with `Retry-After` header when exceeded

### Input Validation

- All query parameters validated before processing
- Slugs are normalized and sanitized (no path traversal, no injection)
- Search queries have a minimum length requirement (2 characters)
- Integer parameters bounds-checked (page, limit)

### Network Security

- **HTTPS only** — HTTP requests auto-redirect to HTTPS
- **CORS** — Configured for public API access (`Access-Control-Allow-Origin: *`)
- **Security headers** on all responses (see below)

### Data Handling

- **No authentication** — No user credentials, tokens, or PII stored
- **No user accounts** — No registration, login, or user data collection
- **Cache only** — In-memory cache with automatic TTL expiration
- **Upstream isolation** — Toraka API keys/credentials are server-side only, never exposed to clients

### Infrastructure

- **Vercel deployment** — Automatic HTTPS, DDoS protection, edge caching
- **GitHub Actions CI** — Automated lint and build checks on every PR
- **Dependency scanning** — Dependabot configured for automatic security updates

---

## Security Headers

Every API response includes:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME type sniffing |
| `X-Frame-Options` | `DENY` | Prevents clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer information |
| `Access-Control-Allow-Origin` | `*` | CORS (public API) |
| `Access-Control-Allow-Methods` | `GET, OPTIONS` | Only GET requests allowed |
| `X-Powered-By` | `ShineiAPI v2.0.1` | API identification |
| `X-RateLimit-Limit` | `60` | Rate limit transparency |
| `X-Request-ID` | `uuid` | Request tracing |

---

## Scope

### In Scope

Everything hosted under [github.com/Shineii86/ShineiAPI](https://github.com/Shineii86/ShineiAPI):

- API route handlers (`src/app/api/`)
- Middleware (`src/middleware.js`)
- Cache layer (`src/lib/cache.js`)
- Toraka client (`src/lib/toraka.js`)
- Constants and configuration (`src/lib/constants.js`)
- Response helpers (`src/lib/response.js`)
- Frontend components and pages (`src/app/`, `src/components/`)
- Public assets (`public/`)
- Deployment config (`vercel.json`)

### Out of Scope

| Item | Why |
|------|-----|
| [Toraka API](https://toraka.com) | Third-party service with its own security policy |
| [Vercel platform](https://vercel.com) | Managed by Vercel |
| [GitHub platform](https://github.com) | Managed by GitHub |
| User-deployed instances | Self-hosted deployments are the operator's responsibility |
| Dependencies with known CVEs | Report to the upstream project; we'll update when patches are available |

---

## Known Limitations

These are architectural trade-offs, not vulnerabilities:

| Limitation | Explanation |
|------------|-------------|
| **Public API, no auth** | All data is publicly accessible by design |
| **Upstream dependency** | If Toraka is down, ShineiAPI returns `502`/`503` |
| **In-memory cache** | Cache resets on serverless cold starts (Vercel) |
| **Rate limit per IP** | Shared IPs (VPNs, NAT) may hit limits faster |
| **CORS wildcard** | Any origin can make requests (intentional for public API) |

---

## Responsible Disclosure

We believe in responsible disclosure and will:

- ✅ Credit reporters in the fix announcement (unless they prefer anonymity)
- ✅ Communicate openly about timelines and progress
- ✅ Not take legal action against researchers who follow this policy
- ✅ Work with you to understand and validate the issue

### Hall of Fame

_contributors who responsibly disclosed vulnerabilities will be listed here_

---

## Contact

- 🔒 **Security reports:** [GitHub Security Advisories](https://github.com/Shineii86/ShineiAPI/security/advisories/new)
- 💬 **General questions:** [GitHub Discussions](https://github.com/Shineii86/ShineiAPI/discussions)
- 🐛 **Non-security bugs:** [GitHub Issues](https://github.com/Shineii86/ShineiAPI/issues)

---

Thank you for helping keep ShineiAPI and its users safe! 🛡️
