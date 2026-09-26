export default async ({ project }) => {
  const p = await project({dir:'/home/user/reel/project',size:'1080x1920',fps:30,background:'#f8f8f5'});
  const assets = {};
  for (const name of ['portrait','clinic','elaria','lumivolt']) assets[name]=await p.add(`/home/user/reel/${name}.jpg`);
  const ink='#171918', paper='#f8f8f5', orange='#c74624', grey='#91958e';
  const enter=(delay=0)=>[{property:'offsetY',from:70,to:0,at:delay,duration:.55,easing:'house'},{property:'opacity',from:0,to:1,at:delay,duration:.35}];
  const text=(value,x,y,size=80,color=ink,width=880,delay=0,font='Inter')=><text x={x} y={y} width={width} height={size*1.4} fontFamily={font} fontSize={size} fontWeight={font==='Inter'?600:400} color={color} animate={enter(delay)}>{value}</text>;
  const label=(value,y=200,color=orange)=>text(value,90,y,24,color,870,0,'JetBrains Mono');
  const scene=(at,dur,dark,nodes)=>p.compose(<frame x={0} y={0} width={1080} height={1920} layout="none" background={dark?ink:paper} clip={true}>
    <rect x={90} y={158} width={900} height={2} fill={dark?'#404540':'#d4d7d1'}/>
    {nodes}
    <text x={90} y={1640} width={880} height={40} fontFamily="JetBrains Mono" fontSize={22} color={dark?'#a8ada5':'#606460'}>AKUL VARSHNEY / SELECTED WORK</text>
    <rect x={90} y={1700} width={900} height={4} fill={dark?'#404540':'#d4d7d1'}/>
    <rect x={90} y={1700} width={900} height={4} fill={orange} animate={[{property:'scaleX',from:.01,to:1,duration:dur,easing:'linear'}]}/>
  </frame>,{at,dur});
  scene(0,3,false,[label('SOFTWARE / AI / SYSTEMS'),text('AKUL',85,300,190,ink,900,0,'Bebas Neue'),text('VARSHNEY.',85,500,180,ink,920,.12,'Bebas Neue'),
    <media file={assets.portrait} x={490} y={820} width={490} height={690} fit="cover" animate={[{property:'offsetX',from:120,to:0,duration:.7,easing:'house'}]}/>,
    text('I BUILD',90,890,78,ink,390,.3,'Bebas Neue'),text('WHAT',90,990,78,ink,390,.4,'Bebas Neue'),text('COMES',90,1090,78,ink,390,.5,'Bebas Neue'),text('NEXT.',90,1190,78,orange,390,.6,'Bebas Neue')]);
  const web=(at,name,asset,kicker,sub,background=false)=>scene(at,3,background,[label(kicker,200,background?'#e98b6f':orange),text(name,85,320,105,background?paper:ink,920,0,'Bebas Neue'),
    <frame x={90} y={565} width={900} height={680} layout="none" clip={true} background="#ffffff" reveal={{from:'bottom',duration:.6}}><media x={0} y={0} file={assets[asset]} width={900} height={680} fit="cover" animate={[{property:'scale',from:1,to:1.07,duration:3,easing:'linear'}]}/></frame>,
    text(sub,90,1310,39,background?paper:ink,870,.25),text('DESIGNED. BUILT. SHIPPED.',90,1460,24,background?grey:'#606460',880,.4,'JetBrains Mono')]);
  web(3,'CLINIC ERP','clinic','01 / FREELANCE PRODUCT','Appointments. Billing. Operations.');
  web(6,'ELARIA ESTHETIQUE','elaria','02 / CLIENT WEBSITE','A digital home for better care.',true);
  web(9,'LUMIVOLT TECH','lumivolt','03 / CLIENT WEBSITE','A brighter energy future.');
  scene(12,4,true,[label('04 / ORANE CONSULTING',200,'#e98b6f'),text('SYSTEMS',85,325,155,paper,920,0,'Bebas Neue'),text('AT SCALE.',85,500,155,paper,920,.12,'Bebas Neue'),text('100K+',85,760,245,'#e98b6f',920,.25,'Bebas Neue'),text('daily transactions',90,1040,48,paper,890,.4),text('IRCTC RISE / 300+ TRAINS',90,1160,28,grey,900,.5,'JetBrains Mono'),
    ...['API','QUEUE','WORKER','DATA'].map((v,i)=><frame x={90+i*230} y={1350} width={210} height={120} layout="none" background="#29302c" motion={{enter:{from:{y:35,opacity:0},duration:.4,at:i*.15}}}><text x={20} y={40} width={180} height={55} fontFamily="JetBrains Mono" fontSize={26} color={paper}>{v}</text></frame>)]);
  scene(16,4,false,[label('05 / APPLIED AI AT EXL'),text('AI WITH',85,335,165,ink,920,0,'Bebas Neue'),text('CONTEXT.',85,525,165,ink,920,.15,'Bebas Neue'),
    ...[['01','Documents in.'],['02','Inconsistencies flagged.'],['03','Human review.']].map(([n,v],i)=><frame x={90} y={830+i*185} width={900} height={160} layout="none" background={i===2?'#171918':'#e9ebe5'} reveal={{from:'left',at:i*.25,duration:.5}}><text x={30} y={55} width={90} height={50} fontFamily="JetBrains Mono" fontSize={28} color={orange}>{n}</text><text x={140} y={50} width={730} height={65} fontFamily="Inter" fontSize={39} color={i===2?paper:ink}>{v}</text></frame>),text('A person stays in control.',90,1460,32,'#606460',890,.5)]);
  scene(20,3,true,[label('06 / ORANE CONSULTING',200,'#e98b6f'),text('LESS WAIT.',85,350,155,paper,930,0,'Bebas Neue'),text('MORE GO.',85,530,155,paper,930,.1,'Bebas Neue'),text('75%',85,780,265,'#e98b6f',900,.2,'Bebas Neue'),text('faster service responses',90,1090,43,paper,900,.3),text('FLEET OPERATIONS / 500 VEHICLES',90,1240,25,grey,900,.4,'JetBrains Mono'),<rect x={90} y={1390} width={900} height={40} fill="#3b413b"/>,<rect x={90} y={1390} width={900} height={40} fill="#c74624" animate={[{property:'scaleX',from:1,to:.25,at:.5,duration:1,easing:'house'}]}/>]);
  scene(23,3,false,[label('07 / ENTERPRISE PROCUREMENT'),text('CONNECTED',85,340,138,ink,940,0,'Bebas Neue'),text('FROM DAY ONE.',85,500,121,ink,940,.15,'Bebas Neue'),text('BLACKBERRY',90,860,72,ink,900,.2,'Bebas Neue'),text('BIBA',90,1020,72,ink,900,.35,'Bebas Neue'),text('AVAADA',90,1180,72,ink,900,.5,'Bebas Neue'),text('Vendor platforms at Orane Consulting',90,1430,31,'#606460',900,.55)]);
  scene(26,4,true,[label('IDEAS TO WORKING PRODUCTS.',200,'#e98b6f'),text('LET’S',85,400,235,paper,920,0,'Bebas Neue'),text('BUILD.',85,660,235,paper,920,.15,'Bebas Neue'),text('Akul Varshney',90,1110,59,paper,900,.3),text('Software engineer',90,1220,35,grey,900,.4),text('akulv.work@gmail.com',90,1400,39,'#e98b6f',900,.5)]);
  for (const t of [1.5,4.5,7.5,10.5,14,18,21.5,24.5,28]) await p.frame(t,`renders/frame-${t}.png`);
};
