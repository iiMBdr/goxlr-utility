<template>
  <header class="titlebar">
    <div class="titlebar-left">
      <div class="logo-mark">
        <span class="logo-goxlr">GoXLR</span>
        <span class="logo-badge">UTILITY</span>
      </div>
    </div>
    <div class="titlebar-center">
      <span class="titlebar-title">{{ currentProfile ? currentProfile : 'GoXLR Configuration' }}</span>
    </div>
    <div class="titlebar-right">
      <button class="win-btn" title="Minimize" @click="$emit('minimize')">
        <Minus :size="12" />
      </button>
      <button class="win-btn" title="Maximize" @click="$emit('maximize')">
        <Square :size="10" />
      </button>
      <button class="win-btn win-btn--close" title="Close" @click="$emit('close')">
        <X :size="12" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Minus, Square, X } from '@lucide/vue'

defineProps<{
  currentProfile?: string
}>()

defineEmits<{
  (e: 'minimize'): void
  (e: 'maximize'): void
  (e: 'close'): void
}>()
</script>

<style scoped>
.titlebar {
  height: 38px;
  background-color: #121618;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-12);
  user-select: none;
  -webkit-app-region: drag;
  flex-shrink: 0;
}

.titlebar-left, .titlebar-right {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  -webkit-app-region: no-drag;
}

.logo-mark {
  display: flex;
  align-items: center;
  gap: 6px;
}

.logo-goxlr {
  font-weight: 700;
  letter-spacing: -0.02em;
  font-size: 14px;
  color: var(--text-primary);
}

.logo-badge {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 2px 5px;
  background: var(--surface-raised);
  color: var(--accent);
  border-radius: 4px;
}

.titlebar-center {
  font-size: var(--font-size-secondary);
  color: var(--text-muted);
  font-weight: 500;
}

.win-btn {
  width: 28px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  border-radius: 4px;
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.win-btn:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.win-btn--close:hover {
  background: var(--danger);
  color: #fff;
}
</style>
