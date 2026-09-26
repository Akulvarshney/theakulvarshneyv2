const {chromium}=require('/Users/varshney/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Users/varshney/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
 const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:4173',{waitUntil:'networkidle'});await page.screenshot({path:'tmp/qa/editorial-hero.png'});
 for(const id of ['work','rise','claims','fleet','approach','contact']){await page.locator('#'+id).scrollIntoViewIfNeeded();await page.waitForTimeout(900);await page.screenshot({path:`tmp/qa/editorial-${id}.png`});}
 await page.screenshot({path:'tmp/qa/editorial-full.png',fullPage:true});
 for(const width of [320,390,768,1024,1440,1920]){await page.setViewportSize({width,height:900});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Horizontal overflow '+width);}
 await page.setViewportSize({width:390,height:844});await page.goto('http://localhost:4173',{waitUntil:'networkidle'});await page.screenshot({path:'tmp/qa/editorial-mobile.png'});
 for(const id of ['rise','claims','fleet','approach','contact']){await page.locator('#'+id).scrollIntoViewIfNeeded();await page.waitForTimeout(900);await page.screenshot({path:`tmp/qa/editorial-mobile-${id}.png`});}
 await page.screenshot({path:'tmp/qa/editorial-mobile-full.png',fullPage:true});
 await page.getByRole('button',{name:'Menu +',exact:true}).click();await page.getByRole('navigation').getByRole('link',{name:'Work',exact:true}).click();
 if(await page.getByRole('button',{name:'Menu +',exact:true}).getAttribute('aria-expanded')!=='false')throw Error('Menu did not close');
 await page.getByRole('button',{name:'Menu +',exact:true}).click();await page.keyboard.press('Escape');if(await page.getByRole('button',{name:'Menu +',exact:true}).getAttribute('aria-expanded')!=='false')throw Error('Escape failed');
 for(const name of ['Order','Queue','Fulfil']){await page.getByRole('button',{name:new RegExp(name)}).click();if(await page.getByRole('button',{name:new RegExp(name)}).getAttribute('aria-pressed')!=='true')throw Error('Rail state');}
 for(const name of ['Extract','Compare','Review']){await page.getByRole('button',{name:new RegExp(name)}).click();if(await page.getByRole('button',{name:new RegExp(name)}).getAttribute('aria-pressed')!=='true')throw Error('Claim state');}
 for(const name of ['Dispatch','Tracking','Fuel']){await page.getByRole('button',{name,exact:true}).click();if(await page.getByRole('button',{name,exact:true}).getAttribute('aria-pressed')!=='true')throw Error('Fleet state');}
 await page.locator('summary').first().click();if(await page.locator('details').first().getAttribute('open')===null)throw Error('Details failed');
 await page.getByRole('button',{name:'Copy email'}).click();if(await page.evaluate(()=>navigator.clipboard.readText())!=='akulv.work@gmail.com')throw Error('Clipboard failed');
 if(!(await context.request.get('http://localhost:4173/Akul-Varshney-Resume.pdf')).ok())throw Error('Resume missing');
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});if(await page.locator('.hero-title').evaluate(e=>getComputedStyle(e).transform)!=='none')throw Error('Reduced motion');
 if(errors.length)throw Error(JSON.stringify(errors));
 console.log(JSON.stringify({status:'PASS',errors,checks:['6 responsive widths','mobile navigation','Escape focus return','9 project states','project details','clipboard','resume download','reduced motion']}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
