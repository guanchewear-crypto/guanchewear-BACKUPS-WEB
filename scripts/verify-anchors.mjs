import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const componentsDir = resolve(here, '..', 'src', 'components')

const files = readdirSync(componentsDir).filter((name) => name.endsWith('.tsx'))
assert.ok(files.length > 0, 'no components found')

const sources = files.map((name) => ({ name, code: readFileSync(join(componentsDir, name), 'utf8') }))

// Every DOM id we can jump to, across the whole component tree.
const ids = new Set()
for (const { code } of sources) {
  for (const match of code.matchAll(/\bid="([^"]+)"/g)) ids.add(match[1])
}

// Nav menus declare their targets as ['Label', '#anchor'] tuples and pass them
// through a variable, so a plain href="..." scan would miss them entirely.
const ANCHOR_SOURCES = [
  /href=["'](#[^"']*)["']/g,
  /\[\s*['"][^'"]*['"]\s*,\s*['"](#[^'"]+)['"]\s*\]/g,
]

const anchors = []
const routes = []
for (const { name, code } of sources) {
  for (const pattern of ANCHOR_SOURCES) {
    for (const match of code.matchAll(pattern)) anchors.push({ name, href: match[1] })
  }
  for (const match of code.matchAll(/href=["'](\/[^"']*)["']/g)) {
    if (!match[1].startsWith('//')) routes.push({ name, href: match[1] })
  }
}

const broken = anchors.filter(({ href }) => href !== '#' && !ids.has(href.slice(1)))
assert.deepEqual(broken, [], `anchors without a matching id: ${JSON.stringify(broken)}`)

// The standalone AI designer page must no longer be linked from the landing:
// every call to action stays inside the design studio section.
const strays = routes.filter(({ href }) => href === '/diseno')
assert.deepEqual(strays, [], `landing still routes to the designer page: ${JSON.stringify(strays)}`)

const distinct = [...new Set(anchors.map((a) => a.href))].sort()
console.log(`ANCHORS_OK ids=${ids.size} anchors=${anchors.length} distinct=${distinct.length}`)
console.log(`  ${distinct.join(' ')}`)