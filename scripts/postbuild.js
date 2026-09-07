#!/usr/bin/env node

/**
 * postbuild.js
 *
 * 1. Copies index.html -> 404.html for SPA fallback.
 * 2. Starts a local static server against dist/.
 * 3. Uses Playwright to render every public route.
 * 4. Saves the rendered HTML as dist/<route>/index.html.
 *
 * This gives crawlers route-specific initial HTML while keeping
 * React Router as the client-side application.
 */

import { createServer } from 'http'
import { copyFileSync, existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname, extname, join, normalize } from 'path'
import { fileURLToPath } from 'url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectDir = resolve(__dirname, '..')
const distDir = resolve(projectDir, 'dist')

const indexPath = resolve(distDir, 'index.html')
const notFoundPath = resolve(distDir, '404.html')

const PORT = 4180
const BASE_URL = `http://127.0.0.1:${PORT}`

if (!existsSync(indexPath)) {
  console.error('❌ dist/index.html not found — did the Vite build fail?')
  process.exit(1)
}

/**
 * Public routes that should have route-specific HTML.
 *
 * Blog routes are discovered from blog-data.ts by reading the built
 * application at runtime, so the route list below covers the main
 * static pages while blog routes are added separately when detected.
 */
const STATIC_ROUTES = [
  '/',
  '/badia',
  '/history',
  '/camels',
  '/horses',
  '/sheep',
  '/wasm',
  '/poetry',
  '/coffee',
  '/traditions',
  '/tent',
  '/town',
  '/blog',

  // Blog posts
  '/blog/tribe-history-overview',
  '/blog/camels-heritage',
  '/blog/horses-knightly',
  '/blog/town-izz-din',
  '/blog/wasm-515',
  '/blog/poetry-fakhr',
]

function contentType(filePath) {
  const ext = extname(filePath).toLowerCase()

  const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  }

  return types[ext] || 'application/octet-stream'
}

function startStaticServer() {
  return new Promise((resolveServer) => {
    const server = createServer((req, res) => {
      try {
        let pathname = decodeURIComponent((req.url || '/').split('?')[0])

        if (pathname === '/') {
          pathname = '/index.html'
        }

        let relativePath = pathname.replace(/^\/+/, '')
        let filePath = normalize(join(distDir, relativePath))

        // Prevent escaping dist/.
        if (!filePath.startsWith(normalize(distDir))) {
          res.writeHead(403)
          res.end('Forbidden')
          return
        }

        // Direct static file.
        if (!existsSync(filePath)) {
          // Filesystem-style route: /badia -> /badia/index.html
          filePath = normalize(join(distDir, relativePath, 'index.html'))
        }

        // SPA fallback.
        if (!existsSync(filePath)) {
          filePath = indexPath
        }

        res.writeHead(200, {
          'Content-Type': contentType(filePath),
        })

        res.end(readFileSync(filePath))
      } catch (error) {
        if (!res.headersSent) {
          res.writeHead(500)
          res.end(String(error))
        } else {
          res.end()
        }
      }
    })

    server.listen(PORT, '127.0.0.1', () => {
      console.log(`🌐 Prerender server: ${BASE_URL}`)
      resolveServer(server)
    })
  })
}

async function prerenderRoute(browser, route) {
  const page = await browser.newPage()

  try {
    const url = `${BASE_URL}${route}`

    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 60000,
    })

    const html = await page.content()

    const outputDir = resolve(
      distDir,
      route.replace(/^\/+/, '')
    )

    mkdirSync(outputDir, { recursive: true })

    const outputPath = resolve(outputDir, 'index.html')

    writeFileSync(outputPath, html, 'utf8')

    const title = await page.title()
    const canonical = await page
      .locator('link[rel="canonical"]')
      .first()
      .getAttribute('href')
      .catch(() => null)

    console.log(`✅ ${route}`)
    console.log(`   title: ${title}`)
    console.log(`   canonical: ${canonical}`)
    console.log(`   output: ${outputPath}`)

    return {
      route,
      title,
      canonical,
      outputPath,
    }
  } finally {
    await page.close()
  }
}

async function main() {
  try {
    // Preserve GitHub Pages fallback.
    copyFileSync(indexPath, notFoundPath)
    console.log('✅ Copied index.html → 404.html')

    const server = await startStaticServer()

    let browser

    try {
      browser = await chromium.launch({
        headless: true,
      })

      console.log('\n🚀 Starting prerender...\n')

      for (const route of STATIC_ROUTES) {
        await prerenderRoute(browser, route)
      }

      console.log('\n✅ Static prerender completed.')
    } finally {
      if (browser) {
        await browser.close()
      }

      await new Promise((resolveClose) => server.close(resolveClose))
    }
  } catch (error) {
    console.error('\n❌ Prerender failed:')
    console.error(error)
    process.exit(1)
  }
}

main()
