<template>
  <div class="daily-quests">
    <div class="quests-header">
      <div class="header-left">
        <span class="header-icon">🎯</span>
        <div>
          <div class="header-title">Défis du jour</div>
          <div class="header-sub">{{ completedCount }}/{{ quests.length }} complétés</div>
        </div>
      </div>
      <div class="header-progress-ring" aria-hidden="true">
        <svg viewBox="0 0 36 36" class="ring-svg">
          <circle class="ring-bg" cx="18" cy="18" r="15" />
          <circle
            class="ring-fill"
            cx="18" cy="18" r="15"
            :stroke-dasharray="`${allProgressPercent} 100`"
          />
        </svg>
        <span class="ring-pct">{{ allProgressPercent }}%</span>
      </div>
    </div>

    <div class="quests-list">
      <TransitionGroup name="quest-complete">
        <div
          v-for="quest in quests"
          :key="quest.id"
          class="quest-item"
          :class="{ completed: quest.completed }"
        >
          <div class="quest-icon">{{ quest.icon }}</div>
          <div class="quest-body">
            <div class="quest-title">{{ quest.title }}</div>
            <div class="quest-bar-wrap">
              <div
                class="quest-bar-fill"
                :class="`type-${quest.type}`"
                :style="{ width: `${questPercent(quest)}%` }"
              />
            </div>
            <div class="quest-counts">{{ quest.progress }}/{{ quest.target }}</div>
          </div>
          <div class="quest-reward">
            <span class="quest-xp">+{{ quest.xpReward }} XP</span>
            <Transition name="check-pop">
              <span v-if="quest.completed" class="quest-check">✓</span>
            </Transition>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- All complete message -->
    <Transition name="all-done">
      <div v-if="allDone" class="all-done-banner">
        <span>🏆</span>
        <span>Tous les défis accomplis ! Reviens demain.</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { DailyQuest } from '~/types/mascot'

const props = defineProps<{
  quests: DailyQuest[]
}>()

const completedCount = computed(() =>
  props.quests.filter(q => q.completed).length
)

const allDone = computed(() =>
  props.quests.length > 0 && completedCount.value === props.quests.length
)

const allProgressPercent = computed(() => {
  if (!props.quests.length) return 0
  const totalProgress = props.quests.reduce((sum, q) => sum + questPercent(q), 0)
  return Math.round(totalProgress / props.quests.length)
})

function questPercent(quest: DailyQuest): number {
  if (!quest.target) return 0
  return Math.min(100, Math.round((quest.progress / quest.target) * 100))
}
</script>

<style scoped>
.daily-quests {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

/* ─── Header ──────────────────────────────────────────── */
.quests-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f0fdf4, #ffffff);
}
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.header-icon {
  font-size: 22px;
}
.header-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}
.header-sub {
  font-size: 11px;
  color: #64748b;
}

/* Ring progress */
.header-progress-ring {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ring-svg {
  position: absolute;
  inset: 0;
  transform: rotate(-90deg);
}
.ring-bg {
  fill: none;
  stroke: #e2e8f0;
  stroke-width: 3;
  stroke-linecap: round;
  pathLength: 100;
}
.ring-fill {
  fill: none;
  stroke: #1A7A1A;
  stroke-width: 3;
  stroke-linecap: round;
  pathLength: 100;
  transition: stroke-dasharray 0.6s ease;
}
.ring-pct {
  position: relative;
  font-size: 9px;
  font-weight: 700;
  color: #1A7A1A;
}

/* ─── Quest items ─────────────────────────────────────── */
.quests-list {
  padding: 8px 0;
}

.quest-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  transition: background 0.2s, opacity 0.3s;
}
.quest-item.completed {
  opacity: 0.6;
}
.quest-item:not(.completed):hover {
  background: #f8fafc;
}

.quest-icon {
  font-size: 22px;
  flex-shrink: 0;
}

.quest-body {
  flex: 1;
  min-width: 0;
}
.quest-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 5px;
}
.quest-bar-wrap {
  height: 6px;
  background: #f1f5f9;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 3px;
}
.quest-bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s ease;
}
.quest-bar-fill.type-lesson  { background: #1A7A1A; }
.quest-bar-fill.type-quiz    { background: #8B5CF6; }
.quest-bar-fill.type-streak  { background: #E06510; }
.quest-bar-fill.type-xp      { background: #F0B429; }

.quest-counts {
  font-size: 10px;
  color: #94a3b8;
}

.quest-reward {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}
.quest-xp {
  font-size: 11px;
  font-weight: 700;
  color: #854d0e;
  background: #fef9c3;
  padding: 2px 6px;
  border-radius: 10px;
  white-space: nowrap;
}
.quest-check {
  font-size: 14px;
  color: #1A7A1A;
  font-weight: 900;
}

/* ─── All done banner ─────────────────────────────────── */
.all-done-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f0fdf4;
  border-top: 1px solid #bbf7d0;
  font-size: 12px;
  font-weight: 600;
  color: #15803d;
}

/* ─── Transitions ─────────────────────────────────────── */
.quest-complete-enter-active { animation: quest-in 0.3s ease-out; }
.quest-complete-leave-active { animation: quest-out 0.3s ease-in; }
@keyframes quest-in  { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
@keyframes quest-out { from { opacity: 1; } to { opacity: 0; transform: translateX(8px); } }

.check-pop-enter-active { animation: check-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes check-in { from { transform: scale(0); } to { transform: scale(1); } }

.all-done-enter-active { animation: banner-in 0.4s ease-out; }
@keyframes banner-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
</style>
