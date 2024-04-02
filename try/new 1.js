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

 function triArea(coords, i, j, k, l) {
    const ax = coords[i * 2];
    const ay = coords[i * 2 + 1];
    const bx = coords[j * 2];
    const by = coords[j * 2 + 1];
    const cx = coords[k * 2];
    const cy = coords[k * 2 + 1];
    const dx = coords[l * 2];
    const dy = coords[l * 2 + 1];
  
    return (ax * (by - cy) + bx * (cy - dy) + cx * (dy - by) + dx * (by - ay)) / 2;
  }
  
  
function simplify(coords, tolerance) {
  if (!Array.isArray(coords) || !coords.every(coord => Array.isArray(coord) && coord.length === 2)) {
    throw new Error('Coordinates must be an array of coordinate arrays [x, y]');
  }

  if (typeof tolerance !== 'number' || tolerance < 0) {
    throw new Error('Tolerance must be a non-negative number');
  }

   const n = coords.length;
    const h = Math.floor(n / 2);
    const half = new Float64Array(n / 2);
  
    for (let i = h; i > 0; i--) {
      const area = triArea(coords, 0, n - 1, i, n - 1) * 2;
      const sqDist = area * area / (triArea(coords, 0, n - 1, 0, i) + triArea(coords, i, n - 1, i, n - 1));
  
      if (sqDist <= sqTolerance) {
        break;
      }
      half[i - 1] = sqDist;
    }
  
    const result = [];
    for (let j = 0; j < n - h; j++) {
      result.push(coords[h + j]);
    }
    return result;
}


