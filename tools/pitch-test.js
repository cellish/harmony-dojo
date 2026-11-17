/* ハモリ道場: ピッチ検出の回帰テスト(Node で実行。ブラウザ不要)
   使い方:  node tools/pitch-test.js          … 基本シナリオ(清音・残響・ドローン混入)で精度を測る
            node tools/pitch-test.js notch    … ドローン混入にノッチ除去を適用した場合の比較
   中身: singing.html の detect()(YIN法)と track()(中央値・オクターヴ監視・0.3秒平均)を
   そのまま写した実装を、チェロに似せた合成音(倍音・ビブラート・弓雑音・残響・弓返しの谷)に通し、
   音ごとに「表示が落ち着くまでの時間 / 定常時の標準偏差(セント) / オクターヴ誤り / 途切れ」を出す。
   singing.html の検出部を変えたら、ここの該当部分も同じに直してから流すこと。
   2026-11-16 の基準値: 清音・残響で sd 0.3〜0.5c, settle 50〜120ms, oct/drop 0。
   ドローン混入 leak=0.6 で sd 約2.3c に悪化、leak>=1.2 で検出不能。ノッチ除去で leak=2.5 でも sd 0.5c 以下。 */
const SR=48000;

/* ---------- 合成音(チェロ風) ---------- */
function synthNote({f0, dur, vibHz=5.5, vibCents=10, fundAmp=0.3, flutter=0.15, rnd}){
  const n=Math.floor(SR*dur), x=new Float32Array(n);
  const H=Math.min(24,Math.floor(20000/f0));
  const amps=[]; for(let h=1;h<=H;h++) amps.push(h===1?fundAmp:Math.pow(h,-0.9)*(1+0.3*Math.sin(h*2.1)));
  const fl=amps.map(()=>({v:0,tgt:0,cnt:0}));
  let ph=new Float64Array(H);
  for(let i=0;i<n;i++){
    const t=i/SR;
    const f=f0*Math.pow(2,(vibCents*Math.sin(2*Math.PI*vibHz*t))/1200);
    let v=0;
    for(let h=0;h<H;h++){
      ph[h]+=2*Math.PI*f*(h+1)/SR;
      if(--fl[h].cnt<=0){ fl[h].tgt=(rnd()*2-1)*flutter; fl[h].cnt=Math.floor(SR*(0.05+rnd()*0.15)); }
      fl[h].v+=(fl[h].tgt-fl[h].v)*0.0005;
      v+=amps[h]*(1+fl[h].v)*Math.sin(ph[h]);
    }
    const att=Math.min(1,t/0.09), rel=Math.min(1,(dur-t)/0.06);
    const mid=dur/2, dip=1-0.85*Math.exp(-(((t-mid)/0.05)**2));   // 弓返しの音量の谷
    x[i]=v*att*rel*dip;
  }
  return x;
}
function makeScene({notes, snrDb=20, reverb=0.35, droneLeak=0, droneHz=130.8, seed=3}){
  let s=seed; const rnd=()=>((s=s*1103515245+12345>>>0)/4294967296);
  const parts=notes.map(nt=>synthNote({...nt,rnd}));
  const total=parts.reduce((a,p)=>a+p.length,0);
  const x=new Float32Array(total); let off=0;
  for(const p of parts){ x.set(p,off); off+=p.length; }
  let sig=0; for(let i=0;i<total;i++) sig+=x[i]*x[i]; const rmsSig=Math.sqrt(sig/total);
  if(reverb>0){                                   // 簡単な部屋鳴り(コムフィルタ3本)
    const ds=[Math.floor(SR*0.023),Math.floor(SR*0.041),Math.floor(SR*0.057)];
    const y=new Float32Array(total);
    for(const d of ds){ const fb=0.55;
      for(let i=d;i<total;i++) y[i]+=(x[i-d]+y[i-d]*fb)*(reverb/3)*0.8; }
    for(let i=0;i<total;i++) x[i]+=y[i];
  }
  if(droneLeak>0){                                 // スピーカーからのドローン(主音+5度+下のオクターヴ)
    for(let i=0;i<total;i++){ const t=i/SR;
      let v=0; for(const [m,a] of [[1,1],[2,.5],[3,.3],[1.5,.6],[0.5,.5]]) v+=a*Math.sin(2*Math.PI*droneHz*m*t);
      x[i]+=v*rmsSig*droneLeak; }
  }
  const rmsNoise=rmsSig*Math.pow(10,-snrDb/20);
  let lp1=0,lp2=0;
  for(let i=0;i<total;i++){ const w=(rnd()*2-1); lp1+=(w-lp1)*0.25; lp2+=(lp1-lp2)*0.25; x[i]+=(lp1-lp2)*rmsNoise*6; }
  let r2=0; for(let i=0;i<total;i++) r2+=x[i]*x[i]; const g=0.08/Math.sqrt(r2/total);
  for(let i=0;i<total;i++) x[i]*=g;
  return x;
}

