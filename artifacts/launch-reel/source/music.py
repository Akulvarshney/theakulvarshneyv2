import numpy as np, wave
sr=44100; dur=15; t=np.arange(sr*dur)/sr; y=np.zeros_like(t); rng=np.random.default_rng(34); beat=60/128

def add(start,x,gain=1):
 i=int(start*sr); n=min(len(x),len(y)-i)
 if n>0:y[i:i+n]+=x[:n]*gain
for i,b in enumerate(np.arange(0,15,beat)):
 u=np.arange(int(.32*sr))/sr; add(b,np.sin(2*np.pi*(48*u+1.5*(1-np.exp(-40*u))))*np.exp(-15*u),.72)
 if i%2:
  u=np.arange(int(.15*sr))/sr; add(b,rng.normal(0,1,len(u))*np.exp(-35*u),.17)
for b in np.arange(beat/2,15,beat/2):
 u=np.arange(int(.065*sr))/sr; n=rng.normal(0,1,len(u)); add(b,np.r_[0,np.diff(n)]*np.exp(-70*u),.042)
for i,b in enumerate(np.arange(beat/2,15,beat)):
 u=np.arange(int(.28*sr))/sr; f=[55,55,65.406,73.416][(i//4)%4]; env=np.minimum(u/.012,1)*np.exp(-11*u)
 add(b,(np.sin(2*np.pi*f*u)+.3*np.sin(4*np.pi*f*u))*env,.35)
for i,b in enumerate(np.arange(0,15,beat/2)):
 u=np.arange(int(.19*sr))/sr; f=220*2**([0,7,12,15,12,7,3,7][i%8]/12)
 add(b,(np.sin(2*np.pi*f*u)+.18*np.sin(4*np.pi*f*u))*np.exp(-22*u),.1)
for b in [0,.94,3,5.2,7.2,9,12]:
 u=np.arange(int(.24*sr))/sr; n=rng.normal(0,1,len(u)); add(b,n*np.exp(-22*u),.09)
for end in [3,9,12]:
 u=np.arange(int(.4*sr))/sr; add(end-.4,rng.normal(0,1,len(u))*(u/.4)**3,.10)
y=np.tanh(y)*np.minimum(t/.025,1)*np.minimum((15-t)/.22,1); y=y/max(abs(y))*.85
with wave.open('/home/user/launch/music.wav','wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.stack([y,np.roll(y,90)*.98],axis=1)*32767).astype('<i2').tobytes())
