# 他者の著作物 / Third-Party Notices

ハモリ道場が使っている、他者の著作物とそのライセンスの一覧です。
This file lists third-party works used by Harmony Dojo and their licenses.

## 同梱しているもの / Bundled

| 名前 / Name | 用途 / Use | 権利者 / Rights holder | ライセンス / License | ライセンス文 / License text |
|---|---|---|---|---|
| Bravura(字形の一部 / some glyph outlines) | 歌うページの楽譜で、ト音記号・ヘ音記号の形を描く(字形の輪郭を `singing.html` に写して使用) / Drawing the treble and bass clefs in the score on the Sing page (glyph outlines copied into `singing.html`) | Steinberg Media Technologies GmbH(Reserved Font Name "Bravura") | SIL Open Font License 1.1 | [vendor/bravura/LICENSE.txt](vendor/bravura/LICENSE.txt)(配布元 / from https://github.com/steinbergmedia/bravura) |

## 外部から読み込んでいるもの / Loaded from external services

次のフォントは Google Fonts から読み込んでいるだけで、このリポジトリには含みません。アプリとしてフォントを同梱する場合は、各フォントのライセンス文(OFL.txt)を同梱する必要があります。
These fonts are loaded from Google Fonts and are not included in this repository. If the fonts are ever bundled with the app, each font's license text (OFL.txt) must be bundled too.

| 名前 / Name | 用途 / Use | 権利者 / Rights holder | ライセンス / License |
|---|---|---|---|
| Shippori Mincho B1 | 見出し / Headings | The Shippori Mincho Project Authors | SIL Open Font License 1.1 |
| Zen Kaku Gothic New | 本文 / Body text | The Zen Kaku Gothic Project Authors | SIL Open Font License 1.1 |
| IBM Plex Mono | 数値・記号 / Numbers and labels | IBM Corp.(Reserved Font Name "Plex") | SIL Open Font License 1.1 |

## 収録曲のデータの出典 / Sources of the song data

| 名前 / Name | 用途 / Use | ライセンス / License |
|---|---|---|
| music21 のコーパス(J. S. バッハのコラール BWV 269, 386, 302, 244/62 の譜面データ) / music21 corpus (scores of J. S. Bach chorales BWV 269, 386, 302, 244/62) | `tools/extract_chorales.py` で音の高さと拍だけを取り出し、拍ごとの和音にまとめて `chorales.js` に収録。music21 本体のコードは含まない / Only pitches and beats are extracted with `tools/extract_chorales.py` and reduced to beat-by-beat chords in `chorales.js`; no music21 code is included | music21 本体は BSD 3-Clause。コーパスの譜面は「各曲のライセンスに従う」とされ、使用した4曲のファイルには利用の制限の記載はない。曲そのもの(バッハ、1750年没)は保護期間が終わっている / music21 itself is BSD 3-Clause. Corpus encodings are "under their own licenses"; the four files used carry no usage restriction. The music itself (Bach, d. 1750) is in the public domain |

## このアプリ自身のもの / Made for this app

アイコン(`icons/`)、ドローンや伴奏の音色(プログラムで合成)、「聖歌風の旋律」と各曲の2声目の編曲は、このアプリのために作ったものです。
The icons (`icons/`), the drone and accompaniment sounds (synthesized in code), the "chant-like melody", and the added second parts of the two-part pieces were made for this app.
