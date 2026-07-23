import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { DefaultTheme } from 'vitepress'
import sidebarData from './sidebar.json'

// Sections and sidebar for the public wiki, derived from sidebar.json — the
// single source of truth, editable from the web CMS (drag & drop included):
//  - sidebar: the groups. Entries whose page doesn't exist yet are filtered
//    out (with a build warning), so a section or link created in the CMS and
//    its pages can arrive in any order without ever breaking the build on a
//    dead link — things appear when both halves exist.
//  - sectionNav: top-menu items for sections that declare `nav` + `dir`,
//    shown once their docs/<dir>/index.md exists.
// The CMS collections for these sections are generated from the same data at
// full-build time (see cms.ts), so creating a section needs no code change.
//
// The private overlay (docs/private/) is NOT listed here — its sidebar is
// generated automatically by scanning the directory (see private.ts).

export interface SidebarSection {
  text: string
  nav?: string
  dir?: string
  collapsed: boolean
  items: { text: string; link: string }[]
}

export const allSections = sidebarData.sections as SidebarSection[]

const DOCS_DIR = fileURLToPath(new URL('..', import.meta.url))

function pageExists(link: string): boolean {
  if (/^[a-z][a-z0-9+.-]*:/i.test(link)) return true // external links pass through
  const rel = (link.endsWith('/') ? `${link}index` : link).replace(/^\//, '')
  return existsSync(join(DOCS_DIR, `${rel}.md`))
}

const visibleSections = allSections.map((section) => ({
  ...section,
  items: section.items.filter((item) => {
    if (pageExists(item.link)) return true
    console.warn(`[sidebar] "${section.text}" › "${item.text}" (${item.link}): page not found — hidden until it exists`)
    return false
  }),
}))

export const sidebar: DefaultTheme.SidebarItem[] = visibleSections
  .filter((s) => s.items.length > 0)
  .map(({ text, collapsed, items }) => ({ text, collapsed, items }))

export const sectionNav: DefaultTheme.NavItem[] = visibleSections
  .filter((s) => s.nav && s.dir && existsSync(join(DOCS_DIR, s.dir, 'index.md')))
  .map((s) => ({ text: s.nav!, link: `/${s.dir}/` }))