/* ---------- singing.html の検出部の写し ---------- */
function makeDetector(P){
  const yinLen=Math.ceil(SR/P.fmin)+4, yinBuf=new Float32Array(yinLen);
  let voiced=false;
  return function(buf){
    const W=Math.round(SR*P.win);
    let rms=0; for(let i=0;i<W;i++) rms+=buf[i]*buf[i]; rms=Math.sqrt(rms/W);
    if(rms<0.0015){ voiced=false; return null; }
    const minT=Math.max(2,Math.floor(SR/P.fmax)), maxT=Math.min(Math.floor(SR/P.fmin),buf.length-W-2,yinLen-2);
    yinBuf[0]=1; let run=0;
    for(let t=1;t<=maxT+1;t++){
      let s=0; for(let i=0;i<W;i++){const d=buf[i]-buf[i+t]; s+=d*d;}
      run+=s; yinBuf[t]=run?s*t/run:1;
    }
    let tau=-1,best=1,bestT=-1;
    for(let t=minT;t<=maxT;t++){
      if(yinBuf[t]<best){best=yinBuf[t]; bestT=t;}
      if(yinBuf[t]<0.15){ while(t+1<=maxT&&yinBuf[t+1]<yinBuf[t]) t++; tau=t; best=yinBuf[t]; break; }
    }
    const lim=voiced?P.v1:P.v0;
    if(best>=lim){ voiced=false; return null; }
    voiced=true; if(tau<0) tau=bestT;
    const a=yinBuf[tau-1],b=yinBuf[tau],c=yinBuf[tau+1];
    const den=a-2*b+c, shift=den?(a-c)/(2*den):0;
    return SR/(tau+Math.max(-1,Math.min(1,shift)));
  };
}
function makeTracker(P){
  const H=[],AV=[]; let lastGood=null,lastGoodT=0,pend=null,pendN=0;
  const cents=(a,b)=>1200*Math.log2(a/b);
  function shown(){ if(!P.avg||!AV.length) return lastGood;
    const now=AV[AV.length-1].t; let sw=0,sl=0;
    AV.forEach(x=>{const w=Math.sin(Math.PI*(now-x.t+16)/(P.avg+32))**2; sw+=w; sl+=w*x.l;});
    return Math.pow(2,sl/sw); }
  return function(raw,now){
    if(raw==null){ if(lastGood&&now-lastGoodT<=P.bridge) return shown();
      H.length=0; AV.length=0; lastGood=null; pend=null; pendN=0; return null; }
    let f=raw;
    if(lastGood){ const d=cents(f,lastGood);
      if(Math.abs(Math.abs(d)-1200)<70){
        if(pend&&Math.abs(cents(f,pend))<70){ if(++pendN<P.oct) f=f*(d>0?.5:2); else {H.length=0; pend=null; pendN=0;} }
        else { pend=f; pendN=1; f=f*(d>0?.5:2); } }
      else if(Math.abs(d)>80){
        if(pend&&Math.abs(cents(f,pend))<50){ if(++pendN<P.jump) return shown(); H.length=0; pend=null; pendN=0; }
        else { pend=f; pendN=1; return shown(); } }
      else { pend=null; pendN=0; } }
    H.push(f); if(H.length>5) H.shift();
    const m=[...H].sort((x,y)=>x-y)[H.length>>1];
    lastGood=m; lastGoodT=now;
    if(!P.avg) return m;
    if(H.length===1) AV.length=0;
    AV.push({t:now,l:Math.log2(m)}); while(AV.length&&now-AV[0].t>P.avg) AV.shift();
    return shown(); };
}

