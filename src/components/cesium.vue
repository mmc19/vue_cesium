<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import { onMounted } from '@vue/runtime-core'
const cesium = require('cesium/Cesium')
function initCesium() {
  const viewer = new cesium.Viewer('cesiumContainer')
}
onMounted(() => {
  initCesium()
  console.log(cesium);
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 #cesiumContainer{
  width: 100vw;
  height: 100vh;
 }
</style>
