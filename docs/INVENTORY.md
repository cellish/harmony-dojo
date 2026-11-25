# ハモリ道場 — 中身の一覧（INVENTORY）

道場シリーズで「書法コア」（楽譜表示・声部・和音・規則判定）を共通化するかを決めるための資料。
2026-11-20 時点の main（fc30ab3）のコードを読んで書いた。推測は「（推測）」と明記。

---

## 1. 概要

### アプリ名・目的・主な機能
- 名前：ハモリ道場 / Harmony Dojo（`index.html`、`prefs.js` の `applyAppName`）
- 目的：純正律の音程を、耳（うなり）と声・楽器（ドローンに合わせて歌う／弾く）で身につける。
- ページは2つ＋入口。
  - `listening.html`「聴く」：2音の音程を純正・ピタゴラス・平均律で鳴らし、ずらした音を正しい位置に戻す。うなりの数を表示する。
  - `singing.html`「歌う」：ドローン（主音・和音・タンプーラなど）に合わせて音階の各度を歌う／弾き、マイクで音高を判定する。モードは quiz（出題）、harm（ハモリ：音程・二重唱・コラール）、free、tuner。
  - `index.html`：2つのページへの入口。

### 言語・フレームワーク・ビルド・公開
- 素の HTML / CSS / JavaScript。フレームワークなし、ビルドなし、npm なし。各ページは1ファイルに CSS と JS を内蔵。
- 公開：GitHub Pages（https://cellish.github.io/harmony-dojo/）。PWA（`sw.js`、`manifest*.webmanifest`）。
- 補助ツール：Python（`tools/extract_chorales.py`、music21 を使用）、Node（`tools/pitch-test.js`）。どちらもオフラインで手で動かす。

### ファイル構成
| ファイル | 行数 | 役割 |
|---|---|---|
| `index.html` | 68 | 入口ページ |
| `listening.html` | 902 | 聴く（音程とうなり） |
| `singing.html` | 1837 | 歌う（ドローン、マイク判定、ハモリ、コラール、楽譜） |
| `chorales.js` | 5 | コラールのデータ（`const CHORALES`、生成物） |
| `prefs.js` | 152 | 言語・テーマの共通設定 |
| `sw.js` | 53 | Service Worker |
| `manifest.webmanifest` / `manifest.en.webmanifest` | 21 / 21 | PWA マニフェスト（日・英） |
| `icons/` | — | apple-touch-icon, icon-192, icon-512, icon-maskable-512 |
| `tools/extract_chorales.py` | 53 | music21 コーパスから `chorales.js` を作る |
| `tools/pitch-test.js` | 168 | 音高判定の回帰テスト（合成音） |
| `PLAN.md`・`STATUS.md` | 32(PLAN) | 未完了の作業（項目4〜6）、現状 |
| `README.md` / `LICENSE` / `THIRD_PARTY_NOTICES.md` | — | 説明・著作権 |
| `vendor/bravura/LICENSE.txt` | — | Bravura（SIL OFL）のライセンス文 |

---

## 2. 音楽データの表し方（最重要）

アプリ内で表し方が統一されていない。**場面ごとに4種類の表し方がある**のが最大の特徴。

| 場面 | 音高の表し方 | ファイル・名前 |
|---|---|---|
| 聴く：基準音 | 音名文字列＋周波数 `{n:'A3',f:220.00}` | `listening.html` `LOW_REFS` `HIGH_REFS` |
| 聴く：音程 | 比 `p:q`（純正）、`pp:pq`（ピタゴラス）、`et`（セント） | `listening.html` `INTERVALS` |
| 歌う：音階の度 | 主音からの半音数 `s`（0〜11）＋比 | `singing.html` `DEGREES` |
| 歌う：旋律・二重唱 | 音階内の番号（0=主音、7=1オクターブ上、x.5=半音上） | `PHRASES` `DUETS` |
| 歌う：コラール | MIDI 番号＋全音階位置 `dia`＋変化記号 `alt` | `chorales.js` `chStep` |

