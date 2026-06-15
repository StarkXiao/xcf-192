<template>
  <div>
    <h1>Test</h1>
    <p>This is a simple test component</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<style scoped>
h1 {
  color: red;
}
</style>
