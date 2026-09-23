<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-title-row">
        <span class="sidebar-title">PROFILES</span>
        <button class="add-btn" title="New Profile" @click="$emit('new-profile')">
          <Plus :size="14" />
        </button>
      </div>
    </div>

    <div class="profile-list">
      <div
        v-for="profile in profiles"
        :key="profile"
        class="profile-item"
        :class="{ 'profile-item--active': profile === activeProfile }"
        @click="$emit('select-profile', profile)"
      >
        <div class="profile-status">
          <span
            class="status-dot"
            :class="{ 'status-dot--active': profile === activeProfile }"
          />
        </div>
        <span class="profile-name" :title="profile">{{ profile }}</span>
        <button
          class="menu-btn"
          title="Profile Options"
          @click.stop="$emit('open-menu', profile, $event)"
        >
          <MoreHorizontal :size="14" />
        </button>
      </div>

      <div v-if="profiles.length === 0" class="empty-profiles">
        No profiles found
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="profile-actions">
        <button class="action-btn" title="Save Profile" @click="$emit('save-profile')">
          <Save :size="14" />
          <span>Save</span>
        </button>
        <button class="action-btn" title="Save As / Duplicate" @click="$emit('duplicate-profile')">
          <Copy :size="14" />
          <span>Duplicate</span>
        </button>
      </div>
      <div class="profile-actions">
        <button class="action-btn" title="Export Profile" @click="$emit('export-profile')">
          <Download :size="14" />
          <span>Export</span>
        </button>
        <button class="action-btn action-btn--danger" title="Delete Profile" @click="$emit('delete-profile')">
          <Trash2 :size="14" />
          <span>Delete</span>
        </button>
      </div>

      <div class="settings-nav" @click="$emit('open-settings')">
        <Settings :size="16" />
        <span>Settings</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Plus, MoreHorizontal, Save, Copy, Download, Trash2, Settings } from '@lucide/vue'

defineProps<{
  profiles: string[]
  activeProfile?: string
}>()

defineEmits<{
  (e: 'select-profile', name: string): void
  (e: 'new-profile'): void
  (e: 'save-profile'): void
  (e: 'duplicate-profile'): void
  (e: 'export-profile'): void
  (e: 'delete-profile'): void
  (e: 'open-menu', name: string, event: MouseEvent): void
  (e: 'open-settings'): void
}>()
</script>

<style scoped>
.sidebar {
  width: 280px;
  min-width: 280px;
  background-color: var(--bg-sidebar);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
}

.sidebar-header {
  padding: var(--space-16) var(--space-16) var(--space-12);
  border-bottom: 1px solid var(--border);
}

.sidebar-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-title {
  font-size: var(--font-size-small);
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.add-btn {
  background: var(--surface-secondary);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  width: 24px;
  height: 24px;
  border-radius: var(--radius-button);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.add-btn:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
  border-color: var(--border-strong);
}

.profile-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-12) var(--space-8);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-item {
  display: flex;
  align-items: center;
  gap: var(--space-10, 10px);
  padding: 8px 10px;
  border-radius: var(--radius-button);
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.profile-item:hover {
  background: var(--surface-primary);
}

.profile-item--active {
  background: var(--surface-secondary);
}

.profile-status {
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--text-muted);
  transition: background-color var(--transition-fast);
}

.status-dot--active {
  background: var(--accent);
}

.profile-name {
  flex: 1;
  font-size: var(--font-size-body);
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-item--active .profile-name {
  color: var(--text-primary);
  font-weight: 500;
}

.menu-btn {
  opacity: 0;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: all var(--transition-fast);
}

.profile-item:hover .menu-btn {
  opacity: 1;
}

.menu-btn:hover {
  color: var(--text-primary);
  background: var(--surface-hover);
}

.empty-profiles {
  padding: var(--space-16);
  text-align: center;
  font-size: var(--font-size-secondary);
  color: var(--text-muted);
}

.sidebar-footer {
  padding: var(--space-12) var(--space-12);
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  background-color: var(--bg-sidebar);
}

.profile-actions {
  display: flex;
  gap: var(--space-6, 6px);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px var(--space-8);
  background: var(--surface-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-button);
  color: var(--text-secondary);
  font-size: var(--font-size-small);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
  border-color: var(--border-strong);
}

.action-btn--danger:hover {
  background: rgba(226, 109, 114, 0.15);
  color: var(--danger);
  border-color: rgba(226, 109, 114, 0.3);
}

.settings-nav {
  display: flex;
  align-items: center;
  gap: var(--space-10, 10px);
  padding: 8px 12px;
  margin-top: 4px;
  border-radius: var(--radius-button);
  color: var(--text-secondary);
  font-size: var(--font-size-body);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.settings-nav:hover {
  background: var(--surface-primary);
  color: var(--text-primary);
}
</style>
