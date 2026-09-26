import numpy as np, wave
sr=44100; dur=30; t=np.arange(sr*dur)/sr; y=np.zeros_like(t); rng=np.random.default_rng(12)
def add(start, x, gain=1):
 i=int(start*sr); n=min(len(x),len(y)-i)
 if n>0:y[i:i+n]+=x[:n]*gain
for b in np.arange(0,30,.5):
 u=np.arange(int(.24*sr))/sr
 add(b,np.sin(2*np.pi*(48*u+8*(1-np.exp(-35*u))))*np.exp(-20*u),.55)
for b in np.arange(.25,29.9,.25):
 u=np.arange(int(.05*sr))/sr; noise=rng.normal(0,1,len(u)); noise=np.r_[0,np.diff(noise)]
 add(b,noise*np.exp(-90*u),.035)
for b in np.arange(.5,30,1):
 u=np.arange(int(.15*sr))/sr; add(b,rng.normal(0,1,len(u))*np.exp(-30*u),.11)
notes=[110,130.8128,164.8138,146.8324]
for i,b in enumerate(np.arange(0,30,.5)):
 u=np.arange(int(.43*sr))/sr; f=notes[(i//8)%4]; env=np.minimum(u/.01,1)*np.exp(-7*u)
 add(b,(np.sin(2*np.pi*f*u)+.25*np.sin(4*np.pi*f*u))*env,.18)
for i,b in enumerate(np.arange(0,30,.25)):
 u=np.arange(int(.34*sr))/sr; f=notes[(i//16)%4]*[4,6,8,6][i%4]
 add(b,np.sin(2*np.pi*f*u)*np.minimum(u/.015,1)*np.exp(-12*u),.09)
y=np.tanh(y)*np.minimum(t/.3,1)*np.minimum((30-t)/1.2,1); y=y/max(abs(y))*.78
stereo=np.stack([y,np.roll(y,160)*.96],axis=1)
with wave.open('/home/user/reel/music.wav','wb') as w:w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes((stereo*32767).astype('<i2').tobytes())
