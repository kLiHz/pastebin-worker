import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import {toString} from 'mdast-util-to-string'

import {escapeHtml} from './common.js'

const descriptionLimit = 200
const defaultTitle = "Untitled"

function getMetadata(options) {
  return (tree) => {
    if (tree.children.length == 0) return

    const firstChild = tree.children[0]
    // if the document begins with a h1, set its content as the title
    if (firstChild.type == 'heading' && firstChild.depth === 1) {
      options.result.title = escapeHtml(toString(firstChild))

      if (tree.children.length > 1) {
        // description is set as the content of the second node
        const secondChild = tree.children[1]
        options.result.description = escapeHtml(toString(secondChild).slice(0, descriptionLimit))
      }
    } else {
      // no title is set
      // description is set as the content of the first node
      options.result.description = escapeHtml(toString(firstChild).slice(0, descriptionLimit))
    }
  }
}

export function makeMarkdown(content) {
  const metadata = { title: defaultTitle, description: "" }
  const convertedHtml = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(getMetadata, { result: metadata })  // result is written to `metadata` variable
    .use(remarkRehype)
    .use(rehypeStringify)
    .processSync(content)

  return `<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
  <title>${metadata.title}</title>
  ${metadata.description.length > 0 ? `<meta name='description' content='${metadata.description}'>` : ""}
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown.css" integrity="sha512-LX/J+iRwkfRqaipVsfmi2B1S7xrqXNHdTb6o4tWe2Ex+//EN3ifknyLIbX5f+kC31zEKHon5l9HDEwTQR1H8cg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
  <script id="MathJax-script" async
          src="https://cdn.jsdelivr.net/npm/mathjax@4.0.0-beta.3/tex-mml-chtml.js">
  </script>
</head>
<body class="markdown-body">
  <style>
    .markdown-body {
      box-sizing: border-box;
      min-width: 200px;
      max-width: 980px;
      margin: 0 auto;
      padding: 45px;
    }

    @media (max-width: 767px) {
      .markdown-body {
        padding: 15px;
      }
    }

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
	color: var(--color-prettylights-syntax-comment);
}

.token.punctuation {
	color: #999;
}

.token.namespace {
	opacity: .7;
}

.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted {
	color: var(--color-prettylights-syntax-constant);;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
	color: var(--color-prettylights-syntax-string);
}

.token.operator,
.language-css .token.string,
.style .token.string {
	color: var(--color-prettylights-syntax-keyword);
}

.token.entity,
.token.url {
  color: var(--color-prettylights-syntax-entity);
}

.token.atrule,
.token.attr-value,
.token.keyword {
	color: var(--color-prettylights-syntax-keyword);
}

.token.function,
.token.class-name {
	color: var(--color-prettylights-syntax-keyword);
}

.token.regex {
  color: var(--color-prettylights-syntax-string-regexp);
}

.token.important,
.token.variable {
  color: var(--color-prettylights-syntax-variable);
}

.token.important,
.token.bold {
	font-weight: bold;
  color: var(--color-prettylights-syntax-markup-bold);
}
.token.italic {
	font-style: italic;
  color: var(--color-prettylights-syntax-markup-italic);
}

.token.entity {
	cursor: help;
}
  </style>
<article>
${convertedHtml}
</article>
  <script src='https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js'></script>
  <script src='https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js'></script>
</html>
`
}
