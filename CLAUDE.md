# CLAUDE.md — ハモリ道場

純正律の耳と歌の練習アプリ。公開先：https://cellish.github.io/harmony-dojo/（GitHub Pages、main を直接公開）

## 構成
- 素の HTML/CSS/JS。ビルドなし・npm なし・外部 JS なし（Google Fonts のみ）。
- `listening.html`（聴く）、`singing.html`（歌う）、`index.html`（入口）。各ページは1ファイルに CSS と JS を内蔵。
- 共有：`prefs.js`（言語・テーマ）、`chorales.js`（生成物。手で編集しない）、`sw.js`（PWA）。
- 全体の地図は `docs/INVENTORY.md`。進捗は `PROGRESS.md`、作業計画は `PLAN.md`。

## 開発
- 確認：`python3 -m http.server` で開く。マイクには localhost か https が要る。
- 音高判定（`detect` / `track`）を変えたら、`tools/pitch-test.js` にも同じ変更を写す。そのうえで `node tools/pitch-test.js` と `node tools/pitch-test.js notch` を通す。
- コラールの追加：`tools/extract_chorales.py`（music21 が要る）で `chorales.js` を作り直す。
- 画面の文字は日英両方。`data-en` 属性か `tr(ja,en)` を使う。
- 設定を変えたら localStorage のキーを確かめる（`drone-settings` は `DEF` で既定値を補う。移行処理を壊さない）。
- 静的ファイルを追加したら、`sw.js` の `CORE` に加え、`CACHE` の版を上げる。

## 決まり
- コミットは日本語で1つにまとめる。1行目は「歌う: …」のようにページ名から書く。
- push は頼まれたときだけ。
- 著作権：All rights reserved（オープンソースにしない）。他者の素材を足したら `THIRD_PARTY_NOTICES.md` に載せる。
- 報告は日本語で。
