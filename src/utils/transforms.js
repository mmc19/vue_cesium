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
  let position = []
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  let temPoints = []
  let polyline = null
  let temPrimitives = []
  if (type === 'point') {
    // 监听鼠标左键
    handler.setInputAction(function(click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      position = viewer.scene.globe.pick(ray, viewer.scene)
      const point = drawPoint(position, viewer)
      temPrimitives.push(point)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // 鼠标左键双击停止绘制
    handler.setInputAction(function(click) {
      handler.destroy() // 关闭事件句柄
      handler = null
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    // 鼠标右键单击停止绘制
    handler.setInputAction(function(click) {
      handler.destroy() // 关闭事件句柄
      handler = null
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
  if (type === 'polyline') {
    // 监听鼠标左键
    handler.setInputAction(function(click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      position = viewer.scene.globe.pick(ray, viewer.scene)
      temPoints.push(position)
      // 调用绘制点的操作
      drawPoint(temPoints[temPoints.length - 1], viewer)
      if (temPoints.length > 1) {
        // 不断把倒数两个点相连
        drawPolyline([temPoints[temPoints.length - 2], temPoints[temPoints.length - 1]], viewer)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    // 监听鼠标移动
    handler.setInputAction(function(movement) {
      const ray = viewer.scene.camera.getPickRay(movement.endPosition)
      position = viewer.scene.globe.pick(ray, viewer.scene)
      if (temPoints.length >= 1) {
        // 不断把倒数两个点相连

        const polyline = drawPolyline([temPoints[temPoints.length - 1], position], viewer)
        console.log(position)
      }

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    // 监听鼠标左键双击
    handler.setInputAction(function(click) {
      handler.destroy() // 关闭事件句柄
      handler = null
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    // 鼠标右键单击停止绘制
    handler.setInputAction(function(click) {
      handler.destroy() // 关闭事件句柄
      handler = null
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
  if (type === 'polygon') {
    // 鼠标移动事件
    handler.setInputAction(function(movement) {

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    // 监听鼠标左键操作
    handler.setInputAction(function(click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      position = viewer.scene.globe.pick(ray, viewer.scene)
      temPoints.push(position)
      // 调用绘制点的接口
      drawPoint(position, viewer)
      if (temPoints.length > 1) {
        // 不断把倒数两个点相连
        drawPolyline([temPoints[temPoints.length - 2], temPoints[temPoints.length - 1]], viewer)
      }
      if (temPoints.length >= 3) {
        // 把倒数两个点相连
        drawPolyline([temPoints[temPoints.length - 2], temPoints[temPoints.length - 1]], viewer)
        drawPolygon(temPoints, viewer)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // 监听鼠标左键双击操作
    handler.setInputAction(function(click) {
      const ray = viewer.scene.camera.getPickRay(click.position)
      position = viewer.scene.globe.pick(ray, viewer.scene)
      temPoints.push(position)
      if (temPoints.length < 3) {
        alert('请选择3个点以上')
      } else {
        // 把倒数两个点相连
        drawPolyline([temPoints[temPoints.length - 2], temPoints[temPoints.length - 1]], viewer)
        drawPolygon(temPoints, viewer)

        handler.destroy() // 关闭事件句柄
        handler = null
      }
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
  const points = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection())
  return points.add({
    position: position,
    color: Cesium.Color.YELLOW,
    // outlineColor: Cesium.Color.RED,
  })
}

/**
 * 画线操作
 * @param { Cartesian3 } position 卡迪尔空间直角坐标
 * @param { Object } viewer
 */
export function drawPolyline(positions, viewer) {
  if (positions.length < 1) return
  console.log(positions);
  const polylineGeometry = new Cesium.PolylineGeometry({
    positions: positions,
    width: 2
  })
  const polylineInstance = new Cesium.GeometryInstance({
    geometry: polylineGeometry
  })
  const polylineMat = new Cesium.Material({
    fabric: {
      type: 'Color',
      uniforms: {
        color: Cesium.Color.YELLOW
      }
    }
  })
  const polylineAppearance = new Cesium.PolylineMaterialAppearance({
    material: polylineMat
  })
  const polylinePrimitive = viewer.scene.primitives.add(new Cesium.Primitive({
    geometryInstances: polylineInstance,
    appearance: polylineAppearance,
    asynchronous: false,
  }))
  console.log(polylinePrimitive, 'line')
  return polylinePrimitive
}

// export function drawPolygon(positions, viewer) {
//   console.log(positions)
//   const polygonGeometry = new Cesium.PolygonGeometry({
//     polygonHierarchy: new Cesium.PolygonHierarchy(positions)

//   })
//   const polygonInstance = new Cesium.GeometryInstance({
//     geometry: polygonGeometry
//   })
//   const polygonMat = new Cesium.Material({
//     fabric: {
//       type: 'Color',
//       uniforms: {
//         color: Cesium.Color.YELLOW
//       }
//     }
//   })
//   const polygonAppearance = new Cesium.MaterialAppearance({
//     material: polygonMat
//   })
//   const polygonPrimitive = viewer.scene.primitives.add(new Cesium.Primitive({
//     geometryInstances: polygonInstance,
//     appearance: polygonAppearance,
//     asynchronous: false,
//   }))
//   console.log(polygonPrimitive)
//   return polygonPrimitive
// }
export function drawPolygon(positions, viewer) {
  const polygon = new Cesium.PolygonGeometry({
    polygonHierarchy: new Cesium.PolygonHierarchy(positions)
  });
  const geometry = Cesium.PolygonGeometry.createGeometry(polygon);

  const instance = new Cesium.GeometryInstance({
    geometry: geometry
  });

  viewer.scene.primitives.add(new Cesium.Primitive({
    geometryInstances: instance,
    appearance: new Cesium.MaterialAppearance({
      material: new Cesium.Material({
        fabric: {
          type: 'Color',
          uniforms: {   
              color: Cesium.Color.YELLOW.withAlpha(0.5)
          }
        }
      })
    }),
    asynchronous: false,
  }));
}
