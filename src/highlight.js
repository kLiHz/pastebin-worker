import { escapeHtml } from "./common.js"

export function makeHighlight(content, lang) {
  return `<!DOCTYPE html>
<html lang='en'>
<head>
  <title>Yet another pastebin</title>
  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
  <meta charset='utf-8'>
  <link href='https://cdn.jsdelivr.net/npm/prismjs@1.23.0/themes/prism-tomorrow.css' rel='stylesheet' />
</head>
<body style="font-size:12px;background-color:black">
<pre><code class='language-${escapeHtml(lang)}'>${escapeHtml(content)}</code></pre>
  <script src='https://cdn.jsdelivr.net/npm/prismjs@1.23.0/components/prism-core.min.js'></script>
  <script src='https://cdn.jsdelivr.net/npm/prismjs@1.23.0/plugins/autoloader/prism-autoloader.min.js'></script>
</body>
</html>
`
}