### 音高
- MIDI 番号：コラールだけ（`chorales.js`）。
- 音名：
  - `KEYS=['C','C♯/D♭',…]`：調の選択肢。黒鍵は一つにまとめて表示。
  - `NOTE_NAMES=['C','C♯','D','E♭',…]`：チューナー表示。綴りは固定で、異名同音の区別はない。
  - いずれも `singing.html`。
- 異名同音：コラールだけ区別する。`dia`＝オクターブ×7＋音名（C=0…B=6）、`alt`＝−1/0/+1。楽譜の臨時記号はこれで決まる（`renderScore`）。ほかの場面は半音数か比だけなので区別しない。
- 周波数：`tonicHz()`＝音域の基準（65.41 / 130.81 / 261.63 Hz）× 調 × A4/440 × `anchorShift()`。目標の音は `targetCents(d)`（主音からのセント、律で選ぶ）。

### 音価・拍・小節
- コラールだけにある。各ステップに拍数 `d`、小節線 `bar`、フェルマータ `ferm`、声部ごとの「前から持続」`held`。拍子は `meter`（拍数のみ。分母はない）。
- `PHRASES`・`DUETS` には音価がない。一音ずつ、歌えたら次へ進む（`harmAdvance`）。
- `listening.html` には拍の概念がない。

### 声部
- コラール：4声 S, A, T, B。`chStep` が `v[0..3]` を返す。歌う声部は `S.chPart`、残りを鳴らす（`syncChoir`）。
- 二重唱：`{hi:[...], lo:[...]}`。歌う側は `S.part`（'hi'/'lo'）、もう一方は `syncMelody` で鳴らす。
- 音程ハモリ：旋律に対して `HARM_OFF{d3:-2,u3:2,d6:-5}`（音階内で何度ずらすか）。
- 声部名：`VOICE_NAME`。

### 和音
- コードネーム：なし。
- ローマ数字：`CHORDS[set]` の記号（例 'Ⅱm'）と `PROGS`（例 `['I-vi-ii-V-I',['I','vi','ii','V','I']]`）。ドローン和音と進行の選択用。
- 数字付き低音：なし。
- 和音の判定：コラールだけ。`chordOf(pcs,bass)` が4声のピッチクラスから根音を点数で推定する。`CT`（根音からの和音構成音の比）で採点する。
- 和音の音の作り方（`chordInfo`）：根・3度・5度を `[1,1]`、`[5,4]`/`[6,5]`、`[3,2]` で根音比に掛ける。長調の ii の根音は 10:9。

### 調・転調
- 調：`S.key`（0〜11）と `S.set`（'major'/'minor'/'chrom'）、`MODES{dorian}`。
- コラール：`tonic`（0〜11）、`mode`（'major'/'minor'）、`ks`（調号のシャープ数。負ならフラット＝推測）。
- 転調：なし。コラールの純正律は `tuneStep` が各和音の根音から決めるので、転調部分も根音さえ取れれば合う（推測）。調そのものは曲中で変えない。

### 実データ例
```js
// listening.html  INTERVALS の1項目
{id:'M3', name:'長3度', kind:'長', nameE:'major 3rd', kindE:'major', num:3, p:5, q:4, et:400, pp:81, pq:64}
// singing.html  DEGREES の1項目（just/et/pyth は後から付く）
{s:0, sol:'ド', deg:'第1音', name:'主音', solE:'do', degE:'1st', nameE:'tonic', p:1, q:1}
// singing.html  DUETS の1項目（数値は音階内の番号、x.5 は半音上）
['canon', '<日本語名>', '<英語名>', {hi:[...], lo:[...], scale?:...}]
// chorales.js  1ステップ = S,A,T,B の [MIDI, dia, alt] ×4 ＋ [拍数, フラグ]
[67,32,0, 62,29,0, 59,27,0, 43,18,0, 1, 0]
// フラグ：1,2,4,8 = 各声部の持続、16 = 前に小節線、32 = フェルマータ
```

---

## 3. 機能ごとの実装

