<template>
  <nav class="top-nav">
    <button
      v-for="page in pages"
      :key="page.id"
      class="nav-tab"
      :class="{ 'nav-tab--active': modelValue === page.id }"
      @click="$emit('update:modelValue', page.id)"
    >
      <span class="nav-label">{{ page.label }}</span>
      <span class="nav-indicator" />
    </button>
  </nav>
</template>

<script setup lang="ts">
export type TabId = 'mic' | 'mixer' | 'configure' | 'lighting' | 'routing' | 'system'

export interface TabItem {
  id: TabId
  label: string
}

defineProps<{
  modelValue: TabId
}>()

defineEmits<{
  (e: 'update:modelValue', id: TabId): void
}>()

const pages: TabItem[] = [
  { id: 'mic', label: 'MIC' },
  { id: 'mixer', label: 'MIXER' },
  { id: 'configure', label: 'CONFIGURE' },
  { id: 'lighting', label: 'LIGHTING' },
  { id: 'routing', label: 'ROUTING' },
  { id: 'system', label: 'SYSTEM' },
]
</script>

<style scoped>
.top-nav {
  display: flex;
  align-items: center;
  gap: var(--space-32);
  padding: 0 var(--space-24);
  height: 44px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-app);
}

.nav-tab {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0 var(--space-4);
  transition: color var(--transition-fast);
}

.nav-label {
  font-size: var(--font-size-body);
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.nav-tab:hover .nav-label {
  color: var(--text-secondary);
}

.nav-tab--active .nav-label {
  color: var(--text-primary);
}

.nav-indicator {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: transparent;
  border-radius: 2px 2px 0 0;
  transition: background-color var(--transition-fast);
}

.nav-tab--active .nav-indicator {
  background: var(--accent);
}
</style>
