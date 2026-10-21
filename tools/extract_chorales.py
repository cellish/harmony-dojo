# バッハのコラール(music21 の公開コーパス)を、拍ごとの4声の和音に変換して JS のデータにする
# 使い方: pip install music21 のあと python tools/extract_chorales.py > 出力(先頭の説明コメントを付けて chorales.js にする)
# 出力: 声部ごとに [MIDI, 譜表上の位置(オクターヴ×7+音名 C=0…B=6), 変化記号(-1,0,1)] を S,A,T,B の順に並べ、続けて [長さ(拍), フラグ]。フラグ: 1,2,4,8=各声部が前から持続 / 16=この拍の前に小節線 / 32=フェルマータ
import json, sys
from music21 import corpus, expressions

PIECES=[
  ('bwv269','bach/bwv269','Aus meines Herzens Grunde','Aus meines Herzens Grunde'),
  ('bwv386','bach/bwv386','Nun danket alle Gott(いざやともに)','Nun danket alle Gott'),
  ('bwv302','bach/bwv302','Ein feste Burg(神はわがやぐら)','Ein feste Burg ist unser Gott'),
  ('bwv244','bach/bwv244.62','Wenn ich einmal soll scheiden(受難コラール)','Wenn ich einmal soll scheiden (Passion Chorale)'),
]
out=[]
for pid,path,ja,en in PIECES:
    s=corpus.parse(path)
    parts=s.parts[:4]
    k=s.analyze('key')
    ks=parts[0].recurse().getElementsByClass('KeySignature')[0].sharps
    ts=parts[0].recurse().getElementsByClass('TimeSignature')[0]
    beats=ts.numerator if ts.denominator==4 else ts.numerator//2
    end=parts[0].highestTime
    # 小節の始まり(弱起の小節も含め、楽譜上のオフセット)
    bars=set(float(m.offset) for m in parts[0].getElementsByClass('Measure'))
    notes=[[n for n in p.flatten().notes] for p in parts]
    def at(v,t):
        for n in notes[v]:
            if n.offset<=t<n.offset+n.quarterLength: return n
        return None
    slices=[]
    t=0.0
    first=min(float(n.offset) for n in notes[0])
    t=first
    while t<end:
        ns=[at(v,t) for v in range(4)]
        if any(n is None for n in ns): t+=1; continue
        held=[n.offset<t for n in ns]
        ferm=any(any(isinstance(e,expressions.Fermata) for e in n.expressions) for n in ns)
        slices.append({'n':[x for n in ns for x in (n.pitch.midi, n.pitch.octave*7+'CDEFGAB'.index(n.pitch.step), int(n.pitch.alter))],'h':held,'bar':t in bars and t!=first,'f':ferm,'d':1})
        t+=1
    # すべての声部が持続している拍は、前の拍にまとめる(二分音符など)
    steps=[]
    for sl in slices:
        if steps and all(sl['h']) and not sl['bar']:
            steps[-1]['d']+=1; steps[-1]['f']=steps[-1]['f'] or sl['f']; continue
        steps.append(sl)
    data=[]
    for st in steps:
        fl=sum((1<<v) for v in range(4) if st['h'][v])+(16 if st['bar'] else 0)+(32 if st['f'] else 0)
        data.append(st['n']+[st['d'],fl])
    out.append({'id':pid,'ja':ja,'en':en,'bwv':path.split('/')[1].replace('bwv','BWV '),'tonic':k.tonic.pitchClass,'mode':k.mode,
                'ks':ks,'meter':beats,'steps':data})
    print(pid,k,'ks',ks,'meter',beats,'steps',len(steps),file=sys.stderr)
print('const CHORALES='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';')
