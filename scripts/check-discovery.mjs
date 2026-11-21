import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
const apps=JSON.parse(await readFile('data/apps.json','utf8'));
const base='https://www.kenseicraft.com';
const sitemap=await readFile('sitemap.xml','utf8');
const files=['apps/index.html','guides/index.html',...apps.flatMap(a=>[`${a.slug}/index.html`,`guides/${a.slug}/index.html`])];
for(const file of files){
 const html=await readFile(file,'utf8');
 const route='/'+file.replace(/index\.html$/,'');
 assert(html.includes(`rel="canonical" href="${base}${route}"`),`${file}: canonical`);
 assert(sitemap.includes(`<loc>${base}${route}</loc>`),`${file}: sitemap entry`);
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: single h1`);
 const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 if(apps.some(a=>`${a.slug}/index.html`===file)){
  const nodes=schemas.flatMap(s=>s['@graph']||[s]);
  const appNodes=nodes.filter(s=>s['@type']==='SoftwareApplication');
  assert.equal(appNodes.length,1,`${file}: one app entity`);
  assert.equal(appNodes[0]['@id'],base+route+'#app');
  assert(appNodes[0].featureList.length>0);
 }
 for(const match of html.matchAll(/href="([^"]+)"/g)){
  const href=match[1];if(!href.startsWith('/')||href.startsWith('//'))continue;
  const local=decodeURIComponent(href.split(/[?#]/)[0]).replace(/^\//,'');
  await access(!local?'index.html':local.endsWith('/')?local+'index.html':local);
 }
}
for(const match of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)){
 const local=new URL(match[1]).pathname.slice(1);
 await access(!local?'index.html':local.endsWith('/')?local+'index.html':local);
}
console.log(`Checked ${apps.length} app entities, ${files.length} pages, JSON-LD, canonical URLs, sitemap targets and internal discovery links.`);
