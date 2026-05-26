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
.habit-card {
  background: var(--color-white);
  padding: 16px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(69, 88, 38, 0.05);
  border: 1px solid var(--matcha-soft);
  transition: all 0.3s ease-in-out;
}
.completed {
  opacity: 0.7;
  transform: scale(0.98);
  animation: habit-pop 0.4s ease;
}

@keyframes habit-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(0.98); }
}

.habit-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.habit-icon-box {
  font-size: 24px;
  width: 48px;
  height: 48px;
  background-color: var(--matcha-bg);
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.habit-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--matcha-dark);
}

.habit-time {
  font-size: 13px;
  color: var(--matcha-mid);
  font-weight: 500;
}

.habit-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff5e57;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.4;
  transition: opacity 0.2s, transform 0.2s;
  padding: 4px;
}

.remove-btn:hover {
  opacity: 1;
  transform: scale(1.2);
}

.check-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--matcha-green);
  background: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
}

.check-fill {
  width: 100%;
  height: 100%;
  background-color: var(--matcha-green);
  border-radius: 50%;
  animation: fill-in 0.25s ease-out;
}

@keyframes fill-in {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>