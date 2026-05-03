# Contributing to ShineiAPI

Thank you for your interest in contributing to ShineiAPI! Every contribution helps make this API better for the manga/manhwa community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [Making Changes](#making-changes)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)
- [Testing](#testing)
- [Reporting Issues](#reporting-issues)
- [FAQ](#faq)

---

## Code of Conduct

Please be respectful and constructive in all interactions. We're here to build something great together.

- ✅ Be welcoming and inclusive
- ✅ Respect differing viewpoints and experiences
- ✅ Give and accept constructive feedback gracefully
- ❌ No harassment, trolling, or personal attacks
- ❌ No spam, self-promotion, or off-topic content

---

## Ways to Contribute

| Type | Description | Difficulty |
|------|-------------|------------|
| 🐛 **Bug Reports** | Report broken endpoints, incorrect data, or unexpected behavior | Easy |
| ✨ **Feature Requests** | Suggest new endpoints, parameters, or capabilities | Easy |
| 📖 **Documentation** | Fix typos, improve examples, add translations | Easy |
| 🧪 **Tests** | Add test coverage for existing endpoints | Medium |
| 🔧 **Bug Fixes** | Fix reported issues | Medium |
| 🚀 **New Features** | Implement new endpoints or functionality | Advanced |
| 🎨 **Frontend** | Improve docs UI, landing page, or playground | Advanced |

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Create** a new branch for your feature or fix
4. **Make** your changes
5. **Test** thoroughly
6. **Push** and create a Pull Request

```bash
# Fork on GitHub, then:
git clone https://github.com/YOUR_USERNAME/ShineiAPI.git
cd ShineiAPI
git remote add upstream https://github.com/Shineii86/ShineiAPI.git
```

---

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [npm](https://npmjs.com/) 9 or later
- [Git](https://git-scm.com/)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The API will be available at [http://localhost:3000](http://localhost:3000).

### Verify Setup

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Browse series
curl "http://localhost:3000/api/v1/series?sort=rating&page=1"
```

---

## Project Architecture

```
src/
├── app/
│   ├── api/v1/           # API route handlers (one folder per endpoint)
│   ├── docs/             # Documentation page
│   ├── privacy/          # Privacy policy page
│   ├── terms/            # Terms of service page
│   ├── globals.css       # Design system & CSS tokens
│   ├── layout.js         # Root layout with SEO metadata
│   └── page.js           # Landing page (server component)
├── components/           # React client components
│   ├── ApiPlayground.js  # Live API testing tool
│   ├── DocsSearch.js     # ⌘K search modal
│   ├── icons.js          # SVG icon library
│   └── ...
├── lib/                  # Shared utilities
│   ├── cache.js          # In-memory cache with TTL
│   ├── constants.js      # Config, genres, types, statuses
│   ├── response.js       # Standardized response builders
│   └── toraka.js         # Toraka API client
└── middleware.js         # Rate limiting, CORS, X-Request-ID
```

### Key Patterns

- **API routes** return standardized responses via `response.js` helpers
- **Caching** is handled by `cache.js` with configurable TTL per endpoint
- **Toraka client** (`toraka.js`) handles upstream requests with error recovery
- **Constants** (`constants.js`) centralize all config, genre lists, and enums

---

## Making Changes

### Branch Naming

```
feat/add-genre-filter
fix/slug-normalization
docs/update-readme
refactor/cache-layer
test/add-search-tests
```

### Adding a New API Endpoint

1. Create `src/app/api/v1/your-endpoint/route.js`
2. Import helpers from `lib/response.js` and `lib/cache.js`
3. Add the endpoint to `lib/constants.js` if needed
4. Update `public/openapi.yaml` with the new path
5. Add tests in `tests/api.test.js`
6. Update `README.md` endpoint list

### Modifying Existing Endpoints

1. Check for cached responses that might be affected
2. Ensure backward compatibility (don't break existing query params)
3. Update OpenAPI spec if parameters or responses change
4. Update tests

---

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature or endpoint |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, semicolons, etc.) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks (deps, config, CI) |
| `perf` | Performance improvement |

### Scopes

`api`, `search`, `series`, `cache`, `docs`, `readme`, `deps`, `ci`, `config`

### Examples

```
feat(search): add status filter to search endpoint
fix(series): handle missing cover image gracefully
docs(readme): add Python code examples
refactor(cache): extract TTL config to constants
test(api): add integration tests for /top endpoint
chore(deps): bump next to 14.2.0
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows the existing style
- [ ] Changes work locally (`npm run dev`)
- [ ] Build passes (`npm run build`)
- [ ] Tests pass (`npm test`)
- [ ] OpenAPI spec is updated (if applicable)
- [ ] README is updated (if applicable)
- [ ] No console.log or debug code left behind

### PR Template

When you open a PR, the template will guide you through:

1. **Description** — What does this PR do?
2. **Related Issue** — Link the issue it fixes
3. **Type of Change** — Bug fix, feature, breaking change, etc.
4. **Checklist** — Self-review items
5. **Screenshots** — For visual changes

### Review Process

1. A maintainer will review within 7 days
2. Address any requested changes
3. Once approved, your PR will be merged into `main`
4. Changes will deploy to Vercel automatically

---

## Style Guide

### JavaScript

- Use `const` by default, `let` when reassignment is needed
- Prefer arrow functions for callbacks
- Use template literals over string concatenation
- Destructure objects when accessing multiple properties
- Add JSDoc comments for complex functions

```js
// ✅ Good
const getTitle = (series) => series?.title ?? 'Unknown';

// ❌ Avoid
function getTitle(series) {
  if (series && series.title) {
    return series.title;
  } else {
    return 'Unknown';
  }
}
```

### API Responses

Always use the standardized response builders:

```js
import { success, error, paginated } from '@/lib/response';

// Success
return success(data);

// Error
return error('SERIES_NOT_FOUND', `Series '${slug}' not found`, 404);

// Paginated
return paginated(data, { page, total, perPage });
```

### Error Handling

- Always handle upstream failures gracefully
- Return descriptive error messages with proper HTTP status codes
- Log errors for debugging but don't expose internals to users

---

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Writing Tests

- Test both success and error cases
- Test edge cases (empty results, invalid params, rate limiting)
- Use descriptive test names that explain the expected behavior

```js
describe('GET /api/v1/search', () => {
  it('returns results for valid query', async () => {
    const res = await fetch('/api/v1/search?q=solo');
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
  });

  it('returns 400 for missing query', async () => {
    const res = await fetch('/api/v1/search');
    expect(res.status).toBe(400);
  });
});
```

---

## Reporting Issues

### Bug Reports

When reporting a bug, please include:

1. **Endpoint** — Which API endpoint is affected?
2. **Request** — Full URL and parameters
3. **Response** — The actual response received
4. **Expected** — What you expected instead
5. **Environment** — Language/runtime, OS, browser (if applicable)

### Feature Requests

When requesting a feature, please include:

1. **Use case** — What problem does this solve?
2. **Proposed API** — What should the endpoint/parameter look like?
3. **Alternatives** — Any workarounds you've considered?

---

## FAQ

<details>
<summary><strong>How do I add a new genre?</strong></summary>

Add the genre to the `GENRES` array in `src/lib/constants.js` with a slug, name, and description. Then update the OpenAPI spec if genres are documented there.
</details>

<details>
<summary><strong>How do I change the cache TTL?</strong></summary>

Cache TTLs are configured in each route handler when calling the cache. Look for `cache.get(key, ttl)` calls. Default is 300 seconds (5 min).
</details>

<details>
<summary><strong>How do I test rate limiting locally?</strong></summary>

Make 61+ rapid requests to any endpoint:

```bash
for i in $(seq 1 65); do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/v1/health; done
```

You should see `429` responses after the 60th request.
</details>

<details>
<summary><strong>Where is the upstream data from?</strong></summary>

All manga/manhwa data comes from the [Toraka API](https://toraka.com). ShineiAPI normalizes, caches, and serves it. We don't host any content ourselves.
</details>

---

## Questions?

- 💬 Open a [Discussion](https://github.com/Shineii86/ShineiAPI/discussions) for general questions
- 🐛 Open an [Issue](https://github.com/Shineii86/ShineiAPI/issues) for bugs
- ✉️ Contact the maintainer: [Shineii86](https://github.com/Shineii86)

---

Thank you for contributing! 🙏
