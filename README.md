# ハモリ道場 (Harmony Dojo)

[日本語](#日本語) | [English](#english)

## 日本語

相対音感とハモリの感覚を育てるための、ブラウザだけで動く練習ページです。

**公開ページ: https://cellish.github.io/harmony-dojo/**

- **ハモリ道場：聴く / Harmony Dojo: Listen** (`listening.html`)：2音を同時に鳴らし、片方を動かして唸りが消える純正音程を探します。
- **ハモリ道場：歌う / Harmony Dojo: Sing** (`singing.html`)：主音のドローンに合わせて指定の音を歌い、ずれをセント単位で表示します。マイクを使います（ヘッドホン推奨）。

表示は日本語と英語に対応しています。最初はブラウザの言語設定で決まり、ホームでは右上のボタン、「聴く」「歌う」では右上の「⚙ 設定」の「表示」欄で切り替えられます。同じ場所で、テーマ(自動・ライト・ダーク)も選べます。選んだ言語とテーマは次回も使われます。

インストールは不要です。iPhone / iPad では Safari で開いて「共有 → ホーム画面に追加」、Android の Chrome ではメニューの「アプリをインストール」で、アプリのように全画面で使えます。一度開けば、ネットにつながっていなくても動きます。

上の公開ページを Chrome / Edge / Safari で開いてください。
マイクは https で配信されたページでのみ使えるため、ローカルで試す場合は `python3 -m http.server` などで localhost から開いてください。

### 著作権・ライセンス

Copyright (c) 2026 jun. All rights reserved.

公開ページでは、誰でも無料で使えます(個人の練習、授業やレッスンでの利用を含みます)。ソースコードは見られるように公開していますが、**オープンソースではありません**。複製・改変・再配布などの条件は [LICENSE](LICENSE) を見てください。

同梱している他者の著作物は、歌うページの楽譜で使っている音部記号の字形(Bravura、SIL Open Font License 1.1)だけです。フォント(Shippori Mincho B1、Zen Kaku Gothic New、IBM Plex Mono。いずれも SIL OFL 1.1)は Google Fonts から読み込んでいます。詳しくは [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) を見てください。

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


## English

Browser-based practice pages for developing relative pitch and a feel for harmony.

**Live site: https://cellish.github.io/harmony-dojo/**

- **Harmony Dojo: Listen** (`listening.html`): Two notes sound together; move one of them to find the just interval where the beating disappears.
- **Harmony Dojo: Sing** (`singing.html`): Sing the given note over a tonic drone and see how far off you are, in cents. Uses the microphone (headphones recommended).

The pages are available in Japanese and English. The language is chosen from your browser settings at first, and you can switch it with the buttons at the top right of the home page, or under “Display” in “⚙ Settings” (top right) on the Listen and Sing pages. The theme (Auto, Light, Dark) can be chosen in the same place. Your choices are remembered for next time.

No installation is needed. On iPhone / iPad, open the site in Safari and choose "Share → Add to Home Screen"; on Android, choose "Install app" from the Chrome menu. It then runs full-screen like an app. Once opened, it also works offline.

Open the live site above in Chrome, Edge or Safari.
The microphone only works on pages served over https, so to try it locally, serve the folder with something like `python3 -m http.server` and open it from localhost.

### Copyright and license

Copyright (c) 2026 jun. All rights reserved.

Anyone may use the app free of charge on the live site, including for personal practice and in classes or lessons. The source code is publicly viewable, but it is **not open source**. See [LICENSE](LICENSE) for the terms on copying, modifying and redistributing it.

The only third-party work bundled with the app is the clef glyphs used in the score on the Sing page (Bravura, SIL Open Font License 1.1). The fonts (Shippori Mincho B1, Zen Kaku Gothic New, IBM Plex Mono; all SIL OFL 1.1) are loaded from Google Fonts. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for details.

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
