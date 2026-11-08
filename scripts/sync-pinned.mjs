#!/usr/bin/env node
// Sync GitHub pinned repos into site/content.js (projects.items with source:"pinned").
// No dependencies. Usage: node scripts/sync-pinned.mjs [--owner <login>] [--dry-run] [--all-public]
// --all-public: track all non-fork, non-archived public repos (pushedAt desc, cap 12) instead of pinnedItems.
// Each repo's GitHub Homepage (homepageUrl) becomes the item's `live` website link.
// Auth: `gh` CLI when authenticated, else GITHUB_TOKEN env (never printed).
import { createRequire } from 'node:module';
import { execFile } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
// Works in job/ (scripts/ next to site/) and in a published site repo (scripts/ next to content.js at root).
const base = existsSync(join(here, '..', 'site', 'content.js')) ? join(here, '..', 'site') : join(here, '..');
const CONTENT = join(base, 'content.js');
const Lib = require(join(base, 'site-lib.js'));

export const DEFAULT_OWNER = 'sinasehlaver';
const OWNER_RE = /^[A-Za-z0-9-]{1,39}$/;
const GH_PREFIX = 'https://github.com/';
const QUERY = 'query($login:String!){user(login:$login){pinnedItems(first:6,types:REPOSITORY){nodes{... on Repository{name url description isPrivate homepageUrl}}}}}';
const ALL_QUERY = 'query($login:String!){user(login:$login){repositories(first:50,privacy:PUBLIC,isFork:false,ownerAffiliations:OWNER,orderBy:{field:PUSHED_AT,direction:DESC}){nodes{name url description isPrivate isFork isArchived homepageUrl pushedAt}}}}';
export const ALL_CAP = 12;

export function validateOwner(owner) {
  if (typeof owner !== 'string' || !OWNER_RE.test(owner)) throw new Error('invalid owner (expected /^[A-Za-z0-9-]{1,39}$/)');
  return owner;
}

// GraphQL response -> [{name, url, description|null}] in pin order. Throws on bad shape / non-github URL.
export function extractPinned(resp, opts) {
  if (resp && Array.isArray(resp.errors) && resp.errors.length) throw new Error('GraphQL error: ' + String(resp.errors[0].message || 'unknown'));
  const u = resp && resp.data && resp.data.user;
  const all = !!(opts && opts.allPublic);
  let nodes = all ? u && u.repositories && u.repositories.nodes : u && u.pinnedItems && u.pinnedItems.nodes;
  if (!Array.isArray(nodes)) throw new Error('unexpected GraphQL response (user not found or no ' + (all ? 'repositories' : 'pinnedItems') + ')');
  if (all) {
    nodes = nodes.filter((n) => n && !n.isFork && !n.isArchived && !n.isPrivate)
      .sort((x, y) => String(y.pushedAt || '').localeCompare(String(x.pushedAt || ''))).slice(0, ALL_CAP);
  }
  const out = [];
  for (const n of nodes) {
    if (!n || typeof n !== 'object' || !n.name) continue; // non-repository pinned item (gist)
    if (n.isPrivate) continue;
    if (typeof n.url !== 'string' || !n.url.startsWith(GH_PREFIX) || !Lib.safeUrl(n.url)) throw new Error('refusing non-github URL: ' + JSON.stringify(String(n.url).slice(0, 80)));
    const hp = typeof n.homepageUrl === 'string' ? n.homepageUrl.trim() : '';
    out.push({ name: String(n.name), url: n.url, description: typeof n.description === 'string' && n.description.trim() ? n.description.trim() : null, homepage: /^https?:\/\//i.test(hp) && Lib.safeUrl(hp) ? hp : null });
  }
  return out;
}

const norm = (u) => String(u || '').replace(/\/+$/, '').toLowerCase();

// Pure merge: replaces only source:"pinned" items; manual kept as-is, pinned first (pin order).
export function mergeProjects(items, pinned) {
  const manual = items.filter((i) => i.source !== 'pinned');
  const oldPinned = items.filter((i) => i.source === 'pinned');
  const manualUrls = new Set(manual.map((i) => norm(i.url)).filter(Boolean));
  const seen = new Set();
  const fresh = [];
  for (const r of pinned) {
    const k = norm(r.url);
    if (manualUrls.has(k) || seen.has(k)) continue;
    seen.add(k);
    const prev = oldPinned.find((i) => norm(i.url) === k);
    const item = { ...(prev || {}), name: r.name, url: r.url, description: r.description != null ? r.description : (prev ? prev.description : ''), source: 'pinned' };
    if (r.homepage) item.live = { label: 'Live', href: r.homepage };
    else delete item.live; // GitHub Homepage is the source of truth for synced items
    fresh.push(item);
  }
  return fresh.concat(manual);
}

export function syncText(text, pinned) {
  const { data, prefix } = Lib.parse(text);
  data.projects.items = mergeProjects(data.projects.items || [], pinned);
  const problems = Lib.validate(data);
  if (problems.length) throw new Error('validation failed: ' + problems.join('; '));
  return { out: Lib.serialize(data, prefix || undefined), data };
}

function run(cmd, args) {
  return new Promise((resolve, reject) => execFile(cmd, args, { maxBuffer: 1 << 20 }, (err, stdout) => (err ? reject(err) : resolve(stdout))));
}

async function viaGh(owner, query) {
  await run('gh', ['auth', 'status']);
  return JSON.parse(await run('gh', ['api', 'graphql', '-f', 'query=' + query, '-F', 'login=' + owner]));
}

async function viaToken(owner, token, query) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json', 'User-Agent': 'job-sync-pinned' },
    body: JSON.stringify({ query, variables: { login: owner } }),
  });
  if (!res.ok) throw new Error('GitHub API HTTP ' + res.status);
  return res.json();
}

export async function fetchPinned(owner, opts) {
  validateOwner(owner);
  const query = opts && opts.allPublic ? ALL_QUERY : QUERY;
  let resp;
  try { resp = await viaGh(owner, query); }
  catch (e) {
    if (!process.env.GITHUB_TOKEN) throw new Error('gh not available/authenticated and GITHUB_TOKEN not set');
    resp = await viaToken(owner, process.env.GITHUB_TOKEN, query);
  }
  return extractPinned(resp, opts);
}

async function main() {
  const argv = process.argv.slice(2);
  const dry = argv.includes('--dry-run');
  const i = argv.indexOf('--owner');
  const owner = i >= 0 ? argv[i + 1] : DEFAULT_OWNER;
  validateOwner(owner);
  const allPublic = argv.includes('--all-public');
  const pinned = await fetchPinned(owner, { allPublic });
  const before = readFileSync(CONTENT, 'utf8');
  const { out, data } = syncText(before, pinned);
  console.log((allPublic ? 'public repos' : 'pinned') + ' from GitHub: ' + pinned.length + '; projects.items now: ' + data.projects.items.map((x) => x.name + '(' + x.source + ')').join(', '));
  if (out === before) return console.log('content.js unchanged');
  if (dry) return console.log('--dry-run: would update site/content.js');
  writeFileSync(CONTENT, out);
  console.log('updated site/content.js');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => { console.error('sync-pinned: ' + e.message); process.exit(1); });
}
