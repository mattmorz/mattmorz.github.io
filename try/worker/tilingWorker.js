// Listen for messages from the main thread
self.addEventListener('message', event => {
  const { geojson, zoomLevels } = event.data;
  const tiles = generateTiles(geojson, zoomLevels);

  // Send the generated tiles back to the main thread
  self.postMessage(tiles);
});


importScripts('../dependencies/leaflet.js','../dependencies/vectorgrid.js')

function generateTiles(geojson, zoomLevels) {
  const tiles = {};
  const options = { maxZoom: zoomLevels[1], indexMaxZoom: zoomLevels[1] };
  const tileIndex = geojsonvt(geojson, options);

  for (let z = zoomLevels[0]; z <= zoomLevels[1]; z++) {
      tiles[z] = {};
      const tileCoords = tileIndex.tileCoordsForExtent(geojsonExtent(geojson), { z });

      tileCoords.forEach(tileCoord => {
          const features = tileIndex.getTile(tileCoord.z, tileCoord.x, tileCoord.y).features;
          tiles[z][`${tileCoord.x}_${tileCoord.y}`] = features;
      });
  }

  return tiles;
}