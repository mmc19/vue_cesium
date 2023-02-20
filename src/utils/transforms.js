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
let dynamicPositions = []
let floatingPosition
let floatingPoint
export function drawGeometry(type, viewer) {

  let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
  if (type === 'point') {
    // 监听鼠标左键
    handler.setInputAction(function (click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      const earthPosition = viewer.scene.globe.pick(ray, viewer.scene)
      if (Cesium.defined(earthPosition)) {
        if (floatingPoint) {
          viewer.entities.remove(floatingPoint)
          floatingPoint = undefined
        }
       drawPoint(earthPosition, viewer)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    // 监听鼠标移动
    handler.setInputAction(function (movement) {
      const ray = viewer.scene.camera.getPickRay(movement.endPosition)
      const earthPosition = viewer.scene.globe.pick(ray, viewer.scene)
      floatingPosition = earthPosition
      if (!floatingPoint) {
        floatingPoint = drawPoint( floatingPosition, viewer)
      }
      if (Cesium.defined(floatingPoint)) {
        floatingPoint.position.setValue(earthPosition)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    // 监听鼠标右键
    handler.setInputAction(function (click) {
      viewer.entities.remove(floatingPoint)
      floatingPoint = undefined
      handler.destroy()
      handler = null
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
  if (type === 'polyline') {
    dynamicPositions = []
    // 监听鼠标左键
    handler.setInputAction(function (click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      const earthPosition = viewer.scene.globe.pick(ray, viewer.scene)
      dynamicPositions.push(earthPosition)
      if (dynamicPositions.length === 2) {
        drawPolyline(dynamicPositions, viewer)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    // 监听鼠标移动
    handler.setInputAction(function (movement) {
      const ray = viewer.scene.camera.getPickRay(movement.endPosition)
      const earthPosition = viewer.scene.globe.pick(ray, viewer.scene)
      floatingPosition = earthPosition
      if (!floatingPoint) {
        floatingPoint = drawPoint( floatingPosition, viewer)
      }
      if (Cesium.defined(floatingPoint)) {
        floatingPoint.position.setValue(floatingPosition)
        dynamicPositions.pop()
        dynamicPositions.push(floatingPosition)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    // 监听鼠标左键双击
    handler.setInputAction(function (click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      const earthPosition = viewer.scene.globe.pick(ray, viewer.scene)
      floatingPosition = earthPosition
      viewer.entities.remove(floatingPoint)
      floatingPoint = undefined
      handler.destroy()
      handler = null
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    // 监听鼠标右键
    handler.setInputAction(function (click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      const earthPosition = viewer.scene.globe.pick(ray, viewer.scene)
      floatingPosition = earthPosition
      viewer.entities.remove(floatingPoint)
      floatingPoint = undefined
      dynamicPositions.pop()
      if (dynamicPositions.length === 1) {
        alert('请选择两个点以上')
        dynamicPositions.pop()
      }
      handler.destroy()
      handler = null
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
  if (type === 'polygon') {
    dynamicPositions = []
    // 监听鼠标左键
    handler.setInputAction(function (click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      const earthPosition = viewer.scene.globe.pick(ray, viewer.scene)
      dynamicPositions.push(earthPosition)
      if (dynamicPositions.length === 2) {
        drawPolyline(dynamicPositions, viewer)
      }
      if (dynamicPositions.length === 3) {
        drawPolygon(dynamicPositions, viewer)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    // 监听鼠标移动
    handler.setInputAction(function (movement) {
      const ray = viewer.scene.camera.getPickRay(movement.endPosition)
      const earthPosition = viewer.scene.globe.pick(ray, viewer.scene)
      floatingPosition = earthPosition
      if (!floatingPoint) {
        floatingPoint = drawPoint( floatingPosition, viewer)
      }
      if (Cesium.defined(floatingPoint)) {
        floatingPoint.position.setValue(floatingPosition)
        dynamicPositions.pop()
        dynamicPositions.push(floatingPosition)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    // 监听鼠标左键双击
    handler.setInputAction(function (click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      const earthPosition = viewer.scene.globe.pick(ray, viewer.scene)
      floatingPosition = earthPosition
      viewer.entities.remove(floatingPoint)
      floatingPoint = undefined
      handler.destroy()
      handler = null
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    // 监听鼠标右键
    handler.setInputAction(function (click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      const earthPosition = viewer.scene.globe.pick(ray, viewer.scene)
      floatingPosition = earthPosition
      viewer.entities.remove(floatingPoint)
      floatingPoint = undefined
      dynamicPositions.pop()
      if (dynamicPositions.length === 2) {
        alert('请选择两个点以上')
        dynamicPositions.pop()
      }
      handler.destroy()
      handler = null
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
  if (type === 'circle'){
    dynamicPositions = []
    // 监听鼠标左键
    handler.setInputAction(function (click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      const earthPosition = viewer.scene.globe.pick(ray, viewer.scene)
      dynamicPositions.push(earthPosition)
      console.log(dynamicPositions);
      if (dynamicPositions.length === 2) {
        drawCircle(dynamicPositions, viewer)
      }
      if (dynamicPositions.length === 3) {
        viewer.entities.remove(floatingPoint)
        floatingPoint = undefined
        handler.destroy()
        handler = null
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    // 监听鼠标移动
    handler.setInputAction(function (movement) {
      const ray = viewer.scene.camera.getPickRay(movement.endPosition)
      const earthPosition = viewer.scene.globe.pick(ray, viewer.scene)
      floatingPosition = earthPosition
      if (!floatingPoint) {
        floatingPoint = drawPoint( floatingPosition, viewer)
      }
      if (Cesium.defined(floatingPoint)) {
        floatingPoint.position.setValue(floatingPosition)
        dynamicPositions.pop()
        dynamicPositions.push(floatingPosition)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }
  if (type === 'rectangle') {
    dynamicPositions = []
    // 监听鼠标左键
    handler.setInputAction(function (click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      const earthPosition = viewer.scene.globe.pick(ray, viewer.scene)
      dynamicPositions.push(earthPosition)
      console.log(dynamicPositions);
      if (dynamicPositions.length === 2) {
        drawRactangle(dynamicPositions, viewer)
      }
      if (dynamicPositions.length === 3) {
        viewer.entities.remove(floatingPoint)
        floatingPoint = undefined
        handler.destroy()
        handler = null
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    // 监听鼠标移动
    handler.setInputAction(function (movement) {
      const ray = viewer.scene.camera.getPickRay(movement.endPosition)
      const earthPosition = viewer.scene.globe.pick(ray, viewer.scene)
      floatingPosition = earthPosition
      if (!floatingPoint) {
        floatingPoint = drawPoint( floatingPosition, viewer)
      }
      if (Cesium.defined(floatingPoint)) {
        floatingPoint.position.setValue(floatingPosition)
        dynamicPositions.pop()
        dynamicPositions.push(floatingPosition)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }
  if (type === 'destroy') {
    dynamicPositions= []
    viewer.entities.removeAll()
    floatingPoint = undefined
    handler.destroy()
    handler = null
  }
}

/**
 * 绘制点
 * @param { Cartesian3 } position 卡迪尔空间直角坐标
 * @param { Object } viewer
 */
export function drawPoint( position, viewer) {
  return  viewer.entities.add({
    // position: position,
    position: position,
    point: {
      color: new Cesium.CallbackProperty(() => {return Cesium.Color.RED}, false),
      pixelSize: 10
    }
  })
}

/**
 * 绘制线
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


/**
 * 绘制面
 * @param { Cartesian3 } position 卡迪尔空间直角坐标
 * @param { Object } viewer
 */
export function drawPolygon(positions, viewer) {
 return viewer.entities.add({
  polygon: {
    hierarchy: new Cesium.CallbackProperty(() => {
      return new Cesium.PolygonHierarchy(positions)
    }, false),
    material: Cesium.Color.RED.withAlpha(0.7)
  }
 })
}

/**
 * 绘制圆
 * @param { Cartesian3 } position 卡迪尔空间直角坐标
 * @param { Object } viewer
 */
export function drawCircle(positions, viewer) {
  return viewer.entities.add({
    position: positions[0],
    ellipse: {
      semiMinorAxis: new Cesium.CallbackProperty(function () {
        //半径 两点间距离
        var r = Math.sqrt(Math.pow(positions[0].x - positions[positions.length - 1].x, 2) + Math
          .pow(positions[0].y - positions[positions.length - 1].y, 2));
        return r ? r : r + 1;
      }, false),
      semiMajorAxis: new Cesium.CallbackProperty(function () {
        var r = Math.sqrt(Math.pow(positions[0].x - positions[positions.length - 1].x, 2) + Math
          .pow(positions[0].y - positions[positions.length - 1].y, 2));
        return r ? r : r + 1;
      }, false),
      material: Cesium.Color.BLUE.withAlpha(0.5),
      outline: true
    }
  })
}

/**
 * 绘制矩形
 * @param { Cartesian3 } position 卡迪尔空间直角坐标
 * @param { Object } viewer
 */
export function drawRactangle(positions, viewer) {
  return viewer.entities.add({
    rectangle: {
      coordinates: new Cesium.CallbackProperty(() => {
        return new Cesium.Rectangle(positions[0].x, positions[positions.length - 1].y, positions[positions.length - 1].x, positions[0].y)
      }, false),
      material: Cesium.Color.RED.withAlpha(0.5)
    }
  })
}