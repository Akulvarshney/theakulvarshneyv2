const { chromium } = require('/Users/varshney/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({headless:true,channel:"chrome"});
const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});
const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:4173',{waitUntil:'networkidle'});
await page.screenshot({path:'tmp/qa/desktop.png'});
await page.getByRole('button',{name:'AI',exact:true}).click();
await page.waitForTimeout(1000);
if(await page.locator('.project-card').count()!==1)throw Error('AI filter '+await page.locator('.project-card').count()+' '+JSON.stringify(errors));
await page.getByRole('button',{name:'Explore the project'}).click();
if(!await page.locator('.project-detail:visible').count())throw Error('Project expansion');
await page.getByRole('button',{name:'All',exact:true}).click();
await page.waitForTimeout(1000);
if(await page.locator('.project-card').count()!==4)throw Error('All filter');
await page.getByRole('button',{name:'Copy email',exact:true}).click();
if(await page.evaluate(()=>navigator.clipboard.readText())!=='akulv.work@gmail.com')throw Error('Clipboard');
if(!(await context.request.get('http://localhost:4173/Akul-Varshney-Resume.pdf')).ok())throw Error('Resume');
for(const id of ['about','work','experience','contact']){if(await page.locator('#'+id).count()!==1)throw Error('Missing anchor');}
await page.locator('#work').scrollIntoViewIfNeeded();await page.waitForTimeout(800);await page.screenshot({path:'tmp/qa/work.png'});
await page.setViewportSize({width:390,height:844});await page.goto('http://localhost:4173');await page.waitForTimeout(1000);
await page.getByRole('button',{name:'Open menu'}).click();await page.getByRole('navigation').getByRole('link',{name:'Work',exact:true}).click();
if(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded')!=='false')throw Error('Menu close');
await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(900);await page.screenshot({path:'tmp/qa/mobile.png'});
for(const width of [320,390,768,1024,1440]){await page.setViewportSize({width,height:900});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+width);}
await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.waitForTimeout(200);if(await page.locator('h1').evaluate(e=>getComputedStyle(e.parentElement).opacity)!=='1')throw Error('Reduced motion visibility');
console.log(JSON.stringify({result:'PASS',checks:['filters','project expansion','clipboard','resume','section anchors','mobile menu','responsive overflow at five widths','reduced motion'],errors}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
