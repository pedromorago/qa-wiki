import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import AISearchButton from './AISearchButton.vue'

// Default theme + one addition: the "✨ AI" pill next to the keyword search
// button, so both ways of finding things live together in the navbar.
export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-before': () => h(AISearchButton),
    })
  },
}
