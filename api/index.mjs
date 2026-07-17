import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distServerDir = path.join(__dirname, "..", "dist", "server");
const distClientDir = path.join(__dirname, "..", "dist", "client");

let serverEntry;

async function getServerEntry() {
  if (!serverEntry) {
    serverEntry = await import(path.join(distServerDir, "server.js"));
  }
  return serverEntry;
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".ttf": "font/ttf",
    ".ico": "image/x-icon",
    ".xml": "application/xml",
  }[ext] ?? "application/octet-stream";
}

async function serveStaticFile(requestPath, response) {
  const assetPath = path.join(distClientDir, requestPath.replace(/^\//, ""));
  try {
    const stat = await fs.stat(assetPath);
    if (!stat.isFile()) throw new Error("Not a file");
    const body = await fs.readFile(assetPath);
    response.statusCode = 200;
    response.setHeader("content-type", getContentType(assetPath));
    response.setHeader("cache-control", "public, max-age=31536000, immutable");
    response.end(body);
    return true;
  } catch {
    return false;
  }
}

export default async function handler(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = url.pathname;

  const isStaticAssetRequest = pathname.includes(".") || pathname.startsWith("/assets/");
  if (isStaticAssetRequest) {
    const served = await serveStaticFile(pathname, response);
    if (served) return;
  }

  const req = new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? request : null,
  });

  try {
    const entry = await getServerEntry();
    const res = await entry.default.fetch(req, {}, {});
    response.statusCode = res.status;
    res.headers.forEach((value, key) => response.setHeader(key, value));
    const body = await res.arrayBuffer();
    response.end(Buffer.from(body));
  } catch (error) {
    response.statusCode = 500;
    response.setHeader("content-type", "text/html; charset=utf-8");
    response.end("Internal Server Error");
  }
}
