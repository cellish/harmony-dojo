# 進捗（2026-11-20 時点）

## 今の状態
- main は `fc30ab3`（著作権表示）。origin より1つ先で、**未 push**。
- `docs/INVENTORY.md` を作成済み（未コミット）。書法コア共通化の判断材料。7章「作者のメモ」は空欄のまま、jun が書く。

## 済んだこと（PLAN.md）
1. マイク機器の選択と Bluetooth の注意（`ac69a76`）
2. スピーカー使用時に伴奏をノッチで除去（`55f8381`）
3. 針の落ち着き（平均の長さ）を設定で選ぶ（`a38361f`）
- 著作権表示：LICENSE（All rights reserved）、THIRD_PARTY_NOTICES.md、README の節、各ページの footer（`fc30ab3`）

## 決めたこと
- オープンソースにしない。著作権表示のみ（All rights reserved、© 2026 jun）。
- ビルドなし・ライブラリなしの1ファイル構成を続ける。楽譜は VexFlow を使わず SVG 手描き。
- 音高判定は YIN を続ける。Swift 化しても判定の精度は変わらない。変わるのは入力経路だけ。
- 伴奏の漏れはノッチで除く（既知の周波数だけ）。ドローンと同じピッチクラスの音では数セントずれる。これは許容する。
- push は jun が頼んだときだけ。

## 残りの作業
- PLAN.md 項目4：設定・記録の書き出し／読み込み
- PLAN.md 項目5：判定の確からしさの表示
- PLAN.md 項目6：共通の `audio.js` への切り出し（書法コアの判断と合わせて検討）
- 書法コア：INVENTORY.md 7章を jun が書いたあとで、何を切り出すか決める
- 確認待ち：iPhone での入力機器の選択（実機）、Mac Chrome と iPhone Safari の判定の比較
- `fc30ab3` と docs/ の push（頼まれたら）
