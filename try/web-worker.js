self.addEventListener('message', function (e) {
    const { feature, tolerance } = e.data;
    try {
      switch (feature.geometry.type) {
        case 'LineString':
        case 'MultiLineString':
          const simplifiedCoords = simplify(feature.geometry.coordinates, tolerance);
          self.postMessage({ action: 'simplifyFeature', result: { ...feature, geometry: { type: 'LineString', coordinates: simplifiedCoords } } });
          break;
        case 'Polygon':
          const simplifiedPolygonCoords = [
            simplify(feature.geometry.coordinates[0], tolerance),
            ...feature.geometry.coordinates.slice(1).map(hole => simplify(hole, tolerance)),
          ];
          self.postMessage({ action: 'simplifyFeature', result: { ...feature, geometry: { type: 'Polygon', coordinates: simplifiedPolygonCoords } } });
          break;
        case 'MultiPolygon':
          const simplifiedMultiPolygonCoords = feature.geometry.coordinates.map(polygon => [
            simplify(polygon[0], tolerance),
            ...polygon.slice(1).map(hole => simplify(hole, tolerance)),
          ]);
          self.postMessage({ action: 'simplifyFeature', result: { ...feature, geometry: { type: 'MultiPolygon', coordinates: simplifiedMultiPolygonCoords } } });
          break;
        default:
          self.postMessage({ action: 'simplifyFeature', error: 'Unsupported geometry type' });
          break;
      }
    } catch (error) {
      self.postMessage({ action: 'simplifyFeature', error: error.message });
    }
  }, false);
  
function simplify(points, tolerance) {
    if (!Array.isArray(points) || !points.every((point) => Array.isArray(point) && point.length === 2)) {
      throw new Error('Points must be an array of coordinate arrays [x, y]');
    }
  
    if (typeof tolerance !== 'number' || tolerance < 0) {
      throw new Error('Tolerance must be a non-negative number');
    }
  
    const sortedAreas = [];
    const n = points.length;
  
    for (let i = 2; i < n; i++) {
      const area = triArea(points, 0, n - 1, i - 1, n - 1) * 2;
      const sqDist = area * area / triArea(points, 0, n - 1, 0, i - 1);
      sortedAreas.push({ index: i - 1, sqDist });
    }
  
    sortedAreas.sort((a, b) => a.sqDist - b.sqDist);
  
    const stack = [];
    stack.push(0);
    stack.push(n - 1);
  
    for (const { index } of sortedAreas) {
      if (stack.length < 2) break;
  
      const lastIndex = stack[stack.length - 1];
      const firstIndex = stack[stack.length - 2];
  
      if (index - lastIndex > 1 && index - firstIndex > 1) {
        const sqDist = points[index][0] * points[index][0] + points[index][1] * points[index][1];
  
        if (sqDist <= tolerance) {
          stack.pop();
          stack.pop();
          stack.push(index);
        }
      }
    }
  
    return stack.map((i) => points[i]);
  }
  
  function triArea(coords, i, j, k, l) {
    const ax = coords[i][0];
    const ay= coords[i][1];
    const bx = coords[j][0];
    const by = coords[j][1];
    const cx = coords[k][0];
    const cy = coords[k][1];
    const dx = coords[l][0];
    const dy = coords[l][1];
  
    return (ax * (by - cy) + bx * (cy - dy) + cx * (dy - by) + dx * (by - ay)) / 2;
  }