### 楽譜表示
- `singing.html` の `renderScore()` だけ。VexFlow は使わず、SVG を手で組んでいる。
- 内容：大譜表、調号（`SH`/`FL` の順序）、拍子、音価による符頭、臨時記号、フェルマータで区切ってフレーズ単位でスクロール。拍をクリックするとそこへ移る。
- 音部記号：`G_CLEF` `F_CLEF`（Bravura のグリフのパスをコピーしたもの）。
- 対象はコラールだけ。二重唱・旋律は楽譜でなく `renderPhrase` の階名列で表示する。
- `listening.html` の `drawRuler` は音程の定規（セント軸の SVG）で、楽譜ではない。

### MIDI 入力
なし（`requestMIDIAccess` はない）。

### 音の再生（Web Audio）
- `listening.html`：`TONES` と `makeWave(role)`。うなりに関わる倍音を強める PeriodicWave を作る。`buildOut`（リバーブ）、`startAudio` `stopAudio` `refreshAudio`。
- `singing.html`：
  - 土台：`ensureCtx`（リバーブのバス）。
  - 音色：`organWave` `softWave`、`SPECTRA{hum,cello}` と `startAdditive`（揺らぎ付きの加算合成）、`tanpuraBuffer` `startTanpura`。
  - ドローン：`droneVoices`（和音対応）、`startDrone` `stopDrone`。
  - 伴奏：`syncMelody`（二重唱の相手）、`syncChoir`（コラールの他声部）。
  - 合図：`playHint`、`chime`。
- 両ページに同じ考えの別実装がある：オルガン系の波形、リバーブ、`setAudioSession`、`keepAwake`。

### マイク入力・音高判定
- `singing.html` だけ。
- 入力：`startMic` `stopMic`。`getUserMedia` から AnalyserNode につなぐ。
- 入力機器：`refreshMicDevs` `isBtMic` `micSummary` `renderMicNote`（Bluetooth の警告）。
- 楽器ごとの設定：`PROFILES{voice,cello,violin}`（fmin, fmax, hp, lp, win, oct, jump, bridge, avg）、`profileFor` `applyProfile`。
- 伴奏の除去：`notchTargets` `updateNotches`。ノッチは10個まで、Q 25。スピーカー使用時の quiz/harm だけ。
- 判定：`detect()`。YIN、`MIN_RMS=0.0015`、周期性で有声を判定（0.2/0.35）。
- 追跡：`track(raw,now)`。5点中央値、オクターブ・跳躍の確認、つなぎ、平均窓（`S.steady`）。`trackNoise`、`drawLevel`。
- 回帰テスト：`tools/pitch-test.js` は `detect` と `track` を写して合成音で試す。

### 音程・コード・調の計算
- 比とセント：`gcd`（両ページ）、`normFrac` `withRatio`（singing）、`derive(iv,k)`（listening、複音程）。
- 律：純正・ピタゴラス・平均律。listening は `INTERVALS` の `p:q` `pp:pq` `et`、singing は `DEGREES` と `PYTH`。`targetCents(d)` が律を選ぶ。
- 和音：`chordInfo` `chordName` `buildChordOpts`、`chordOf`、`tuneStep`、`ROOT_R` `CT` `PURE`。
- ハモリの目標：`harmTarget`。鳴っている相手の音との純正音程（`PURE`）から決める。ほかに `harmScale` `idxDeg` `melodyCents` `semis`。

### 規則の判定と採点
- 声部進行の規則（平行5度・8度、限定進行など）の判定：なし。
- 採点は「音程の正確さ」だけ。
  - listening：`verdictOf` `showResult`。合わせたずれをセントで判定する。
  - singing：`S.tol` セント以内に `S.hold` ミリ秒とどまれば合格。途切れの許容は `GAP=180` ms。`holdDevs` の後に `pass()` を呼び、`addStat` で記録する。
- 苦手の出題：`weakWeight`（両ページに別実装）、`addSkip`。

### 課題・問題データ
- listening：`INTERVALS`（12音程）、`LOW_REFS` `HIGH_REFS`、出題方式 `PICKS['fixed','random','weak']`。
- singing：
  - `DEGREES` `SETS` `MODES` `CHORDS` `PROGS` `PHRASES` `DUETS`（org5, org4, fux, canon, twinkle, joy）。
  - `CHORALES`（bwv269, bwv386, bwv302, bwv244）。
