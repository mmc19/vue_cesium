<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import { onMounted, reactive } from '@vue/runtime-core'
import * as Cesium from'cesium/Cesium'

const props = defineProps({
  view: {
    type: [],
    default: () => [119, 26]
  }
})
let viewer = reactive()
function initCesium() {
  viewer = new Cesium.Viewer('cesiumContainer',{
    infoBox: false,
    //搜索框
    geocoder: false,
    //home键
    homeButton: false,
    // 动画控件
    animation: false,
    //全屏按钮
    fullscreenButton: false,
    //场景模式选择器
    sceneModePicker: false,
    //时间轴
    timeline: false,
    //导航提示
    navigationHelpButton: false,
    //地图选择器
    baseLayerPicker: false,
  })
  viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(props.view[0], props.view[1], 500000)
  })
  viewer.scene.globe.depthTestAgainstTerrain = true
}
function getPosition() {
}

onMounted(() => {
  initCesium()
  getPosition()
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 #cesiumContainer{
  width: 100vw;
  height: 100vh;
 }
</style>
