<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<template>
  <a class="ai-btn" :href="withBase('/search')" aria-label="AI semantic search" title="Search by meaning (AI)">
    <span class="ai-btn__icon">✨</span>
    <span class="ai-btn__label">AI</span>
  </a>
</template>

<style scoped>
/* Styled to sit as a sibling of the VPNavBarSearch button */
.ai-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 8px;
  padding: 4px 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  transition: border-color 0.25s, color 0.25s;
}
.ai-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}
@media (max-width: 767px) {
  .ai-btn__label {
    display: none;
  }
  .ai-btn {
    padding: 4px 8px;
  }
}
</style>