- すべてコード内の定数。外部ファイルから読むのは `chorales.js` だけ（`<script>` で読む）。

### ファイル読み書き（MusicXML など）
- アプリ内：なし。
- 開発時のみ：`tools/extract_chorales.py` が music21 の `corpus.parse` から `chorales.js` を書き出す。調は `analyze('key')`、調号は key signature から取る。

### 言語切替
- `prefs.js` が担当。属性 `data-en` `data-en-title` `data-en-aria-label` `data-en-placeholder`、関数 `tr(ja,en)` `isEn` `onLang(fn)` `applyLang`。
- データ側は `name`/`nameE` のように日英を並べる（`INTERVALS` `DEGREES` `DUETS` など）。

### 保存（localStorage）
| キー | ページ | 中身 |
|---|---|---|
| `hd-lang` `hd-theme` | prefs.js | 言語・テーマ |
| `jit-a4` | 両方 | A4 の周波数（`A4_KEY`） |
| `unari-oct` `unari-mode` `unari-tuning` `unari-tone` `unari-pick` | listening | 設定 |
| `unari-history` | listening | 直近15問 |
| `unari-stats` | listening | 音程ごとの成績 `{n,e}`。キーは `tun==='just'?iv.id:` `` `${tun}:${iv.id}` `` |
| `drone-settings` | singing | 設定オブジェクト `S`（`DEF` で既定値を補い、移行処理あり） |
| `drone-stats` | singing | 成績 `{n,sum,abs,e,t,sk}`。キーは律＋（和音）＋度 |
| `drone-stats-open` | singing | 成績表の開閉 |

キーの接頭辞が `hd-` `jit-` `unari-` `drone-` と4系統に分かれている（旧アプリ名の名残。推測）。

### PWA・オフライン
- `sw.js`：`CACHE='harmony-dojo-v2'`。
- 方式：ネット優先（5秒で打ち切ってキャッシュへ）。Google Fonts は stale-while-revalidate。
- 登録：3ページとも末尾で https のときだけ行う。
- マニフェストは日英2つ。`prefs.js` の `applyAppName` が切り替える。

### 著作権表示
- `LICENSE`（All rights reserved、日英）、`THIRD_PARTY_NOTICES.md`、`README.md` の節。
- 画面の下：3ページの `<footer>`（`© 2026 jun　All rights reserved.`）。

---

## 4. 依存関係

### 外部ライブラリ
- JS ライブラリ：なし（CDN も npm もない）。
- フォント：Google Fonts（Shippori Mincho B1、Zen Kaku Gothic New、IBM Plex Mono）を CSS の `<link>` で読む。
- 同梱：Bravura のグリフのパスだけ。`singing.html` に `G_CLEF` `F_CLEF` として埋め込み、ライセンス文は `vendor/bravura/LICENSE.txt`。
- 開発用：music21（Python、`tools/extract_chorales.py`）。版は固定していない。

### 他アプリからコピーしたコード
- 道場シリーズの他アプリ（リハモ道場など）からのコピー：コード内に出典の記載はなく、確かめられない。
- 著作権表示の形はリハモ道場と同じ（add-copyright-notice の手順による）。
- アプリ内のコピー：
  - `listening.html` と `singing.html` の間で、`setAudioSession` `keepAwake` `A4_PRESETS`（同じ値）、A4 の処理、`gcd`、オルガン系の波形とリバーブが重複している。
  - `tools/pitch-test.js` は `detect` と `track` を写したもの。本体を直すとずれる。

---

## 5. 共通化の候補

### 使えそうな部分
- **`prefs.js`（言語・テーマ）**：すでにページ間で共有している。`data-en` 方式は他の道場でもそのまま使える。
- **コラールのデータ形式と抽出ツール**（`chorales.js`、`tools/extract_chorales.py`）
  - MIDI＋全音階位置＋変化記号で異名同音を保つ。音価・小節・フェルマータ・持続も持つ。
  - 書法コアの「声部データ」の土台になりうる。
  - ただしフラグが整数の詰め込みで読みにくい。拍子の分母、休符、タイ、調号の変化、声部交差などの情報はない。
