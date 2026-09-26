import sys,json,zipfile,subprocess,math,bisect
sys.path.insert(0,'/tmp/reel-ffmpeg')
import imageio_ffmpeg
import numpy as np
from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
root=Path(__file__).parent; ff=imageio_ffmpeg.get_ffmpeg_exe(); W,H=1080,1920
p=json.loads(zipfile.ZipFile(root/'editable-project.zip').read('project/project.json'))
groups=[]
def walk(v):
 if isinstance(v,dict):
  if v.get('kind')=='group' and any(c.get('text') in ['UI / UX','CODE','DESIGN'] for c in v.get('children',[])):groups.append(v)
  for x in v.values():walk(x)
 elif isinstance(v,list):
  for x in v:walk(x)
walk(p)
def value(track,t):
 k=track['keyframes']; times=[x['time'] for x in k];i=bisect.bisect_right(times,t)-1
 if i<0:return k[0]['value']
 if i>=len(k)-1:return k[-1]['value']
 a,b=k[i:i+2];f=(t-a['time'])/(b['time']-a['time']);e=a.get('easing',{})
 if e.get('kind')=='cubic-bezier':
  lo,hi=0.,1.
  for _ in range(16):
   z=(lo+hi)/2;x=3*(1-z)**2*z*e['x1']+3*(1-z)*z*z*e['x2']+z**3
   if x<f:lo=z
   else:hi=z
  f=3*(1-z)**2*z*e['y1']+3*(1-z)*z*z*e['y2']+z**3
 return a['value']+(b['value']-a['value'])*f
mapping={
    'UI':'AI',
    'UI / UX':'DEVELOPMENT',
    '</>':'UI / UX',
    'CODE':'ANIMATION',
    '*':'INTEGRATIONS',
    'DESIGN':'PAYMENTS',
}
patches=[]
for g in groups:
 patch=Image.new('RGBA',(390,290));d=ImageDraw.Draw(patch)
 for c in g['children']:
  if c.get('text') not in mapping:continue
  label=mapping[c['text']];y=c['transform']['y']
  size=38 if label in ['DEVELOPMENT','INTEGRATIONS'] else (45 if label=='ANIMATION' else c['fontSize'])
  d.rectangle((22,y-2,368,y+c['size']['height']+8),fill='#101a25')
  font=ImageFont.truetype(str(root/'source/display.ttf'),size)
  d.text((195,y+size*.08),label,font=font,fill=c['fill']['color'],anchor='mt')
 patches.append((g,patch))
dec=subprocess.Popen([ff,'-loglevel','error','-i',str(root/'portfolio-launch-15s.mp4'),'-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
enc=subprocess.Popen([ff,'-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s','1080x1920','-r','30','-i','-','-i',str(root/'portfolio-launch-15s.mp4'),'-map','0:v','-map','1:a','-c:v','libx264','-preset','fast','-crf','18','-c:a','copy','-t','15','-movflags','+faststart',str(root/'portfolio-launch-updated.mp4')],stdin=subprocess.PIPE)
for n in range(450):
 raw=dec.stdout.read(W*H*3)
 if len(raw)!=W*H*3:raise RuntimeError('Incomplete frame')
 t=n/30
 if 9<=t<12:
  im=Image.frombytes('RGB',(W,H),raw).convert('RGBA')
  for g,patch in patches:
   local=t-g['timeRange']['start']
   if not 0<=local<g['timeRange']['duration']:continue
   vals={a['property']:value(a,local) for a in g['animations']};s=vals.get('scale',1);r=math.radians(vals.get('rotation',0));x=g['transform']['x']+vals.get('offsetX',0);y=g['transform']['y']+vals.get('offsetY',0)
   a=math.cos(r)/s;b=math.sin(r)/s;d=-math.sin(r)/s;e=math.cos(r)/s
   layer=patch.transform((W,H),Image.Transform.AFFINE,(a,b,-a*x-b*y,d,e,-d*x-e*y),Image.Resampling.BICUBIC)
   op=vals.get('opacity',1)
   if op<1:layer.putalpha(layer.getchannel('A').point(lambda z:round(z*op)))
   im=Image.alpha_composite(im,layer)
  if n in [279,315]:im.save(root/f'updated-{n}.png')
  raw=im.convert('RGB').tobytes()
 enc.stdin.write(raw)
enc.stdin.close();assert enc.wait()==0;assert dec.wait()==0
print(root/'portfolio-launch-updated.mp4')
