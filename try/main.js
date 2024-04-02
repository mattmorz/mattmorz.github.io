
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

function simplify(coords, sqTolerance) {
    if (!Array.isArray(coords) || !coords.every(item => Array.isArray(item) && item.length === 2)) {
      throw new Error('coords must be an array of coordinate arrays [x, y]');
    }

    if (typeof sqTolerance !== 'number' || sqTolerance < 0) {
      throw new Error('sqTolerance must be a non-negative number');
    }

    const n = coords.length;
    console.log("orig length")
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
    console.log(result.length);
    return result;
  }


// Function to apply Visvalingam-Whyatt simplification to a GeoJSON feature
function simplifyFeature(feature, tolerance) {
  const simplifiedCoords = {};

  if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
    simplifiedCoords.type = 'LineString';
    simplifiedCoords.coordinates = simplify(feature.geometry.coordinates, tolerance);
    simplifiedCoords.coordinates = feature.geometry.coordinates.map(coords => simplify(coords, tolerance));
  } else if (feature.geometry.type === 'Polygon') {
    simplifiedCoords.type = 'Polygon';
    simplifiedCoords.coordinates = [
      simplify(feature.geometry.coordinates[0], tolerance),
      ...feature.geometry.coordinates.slice(1).map(hole => simplify(hole, tolerance)),
    ];
  } else if (feature.geometry.type === 'MultiPolygon') {
    simplifiedCoords.type = 'MultiPolygon';
    simplifiedCoords.coordinates = feature.geometry.coordinates.map(polygon => [
        simplify(polygon[0], tolerance),
        ...polygon.slice(1).map(hole => simplify(hole, tolerance)),
    ]);
  }else {
    // For Point, MultiPoint return the original coordinates
    simplifiedCoords.type = feature.geometry.type;
    simplifiedCoords.coordinates = feature.geometry.coordinates;
  }

  return {
    ...feature,
    geometry: simplifiedCoords,
  };
}

// Function to create vector tiles from GeoJSON data
function createVectorTiles(geojsonData, zoom, tolerance) {
  // Simplify the GeoJSON data before converting to vector tiles
  const features = geojsonData.features.map(feature => simplifyFeature(feature, tolerance));
  const simplifiedGeoJSON = {
    type: 'FeatureCollection',
    features: features
  };

  // Create vector tiles using Leaflet VectorGrid plugin
  const vectorTileOptions = {
    maxZoom: 14,
    vectorTileLayerStyles: {
      sliced: function(properties, zoom) {
        // Customize the style for vector tiles (optional)
        return {
          fillColor: '#3388ff',
          fillOpacity: .9,
          color: '#3388ff',
          opacity: 1,
          weight: 2,
        };
      }
    }
  };

  const vectorTiles = L.vectorGrid.slicer(simplifiedGeoJSON, vectorTileOptions);
  return vectorTiles;
}

// Function to fetch GeoJSON data using AJAX (XMLHttpRequest)
function fetchGeoJSONData(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var geojsonData = JSON.parse(xhr.responseText);
      callback(geojsonData);
    }
  };
  xhr.send();
}

// Example usage
function main() {
  const map = L.map('map').setView([9.1204, 125.59], 7);

  // Add a basemap (e.g., OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Replace 'data/your_geojson_data.json' with the path to your GeoJSON data
  const url = '/try/country.json';

  // Set the simplification tolerance and zoom level
  const zoomLevel = 10;
  const simplificationTolerance = .001;

  // Fetch GeoJSON data and create vector tiles
  fetchGeoJSONData(url, function (geojsonData) {
    const vectorTiles = createVectorTiles(geojsonData, zoomLevel, simplificationTolerance);

    // Add the vector tiles to the map using Leaflet VectorGrid plugin
    vectorTiles.addTo(map);

    console.log('Vector tiles created and displayed on the map.');
  });
}

// Run the main function when the page loads
window.onload = main;
