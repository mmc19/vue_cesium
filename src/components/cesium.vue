<template>
  <div id="cesiumContainer">
    <div class="editButton" v-if="showEditor">
      <el-button type="info" :icon="Coordinate" circle @click="editGeometry('point')"/>
      <el-button type="info" :icon="SemiSelect" circle @click="editGeometry('polyline')"/>
      <el-button type="info" :icon="Cloudy" circle @click="editGeometry('polygon')"/>
      <el-button type="info" :icon="CircleCloseFilled" circle @click="editGeometry('destroy')"/>
      <el-button type="info" :icon="CircleCloseFilled" circle @click="colorChange"/>
    </div>
  </div>

</template>

<script setup>
import { Coordinate, SemiSelect, Cloudy, CircleCloseFilled } from '@element-plus/icons-vue'
import { onMounted, reactive } from '@vue/runtime-core'
import * as Cesium from'cesium/Cesium'
import { drawGeometry, drawPolyline, drawPolygon, drawPoint } from '@/utils/transforms'
const props = defineProps({
  view: {
    type: [],
    default: () => [119, 26]
  },
  showEditor:{
    type: Boolean,
    default: false
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
    imageryProvider: new Cesium.UrlTemplateImageryProvider({
        url: "http://webrd01.is.autonavi.com/appmaptile?&scale=1&lang=zh_cn&style=8&x={x}&y={y}&z={z}",
        minimumLevel: 1,
        maximumLevel: 18
    }),
  })
  viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(props.view[0], props.view[1], 500000)
  })
  // viewer.scene.globe.depthTestAgainstTerrain = true
}
function editGeometry(val) {
  console.log(val);
  drawGeometry(val, viewer)
}
function colorChange() {
  color = Cesium.Color.YELLOW
  console.log(color);
}
let color = reactive(Cesium.Color.RED)
onMounted(() => {
  initCesium()
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 #cesiumContainer{
  position: relative;
  width: 100vw;
  height: 100vh;
 }
 .editButton {
  position: absolute;
  z-index: 999;
  display: flex;
  flex-direction: row;
  justify-content: end;
 }
</style>
