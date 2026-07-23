import type { DefaultTheme } from 'vitepress'
import sidebarData from './sidebar.json'

// Curated sidebar for the public wiki. The actual data lives in sidebar.json
// so it can be edited from the web CMS (see /admin on the authenticated site)
// as well as by hand. To add a new article: create the .md file in its section
// (docs/<section>/) and add one entry to sidebar.json.
//
// The private overlay (docs/private/) is NOT listed here — its sidebar is
// generated automatically by scanning the directory (see private.ts).

export const sidebar = sidebarData.sections as DefaultTheme.SidebarItem[]
