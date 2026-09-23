<template>
  <div class="card" :class="{ 'card--interactive': interactive }">
    <div v-if="title || $slots.header || $slots.action" class="card-header">
      <div class="card-header-left">
        <component :is="icon" v-if="icon" class="card-icon" :size="16" />
        <span v-if="title" class="card-title">{{ title }}</span>
      </div>
      <div v-if="$slots.action" class="card-action">
        <slot name="action" />
      </div>
    </div>
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title?: string
  icon?: Component
  interactive?: boolean
}>()
</script>

<style scoped>
.card {
  background: var(--surface-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  padding: var(--space-16);
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.card--interactive:hover {
  border-color: var(--border-strong);
  background: var(--surface-secondary);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.card-icon {
  color: var(--accent);
  opacity: 0.9;
}

.card-title {
  font-size: var(--font-size-section-title);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-primary);
}

.card-action {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}
</style>
