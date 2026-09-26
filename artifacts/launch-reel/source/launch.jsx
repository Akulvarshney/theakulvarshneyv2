export default async ({ project }) => {
 const p=await project({dir:'/home/user/launch/project',size:'1080x1920',fps:30,background:'#060910'});
 const page=await p.add('/home/user/launch/portfolio.png');
 const font=await p.add('/home/user/launch/display.ttf');
 const cyan='#5fffe4', purple='#9d7aff', white='#f4f8ff';
 const keys=(property,points)=>({property,keyframes:points.map(([at,value])=>({at,value})),easing:'house'});
 const pop=(duration=1)=>[keys('scale',[[0,.15],[.18,1.12],[.34,1],[duration-.16,1.04],[duration,1.7]]),keys('opacity',[[0,0],[.08,1],[duration-.1,1],[duration,0]])];
 const T=(value,x,y,size,width=900,color=white,extra={})=><text x={x} y={y} width={width} height={size*1.3} typography={{fontAssetId:font.id}} fontSize={size} color={color} {...extra}>{value}</text>;
 p.compose(<frame x={0} y={0} width={1080} height={1920} layout="none" background="#060910" clip={true}>
  <rect x={-350} y={350} width={1100} height={1100} radius={550} fill={{kind:'radial',stops:[{offset:0,color:'#134c49',opacity:.55},{offset:1,color:'#060910',opacity:0}]}} animate={[keys('offsetX',[[0,-80],[7,260],[15,-80]]),keys('offsetY',[[0,0],[7,-240],[15,0]])]}/>
  <rect x={500} y={700} width={1000} height={1000} radius={500} fill={{kind:'radial',stops:[{offset:0,color:'#4b286c',opacity:.5},{offset:1,color:'#060910',opacity:0}]}} animate={[keys('offsetY',[[0,0],[8,-500],[15,-100]])]}/>
  {Array.from({length:22},(_,i)=><rect x={(i*193)%1080} y={(i*277)%1920} width={i%3===0?5:3} height={i%3===0?5:3} fill={i%2?cyan:purple} opacity={.3+(i%4)*.15} animate={[{property:'offsetY',from:200,to:-380-i*8,duration:15,easing:'linear'},{property:'offsetX',from:-70,to:100,duration:15,easing:'linear'}]}/>)}
  {[0,1,2].map(i=><rect x={-300+i*420} y={500+i*510} width={900} height={2} fill={i%2?purple:cyan} opacity={.22} animate={[{property:'rotation',from:-30,to:30,duration:15,easing:'linear'},{property:'offsetY',from:200,to:-200,duration:15,easing:'linear'}]}/>)}
 </frame>,{at:0,dur:15});
 p.compose(<frame x={90} y={640} width={900} height={590} layout="none" animate={pop(.94)}>
  {T('STOP',0,0,235,900,cyan,{align:'center'})}{T('SCROLLING.',0,245,180,900,white,{align:'center'})}
 </frame>,{at:0,dur:.94});
 p.compose(<frame x={90} y={540} width={900} height={800} layout="none" animate={[keys('scale',[[0,.3],[.22,1.08],[.4,1],[1.65,1.04],[2.06,2.5]]),keys('opacity',[[0,0],[.1,1],[1.85,1],[2.06,0]])]}>
 {T('MY NEW',0,0,135,900,white,{align:'center'})}{T('PORTFOLIO',0,165,175,900,white,{align:'center',animate:[keys('offsetX',[[0,-600],[.28,25],[.45,0]])]})}
 {T('IS LIVE.',0,400,215,900,cyan,{align:'center',animate:[keys('scale',[[0,.2],[.3,.2],[.5,1.15],[.7,1]])]})}
 </frame>,{at:.94,dur:2.06});
 const browserShader=`vec4 pixel(vec2 uv) {
 float t=clamp(u_time-3.0,0.0,6.0);
 float arrival=smoothstep(0.0,0.65,t);
 float leave=smoothstep(5.65,6.0,t);
 float punch=0.16*smoothstep(1.85,2.05,t)*(1.0-smoothstep(2.3,2.65,t))+0.13*smoothstep(3.8,4.0,t)*(1.0-smoothstep(4.3,4.65,t));
 float zoom=.94+.04*sin(t*2.2)+punch;
 vec2 q=(uv*vec2(1080.0,1920.0)-vec2(540.0+(1.0-arrival)*1450.0-leave*1500.0,990.0+20.0*sin(t*2.0)))/(vec2(920.0,1120.0)*zoom);
 float r=mix(-.14,.035,arrival)+.025*sin(t*2.0); q=mat2(cos(r),-sin(r),sin(r),cos(r))*q;
 float angle=mix(.7,.16,arrival)+.12*sin(t*1.7);
 float xx=q.x/(cos(angle)+q.x*sin(angle)*.65);
 float yy=q.y*(1.0-xx*sin(angle)*.65);
 vec2 v=vec2(xx,yy)+.5;
 if(v.x<0.0||v.x>1.0||v.y<0.0||v.y>1.0) return vec4(0.0);
 float edge=min(min(v.x,1.0-v.x),min(v.y,1.0-v.y));
 if(edge<.003) return vec4(.37,1.0,.89,1.0);
 if(v.y<.062){
 vec3 col=vec3(.06,.08,.11);
 for(int i=0;i<3;i++){if(distance(v,vec2(.035+float(i)*.025,.030))<.008)col=i==0?vec3(1.,.35,.4):i==1?vec3(1.,.78,.3):vec3(.3,1.,.65);}
 if(v.x>.20&&v.x<.80&&v.y>.018&&v.y<.044)col=vec3(.13,.16,.2);
 return vec4(col,1.0);}
 float scroll=938.0*smoothstep(.65,2.2,t)+1120.0*smoothstep(2.65,4.35,t)+100.0*smoothstep(4.7,5.7,t);
 float py=(v.y-.062)/.938*1150.0+scroll;
 vec4 col=texture(u_page,vec2(v.x,py/3338.0));
 return vec4(col.rgb,1.0);
 }`;
 p.compose(<rect x={0} y={0} width={1080} height={1920} fill="#ffffff" effects={[{kind:'shader',params:{glsl:browserShader,textures:{page:{assetId:page.id}}}}]}/>,{at:3,dur:6});
 p.compose(<frame x={90} y={240} width={900} height={190} layout="none" animate={[keys('offsetY',[[0,-90],[.4,0],[5.6,0],[6,-100]]),keys('opacity',[[0,0],[.3,1],[5.6,1],[6,0]])]}>
 {T('BUILT. SHIPPED. LIVE.',0,0,92,900,white,{align:'center'})}</frame>,{at:3,dur:6});
 [['EXPLORE THE WORK',3.6],['REAL PRODUCTS.',5.2],['REAL IMPACT.',7.2]].forEach(([v,at])=>p.compose(<frame x={90} y={1560} width={900} height={110} layout="none" animate={pop(1.3)}>{T(v,0,0,65,900,cyan,{align:'center'})}</frame>,{at,dur:1.3}));
 p.compose(<frame x={90} y={320} width={900} height={180} layout="none" animate={[keys('scale',[[0,.4],[.25,1.08],[.5,1],[2.7,1.03],[3,1.5]]),keys('opacity',[[0,0],[.12,1],[2.75,1],[3,0]])]}>{T('IDEAS INTO REALITY.',0,0,100,900,white,{align:'center'})}</frame>,{at:9,dur:3});
 [['AI','AI',130,640,cyan,-850],['INTEGRATIONS','</>',540,850,purple,850],['PAYMENTS','$',150,1120,cyan,-800]].forEach(([label,icon,x,y,color,dx],i)=>p.compose(<frame x={x} y={y} width={390} height={290} radius={30} background="#101a25" layout="none" shadow={{x:0,y:0,blur:30,color:color+'55'}} motion={{enter:{from:{x:dx,y:180,scale:.35,rotation:i%2?24:-24},duration:1.25,easing:{kind:'spring',stiffness:220,damping:17,mass:1}},settle:{to:{y:-24,rotation:2},duration:.8,easing:'smooth'},exit:{to:{y:-700,scale:.4,opacity:0},duration:.32,anchor:'end'}}}>
  <rect x={0} y={0} width={390} height={290} radius={30} fill="#101a25" strokeColor={color} strokeWidth={3}/>
  {T(icon,30,28,105,330,color,{align:'center'})}{T(label,30,177,label==='INTEGRATIONS'?45:56,330,white,{align:'center'})}
 </frame>,{at:9+i*.22,dur:3-i*.22}));
 p.compose(<frame x={90} y={460} width={900} height={960} layout="none" animate={[keys('scale',[[0,.2],[.25,1.1],[.48,1],[2.8,1.035],[3,1.02]]),keys('opacity',[[0,0],[.1,1]])]}>
 {T('TAKE A LOOK.',0,0,148,900,white,{align:'center'})}{T('AKUL VARSHNEY',0,220,57,900,'#8d9cae',{align:'center'})}
 <frame x={25} y={460} width={850} height={200} layout="none" radius={100} background={cyan} shadow={{x:0,y:0,blur:65,color:'#5fffe499'}} animate={[keys('scale',[[0,.85],[.5,1],[1.0,1.045],[1.5,1],[2,1.045],[2.5,1],[3,1.025]])]}>{T('LINK IN BIO TO EXPLORE',20,48,62,810,'#071011',{align:'center'})}</frame>
 {T('MY NEW PORTFOLIO IS LIVE',0,770,38,900,cyan,{align:'center'})}
 </frame>,{at:12,dur:3});
 p.compose(Array.from({length:26},(_,i)=>{let angle=i/26*Math.PI*2;return <rect x={540} y={1030} width={5+i%3*3} height={5+i%3*3} radius={3} fill={i%2?cyan:purple} animate={[{property:'offsetX',from:0,to:Math.cos(angle)*850,duration:1.3,easing:'ease-out'},{property:'offsetY',from:0,to:Math.sin(angle)*1000,duration:1.3,easing:'ease-out'},keys('opacity',[[0,0],[.1,1],[1.1,.4],[1.4,0]])]}/>}),{at:12,dur:1.4});
 for(const t of [.4,1.8,3.6,4.8,6.1,7.7,9.8,10.8,13.3])await p.frame(t,`renders/f-${t}.png`);
};
