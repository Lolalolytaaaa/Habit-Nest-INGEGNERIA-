<template>
  <div class="habit-card" :class="{ 'completed': isDone }">
    <div class="habit-content">
      <div class="habit-icon-box">{{ emoji }}</div>
      <div class="habit-details">
        <h3 class="habit-title">{{ title }}</h3>
        <p class="habit-time">{{ time }}</p>
      </div>
    </div>

    <div class="habit-actions">
      <button class="remove-btn" @click="$emit('remove')" title="Rimuovi abitudine">✕</button>

      <button class="check-button" @click="$emit('toggle')">
        <div class="check-fill" v-if="isDone"></div>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HabitCard',
  props: ['title', 'emoji', 'time', 'isDone'],
  emits: ['remove', 'toggle']
}
</script>

<style scoped>
</style>