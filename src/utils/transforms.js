import * as Cesium from'cesium/Cesium'


/**
 * 将迪卡尔空间直角坐标转换为 WGS84 的经纬坐标
 * @param { Cartesian3 } cartesian3 迪卡尔空间直角坐标
 * @return { Array } 返回一个 WGS84 的经纬度坐标
 */
export function cartesian3ToDegrees(cartesian3) {
  const cartographic  = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian3)
  // console.log(cartographic);
  const longitude = Cesium.Math.toDegrees(cartographic.longitude)
  const latitude = Cesium.Math.toDegrees(cartographic.latitude)
  return [longitude, latitude]
}


/**
 * 将经纬度坐标转换为迪卡空间直角坐标
 * @param { Array } coordinate WGS84 经纬度坐标 数组
 * @return { Cartesian3 } 返回一个迪卡尔空间直角坐标
 */
export function degreesToCartesian3(coordinate) {
  const cartesian3 = Cesium.Cartesian3.fromDegrees(coordinate[0], coordinate[1])
  return cartesian3
}

/**
 * @param { String } type 点、线、矩形、圆形(point、polyline、rectangle、circle)
 * @param { Object } viewer
 * @return {*}
 */
export function drawGeometry(type, viewer) {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction(function(click) {
    const ray = viewer.scene.camera.getPickRay(click.position)
    // console.log(ray);
    const cartesian3 = viewer.scene.globe.pick(ray, viewer.scene)
    // console.log(cartesian3);
    const cartographic  = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian3)
    // console.log(cartographic);
    const longitude = Cesium.Math.toDegrees(cartographic.longitude)
    const latitude = Cesium.Math.toDegrees(cartographic.latitude)
    console.log([longitude, latitude]);
    // console.log(Cesium.KeyboardEventModifier);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  if (type === 'point') {
    
  }
}

export function drawPoint(position, viewer) {
  const points = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection())
  points.add({
    position: position,
    color: new Cesium.Color(1, 1, 1, 1)
  })
}

