import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const STATE_DIR = join(process.env.LOCALAPPDATA || homedir(), "ace-the-pmp");
const STATE_FILE = join(STATE_DIR, "last-deployed-sha.txt");
const LOCK_FILE = join(STATE_DIR, "deploy.lock");
const EXPECTED_MSG = "chore(blog): automatic daily study guide";
const TEAM_ID = "team_2vb8J58vWl6fdj3UlP4o4L4T";
const PROJECT_ID = "prj_T30PuBYYM8cYWwRXg3LikuBEp3J0";
const VERCEL_BASE = "https://api.vercel.com";

function now() {
  return new Date().toISOString();
}
function info(msg) {
  console.log(`[deploy-daily ${now()}] ${msg}`);
}
function readOrNull(path) {
  try {
    return readFileSync(path, "utf8").trim();
  } catch {
    return null;
  }
}
function tryLock() {
  mkdirSync(STATE_DIR, { recursive: true });
  if (existsSync(LOCK_FILE)) {
    const lock = readOrNull(LOCK_FILE);
    const ageMs = Date.now() - new Date(lock || 0).getTime();
    if (Number.isFinite(ageMs) && ageMs < 2 * 60 * 60 * 1000) return false;
  }
  writeFileSync(LOCK_FILE, now(), "utf8");
  return true;
}
function releaseLock() {
  try {
    rmSync(LOCK_FILE, { force: true });
  } catch {
    // best effort
  }
}
function git(args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function vercelToken() {
  const roaming = process.env.APPDATA || join(homedir(), "AppData", "Roaming");
  const authPath = join(roaming, "xdg.data", "com.vercel.cli", "auth.json");
  const raw = readOrNull(authPath);
  if (!raw) return null;
  try {
    return JSON.parse(raw).token || null;
  } catch {
    return null;
  }
}

async function alreadyDeployedAfter(commitTs) {
  const token = vercelToken();
  if (!token) return false;
  const url = `${VERCEL_BASE}/v6/deployments?projectId=${PROJECT_ID}&teamId=${TEAM_ID}&limit=10`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return false;
  const data = await res.json();
  return (data.deployments || []).some(
    (d) => d.readyState === "READY" && d.created >= commitTs
  );
}

async function main() {
  if (!tryLock()) {
    info("another deploy run is in progress (lock fresh) — skipping");
    return;
  }
  try {
    git(["fetch", "origin", "master", "--quiet"]);
    const sha = git(["rev-parse", "origin/master"]);
    const msg = git(["log", "-1", "--format=%s", "origin/master"]);
    if (msg !== EXPECTED_MSG) {
      info(`latest origin/master is "${msg?.slice(0, 60)}" (not an auto-post) — nothing to deploy`);
      return;
    }
    const lastDeployed = readOrNull(STATE_FILE);
    if (lastDeployed === sha) {
      info("this auto-post was already deployed locally — nothing to do");
      return;
    }
    const commitTs = Math.floor(new Date(git(["log", "-1", "--format=%cI", "origin/master"])).getTime());
    if (await alreadyDeployedAfter(commitTs)) {
      writeFileSync(STATE_FILE, sha, "utf8");
      info(`auto-post ${sha.slice(0, 8)} already deployed by GitHub Actions — marking done`);
      return;
    }
    info(`new auto-post detected (${sha.slice(0, 8)}) — deploying to Vercel`);
    const out = execFileSync(
      process.platform === "win32" ? "npx.cmd" : "npx",
      ["vercel", "deploy", "--prod", "--yes"],
      { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
    );
    if (!/Aliased[^\n]*acethepmp\.vercel\.app/.test(out)) {
      info("deploy finished but production alias was not confirmed");
      info(out.split("\n").slice(-6).join("\n"));
      process.exitCode = 1;
      return;
    }
    writeFileSync(STATE_FILE, sha, "utf8");
    info("deployed and aliased to https://acethepmp.vercel.app");
  } catch (err) {
    info(`deploy error: ${err.stderr?.toString?.()?.slice(0, 400) || err.message}`);
    process.exitCode = 1;
  } finally {
    releaseLock();
  }
}

main();