- **楽譜描画 `renderScore`**
  - 依存なしの SVG 大譜表、調号、臨時記号。
  - VexFlow を使う他アプリと合わせるか、こちらを部品にするかの判断が要る。
  - 4声コラール専用の書き方で、関数は大きく `S` や再生状態に依存している（推測）。
- **和音の根音推定 `chordOf` と純正律の割り当て `tuneStep`**
  - 和音分析と「純正でどう取るか」の両方に使える。
- **音程の比・セントの計算**：`gcd` `normFrac` `withRatio` `derive`、律の表。
  - ただし `INTERVALS`（音程が単位）と `DEGREES`（音階の度が単位）で形が違うので、一つの表にまとめ直す必要がある。
- **音高判定 `detect` / `track` / `PROFILES` / ノッチ**
  - 歌や楽器を判定する他アプリで使える。
  - テスト `tools/pitch-test.js` が付いているので、切り出せば二重管理も解消する。
- **Web Audio の土台**：リバーブ、音色、`setAudioSession`、`keepAwake`。PLAN.md 項目6で `audio.js` への切り出しを計画済み。
- **`sw.js` の方式**：ネット優先＋フォントの SWR。

### 固有で共通化しにくい部分
- **うなりの表示**（`beatHz` `updateBeat`、キャンバスのループ、`drawRuler`）：純正音程のうなりに特化している。
- **ドローンの設計**（`droneVoices`、タンプーラ、`anchorShift`、`tonicHz`）：ドローンを鳴らして歌う練習に固有。
- **旋律の表し方**（`PHRASES` `DUETS` の音階番号＋x.5）：音価がなく、調から切り離された相対表記。書法コアの声部データとは別物。変換は可能（推測）。
- **合格判定（とどまる時間と許容セント）**：音程練習のもの。書法の規則判定とは目的が違う。
- **設定オブジェクト `S` と保存キー**：ページ固有で、旧名の接頭辞が混在している。

---

## 6. 既知の問題

### 不具合・制限
- ノッチは、ドローンと同じピッチクラスの音を消すと歌の音まで削る。そのため判定が数セント引っ張られる（項目2の実装時に確認）。
- 落ち着き（平均窓 0.8 s など）を長くすると、短い音では立ち上がりが平均に入る。
- iPhone での入力機器の選択は実機で未確認。
- 作業ディレクトリの `.git` に、削除できなかった一時オブジェクト（tmp_obj）が4つ残っている。動作に影響はない。

### 未完成
- PLAN.md の項目4（設定・記録の書き出し／読み込み）、5（判定の確からしさの表示）、6（共通の `audio.js` への切り出し）が未着手。
- `fc30ab3`（著作権表示）はコミット済みで、まだ push していない。

### TODO
- コード内に `TODO` `FIXME` のコメントはない（grep で確認）。

### 気になる設計
- **音高の表し方が4種類**（音名＋Hz、比、音階番号、MIDI＋dia）。相互の変換関数がない。
- **異名同音を区別するのはコラールだけ**。`NOTE_NAMES` は綴りが固定（E♭、A♭、B♭ など）。
- `singing.html` が 1837 行で、ドローン、マイク、ハモリ、コラール、楽譜、成績が1ファイルに同居している。グローバルの `S` や `harm` に多くの関数が依存する。
- 音程データが `INTERVALS`（listening）と `DEGREES`＋`PURE`＋`ROOT_R`＋`CT`（singing）に分散している。比は一部同じだが表ごとに重複している（増4度は listening が 7:5、`ROOT_R` は 45:32）。
- `tools/pitch-test.js` が本体のコピーで、同期を手で保つ必要がある。
- localStorage の接頭辞が統一されていない（`hd-` `jit-` `unari-` `drone-`）。
- `chorales.js` のステップが位置依存の数値配列で、拡張しにくい（休符・タイ・装飾音を入れる場所がない）。

---

## 7. 作者のメモ

### 共通にしたい部分：

### このアプリに残したい部分：