/* ---------- ノッチフィルタ(RBJ)。ドローンの既知周波数を除く実験用 ---------- */
function notch(f0,Q){ const w=2*Math.PI*f0/SR, al=Math.sin(w)/(2*Q), b1=-2*Math.cos(w), a0=1+al;
  const c={b0:1/a0,b1:b1/a0,b2:1/a0,a1:b1/a0,a2:(1-al)/a0,x1:0,x2:0,y1:0,y2:0};
  return x=>{const y=c.b0*x+c.b1*c.x1+c.b2*c.x2-c.a1*c.y1-c.a2*c.y2; c.x2=c.x1;c.x1=x;c.y2=c.y1;c.y1=y; return y;}; }
function applyNotches(sig,freqs,Q){ const y=Float32Array.from(sig);
  for(const f of freqs){ const n=notch(f,Q); for(let i=0;i<y.length;i++) y[i]=n(y[i]); } return y; }

/* ---------- 測定 ---------- */
function run(sig,P,f0s,noteDur){
  const det=makeDetector(P), trk=makeTracker(P);
  const frame=Math.round(SR/60), need=Math.round(SR*P.win)+Math.ceil(SR/P.fmin)+4;
  const out=[];
  for(let end=need; end<sig.length; end+=frame)
    out.push({t:end/SR, f:trk(det(sig.subarray(end-need,end)),end/SR*1000)});
  return f0s.map((f0,k)=>{
    const t0=k*noteDur, t1=(k+1)*noteDur;
    const seg=out.filter(o=>o.t>=t0+0.02&&o.t<t1-0.02);
    const cents=f=>1200*Math.log2(f/f0);
    let settle=null;
    for(let i=0;i<seg.length;i++){
      if(seg[i].f&&Math.abs(cents(seg[i].f))<25){
        let ok=true;
        for(let j=i;j<seg.length&&seg[j].t<seg[i].t+0.2;j++) if(!seg[j].f||Math.abs(cents(seg[j].f))>=25){ok=false;break;}
        if(ok){ settle=seg[i].t-t0; break; } } }
    const steady=seg.filter(o=>o.t>t0+0.5&&o.f);
    const devs=steady.map(o=>cents(o.f)).filter(c=>Math.abs(c)<150);
    const octF=steady.filter(o=>Math.abs(Math.abs(cents(o.f))-1200)<150).length;
    const drops=seg.filter(o=>o.t>t0+0.3&&!o.f).length;
    const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:NaN;
    const sd=a=>{const m=mean(a); return Math.sqrt(mean(a.map(x=>(x-m)*(x-m))))};
    return {settle:settle==null?'FAIL':(settle*1000).toFixed(0)+'ms', sd:sd(devs).toFixed(2), oct:octF, drops};
  });
}
const CELLO={fmin:58,fmax:1400,win:.035,oct:3,jump:2,bridge:120,v0:.25,v1:.4,avg:300};
const NAMES=['G2','D3','A2','E3'], f0s=[98,146.8,110,164.8], dur=2, droneHz=130.8;   // ドローンは C3。音はその部分音と重ねない
const fmt=r=>r.map((x,i)=>`${NAMES[i]}: settle ${x.settle} sd ${x.sd} oct ${x.oct} drop ${x.drops}`).join(' | ');

if(process.argv[2]==='notch'){
  for(const leak of [0.6,1.2,2.5]){
    const sig=makeScene({notes:f0s.map(f0=>({f0,dur})), snrDb:20, reverb:0.5, droneLeak:leak, droneHz});
    const sigN=applyNotches(sig,[0.5,1,1.5,2,3].map(m=>droneHz*m),25);
    console.log(`leak=${leak} そのまま  `, fmt(run(sig ,CELLO,f0s,dur)));
    console.log(`leak=${leak} ノッチあり`, fmt(run(sigN,CELLO,f0s,dur)));
  }
}else{
  for(const [nm,sc] of [
    ['清音',        {notes:f0s.map(f0=>({f0,dur})), snrDb:24, reverb:0}],
    ['残響',        {notes:f0s.map(f0=>({f0,dur})), snrDb:22, reverb:0.5}],
    ['残響+混入0.3',{notes:f0s.map(f0=>({f0,dur})), snrDb:20, reverb:0.5, droneLeak:0.3, droneHz}],
    ['基音弱',      {notes:f0s.map(f0=>({f0,dur,fundAmp:0.12})), snrDb:20, reverb:0.5}],
  ]) console.log(nm.padEnd(10), fmt(run(makeScene(sc),CELLO,f0s,dur)));
}
