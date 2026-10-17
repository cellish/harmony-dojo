/* ハモリ道場: 表示の設定(全ページ共通) — 言語(日本語 / 英語)とテーマ(自動 / ライト / ダーク)
   head の中で読み込む。テーマは描画前に決めるので、ページを開いたときに色がちらつかない。

   言語
   - 最初の言語: 前に選んだ言語。なければブラウザの言語設定で決める(日本語が英語より先にあれば日本語、それ以外は英語)
   - 固定の文言: HTML の要素に data-en="英語"(HTML も書ける)を付ける。日本語は元の中身をそのまま使う
   - 属性: data-en-title / data-en-aria-label / data-en-placeholder
   - JS で作る文言: tr('日本語','English') で選び、onLang(fn) で言語が変わったときに書き直す
   - ページのスクリプトの最初で applyLang() を呼ぶ(切替ボタンもここで上部に置く)
   - ホーム画面に追加するときのアプリ名も言語に合わせる(manifest を切り替え、iPhone 用の名前も書き換える)

   テーマ
   - auto はシステムの設定に従う。light / dark は <html data-theme="..."> を付け、各ページの CSS が色を切り替える
   - canvas のように CSS だけでは色が変わらないものは、onTheme(fn) で描き直す */
(function(){
  const LANG_KEY='hd-lang', THEME_KEY='hd-theme', ATTRS=['title','aria-label','placeholder'];
  const root=document.documentElement;

  /* ---------- テーマ ---------- */
  const THEME_BG={light:'#EEF1F4', dark:'#12161C'};
  let theme='auto';
  try{ const v=localStorage.getItem(THEME_KEY); if(v==='light'||v==='dark') theme=v; }catch(e){}
  const themeSubs=[];
  function applyTheme(){
    if(theme==='auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme',theme);
    // アドレスバーなどの色: テーマを選んだらその色に、自動ならシステム設定ごとの元の色に戻す
    document.querySelectorAll('meta[name="theme-color"]').forEach(m=>{
      if(!m.dataset.orig) m.dataset.orig=m.content;
      m.content=theme==='auto'?m.dataset.orig:THEME_BG[theme];
    });
  }
  applyTheme();
  function setTheme(t){
    if(t===theme) return;
    theme=t; try{ if(t==='auto') localStorage.removeItem(THEME_KEY); else localStorage.setItem(THEME_KEY,t); }catch(e){}
    applyTheme(); markBar(); themeSubs.forEach(f=>f());
  }
  // 自動のとき、システムの設定が変わったら描き直す
  if(window.matchMedia){ const mq=matchMedia('(prefers-color-scheme: dark)');
    const fn=()=>{ if(theme==='auto') themeSubs.forEach(f=>f()); };
    mq.addEventListener?mq.addEventListener('change',fn):mq.addListener&&mq.addListener(fn); }

  /* ---------- 言語 ---------- */
  function detect(){
    try{ const v=localStorage.getItem(LANG_KEY); if(v==='ja'||v==='en') return v; }catch(e){}
    const ls=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||''];
    for(const l of ls){ const p=String(l).toLowerCase(); if(p.startsWith('ja')) return 'ja'; if(p.startsWith('en')) return 'en'; }
    return 'en';
  }
  let lang=detect(), bar=null;
  const langSubs=[];
  root.lang=lang;
  const tr=(ja,en)=>lang==='en'?en:ja;

  /* ---------- 上部の切替ボタン ---------- */
  const THEMES=[['auto','自動','Auto'],['light','ライト','Light'],['dark','ダーク','Dark']];
  function makeBar(){
    const st=document.createElement('style');
    st.textContent=
      '.topbar{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:8px 12px;margin-bottom:-12px}'+
      '.topbar .seg{display:flex;gap:4px}'+
      '.topbar button{font:inherit;font-size:13px;line-height:1.5;border:1px solid var(--line);background:var(--panel);color:var(--muted);padding:2px 12px;border-radius:999px;cursor:pointer}'+
      '.topbar button[aria-pressed="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}'+
      '.topbar button:focus-visible{outline:2px solid var(--brass);outline-offset:2px}';
    document.head.appendChild(st);
    bar=document.createElement('div'); bar.className='topbar';
    const seg=(cls,items,onPick)=>{
      const g=document.createElement('div'); g.className='seg '+cls; g.setAttribute('role','group');
      items.forEach(([v,lab,l])=>{ const b=document.createElement('button'); b.type='button'; b.dataset.v=v; b.textContent=lab;
        if(l) b.lang=l; b.onclick=()=>onPick(v); g.appendChild(b); });
      bar.appendChild(g); return g;
    };
    seg('theme',THEMES.map(([v])=>[v,'']),setTheme);
    seg('lang',[['ja','日本語','ja'],['en','English','en']],setLang).setAttribute('aria-label','Language / 言語');
    const wrap=document.querySelector('.wrap')||document.body;
    wrap.insertBefore(bar,wrap.firstChild);
  }
  function markBar(){
    if(!bar) return;
    bar.querySelectorAll('.theme button').forEach(b=>{ b.setAttribute('aria-pressed',b.dataset.v===theme);
      const t=THEMES.find(x=>x[0]===b.dataset.v); b.textContent=tr(t[1],t[2]); });
    bar.querySelector('.theme').setAttribute('aria-label',tr('テーマ','Theme'));
    bar.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===lang));
  }
  function applyAppName(){
    const m=document.querySelector('link[rel="manifest"]');
    if(m) m.setAttribute('href',lang==='en'?'manifest.en.webmanifest':'manifest.webmanifest');
    const t=document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if(t) t.content=tr('ハモリ道場','Harmony Dojo');
  }
  applyAppName();
  function apply(){
    root.lang=lang; applyAppName();
    if(!bar) makeBar();
    document.querySelectorAll('[data-en]').forEach(el=>{
      if(el.dataset.ja===undefined) el.dataset.ja=el.innerHTML;
      el.innerHTML=lang==='en'?el.dataset.en:el.dataset.ja;
    });
    ATTRS.forEach(a=>document.querySelectorAll(`[data-en-${a}]`).forEach(el=>{
      if(!el.hasAttribute('data-ja-'+a)) el.setAttribute('data-ja-'+a,el.getAttribute(a)||'');
      el.setAttribute(a,el.getAttribute((lang==='en'?'data-en-':'data-ja-')+a));
    }));
    markBar();
  }
  function setLang(l){
    if(l===lang) return;
    lang=l; try{ localStorage.setItem(LANG_KEY,l); }catch(e){}
    apply(); langSubs.forEach(f=>f());
  }
  window.tr=tr;
  window.isEn=()=>lang==='en';
  window.onLang=f=>langSubs.push(f);
  window.onTheme=f=>themeSubs.push(f);
  window.applyLang=apply;
})();
