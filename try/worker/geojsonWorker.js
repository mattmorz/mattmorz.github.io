class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  off(event, listener) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (l) => l !== listener
      );
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => listener(data));
    }
  }
}

self.addEventListener('message', (event) => {
  const { task, data, id, eventBus,tolerance } = event.data;
  const workerId = `worker${id}`;
  const startTime = performance.now();
  //console.log(tolerance)
  const simplifiedGeoJSON = simplify_vw(data, tolerance || 0.15);
  const endTime = performance.now();
  console.log(endTime-startTime);
  // Post processed data back to the main thread
  self.postMessage({
    workerId: workerId,
    processedData: simplifiedGeoJSON,
    execution_time: (endTime - startTime),
    id: id
  });
});


  class PointObj {
    constructor(index, coords) {
      this.index = index;
      this.coords = coords;
      this.area = 0;
      this.needsrefresh = true;
    }
  
    setArea(previousP, nextP) {
      if (!this.area || this.needsrefresh) {
        const [x1, y1] = previousP.coords;
        const [x2, y2] = this.coords;
        const [x3, y3] = nextP.coords;
        // Calculate the area of the polygon using the cross-product formula
        this.area = Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);
        //console.log(this.area)
        this.needsrefresh = false;
      }
    }
    
  }
  
  class PolygonObj {
    constructor(polygonFeature) {
        this.minArea = 0;
        this.pointArray = [];
        this.initializePoints(polygonFeature);
    }

    //OK
    initializePoints(polygonFeature) {
      if (!polygonFeature || polygonFeature.type !== 'Polygon' || !polygonFeature.coordinates || polygonFeature.coordinates.length === 0 || polygonFeature.coordinates[0].length < 4 || polygonFeature.coordinates[0][0][0] !== polygonFeature.coordinates[0][polygonFeature.coordinates[0].length - 1][0] || polygonFeature.coordinates[0][0][1] !== polygonFeature.coordinates[0][polygonFeature.coordinates[0].length - 1][1]) {
        console.error("Invalid polygon feature");
        return;
      }
    
      const coordinates = polygonFeature.coordinates[0].slice();
      this.pointArray = coordinates.slice(0, -1).map((currentCoord, i) => new PointObj(i, currentCoord));
    
      // Set the last point auxiliary
      this.lastPoint_Aux = this.pointArray[coordinates.length - 2];
    }
    
    getPointAreas() {
      const length = this.pointArray.length;
    
      for (let i = 0; i < length; i++) {
        const pointObj = this.pointArray[i];
        const prevIndex = i === 0 ? length - 1 : i - 1;
        const nextIndex = i === length - 1 ? 0 : i + 1;
        const prevPoint = this.pointArray[prevIndex];
        const nextPoint = this.pointArray[nextIndex];
        pointObj.setArea(prevPoint, nextPoint);
      }
    }
    

    removePointWithMinArea() {
      // Calculate areas only when needed
      if (!this.areasCalculated) {
        this.getPointAreas();
        this.areasCalculated = true;
      }
    
      let minArea = Infinity;
      let indexOfMinAreaPoint = -1;
      let pointArrayLen = this.pointArray.length;
      // Find the index of the point with the minimum area
      const increment = Math.max(1, Math.ceil(pointArrayLen / 100));

      for (let i = 0; i < pointArrayLen; i += increment) {
      //for (let i = 0; i < pointArrayLen; i ++) {
        if (this.pointArray[i].area < minArea) {
          minArea = this.pointArray[i].area;
          indexOfMinAreaPoint = i;
        }

        if (minArea === 0) {
          // exit the loop if minArea is already 0
          break;
        }
      }
    
      // Handle special cases for previous and next indices
      const prevIndex = (indexOfMinAreaPoint === 0) ?pointArrayLen - 1 : indexOfMinAreaPoint - 1;
      const nextIndex = (indexOfMinAreaPoint === pointArrayLen - 1) ? 0 : indexOfMinAreaPoint + 1;
    
      // Set needsrefresh for previous and next points
      this.pointArray[prevIndex].needsrefresh = true;
      this.pointArray[nextIndex].needsrefresh = true;
    
      // Remove the point with the minimum area
      this.pointArray.splice(indexOfMinAreaPoint, 1);
    
      // Update the minimum area property
      this.minArea = minArea;
    
      return this;
    }
    
    simplify_vw(percentage) {
      const originalLength = this.pointArray.length;
      const targetLength = Math.round(originalLength * percentage);
      //console.log(originalLength,targetLength);
      // Iterate until the target length is reached
      while (this.pointArray.length > targetLength) {
        this.removePointWithMinArea();
      }
    
      const coords = this.pointArray.map(point => point.coords);
      coords.push(coords[0]);
    
      // Construct the simplified polygon
      return {
        type: 'Feature',
        properties: null,
        geometry: {
          coordinates: [coords],
          type: 'Polygon'
        }
      };
    }
    
    
}


// Function to simplify the geometry

let counterOrigPoint = 0;
let counterSimplifiedPoint = 0;

function simplify_vw(feature, percentage) {
  const simplifiedFeatures = [];
  
  counterOrigPoint = 0;
  counterSimplifiedPoint = 0;
  if (feature.type !== "FeatureCollection") {
    console.error("Unsupported feature type:", feature.type);
    return null;
  }

  for (const f of feature.features) {
    const featureType = f.geometry.type;

    let simplifiedFeature;
    if (featureType === "Polygon") {
      simplifiedFeature = simplifyPolygon(f, percentage);
    } else if (featureType === "MultiPolygon") {
      simplifiedFeature = simplifyMultiPolygon(f, percentage);
    } else {
      console.warn("Unknown geometry type:", featureType);
      simplifiedFeature = f; // Keep original feature
    }

    simplifiedFeatures.push(simplifiedFeature);
  }
  
  //console.log("from ", counterOrigPoint, "to ", counterSimplifiedPoint);
  
  return {
    type: 'FeatureCollection',
    features: simplifiedFeatures,
  };
}

function simplifyPolygon(polygonFeature, percentage) {
  const polygonObj = new PolygonObj(polygonFeature.geometry);
  return polygonObj.simplify_vw(percentage);
}

function simplifyMultiPolygon(multiPolygonFeature, percentage) {
  const simplifiedMultiPolygons = [];
  for (const coords of multiPolygonFeature.geometry.coordinates) {
    //console.log(coords)
    var coordLen = coords[0].length;
    const polygonObj = new PolygonObj({ type: 'Polygon', coordinates: coords });
    if (coordLen > 100) {
      const simplifiedPolygon = polygonObj.simplify_vw(percentage);
      counterOrigPoint += coordLen;
      counterSimplifiedPoint += simplifiedPolygon.geometry.coordinates[0].length;
      simplifiedMultiPolygons.push(simplifiedPolygon.geometry.coordinates[0]);
    }
  }

  return {
    type: "Feature",
    geometry: {
      type: "MultiPolygon",
      coordinates: [simplifiedMultiPolygons]
    },
    properties: multiPolygonFeature.properties
  };
}
