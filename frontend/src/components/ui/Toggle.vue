<template>
  <label class="toggle" :class="{ 'toggle--disabled': disabled }">
    <input
      type="checkbox"
      class="toggle-input"
      :checked="modelValue"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="toggle-track">
      <span class="toggle-thumb" />
    </span>
    <span v-if="label" class="toggle-label">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  label?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function onChange(e: Event) {
  if (props.disabled) return
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<style scoped>
.toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-10, 10px);
  cursor: pointer;
  user-select: none;
}

.toggle--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-track {
  width: 36px;
  height: 20px;
  background: var(--surface-raised);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-pill);
  position: relative;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
  flex-shrink: 0;
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  background: var(--text-secondary);
  border-radius: 50%;
  transition: transform var(--transition-fast), background-color var(--transition-fast);
}

.toggle-input:checked + .toggle-track {
  background: var(--accent-muted);
  border-color: var(--accent);
}

.toggle-input:checked + .toggle-track .toggle-thumb {
  transform: translateX(16px);
  background: var(--accent);
}

.toggle-label {
  font-size: var(--font-size-body);
  color: var(--text-primary);
}
</style>
