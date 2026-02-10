import { build } from 'esbuild'
import fs from 'fs'

async function doBuild() {
  // Build JavaScript
  await build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    outfile: 'dist/bundle.js',
    platform: 'browser',
    sourcemap: false,
    minify: true,
  })

  // Read CSS and JavaScript
  fs.mkdirSync('dist', { recursive: true })
  const css = fs.readFileSync('src/styles.css', 'utf8')
  const js = fs.readFileSync('dist/bundle.js', 'utf8')

  // Create multi-file version
  const multiFileHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Dice Throne Simulator</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <div id="app"></div>
    <script src="bundle.js"></script>
  </body>
</html>`
  fs.writeFileSync('dist/styles.css', css)
  fs.writeFileSync('dist/index.html', multiFileHtml)

  // Create single-file version with inlined CSS and JS
  const singleFileHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Dice Throne Simulator</title>
    <style>
${css}
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script>
${js}
    </script>
  </body>
</html>`
  fs.writeFileSync('dist/index-standalone.html', singleFileHtml)

  console.log('Built dist/index.html (with external CSS/JS)')
  console.log('Built dist/index-standalone.html (single-file standalone)')
}

doBuild().catch(err => { console.error(err); process.exit(1) })
