import {readFile, writeFile, mkdir, readdir} from 'node:fs/promises';
import path from 'node:path';
const base = 'https://www.kenseicraft.com';
const apps = JSON.parse(await readFile('data/apps.json', 'utf8'));
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ld = value => `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org', ...value}).replace(/</g,'\\u003c')}</script>`;
const organization = {'@type':'Organization','@id':`${base}/#organization`,name:'Kensei Craft',url:`${base}/`};
const breadcrumbs = (name, url) => ld({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Kensei Craft',item:`${base}/`},{'@type':'ListItem',position:2,name:'Apps',item:`${base}/apps/`},{'@type':'ListItem',position:3,name,item:url}]});
const shell = (title, description, route, body, schema='') => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Kensei Craft</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${base}${route}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${base}${route}"><meta property="og:image" content="${base}/assets/kensei-social-card.png"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="/assets/app-page.css"><link rel="stylesheet" href="/assets/discovery.css">${schema}</head><body class="app-site"><nav class="app-nav" aria-label="Main navigation"><div class="app-shell app-nav-inner"><a class="app-brand" href="/">Kensei Craft</a><div class="app-nav-links"><a href="/apps/">All apps</a><a href="/guides/">Guides</a><a href="/contact.html">Support</a></div></div></nav><main class="discovery-main">${body}</main><footer class="app-footer"><div class="app-shell"><p>Made by <a href="/">Kensei Craft</a>, an independent app studio in Nairobi.</p><nav aria-label="Footer"><a href="/apps/">All apps</a> · <a href="/guides/">Guides</a> · <a href="/contact.html">Contact</a> · <a href="/privacyPolicy.html">Privacy policy</a></nav></div></footer></body></html>\n`;
const workflows = {
curio:['Photograph the whole item in even light, then take close-ups of maker marks, materials and signs of wear.','Use Curio to explore a possible identification, history and estimated value; compare the result with physical evidence.','Save the item to your collection. For a sale, insurance or a high-value decision, seek a qualified appraisal.'],
cardValueScanner:['Photograph the card clearly and record its name, set, number, language and visible condition.','Use MonValue to identify the card and explore market estimates; check that the edition matches your card.','Save it to your collection and compare recent sold examples in similar condition before deciding a price.'],
blueMic:['Connect your iPhone to the Bluetooth speaker or headphones you want to use.','Open BlueMic, allow microphone access when prompted and test speech at low speaker volume.','Adjust the sound controls and keep the phone away from the speaker to reduce feedback. Bluetooth delay can vary by setup.'],
coinScope:['Photograph both sides of the coin in focus and note any visible lettering, date and mint marks.','Use CoinScope to explore its country, denomination and composition, then compare those details with the coin.','Save the find to your collection. Treat value estimates as a starting point and seek specialist advice for significant items.'],
cleanKit:['Start with a small group of photos or large videos and identify what you no longer need.','Review each proposed deletion in CleanKit and check that important originals have a backup.','Delete only confirmed unwanted items. Check available device storage afterward and review recently deleted items before permanent removal.'],
videocompressor:['Choose a video and decide whether you need a smaller sharing copy or a higher-quality archive.','Use a preset or adjust resolution, frame rate and bitrate in VideoShrink. Smaller output generally involves a quality trade-off.','Save and play the compressed copy, checking motion and fine detail before sharing it or removing the original.'],
anyPantry:['Add your pantry items, quantities and storage locations so you can see what is already at home.','Review low stock and add needed items to your shopping list; move bought items into your pantry.','Explore meal ideas from your ingredients and check each recipe against what you have before cooking.']
};
const titles = {
curio:'How to research an antique from a photo',cardValueScanner:'How to identify and organize trading cards',blueMic:'How to use your iPhone with a Bluetooth speaker microphone',coinScope:'How to identify a coin from photos',cleanKit:'How to review iPhone photos and videos before deleting them',videocompressor:'How to make an iPhone video smaller',anyPantry:'How to organize your pantry and plan your next shop',birdBook:'How to keep a useful bird sighting collection',skedge:'How to plan assignments alongside your weekly schedule',devotion:'How to start a daily scripture and prayer routine',pdfscanner:'How to scan and organize documents as PDFs',pdfphoto:'How to turn a collection of photos into a PDF',beeflow:'How to track freelance hours by client and project',gratitude:'How to start a three-entry daily gratitude journal',invoiceMaker:'How to prepare and check a client invoice'};
const card = app => `<article class="app-benefit"><h2><a href="/${app.slug}/">${esc(app.name)}</a></h2><p>${esc(app.description)}</p><a href="/guides/${app.slug}/">${esc(titles[app.slug])}</a></article>`;
for (const app of apps) {
 const route = `/${app.slug}/`, url = base+route;
 const faq = [{q:`What does ${app.name} do?`,a:app.description},{q:`What can I use ${app.name} for?`,a:app.features.join('. ')+'.'},{q:`Where can I get help with ${app.name}?`,a:'Contact Kensei Craft at developer@kenseicraft.com for product support and availability questions.'}];
 const application = {'@type':'SoftwareApplication','@id':url+'#app',name:app.name,url,description:app.description,applicationCategory:app.category,operatingSystem:'iOS',featureList:app.features,author:organization,...(app.download?{downloadUrl:app.download}:{})};
 const guideUrl = `/guides/${app.slug}/`;
 if (!app.existing) {
  await mkdir(app.slug,{recursive:true});
  const terms = app.slug==='invoiceMaker'?'/termsOfUse.html':route+'termsOfUse.html';
  await writeFile(app.slug+'/index.html',shell(app.name,app.description,route,`<header class="app-shell discovery-header"><p class="app-eyebrow">An app by Kensei Craft</p><h1>${esc(app.name)}</h1><p class="app-lede">${esc(app.description)}</p><a class="app-button app-button-primary" href="${guideUrl}">Read the getting started guide</a></header><section class="app-shell app-section"><h2>What you can do</h2><div class="app-benefits">${app.features.map(f=>`<article class="app-benefit"><h3>${esc(f)}</h3></article>`).join('')}</div></section><section class="app-shell app-section"><h2>${esc(titles[app.slug])}</h2><ol class="discovery-steps">${app.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p><a href="${guideUrl}">Read the full guide</a></p></section><section class="app-shell app-section"><h2>Frequently asked questions</h2><div class="app-faq-list">${faq.map(f=>`<details><summary>${esc(f.q)}</summary><div class="app-faq-answer"><p>${esc(f.a)}</p></div></details>`).join('')}</div></section><section class="app-shell app-section"><h2>Support and availability</h2><p>${app.download ? `<a href="${esc(app.download)}">View ${esc(app.name)} on the App Store</a> for current availability and pricing.` : `For the current download link, device compatibility and pricing, <a href="/contact.html">contact Kensei Craft</a>.`}</p><a href="${terms}">Terms of use</a></section>`,ld(application)+ld({'@type':'FAQPage',mainEntity:faq.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))})+breadcrumbs(app.name,url)));
 } else {
  const file=app.slug+'/index.html';
  let html=await readFile(file,'utf8');
  // Replace our own block on repeat runs; retain hand-authored schema and content.
  html=html.replace(/\n<!-- discovery:start -->[\s\S]*?<!-- discovery:end -->\n?/g,'');
  const hasApp=html.includes('"SoftwareApplication"');
  const graph=[organization,{'@type':'WebPage','@id':url+'#page',url,name:app.name,about:{'@id':url+'#app'},publisher:{'@id':organization['@id']}}];
  if (!hasApp) graph.push(application);
  else html=html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,(all,open,body,close)=>{
   const data=JSON.parse(body);
   if(data['@type']!=='SoftwareApplication') return all;
   data['@id']=url+'#app';data.featureList=app.features;data.author=organization;
   // Pricing remains in hand-authored copy; do not assert stale prices in generated schema.
   delete data.offers;
   return open+JSON.stringify(data,null,2)+close;
  });
  html=html.replace('</head>',`\n<!-- discovery:start -->${ld({'@graph':graph})}${breadcrumbs(app.name,url)}<!-- discovery:end -->\n</head>`);
  html=html.replace('</main>',`\n<!-- discovery:start --><section class="app-section"><div class="app-shell"><h2>Getting started with ${esc(app.name)}</h2><p><a href="${guideUrl}">${esc(titles[app.slug])}</a></p><p><a href="/apps/">Explore all Kensei Craft apps</a> · <a href="/guides/">Browse practical guides</a></p></div></section><!-- discovery:end -->\n</main>`);
  await writeFile(file,html);
 }
 const steps=app.steps||workflows[app.slug];
 await mkdir('guides/'+app.slug,{recursive:true});
 const title=titles[app.slug];
 const description=`${title} with a practical workflow and tips for using ${app.name}.`;
 await writeFile('guides/'+app.slug+'/index.html',shell(title,description,guideUrl,`<article class="app-shell discovery-article"><p class="app-eyebrow">A practical guide by Kensei Craft</p><h1>${esc(title)}</h1><p class="app-lede">${esc(app.description)}</p><p>This guide walks through a simple workflow using <a href="${route}">${esc(app.name)}</a>.</p><h2>Step by step</h2><ol class="discovery-steps">${steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><h2>Before you finish</h2><p>Review the result before relying on it. Available controls and features can vary by app version; contact <a href="/contact.html">Kensei Craft support</a> if your screen differs from this workflow.</p><h2>Explore ${esc(app.name)}</h2><p>${esc(app.description)}</p><p><a href="${route}">See features and support for ${esc(app.name)}</a>${app.download?` · <a href="${esc(app.download)}">View on the App Store</a>`:''}</p></article>`,ld({'@type':'Article',headline:title,description,url:base+guideUrl,author:organization,publisher:organization,about:{'@id':url+'#app'},mainEntityOfPage:base+guideUrl})));
}
await mkdir('apps',{recursive:true});await mkdir('guides',{recursive:true});
await writeFile('apps/index.html',shell('Apps for everyday tasks','Explore all 15 Kensei Craft apps for collecting, productivity, creativity and daily routines.','/apps/',`<header class="app-shell discovery-header"><h1>Find an app for your everyday tasks.</h1><p class="app-lede">Explore the full Kensei Craft collection, with product details, practical guides and support.</p></header><section class="app-shell app-section"><div class="discovery-grid">${apps.map(card).join('')}</div></section>`,ld({'@type':'ItemList',itemListElement:apps.map((app,i)=>({'@type':'ListItem',position:i+1,name:app.name,url:`${base}/${app.slug}/`}))})));
await writeFile('guides/index.html',shell('Practical app guides','Learn how to use Kensei Craft apps to organize, create, collect and reflect.','/guides/',`<header class="app-shell discovery-header"><h1>Practical guides for everyday tasks.</h1><p class="app-lede">Start with the task you want to finish, then explore the app that helps you do it.</p></header><section class="app-shell app-section"><div class="discovery-grid">${apps.map(card).join('')}</div></section>`));
// Discover publishable HTML rather than maintaining an incomplete URL list.
const directories=['apps','guides',...apps.map(a=>a.slug),'devotion','gratitude'];
const files=new Set(['index.html','contact.html','privacyPolicy.html','termsOfUse.html']);
async function walk(dir) {for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.posix.join(dir,entry.name);if(entry.isDirectory()) await walk(file);else if(entry.name.endsWith('.html')) files.add(file);}}
for(const dir of new Set(directories)) await walk(dir);
const urls=[...files].map(f=>f==='index.html'?'/':f.endsWith('/index.html')?'/'+f.slice(0,-10):'/'+f).sort();
await writeFile('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${base}${esc(u)}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Generated discovery content for ${apps.length} apps and ${urls.length} sitemap URLs.`);
