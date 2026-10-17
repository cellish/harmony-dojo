# ハモリ道場 (Harmony Dojo)

[日本語](#日本語) | [English](#english)

## 日本語

相対音感とハモリの感覚を育てるための、ブラウザだけで動く練習ページです。

**公開ページ: https://cellish.github.io/harmony-dojo/**

- **ハモリ道場：聴く / Harmony Dojo: Listen** (`listening.html`)：2音を同時に鳴らし、片方を動かして唸りが消える純正音程を探します。
- **ハモリ道場：歌う / Harmony Dojo: Sing** (`singing.html`)：主音のドローンに合わせて指定の音を歌い、ずれをセント単位で表示します。マイクを使います（ヘッドホン推奨）。

表示は日本語と英語に対応しています。最初はブラウザの言語設定で決まり、各ページ右上のボタンで切り替えられます。同じ場所で、テーマ(自動・ライト・ダーク)も選べます。選んだ言語とテーマは次回も使われます。

インストールは不要です。iPhone / iPad では Safari で開いて「共有 → ホーム画面に追加」、Android の Chrome ではメニューの「アプリをインストール」で、アプリのように全画面で使えます。一度開けば、ネットにつながっていなくても動きます。

上の公開ページを Chrome / Edge / Safari で開いてください。
マイクは https で配信されたページでのみ使えるため、ローカルで試す場合は `python3 -m http.server` などで localhost から開いてください。

## English

Browser-based practice pages for developing relative pitch and a feel for harmony.

**Live site: https://cellish.github.io/harmony-dojo/**

- **Harmony Dojo: Listen** (`listening.html`): Two notes sound together; move one of them to find the just interval where the beating disappears.
- **Harmony Dojo: Sing** (`singing.html`): Sing the given note over a tonic drone and see how far off you are, in cents. Uses the microphone (headphones recommended).

The pages are available in Japanese and English. The language is chosen from your browser settings at first, and you can switch it with the buttons at the top right of each page. The theme (Auto, Light, Dark) can be chosen in the same place. Your choices are remembered for next time.

No installation is needed. On iPhone / iPad, open the site in Safari and choose "Share → Add to Home Screen"; on Android, choose "Install app" from the Chrome menu. It then runs full-screen like an app. Once opened, it also works offline.

Open the live site above in Chrome, Edge or Safari.
The microphone only works on pages served over https, so to try it locally, serve the folder with something like `python3 -m http.server` and open it from localhost.
