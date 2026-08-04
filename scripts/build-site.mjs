import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "dist");
const client = path.join(output, "client");

const publicFiles = [
  "index.html",
  "contact.html",
  "privacyPolicy.html",
  "termsOfUse.html",
  "robots.txt",
  "sitemap.xml",
];

const publicDirectories = [
  "assets",
  "beeflow",
  "birdBook",
  "blueMic",
  "cardValueScanner",
  "cleanKit",
  "coinScope",
  "css",
  "curio",
  "devotion",
  "fonts",
  "gratitude",
  "images",
  "js",
  "pdfphoto",
  "pdfscanner",
  "skedge",
  "videocompressor",
];

const shouldCopy = (source) =>
  !source.endsWith(".DS_Store") &&
  !source.endsWith(".md") &&
  !source.endsWith(".map");

await rm(output, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(path.join(output, "server"), { recursive: true });

for (const file of publicFiles) {
  await cp(path.join(root, file), path.join(client, file));
}

for (const directory of publicDirectories) {
  await cp(path.join(root, directory), path.join(client, directory), {
    recursive: true,
    filter: shouldCopy,
  });
}

const worker = `export default {
  async fetch(request, env) {
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response("Site assets are unavailable.", { status: 503 });
  }
};
`;

await writeFile(path.join(output, "server", "index.js"), worker);

const countFiles = async (directory) => {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    count += entry.isDirectory()
      ? await countFiles(path.join(directory, entry.name))
      : 1;
  }
  return count;
};

console.log(`Built ${await countFiles(client)} public files in dist/client.`);
