---
app: ハモリ道場(Harmony Dojo)
stage: 公開中          # 構想 / 試作 / 公開中 / 保守
url: https://cellish.github.io/harmony-dojo/
updated: 2026-11-26
---
## 実装済み（要約）
- 聴く(`listening.html`): 2音を同時に鳴らし、唸りが消える純正音程を探す
- 歌う(`singing.html`): 主音のドローンに合わせて歌い、ずれをセント単位で表示(YIN による音高判定)。楽譜は SVG 手描き
- マイク入力の機器選択と Bluetooth マイクの警告、スピーカー使用時の伴奏のノッチ除去、針の落ち着き(平均の長さ)の設定
- 日英2言語、PWA(オフライン可)、著作権表示(All rights reserved、LICENSE・THIRD_PARTY_NOTICES.md・各ページの footer)
- 状態: main は `fc30ab3` 以降。origin より先で未 push(push は頼まれたときだけ)

## 現在の検討事項（主要3件まで）
- 書法コア: docs/INVENTORY.md の7章「作者のメモ」を作者が書いたあと、何を切り出すか決める
- 共通の `audio.js` への切り出し(書法コアの判断と合わせて)
- iPhone での入力機器の選択と、Mac Chrome / iPhone Safari の判定の比較(実機で確認待ち)

## 次の一手（1〜2件）
- 設定・記録の書き出し/読み込み(PLAN 項目4)
- 判定の確からしさの表示(PLAN 項目5)

## 共通部品の状況
- 言語・テーマ(`prefs.js`): 独自実装
- 音高判定(YIN): 独自実装
- 楽譜の描画(SVG 手描き): 独自実装
- Web Audio の土台(リバーブ・音色・`setAudioSession`・`keepAwake`): 独自実装(`audio.js` へ切り出し予定)
