<template>
  <Transition name="phase-reward">
    <div v-if="collectionStore.showRewardModal && collectionStore.currentReward" class="phase-reward-modal">
      <div class="prm-bg"></div>
      <div class="prm-content">
        <div class="prm-particles">
          <div v-for="i in 40" :key="i" class="prm-particle" :style="getParticleStyle(i)"></div>
        </div>

        <div class="prm-icon-wrap">
          <div class="prm-ring"></div>
          <span class="prm-icon">{{ collectionStore.currentReward.phase.icon }}</span>
        </div>

        <div class="prm-header">
          <div class="prm-badge">🏆 阶段达成</div>
          <h2 class="prm-title">{{ collectionStore.currentReward.phase.name }}</h2>
          <p class="prm-desc">{{ collectionStore.currentReward.phase.description }}</p>
        </div>

        <div class="prm-title-reward">
          <div class="prm-ti-icon">👑</div>
          <div class="prm-ti-info">
            <span class="prm-ti-label">获得称号</span>
            <span class="prm-ti-value">{{ collectionStore.currentReward.reward.title }}</span>
          </div>
        </div>

        <div class="prm-rewards-section">
          <h3 class="prm-section-title">🎁 奖励内容</h3>
          <div class="prm-rewards-grid">
            <div class="prm-reward-card prm-rc-coin">
              <span class="prm-rc-icon">🪙</span>
              <span class="prm-rc-value">+{{ collectionStore.currentReward.reward.coins }}</span>
              <span class="prm-rc-label">金币</span>
            </div>
            <div 
              v-for="matId in collectionStore.currentReward.reward.materials" 
              :key="matId"
              class="prm-reward-card prm-rc-mat"
            >
              <span class="prm-rc-icon">{{ getMatIcon(matId) }}</span>
              <span class="prm-rc-value">{{ getMatName(matId) }}</span>
              <span class="prm-rc-label">材料 x1</span>
            </div>
          </div>
        </div>

        <div class="prm-unlock-card">
          <span class="prm-unlock-icon">🔓</span>
          <div class="prm-unlock-info">
            <span class="prm-unlock-label">新解锁</span>
            <span class="prm-unlock-text">{{ collectionStore.currentReward.reward.unlock }}</span>
          </div>
        </div>

        <button class="prm-claim-btn" @click="handleClose">
          <span>✨</span>
          确认领取
          <span>✨</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useCollectionStore } from '../stores/collectionStore'
import { MATERIAL_SHOP } from '../data/collectionData'

const collectionStore = useCollectionStore()

function getParticleStyle(index) {
  const seed = index * 29
  return {
    left: `${(seed * 11) % 100}%`,
    top: `${(seed * 17) % 100}%`,
    animationDelay: `${(seed % 20) / 10}s`,
    animationDuration: `${3 + (seed % 5)}s`,
    fontSize: `${10 + (seed % 8)}px`
  }
}

function getMatIcon(matId) {
  const mat = MATERIAL_SHOP.find(m => m.id === matId)
  return mat ? mat.icon : '📦'
}

function getMatName(matId) {
  const mat = MATERIAL_SHOP.find(m => m.id === matId)
  return mat ? mat.name : matId
}

function handleClose() {
  collectionStore.closeRewardModal()
}
</script>

<style scoped>
.phase-reward-modal {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.prm-bg {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: 
    radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 100%);
  backdrop-filter: blur(8px);
}

.prm-content {
  position: relative;
  width: 100%;
  max-width: 520px;
  background: linear-gradient(180deg, #2a1f3d 0%, #1f1830 50%, #1a1520 100%);
  border: 2px solid rgba(251, 191, 36, 0.5);
  border-radius: 28px;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 
    0 0 60px rgba(251, 191, 36, 0.25),
    0 20px 60px rgba(0,0,0,0.5);
  overflow: hidden;
}

.prm-particles {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.prm-particle {
  position: absolute;
  animation: particle-float linear infinite;
  opacity: 0;
}

.prm-particle::before {
  content: '✨';
}

@keyframes particle-float {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0.5);
  }
  20% { opacity: 1; }
  80% { opacity: 0.8; }
  100% {
    opacity: 0;
    transform: translateY(-120px) scale(1.2);
  }
}

