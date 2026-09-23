<template>
  <button
    class="btn"
    :class="[
      `btn--${variant || 'default'}`,
      `btn--${size || 'medium'}`,
      { 'btn--active': active, 'btn--icon-only': iconOnly }
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <component :is="icon" v-if="icon" class="btn-icon" :size="iconSize" />
    <span v-if="$slots.default" class="btn-text">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

const props = defineProps<{
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  icon?: Component
  active?: boolean
  disabled?: boolean
  iconOnly?: boolean
}>()

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const iconSize = computed(() => {
  if (props.size === 'small') return 14
  if (props.size === 'large') return 18
  return 16
})
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  border-radius: var(--radius-button);
  font-family: var(--font-family);
  font-size: var(--font-size-body);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
  outline: none;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Sizes */
.btn--small {
  padding: 4px 10px;
  font-size: var(--font-size-secondary);
}

.btn--medium {
  padding: 6px 14px;
  font-size: var(--font-size-body);
}

.btn--large {
  padding: 10px 18px;
  font-size: 14px;
}

.btn--icon-only.btn--small {
  padding: 4px;
}
.btn--icon-only.btn--medium {
  padding: 6px;
}
.btn--icon-only.btn--large {
  padding: 8px;
}

/* Variants */
.btn--default {
  background: var(--surface-secondary);
  border-color: var(--border);
  color: var(--text-primary);
}
.btn--default:hover:not(:disabled) {
  background: var(--surface-hover);
  border-color: var(--border-strong);
}

.btn--primary {
  background: var(--accent);
  color: #0F1315;
  font-weight: 600;
}
.btn--primary:hover:not(:disabled) {
  background: var(--accent-hover);
}

.btn--secondary {
  background: var(--surface-raised);
  border-color: var(--border);
  color: var(--text-secondary);
}
.btn--secondary:hover:not(:disabled) {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.btn--danger {
  background: rgba(226, 109, 114, 0.15);
  border-color: rgba(226, 109, 114, 0.3);
  color: var(--danger);
}
.btn--danger:hover:not(:disabled) {
  background: rgba(226, 109, 114, 0.25);
}

.btn--ghost {
  background: transparent;
  color: var(--text-secondary);
}
.btn--ghost:hover:not(:disabled) {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.btn--active {
  border-color: var(--accent);
  color: var(--accent);
}
</style>
