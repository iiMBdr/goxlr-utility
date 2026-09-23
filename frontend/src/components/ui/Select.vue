<template>
  <div class="select-container">
    <label v-if="label" class="select-label">{{ label }}</label>
    <div class="select-wrapper">
      <select
        class="select-input"
        :value="modelValue"
        :disabled="disabled"
        @change="onChange"
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <ChevronDown class="select-chevron" :size="14" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'

export interface SelectOption {
  label: string
  value: string | number
}

const props = defineProps<{
  modelValue: string | number
  options: SelectOption[]
  label?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

function onChange(e: Event) {
  const target = e.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.select-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
}

.select-label {
  font-size: var(--font-size-secondary);
  color: var(--text-secondary);
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select-input {
  width: 100%;
  appearance: none;
  background: var(--surface-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-control);
  padding: 8px 30px 8px 12px;
  font-family: var(--font-family);
  font-size: var(--font-size-body);
  color: var(--text-primary);
  cursor: pointer;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
  outline: none;
}

.select-input:hover:not(:disabled) {
  border-color: var(--border-strong);
  background: var(--surface-hover);
}

.select-input:focus {
  border-color: var(--accent);
}

.select-input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.select-chevron {
  position: absolute;
  right: 10px;
  pointer-events: none;
  color: var(--text-muted);
}
</style>