.prm-icon-wrap {
  position: relative;
  width: 110px;
  height: 110px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prm-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #fbbf24,
    #f59e0b,
    #d97706,
    #fbbf24
  );
  animation: rotate 4s linear infinite;
  filter: blur(4px);
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.prm-icon {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1520, #2a1f3d);
  border-radius: 50%;
  font-size: 3.5rem;
  z-index: 1;
  animation: gentle-bounce 2s ease-in-out infinite;
}

@keyframes gentle-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.prm-header {
  margin-bottom: 1.5rem;
}

.prm-badge {
  display: inline-block;
  padding: 0.4rem 1.2rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #1a1520;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.35);
}

.prm-title {
  font-size: 2rem;
  font-weight: 400;
  letter-spacing: 0.2rem;
  color: #fbbf24;
  margin: 0 0 0.6rem 0;
  text-shadow: 0 0 30px rgba(251, 191, 36, 0.5);
}

.prm-desc {
  font-size: 0.95rem;
  color: #a89878;
  margin: 0;
  line-height: 1.6;
}

.prm-title-reward {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  background: linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.08));
  border: 1px solid rgba(251,191,36,0.35);
  border-radius: 14px;
  margin-bottom: 1.5rem;
}

.prm-ti-icon {
  font-size: 2rem;
}

.prm-ti-info {
  flex: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.prm-ti-label {
  font-size: 0.75rem;
  color: #8a7a5a;
  letter-spacing: 0.05rem;
}

.prm-ti-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #fcd34d;
}

.prm-rewards-section {
  margin-bottom: 1.3rem;
}

.prm-section-title {
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  color: #d4a574;
  font-weight: 500;
  text-align: left;
}

.prm-rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 0.7rem;
}

.prm-reward-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.9rem 0.6rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  animation: reward-pop 0.5s ease-out both;
}

.prm-reward-card:nth-child(1) { animation-delay: 0.1s; }
.prm-reward-card:nth-child(2) { animation-delay: 0.2s; }
.prm-reward-card:nth-child(3) { animation-delay: 0.3s; }
.prm-reward-card:nth-child(4) { animation-delay: 0.4s; }

@keyframes reward-pop {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.prm-reward-card:hover {
  border-color: rgba(251,191,36,0.35);
  background: rgba(251,191,36,0.06);
  transform: translateY(-3px);
}

.prm-rc-coin {
  border-color: rgba(255,215,0,0.3);
  background: rgba(255,215,0,0.06);
}

.prm-rc-icon {
  font-size: 1.8rem;
}

.prm-rc-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e0e0e8;
}

.prm-rc-coin .prm-rc-value {
  color: #ffd700;
  font-size: 1.1rem;
}

.prm-rc-label {
  font-size: 0.72rem;
  color: #7a7a8a;
}

.prm-unlock-card {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.9rem 1.1rem;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  margin-bottom: 1.8rem;
}

.prm-unlock-icon {
  font-size: 1.5rem;
}

.prm-unlock-info {
  flex: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.prm-unlock-label {
  font-size: 0.72rem;
  color: #7a7acc;
}

.prm-unlock-text {
  font-size: 0.88rem;
  color: #a5b4fc;
}

.prm-claim-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
  background-size: 200% 200%;
  border: none;
  border-radius: 14px;
  color: #1a1520;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.1rem;
  cursor: pointer;
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  box-shadow: 0 6px 25px rgba(251, 191, 36, 0.4);
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.prm-claim-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 35px rgba(251, 191, 36, 0.55);
}

.prm-claim-btn:active {
  transform: translateY(-1px) scale(0.99);
}

.phase-reward-enter-active,
.phase-reward-leave-active {
  transition: all 0.4s ease;
}

.phase-reward-enter-from,
.phase-reward-leave-to {
  opacity: 0;
}

.phase-reward-enter-from .prm-content,
.phase-reward-leave-to .prm-content {
  transform: scale(0.85) translateY(30px);
  opacity: 0;
}

.phase-reward-enter-to .prm-content,
.phase-reward-leave-from .prm-content {
  transform: scale(1) translateY(0);
  opacity: 1;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
