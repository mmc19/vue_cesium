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
  let floatPoint = {}
  let floatPosition = {}
  let floatPolyline = {}
  let floatPolygon = {}
  let polylinePosition = []
  let lastPolyline = {}
  let lastPolygon = {}
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

  if (type === 'point') {
    // 监听鼠标左键
    handler.setInputAction(function(click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      const position = viewer.scene.globe.pick(ray, viewer.scene)
      if (Object.keys(floatPoint).length !== 0) viewer.entities.remove(floatPoint)
      drawPoint(position, viewer)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // 鼠标移动事件
    handler.setInputAction(function(movement) {
      const ray = viewer.scene.camera.getPickRay(movement.endPosition)
      floatPosition = viewer.scene.globe.pick(ray, viewer.scene)
      if (Object.keys(floatPoint).length !== 0) {
        viewer.entities.remove(floatPoint)
      }

      floatPoint = drawPoint(floatPosition, viewer)
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // 鼠标右键单击停止绘制
    handler.setInputAction(function(click) {
      if (floatPoint) viewer.entities.remove(floatPoint)
      handler.destroy() // 关闭事件句柄
      handler = null
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
  if (type === 'polyline') {
    // 监听鼠标左键
    handler.setInputAction(function(click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      const position = viewer.scene.globe.pick(ray, viewer.scene)
      polylinePosition.push(position)
      // 
      if (polylinePosition.length > 1) {
        if (Object.keys(floatPoint).length !== 0) viewer.entities.remove(floatPoint)
        if (Object.keys(floatPolyline).length !== 0) viewer.entities.remove(floatPolyline)
        lastPolyline = drawPolyline([polylinePosition[polylinePosition.length - 2], polylinePosition[polylinePosition.length - 1]], viewer)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    // 监听鼠标移动
    handler.setInputAction(function(movement) {
      const ray = viewer.scene.camera.getPickRay(movement.endPosition)
      floatPosition = viewer.scene.globe.pick(ray, viewer.scene)

      // 动态点
      if (Object.keys(floatPoint).length !== 0) viewer.entities.remove(floatPoint)
      floatPoint = drawPoint(floatPosition, viewer)

      if (polylinePosition.length >= 1) {  // 动态线
        if (Object.keys(floatPolyline).length !== 0) viewer.entities.remove(floatPolyline)
        floatPolyline = drawPolyline([polylinePosition[polylinePosition.length - 1], floatPosition], viewer)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    // 监听鼠标左键双击
    handler.setInputAction(function(click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      const position = viewer.scene.globe.pick(ray, viewer.scene)
      polylinePosition.push(position)
  
      if (polylinePosition.length > 1) {
        if (Object.keys(floatPoint).length !== 0) viewer.entities.remove(floatPoint)
        if (Object.keys(floatPolyline).length !== 0) viewer.entities.remove(floatPolyline)
        if (Object.keys(lastPolyline).length !== 0) viewer.entities.remove(lastPolyline)
        drawPolyline([polylinePosition[polylinePosition.length - 2], polylinePosition[polylinePosition.length - 1]], viewer)
      }

      handler.destroy() // 关闭事件句柄
      handler = null
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    // 监听鼠标右键单击
    handler.setInputAction(function(click) {
      if (polylinePosition.length > 1) {
        if (Object.keys(floatPoint).length !== 0) viewer.entities.remove(floatPoint)
        if (Object.keys(floatPolyline).length !== 0) viewer.entities.remove(floatPolyline)
      }
      handler.destroy() // 关闭事件句柄
      handler = null
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
  if (type === 'polygon') {
    // 鼠标移动事件
    handler.setInputAction(function(movement) {
      const ray = viewer.scene.camera.getPickRay(movement.endPosition)
      floatPosition = viewer.scene.globe.pick(ray, viewer.scene)

      // 动态点
      if (Object.keys(floatPoint).length !== 0) viewer.entities.remove(floatPoint)
      floatPoint = drawPoint(floatPosition, viewer)
      // 动态线
      if (polylinePosition.length >= 1) {  
        if (Object.keys(floatPolyline).length !== 0) viewer.entities.remove(floatPolyline)
        floatPolyline = drawPolyline([polylinePosition[polylinePosition.length - 1], floatPosition], viewer)
      }
      // 动态面
      if (polylinePosition.length >=2) {
        if (Object.keys(lastPolygon).length !== 0) viewer.entities.remove(lastPolygon)
        if (Object.keys(floatPolygon).length !== 0) viewer.entities.remove(floatPolygon)
        floatPolygon = drawPolygon([polylinePosition.flat(), floatPosition].flat(), viewer)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    // 监听鼠标左键操作
    handler.setInputAction(function(click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      const position = viewer.scene.globe.pick(ray, viewer.scene)
      polylinePosition.push(position)

      if (polylinePosition.length > 1) {
        if (Object.keys(floatPoint).length !== 0) viewer.entities.remove(floatPoint)
        if (Object.keys(floatPolyline).length !== 0) viewer.entities.remove(floatPolyline)
        lastPolyline = drawPolyline([polylinePosition[polylinePosition.length - 2], polylinePosition[polylinePosition.length - 1]], viewer)
      }
      if (polylinePosition.length > 2) {
        if (Object.keys(floatPoint).length !== 0) viewer.entities.remove(floatPoint)
        if (Object.keys(floatPolyline).length !== 0) viewer.entities.remove(floatPolyline)
        if (Object.keys(lastPolygon).length !== 0) viewer.entities.remove(lastPolygon)
        if (Object.keys(floatPolygon).length !== 0) viewer.entities.remove(floatPolygon)
        lastPolygon = drawPolygon(polylinePosition.flat(), viewer)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // 监听鼠标左键双击操作
    handler.setInputAction(function(click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      const position = viewer.scene.globe.pick(ray, viewer.scene)
      polylinePosition.push(position)

      if (polylinePosition.length > 1) {
        if (Object.keys(floatPoint).length !== 0) viewer.entities.remove(floatPoint)
        if (Object.keys(floatPolyline).length !== 0) viewer.entities.remove(floatPolyline)
        lastPolyline = drawPolyline([polylinePosition[polylinePosition.length - 2], polylinePosition[polylinePosition.length - 1]], viewer)
      }
      if (polylinePosition.length > 2) {
        if (Object.keys(floatPoint).length !== 0) viewer.entities.remove(floatPoint)
        if (Object.keys(floatPolyline).length !== 0) viewer.entities.remove(floatPolyline)
        if (Object.keys(lastPolygon).length !== 0) viewer.entities.remove(lastPolygon)
        if (Object.keys(floatPolygon).length !== 0) viewer.entities.remove(floatPolygon)
        lastPolygon = drawPolygon(polylinePosition.flat(), viewer)
      }

        handler.destroy() // 关闭事件句柄
        handler = null
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  }
  if (type === 'destroy') {
    viewer.scene.primitives.removeAll()
  }
}

/**
 * 画点操作
 * @param { Cartesian3 } position 卡迪尔空间直角坐标
 * @param { Object } viewer
 */
export function drawPoint(position, viewer) {
  return  viewer.entities.add({
    position: new Cesium.CallbackProperty(() => {return position}, false),
    point: {
      color: new Cesium.CallbackProperty(() => {return Cesium.Color.RED}, false),
      pixelSize: 10
    }
  })
}

/**
 * 画线操作
 * @param { Cartesian3 } position 卡迪尔空间直角坐标
 * @param { Object } viewer
 */
export function drawPolyline(positions, viewer) {
  return viewer.entities.add({
    polyline: {
      positions: new Cesium.CallbackProperty(() => {return positions}, false),
      material: Cesium.Color.RED,
      width: 2
    }
  })
}


export function drawPolygon(positions, viewer) {
 return viewer.entities.add({
  polygon: {
    hierarchy: {
      positions: positions
    },
    material: Cesium.Color.RED.withAlpha(0.7)
  }
 })
}
