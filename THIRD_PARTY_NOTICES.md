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

## 収録している曲の権利 / Status of the pieces included

収録している曲は、次のとおり、著作権の保護期間が終わったもの、またはこのアプリのために作ったものです。歌詞は収録していません。

| 作品 | 作者と没年 | 状態 |
|---|---|---|
| コラール「Aus meines Herzens Grunde」BWV 269 | 和声付け J. S. バッハ(1750年没)。旋律は作者不詳(1598年以前) | 日本・米国とも保護期間終了 |
| コラール「Nun danket alle Gott」BWV 386 | 和声付け バッハ。旋律 ヨハン・クリューガー(1647年出版、1662年没) | 日本・米国とも保護期間終了 |
| コラール「Ein feste Burg」BWV 302 | 和声付け バッハ。旋律 マルティン・ルター(1546年没) | 日本・米国とも保護期間終了 |
| 受難コラール「Wenn ich einmal soll scheiden」BWV 244/62 | 和声付け バッハ。旋律 ハンス・レオ・ハスラー(1601年出版、1612年没) | 日本・米国とも保護期間終了 |
| パッヘルベルのカノン(冒頭の2声) | ヨハン・パッヘルベル(1706年没)。初出版 1919年 | 日本・米国とも保護期間終了 |
| フックスの対位法(第1類・ドリア旋法) | ヨハン・ヨーゼフ・フックス『パルナッソス山への階梯』(1725年、1741年没) | 日本・米国とも保護期間終了 |
| きらきら星 | 作者不詳のフランスの旋律(1761年出版)。2声目はこのアプリの編曲 | 旋律は保護期間終了 |
| よろこびの歌 | ベートーヴェン(1827年没)、交響曲第9番(1824年初演)。2声目はこのアプリの編曲 | 旋律は保護期間終了 |
| メリーさんのひつじ | 今ふつうに歌われる旋律は「Merrily We Roll Along」と同じもの(E. P. クリスティ作とされる「Goodnight, Ladies」、1867年出版) | 日本・米国とも保護期間終了 |
| 聖歌風の旋律(平行オルガヌム) | このアプリのために作った旋律 | 作者自身の作品 |

コラールの譜面データは music21 のコーパスから音の高さと拍だけを取り出したものです(`tools/extract_chorales.py`)。

The pieces included are either in the public domain or were made for this app, as listed below. No lyrics are included.

| Piece | Author (death year) | Status |
|---|---|---|
| Chorale “Aus meines Herzens Grunde”, BWV 269 | Harmonized by J. S. Bach (d. 1750); melody anonymous (before 1598) | Public domain in Japan and the US |
| Chorale “Nun danket alle Gott”, BWV 386 | Harmonized by Bach; melody by Johann Crüger (published 1647, d. 1662) | Public domain in Japan and the US |
| Chorale “Ein feste Burg”, BWV 302 | Harmonized by Bach; melody by Martin Luther (d. 1546) | Public domain in Japan and the US |
| Passion chorale “Wenn ich einmal soll scheiden”, BWV 244/62 | Harmonized by Bach; melody by Hans Leo Hassler (published 1601, d. 1612) | Public domain in Japan and the US |
| Pachelbel’s Canon (opening, two parts) | Johann Pachelbel (d. 1706); first published 1919 | Public domain in Japan and the US |
| Fux, first-species counterpoint (Dorian) | Johann Joseph Fux, *Gradus ad Parnassum* (1725; d. 1741) | Public domain in Japan and the US |
| Twinkle, Twinkle | Anonymous French melody (published 1761); second part arranged for this app | Melody in the public domain |
| Ode to Joy | Beethoven (d. 1827), Symphony No. 9 (premiered 1824); second part arranged for this app | Melody in the public domain |
| Mary Had a Little Lamb | The melody sung today is that of “Merrily We Roll Along” (“Goodnight, Ladies”, attributed to E. P. Christy, published 1867) | Public domain in Japan and the US |
| Chant-like melody (parallel organum) | Written for this app | The author’s own work |

The chorale data consists only of pitches and beats extracted from the music21 corpus (`tools/extract_chorales.py`).
