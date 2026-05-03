/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.1                                    ║
 * ║  API Endpoint Tests                                  ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * Run: node tests/api.test.js
 * Or:  npm test (after adding to package.json scripts)
 *
 * Tests the live API endpoints for correct response format,
 * status codes, and data structure.
 */

const BASE = 'https://shineiapi.vercel.app/api/v1';

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.log(`  [FAIL] ${name}`);
    console.log(`     ${err.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg);
}

async function fetchJSON(path) {
  const res = await fetch(`${BASE}${path}`);
  const data = await res.json();
  return { status: res.status, data, headers: res.headers };
}

/* ─── Health ─── */
async function testHealth() {
  console.log('\n[Health]');
  await test('returns 200 with healthy status', async () => {
    const { status, data } = await fetchJSON('/health');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, 'Expected success: true');
    assert(data.data.status === 'healthy', `Expected healthy, got ${data.data.status}`);
    assert(data.data.version === '2.0.1', 'Expected version 2.0.1');
  });
}

/* ─── Stats ─── */
async function testStats() {
  console.log('\n[Stats]');
  await test('returns 200 with stats', async () => {
    const { status, data } = await fetchJSON('/stats');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, 'Expected success: true');
    assert(data.data.endpoints === 10, 'Expected 10 endpoints');
    assert(data.data.cache, 'Expected cache stats');
  });
}

/* ─── Search ─── */
async function testSearch() {
  console.log('\n[Search]');
  await test('returns results for valid query', async () => {
    const { status, data } = await fetchJSON('/search?q=solo+leveling');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, 'Expected success: true');
    assert(Array.isArray(data.data), 'Expected data array');
    assert(data.data.length > 0, 'Expected at least one result');
    assert(data.data[0].title, 'Expected title field');
  });

  await test('returns 400 for missing query', async () => {
    const { status, data } = await fetchJSON('/search');
    assert(status === 400, `Expected 400, got ${status}`);
    assert(data.success === false, 'Expected success: false');
  });

  await test('returns 400 for short query', async () => {
    const { status, data } = await fetchJSON('/search?q=a');
    assert(status === 400, `Expected 400, got ${status}`);
  });
}

/* ─── Series ─── */
async function testSeries() {
  console.log('\n[Series]');
  await test('returns series list', async () => {
    const { status, data } = await fetchJSON('/series');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, 'Expected success: true');
    assert(Array.isArray(data.data), 'Expected data array');
  });

  await test('returns series detail for valid slug', async () => {
    const { status, data } = await fetchJSON('/series/solo-leveling');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.data.title === 'Solo Leveling', `Expected Solo Leveling, got ${data.data.title}`);
    assert(data.data.rating, 'Expected rating field');
    assert(data.data.genres, 'Expected genres field');
  });

  await test('returns 404 for invalid slug', async () => {
    const { status, data } = await fetchJSON('/series/this-does-not-exist-xyz');
    assert(status === 404, `Expected 404, got ${status}`);
    assert(data.success === false, 'Expected success: false');
  });
}

/* ─── Chapters ─── */
async function testChapters() {
  console.log('\n[Chapters]');
  await test('returns chapters for valid slug', async () => {
    const { status, data } = await fetchJSON('/series/solo-leveling/chapters');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data.data), 'Expected data array');
  });
}

/* ─── Popular ─── */
async function testPopular() {
  console.log('\n[Popular]');
  await test('returns popular series', async () => {
    const { status, data } = await fetchJSON('/popular');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data.data), 'Expected data array');
  });

  await test('returns trending series', async () => {
    const { status, data } = await fetchJSON('/popular?type=trending');
    assert(status === 200, `Expected 200, got ${status}`);
  });
}

/* ─── Random ─── */
async function testRandom() {
  console.log('\n[Random]');
  await test('returns a random series', async () => {
    const { status, data } = await fetchJSON('/random');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.data.title, 'Expected title field');
  });
}

/* ─── Top ─── */
async function testTop() {
  console.log('\n[Top Rated]');
  await test('returns top rated series', async () => {
    const { status, data } = await fetchJSON('/top');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data.data), 'Expected data array');
  });
}

/* ─── Schedule ─── */
async function testSchedule() {
  console.log('\n[Schedule]');
  await test('returns release schedule', async () => {
    const { status, data } = await fetchJSON('/schedule');
    assert(status === 200, `Expected 200, got ${status}`);
  });
}

/* ─── Genres ─── */
async function testGenres() {
  console.log('\n[Genres]');
  await test('returns genres list', async () => {
    const { status, data } = await fetchJSON('/genres');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data.data), 'Expected data array');
    assert(data.data.length > 0, 'Expected at least one genre');
    assert(data.data[0].slug, 'Expected slug field');
  });
}

/* ─── Response Format ─── */
async function testFormat() {
  console.log('\n[Response Format]');
  await test('all responses have timestamp', async () => {
    const { data } = await fetchJSON('/health');
    assert(data.timestamp || data.data?.timestamp, "Expected timestamp field");
    assert(!isNaN(Date.parse(data.timestamp)), 'Expected valid ISO timestamp');
  });

  await test('rate limit headers present', async () => {
    const res = await fetch(`${BASE}/health`);
    assert(res.headers.get('x-ratelimit-limit'), 'Expected X-RateLimit-Limit header');
    assert(res.headers.get('x-ratelimit-remaining'), 'Expected X-RateLimit-Remaining header');
    assert(res.headers.get('x-request-id'), 'Expected X-Request-ID header');
  });
}

/* ─── Run All ─── */
async function testSlugNorm() {
  await testSlugNormalization();
}

async function run() {
  console.log('>> ShineiAPI v2.0.1 — API Tests');
  console.log(`   Base: ${BASE}\n`);

  await testHealth();
  await testStats();
  await testSearch();
  await testSeries();
  await testChapters();
  await testPopular();
  await testRandom();
  await testTop();
  await testSchedule();
  await testGenres();
  await testFormat();
  await testSlugNormalization();

  console.log(`\n${'─'.repeat(40)}`);
  console.log(`  Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  console.log(`${'─'.repeat(40)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

run();

/* ─── Slug Normalization ─── */
async function testSlugNormalization() {
  console.log('\n[Slug Normalization]');
  await test('converts %20 (encoded space) to hyphens', async () => {
    const { status, data } = await fetchJSON('/series/nano%20machine');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.data.title === 'Nano Machine', `Expected Nano Machine, got ${data.data.title}`);
    assert(data.data.slug === 'nano-machine', `Expected nano-machine slug`);
  });

  await test('series detail excludes chapters by default', async () => {
    const { status, data } = await fetchJSON('/series/solo-leveling');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.data.chapters === undefined, 'Expected chapters to be absent by default');
    assert(data.data.chapters_count !== undefined, 'Expected chapters_count to be present');
  });

  await test('series detail includes chapters with ?include=chapters', async () => {
    const { status, data } = await fetchJSON('/series/solo-leveling?include=chapters');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data.data.chapters), 'Expected chapters array');
    assert(data.data.chapters.length > 0, 'Expected at least one chapter');
  });
}

// Insert before run()
