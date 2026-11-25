# CLAUDE.md — ハモリ道場

純正律の耳と歌の練習アプリ。公開先：https://cellish.github.io/harmony-dojo/（GitHub Pages、main を直接公開）

## 構成
- 素の HTML/CSS/JS。ビルドなし・npm なし・外部 JS なし（Google Fonts のみ）。
- `listening.html`（聴く）、`singing.html`（歌う）、`index.html`（入口）。各ページは1ファイルに CSS と JS を内蔵。
- 共有：`prefs.js`（言語・テーマ）、`chorales.js`（生成物。手で編集しない）、`sw.js`（PWA）。
- 全体の地図は `docs/INVENTORY.md`。現状は `STATUS.md`、未完了の作業は `PLAN.md`。

## 開発
- 確認：`python3 -m http.server` で開く。マイクには localhost か https が要る。
- 音高判定（`detect` / `track`）を変えたら、`tools/pitch-test.js` にも同じ変更を写す。そのうえで `node tools/pitch-test.js` と `node tools/pitch-test.js notch` を通す。
- コラールの追加：`tools/extract_chorales.py`（music21 が要る）で `chorales.js` を作り直す。
- 画面の文字は日英両方。`data-en` 属性か `tr(ja,en)` を使う。
- 設定を変えたら localStorage のキーを確かめる（`drone-settings` は `DEF` で既定値を補う。移行処理を壊さない）。
- 静的ファイルを追加したら、`sw.js` の `CORE` に加え、`CACHE` の版を上げる。

## 設計方針
- オープンソースにしない。ビルドなし・ライブラリなしの1ファイル構成を続ける。楽譜は VexFlow を使わず SVG 手描き。
- 音高判定は YIN を続ける。`tools/pitch-test.js` の測定で、残響・雑音ありでも標準偏差 0.3〜1.1 セント、オクターヴ誤り・途切れゼロ。
  窓長・しきい値・極小値の選び方を変えても改善しなかったので、**YIN まわりの作り直しはしない**。Swift 化しても判定の精度は変わらない(変わるのは入力経路だけ)。
- 崩れるのはスピーカーからのドローン混入(楽器の 0.6 倍の音量で標準偏差が約7倍)。既知周波数のノッチ除去で防ぐ。
  ドローンと同じピッチクラスの音では数セントずれるが、これは許容する。エコー除去(AEC)まわりは変えない(ノッチ除去が代替)。
- Bluetooth マイク(AirPods 等)は通話用コーデックでピッチがふらつくため、警告を出す。
- `tools/pitch-test.js` の基準: 清音・残響で sd 0.3〜0.5・settle 50〜120ms・oct/drop 0。`notch` は leak=0.6 そのままで sd≈2.3 / ノッチありで sd≤0.5、leak=1.2 そのままは FAIL / ノッチありは正常。

## 決まり
- コミットは日本語で1つにまとめる。1行目は「歌う: …」のようにページ名から書く。
- push は頼まれたときだけ。
- 著作権：All rights reserved（オープンソースにしない）。他者の素材を足したら `THIRD_PARTY_NOTICES.md` に載せる。
- 報告は日本語で。

## ドキュメント更新
- 作業の終わりに STATUS.md を上書き更新（50行以内、updated を更新）
- 完了した作業は PLAN.md から削除し、STATUS の「実装済み」に要約
- 外部素材を追加・削除したら THIRD_PARTY_NOTICES.md を更新
- OS・ブラウザ対応が変わったら STATUS の os: と対応状況を更新（未確認を「対応」と書かない）
- 詳細方針は道場シリーズ親フォルダの DOCS-POLICY.md を参照
