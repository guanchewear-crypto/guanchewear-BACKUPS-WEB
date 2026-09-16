import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(here, '..')
const catalogPath = join(projectRoot, 'public', 'garments', 'catalog.json')

assert.ok(existsSync(catalogPath), `Missing garment catalog: ${catalogPath}`)

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'))
assert.equal(Array.isArray(catalog.garments), true, 'catalog.garments must be an array')

const counts = catalog.garments.reduce((result, garment) => {
  result[garment.type] = (result[garment.type] ?? 0) + 1
  return result
}, {})

assert.deepEqual(counts, { camiseta: 18, sudadera: 23 }, 'Unexpected garment counts')

const ids = new Set()
for (const garment of catalog.garments) {
  assert.ok(garment.id, 'Every garment needs an id')
  assert.equal(ids.has(garment.id), false, `Duplicate garment id: ${garment.id}`)
  ids.add(garment.id)
  assert.ok(['camiseta', 'sudadera'].includes(garment.type), `Invalid type: ${garment.type}`)
  assert.ok(garment.label, `Missing label for ${garment.id}`)
  assert.ok(garment.color, `Missing color for ${garment.id}`)
  assert.ok(/^#[0-9a-f]{6}$/i.test(garment.swatch), `Invalid swatch for ${garment.id}`)
  assert.ok(/^\/garments\/[a-z0-9-]+\.webp$/.test(garment.image), `Invalid image path for ${garment.id}`)
  assert.equal(existsSync(join(projectRoot, 'public', garment.image.slice(1))), true, `Missing image: ${garment.image}`)
  assert.equal(typeof garment.price, 'number', `Invalid price for ${garment.id}`)
}

console.log(`GARMENT_CATALOG_OK garments=${catalog.garments.length} camisetas=${counts.camiseta} sudaderas=${counts.sudadera}`)
