<template>
  <button class="music-btn" @click="toggleMusic" :title="musicEnabled ? '关闭音乐' : '开启音乐'">
    {{ musicEnabled ? '🔊' : '🔇' }}
  </button>
  <audio ref="audioRef" loop preload="auto">
    <source :src="musicSrc" type="audio/mpeg">
  </audio>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
const audioRef = ref(null)
const musicEnabled = ref(true)

const musicSrc = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQcAQNHWpXYRAPv/+/sA'

const musicLayer = computed(() => gameStore.musicLayer)

function applyMusicLayer() {
  if (!audioRef.value || !musicLayer.value) return
  
  const layer = musicLayer.value
  const baseVolume = musicEnabled.value ? layer.volume : 0
  
  audioRef.value.volume = baseVolume
  audioRef.value.playbackRate = layer.playbackRate
  
  if (layer.filter && layer.filter !== 'none') {
    audioRef.value.style.filter = layer.filter
  } else {
    audioRef.value.style.filter = 'none'
  }
}

watch(musicEnabled, (newVal) => {
  gameStore.musicEnabled = newVal
  if (audioRef.value) {
    if (newVal) {
      applyMusicLayer()
      audioRef.value.play().catch(() => {})
    } else {
      audioRef.value.pause()
    }
  }
})

watch(musicLayer, () => {
  applyMusicLayer()
}, { deep: true })

onMounted(() => {
  musicEnabled.value = gameStore.musicEnabled
  if (audioRef.value && musicEnabled.value) {
    applyMusicLayer()
    const playAudio = () => {
      audioRef.value.play().catch(() => {})
      document.removeEventListener('click', playAudio)
      document.removeEventListener('touchstart', playAudio)
    }
    document.addEventListener('click', playAudio)
    document.addEventListener('touchstart', playAudio)
  }
})

onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
  }
})

function toggleMusic() {
  musicEnabled.value = !musicEnabled.value
}
</script>

<style scoped>
.music-btn {
  position: fixed;
  top: 15px;
  right: 15px;
  z-index: 1000;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.music-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.05);
}

.music-btn:active {
  transform: scale(0.95);
}
</style>
