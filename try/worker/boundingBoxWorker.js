// Web worker (worker.js)
self.onmessage = function(event) {
    const mapBounds = event.data.mapBounds;
    const geoJsonData = event.data.geoJsonData;
    const tileX = 0;
    const tileY = 0;
    const zoomLevel = 0;
    const tileSize = 256;
    let featuresInsideBoundingBox = [];
    //console.log(mapBounds)
    if (geoJsonData) {
        
        geoJsonData.features.forEach(function(feature) {
            //console.log(feature)
            if (feature.geometry.type === "MultiPolygon") {
                // Calculate the bounding box of the feature
                const featureBoundingBox = calculateFeatureBoundingBox(feature);
                //console.log(featureBoundingBox);
                // Check if the feature's bounding box intersects with the map bounds
                if (isBoundingBoxIntersecting(featureBoundingBox,mapBounds )) {
                    feature['bounds'] = featureBoundingBox;
                    featuresInsideBoundingBox.push(feature);
                    
                }
            }
        });
    }

    const filteredGeoJson = {
        type: 'FeatureCollection',
        features: featuresInsideBoundingBox
    };
   
    self.postMessage(filteredGeoJson);
};




function calculateFeatureBoundingBox(multipolygon) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
  
    multipolygon.geometry.coordinates.forEach(polygonCoords => {
      polygonCoords.forEach(ringCoords => {
        ringCoords.forEach(coord => {
          if (coord[0] < minX) {
            minX = coord[0];
          }
          if (coord[0] > maxX) {
            maxX = coord[0];
          }
          if (coord[1] < minY) {
            minY = coord[1];
          }
          if (coord[1] > maxY) {
            maxY = coord[1];
          }
        });
      });
    });
  
    return [minX, minY, maxX, maxY];
  }


  function isBoundingBoxIntersecting(bbox, mapBoundingBox) {
    const [minX, minY, maxX, maxY] = bbox;
    const [mapMinX, mapMinY, mapMaxX, mapMaxY] = mapBoundingBox;
  
    return (
      minX < mapMaxX && 
      minY < mapMaxY && 
      maxX > mapMinX && 
      maxY > mapMinY
    );
  }

