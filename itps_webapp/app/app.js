
/*
 Copyright (c) 2013, Neil Jakeman
 GWC Layer implements access to a pre rendered GWC tile cache.
 NB. URL to take the form:
  '{s}/path/to/cache/EPSG_900913_{z}/{dir_x}_{dir_y}/{x}_{y}.png';
 Options:
 Must declare {tms:true}
 
*/

L.TileLayer.GWC = L.TileLayer.extend({

	_padZeros: function(unPaddedInt,padReq) {
			padded = unPaddedInt.toString()
			while (padded.length < padReq) {
					padded = '0'+padded;
			}
			return padded
	},
	
	_formatZ: function(z) {
			if (z<10) {
				z='0'+z;
			}
			return z
		},
	
	getTileUrl: function (tilePoint) {

		return L.Util.template(this._url, L.extend({
			s: this._getSubdomain(tilePoint),
			z: this._formatZ(this._getZoomForUrl()),
			dir_x: this._padZeros(Math.floor(tilePoint.x/(Math.pow(2,Math.floor(1+(this._getZoomForUrl(tilePoint)/2))))), Math.floor(this._getZoomForUrl(tilePoint)/6)+1),
			dir_y: this._padZeros(Math.floor(tilePoint.y/(Math.pow(2,Math.floor(1+(this._getZoomForUrl(tilePoint)/2))))), Math.floor(this._getZoomForUrl(tilePoint)/6)+1),
			x: this._padZeros(tilePoint.x,2+(Math.floor(this._getZoomForUrl(tilePoint)/6)*2)),
			y: this._padZeros(tilePoint.y,2+(Math.floor(this._getZoomForUrl(tilePoint)/6)*2))
			
		}, this.options));
	}
})

var LAYERS = [];
var coverage_type = null;

//GEOJSON FILES, EPSG:32651 coverted to EPSG:4321 for Web Display
const BASE_URL = window.location.href;
const BAGRAS_GEOJSON = BASE_URL+"data/RescaledRefinedBagras_CaragaRegion.json";
const MANGIUM_GEOJSON = BASE_URL+"data/RescaledRefinedMangium_CaragaRegion.json";
const GMELINA_GEOJSON = BASE_URL+"data/RescaledRefinedGmelina_CaragaRegion.json";
const FALCATA_GEOJSON = BASE_URL+"data/RescaledRefinedFalcata_CaragaRegion.json";
const NGP_FALCATA = BASE_URL+"data/NGP_DENRCaraga_Falcata.json";
const NGP_GMELINA = BASE_URL+"data/NGP_DENRCaraga_Gmelina.json";
const NGP_MANGIUM = BASE_URL+"data/NGP_DENRCaraga_Mangium.json";
const NGP_BAGRAS = BASE_URL+"data/NGP_DENRCaraga_Bagras.json";

const BRGY_FALCATA = BASE_URL+"data/Falcata_Stats_BrgyLevel.json";
const BRGY_GMELINA = BASE_URL+"data/Gmelina_Stats_BrgyLevel.json";
const BRGY_MANGIUM = BASE_URL+"data/Mangium_Stats_BrgyLevel.json";
const BRGY_BAGRAS = BASE_URL+"data/Bagras_Stats_BrgyLevel.json";

const MUN_FALCATA = BASE_URL+"data/Falcata_Stats_MunLevel.json";
const MUN_GMELINA = BASE_URL+"data/Gmelina_Stats_MunLevel.json";
const MUN_MANGIUM = BASE_URL+"data/Mangium_Stats_MunLevel.json";
const MUN_BAGRAS = BASE_URL+"data/Bagras_Stats_MunLevel.json";

const PROV_FALCATA = BASE_URL+"data/Falcata_Stats_ProvLevel.json";
const PROV_GMELINA = BASE_URL+"data/Gmelina_Stats_ProvLevel.json";
const PROV_MANGIUM = BASE_URL+"data/Mangium_Stats_ProvLevel.json";
const PROV_BAGRAS = BASE_URL+"data/Bagras_Stats_ProvLevel.json";

const CARAGA_PLACES = BASE_URL+"js/caraga.json";

// standard leaflet map setup
var map = L.map('map');
map.setView([9.1204, 125.59], 8);

var treesRepo = L.geoJson(null);
var treesRepo1 = {
    type:"FeatureCollection",
    features: []
};
var brgyRepoFalcata = L.geoJson(null);
var brgyRepoFalcata1 = null;
var brgyRepoGmelina = L.geoJson(null);
var brgyRepoGmelina1 = null;
var brgyRepoMangium = L.geoJson(null);
var brgyRepoMangium1 = null;
var brgyRepoBagras = L.geoJson(null);
var brgyRepoBagras1 = null;

var munRepoFalcata = L.geoJson(null);
var munRepoFalcata1 = null;
var munRepoGmelina = L.geoJson(null);
var munRepoGmelina1 = null;
var munRepoMangium = L.geoJson(null);
var munRepoMangium1 = null;
var munRepoBagras = L.geoJson(null);
var munRepoBagras1 = null;

var provRepoFalcata = L.geoJson(null);
var provRepoFalcata1 = null;
var provRepoGmelina = L.geoJson(null);
var provRepoGmelina1 = null;
var provRepoMangium = L.geoJson(null);
var provRepoMangium1 = null;
var provRepoBagras = L.geoJson(null);
var provRepoBagras1 = null;

var FALCATAtileLayer, BAGRAStileLayer,MANGIUMtileLayer, GMELINAtileLayer;
var BRGYtileLayer,MUNtileLayer,PROVtileLayer;
var falcataRepoJSON, bagrasRepoJSON, mangiumRepoJSON, gmelinaRepoJSON;
var groupAreaStats = new L.layerGroup();
var groupTrees = new L.layerGroup();
var groupOtherLayers = new L.layerGroup();
var FILTERED_LAYER = null;

var toogleFALCATA = false;
var toogleBAGRAS = false;
var toogleGMELINA = false;
var toogleMANGIUM = false; 
var toogleAreaStats = false;
var toogleAreaStatsByBrgy = false;
var toogleAreaStatsByMun = false;
var toogleAreaStatsByMProv = false;
var highlight;
var activeStatsLayer = null;
var activeTreeName = null;
var loadedLayers = [];
var TREES_FILTER = null;

function addFALCATA(URL){
    var trees;
    if (toogleFALCATA == false){
        $('#loadMe').modal('show');
        var data = omnivore.topojson(URL);
        data.on('ready', function() {
            console.log('ready');
            trees = data.toGeoJSON();
            falcataRepoJSON = trees;
            treesRepo1.features.push({
                'Falcata':trees.features
            });
            console.log(trees);
            treesRepo.addData(falcataRepoJSON);
            FALCATAtileLayer = L.vectorGrid.slicer(trees, {
                rendererFactory: L.canvas.tile,
                vectorTileLayerStyles: {
                    sliced: {
                        fillColor: "#006d2c",
                        color: "black",
                        weight: .1,
                        fill: true,
                        stroke: true,
                        fillOpacity: .8
                    }
                },
                maxZoom: 22,
                indexMaxZoom: 5,
                interactive: true,
            }).addTo(map);
            setTimeout(function() {
                $('#loadMe').modal('hide');
            }, 500);
            console.log('added to map');
            groupTrees.addLayer(FALCATAtileLayer);
            toogleFALCATA = true;
        });   
    }
}
function addMANGIUM(URL){
    var trees;
    if (toogleMANGIUM == false){
        $('#loadMe').modal('show');
        var data = omnivore.topojson(URL);
        data.on('ready', function() {
            console.log('ready');
            trees = data.toGeoJSON();
            mangiumRepoJSON = trees;
            treesRepo1.features.push({
                'Mangium':trees.features
            });
            treesRepo.addData(mangiumRepoJSON);
            MANGIUMtileLayer = L.vectorGrid.slicer(trees, {
                rendererFactory: L.canvas.tile,
                vectorTileLayerStyles: {
                    sliced: {
                        fillColor: "#54278f",
                        color: "black",
                        weight: .1,
                        fill: true,
                        stroke: true,
                        fillOpacity: .8
                    }
                },
                maxZoom: 22,
                indexMaxZoom: 5,
                interactive: true,
            }).addTo(map);
            setTimeout(function() {
                $('#loadMe').modal('hide');
            }, 500);
            console.log('added to map');
            groupTrees.addLayer(MANGIUMtileLayer);
            toogleMANGIUM = true;
        });   
    }
}
function addGMELINA(URL){
    var trees;
    if (toogleGMELINA == false){
         $('#loadMe').modal('show');
        var data = omnivore.topojson(URL);
        data.on('ready', function() {
            console.log('ready');
            trees = data.toGeoJSON();
            gmelinaRepoJSON = trees;
            treesRepo.addData(gmelinaRepoJSON);
            treesRepo1.features.push({
                'Gmelina':trees.features
            });
            GMELINAtileLayer = L.vectorGrid.slicer(trees, {
                rendererFactory: L.canvas.tile,
                vectorTileLayerStyles: {
                    sliced: {
                        fillColor: "#a50f15",
                        color: "black",
                        weight: .1,
                        fill: true,
                        stroke: true,
                        fillOpacity: .8
                    }
                },
                maxZoom: 22,
                indexMaxZoom: 5,
                interactive: true
            }).addTo(map);
            console.log('added to map');
            groupTrees.addLayer(GMELINAtileLayer);
            setTimeout(function() {
                $('#loadMe').modal('hide');
            }, 500);
            toogleGMELINA = true;
        });   
    }
    

}
function addBAGRAS(URL){
    var trees;
    if(toogleBAGRAS == false){
        $('#loadMe').modal('show');
        var data = omnivore.topojson(URL);
        data.on('ready', function() {
            console.log('ready');
            trees = data.toGeoJSON();
            bagrasRepoJSON = trees;
            treesRepo1.features.push({
                'Bagras':trees.features
            });
            treesRepo.addData(bagrasRepoJSON);
            BAGRAStileLayer = L.vectorGrid.slicer(trees, {
                rendererFactory: L.canvas.tile,
                loadingControl: true,
                vectorTileLayerStyles: {
                    sliced: {
                        fillColor: "#08519c",
                        color: "black",
                        weight: .1,
                        fill: true,
                        stroke: true,
                        fillOpacity: .8
                    }
                },
                maxZoom: 22,
                indexMaxZoom: 5,
                interactive: true,
            }).addTo(map);
            console.log('added to map');
            groupTrees.addLayer(BAGRAStileLayer);
            toogleBAGRAS = true
            setTimeout(function() {
                $('#loadMe').modal('hide');
            }, 500);
        });
    }

}

//STATS
/** 
 1. Check if layer if already added
 2. If not, add then save the geojson data to the placeholder variable
 3. Use geojson data in vectorGrid layer
*/ 

function addLayerStats(URL, _coverage_type, _layer_name){
    if(toogleAreaStats == false){
        var stats;
        $('#loadMe').modal('show');
        var data = omnivore.topojson(URL);
        data.on('ready', function() {
            console.log('ready');
            stats = data.toGeoJSON();
            if (_coverage_type == "Barangay"){

                if(_layer_name == 'Barangay_Falcata'){
                    brgyRepoFalcata.addData(stats);
                    brgyRepoFalcata1 = stats;
                    
                }
                if(_layer_name == 'Barangay_Gmelina'){
                    brgyRepoGmelina.addData(stats);
                    brgyRepoGmelina1 = stats;

                }
                if(_layer_name == 'Barangay_Mangium'){
                    brgyRepoMangium.addData(stats);
                    brgyRepoMangium1 = stats;

                }
                if(_layer_name == 'Barangay_Bagras'){
                    brgyRepoBagras.addData(stats);
                    brgyRepoBagras1 = stats;

                }

                BRGYtileLayer = L.vectorGrid.slicer(stats, {
                    rendererFactory: L.canvas.tile,
                    loadingControl: true,
                    vectorTileLayerStyles: {
                        sliced: function(properties){
                            var area = parseFloat(properties.Area_sqm/10000);
                            if(area == 0){
                                return {
                                    fillColor: "white",
                                    color: "black",
                                    weight: 1,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }
                            else if(area <= 10 && area > 0){
                                return {
                                    fillColor: _layer_name == 'Barangay_Falcata' ? "#edf8e9"
                                                :_layer_name == 'Barangay_Gmelina' ? "#fee5d9"
                                                :_layer_name == 'Barangay_Mangium' ? "#f2f0f7"
                                                : "#eff3ff",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 10 && area <= 20){
                                return {
                                    fillColor: _layer_name == 'Barangay_Falcata' ? "#bae4b3"
                                                :_layer_name == 'Barangay_Gmelina' ? "#fcae91"
                                                :_layer_name == 'Barangay_Mangium' ? "#cbc9e2"
                                                : "#bdd7e7",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 20 && area <= 30){
                                return {
                                    fillColor: _layer_name == 'Barangay_Falcata' ? "#74c476"
                                                :_layer_name == 'Barangay_Gmelina' ? "#fb6a4a"
                                                :_layer_name == 'Barangay_Mangium' ? "#9e9ac8"
                                                : "#6baed6",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 30 && area <= 40){
                                return {
                                    fillColor: _layer_name == 'Barangay_Falcata' ? "#31a354"
                                                :_layer_name == 'Barangay_Gmelina' ? "#de2d26"
                                                :_layer_name == 'Barangay_Mangium' ? "#756bb1"
                                                : "#3182bd",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else{
                                return {
                                    fillColor: _layer_name == 'Barangay_Falcata' ? "#006d2c"
                                                :_layer_name == 'Barangay_Gmelina' ? "#a50f15"
                                                :_layer_name == 'Barangay_Mangium' ? "#54278f"
                                                : "#08519c",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }

                        }
                    },
                    maxZoom: 22,
                    indexMaxZoom: 5,
                    interactive: true,
                    getFeatureId: function(feature) {
                        var uniq = feature.BGY_CODE+'_'+feature.MUN_CODE
                        return uniq
                    },
                    name: _layer_name
                }).addTo(map);
                groupAreaStats.addLayer(BRGYtileLayer);
                toogleAreaStatsByBrgy = true;
            }
            if (_coverage_type == "City/Municipality"){
                if(_layer_name == 'City/Municipality_Falcata'){
                    munRepoFalcata.addData(stats);
                    munRepoFalcata1 = stats;
                }
                if(_layer_name == 'City/Municipality_Gmelina'){
                    munRepoGmelina.addData(stats);
                    munRepoGmelina1 = stats;
                }
                if(_layer_name == 'City/Municipality_Mangium'){
                    munRepoMangium.addData(stats);
                    munRepoMangium1 = stats;
                }
                if(_layer_name == 'City/Municipality_Bagras'){
                    munRepoBagras.addData(stats);
                    munRepoBagras1 = stats;
                }
                MUNtileLayer = L.vectorGrid.slicer(stats, {
                    rendererFactory: L.canvas.tile,
                    loadingControl: true,
                    vectorTileLayerStyles: {
                        sliced: function(properties){
                            var area = parseFloat(properties.Area_sqm/10000);
                            if(area == 0){
                                return {
                                    fillColor: "white",
                                    color: "black",
                                    weight: 1,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }
                            else if(area <= 10 && area > 0){
                                return {
                                    fillColor: _layer_name == 'City/Municipality_Falcata' ? "#edf8e9"
                                                :_layer_name == 'City/Municipality_Gmelina' ? "#fee5d9"
                                                :_layer_name == 'City/Municipality_Mangium' ? "#f2f0f7"
                                                : "#eff3ff",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 10 && area <= 20){
                                return {
                                    fillColor: _layer_name == 'City/Municipality_Falcata' ? "#bae4b3"
                                                :_layer_name == 'City/Municipality_Gmelina' ? "#fcae91"
                                                :_layer_name == 'City/Municipality_Mangium' ? "#cbc9e2"
                                                : "#bdd7e7",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 20 && area <= 30){
                                return {
                                    fillColor: _layer_name == 'City/Municipality_Falcata' ? "#74c476"
                                                :_layer_name == 'City/Municipality_Gmelina' ? "#fb6a4a"
                                                :_layer_name == 'City/Municipality_Mangium' ? "#9e9ac8"
                                                : "#6baed6",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 30 && area <= 40){
                                return {
                                    fillColor: _layer_name == 'City/Municipality_Falcata' ? "#31a354"
                                                :_layer_name == 'City/Municipality_Gmelina' ? "#de2d26"
                                                :_layer_name == 'City/Municipality_Mangium' ? "#756bb1"
                                                : "#3182bd",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else{
                                return {
                                    fillColor: _layer_name == 'City/Municipality_Falcata' ? "#006d2c"
                                                :_layer_name == 'City/Municipality_Gmelina' ? "#a50f15"
                                                :_layer_name == 'City/Municipality_Mangium' ? "#54278f"
                                                : "#08519c",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }

                        }
                    },
                    maxZoom: 22,
                    indexMaxZoom: 5,
                    interactive: true,
                    getFeatureId: function(feature) {
                        var uniq = feature.MUN_CODE
                        return uniq
                    },
                    name: _layer_name
                }).addTo(map);
                toogleAreaStatsByMun=true;
                groupAreaStats.addLayer(MUNtileLayer);
            }
            if (_coverage_type == "Province"){
                if(_layer_name == 'Province_Falcata'){
                    provRepoFalcata.addData(stats);
                    provRepoFalcata1 = stats;
                }
                if(_layer_name == 'Province_Gmelina'){
                    provRepoGmelina.addData(stats);
                    provRepoGmelina1 = stats;
                }
                if(_layer_name == 'Province_Mangium'){
                    provRepoMangium.addData(stats);
                    provRepoMangium1 = stats;
                }
                if(_layer_name == 'Province_Bagras'){
                    provRepoBagras.addData(stats);
                    provRepoBagras1= stats;
                }
                PROVtileLayer = L.vectorGrid.slicer(stats, {
                    rendererFactory: L.canvas.tile,
                    loadingControl: true,
                    vectorTileLayerStyles: {
                        sliced: function(properties){
                            var area = parseFloat(properties.Area_sqm/10000);
                            if(area == 0){
                                return {
                                    fillColor: "white",
                                    color: "black",
                                    weight: 1,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }
                            else if(area <= 10 && area > 0){
                                return {
                                    fillColor: _layer_name == 'Province_Falcata' ? "#edf8e9"
                                                :_layer_name == 'Province_Gmelina' ? "#fee5d9"
                                                :_layer_name == 'Province_Mangium' ? "#f2f0f7"
                                                : "#eff3ff",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 10 && area <= 20){
                                return {
                                    fillColor: _layer_name == 'Province_Falcata' ? "#bae4b3"
                                                :_layer_name == 'Province_Gmelina' ? "#fcae91"
                                                :_layer_name == 'Province_Mangium' ? "#cbc9e2"
                                                : "#bdd7e7",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 21 && area <= 30){
                                return {
                                    fillColor: _layer_name == 'Province_Falcata' ? "#74c476"
                                                :_layer_name == 'Province_Gmelina' ? "#fb6a4a"
                                                :_layer_name == 'Province_Mangium' ? "#9e9ac8"
                                                : "#6baed6",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 31 && area <= 40){
                                return {
                                    fillColor: _layer_name == 'Province_Falcata' ? "#31a354"
                                                :_layer_name == 'Province_Gmelina' ? "#de2d26"
                                                :_layer_name == 'Province_Mangium' ? "#756bb1"
                                                : "#3182bd",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else{
                                return {
                                    fillColor: _layer_name == 'Province_Falcata' ? "#006d2c"
                                                :_layer_name == 'Province_Gmelina' ? "#a50f15"
                                                :_layer_name == 'Province_Mangium' ? "#54278f"
                                                : "#08519c",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }

                        }
                    },
                    maxZoom: 22,
                    indexMaxZoom: 5,
                    interactive: true,
                    getFeatureId: function(feature) {
                        var uniq = feature.PRO_CODE
                        return uniq
                    },
                    name: _layer_name
                }).addTo(map);
                toogleAreaStatsByMProv=true;
                groupAreaStats.addLayer(PROVtileLayer);
            }
               
            console.log('added to map');
            toogleAreaStats = true;
            coverage_type = _coverage_type;
            setTimeout(function() {
                $('#loadMe').modal('hide');
            }, 500);
        });
    }
}

function loadLayerStats(URL, _coverage_type, _layer_name){
    console.log('get from loaded geojson');
    var stats =null;
    if (_coverage_type == "Barangay"){
        if(_layer_name == 'Barangay_Falcata'){
            stats = brgyRepoFalcata1;
        }
        if(_layer_name == 'Barangay_Gmelina'){
            stats = brgyRepoGmelina1;
        }
        if(_layer_name == 'Barangay_Mangium'){
            stats = brgyRepoMangium1
        }
        if(_layer_name == 'Barangay_Bagras'){
            stats = brgyRepoBagras1
        }
        //BRGYtileLayer =L.vectorGrid.slicer(null);
        BRGYtileLayer = L.vectorGrid.slicer(stats, {
            rendererFactory: L.canvas.tile,
            loadingControl: true,
            vectorTileLayerStyles: {
                sliced: function(properties){
                    var area = parseFloat(properties.Area_sqm/10000);
                    if(area == 0){
                        return {
                            fillColor: "white",
                            color: "black",
                            weight: 1,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }
                    else if(area <= 10 && area > 0){
                        return {
                            fillColor: _layer_name == 'Barangay_Falcata' ? "#edf8e9"
                                        :_layer_name == 'Barangay_Gmelina' ? "#fee5d9"
                                        :_layer_name == 'Barangay_Mangium' ? "#f2f0f7"
                                        : "#eff3ff",
                            color: "black",
                            weight: .5,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else if(area > 10 && area <= 20){
                        return {
                            fillColor: _layer_name == 'Barangay_Falcata' ? "#bae4b3"
                                        :_layer_name == 'Barangay_Gmelina' ? "#fcae91"
                                        :_layer_name == 'Barangay_Mangium' ? "#cbc9e2"
                                        : "#bdd7e7",
                            color: "black",
                            weight: .5,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else if(area > 20 && area <= 30){
                        return {
                            fillColor: _layer_name == 'Barangay_Falcata' ? "#74c476"
                                        :_layer_name == 'Barangay_Gmelina' ? "#fb6a4a"
                                        :_layer_name == 'Barangay_Mangium' ? "#9e9ac8"
                                        : "#6baed6",
                            color: "black",
                            weight: .5,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else if(area > 30 && area <= 40){
                        return {
                            fillColor: _layer_name == 'Barangay_Falcata' ? "#31a354"
                                        :_layer_name == 'Barangay_Gmelina' ? "#de2d26"
                                        :_layer_name == 'Barangay_Mangium' ? "#756bb1"
                                        : "#3182bd",
                            color: "black",
                            weight: .5,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else{
                        return {
                            fillColor: _layer_name == 'Barangay_Falcata' ? "#006d2c"
                                        :_layer_name == 'Barangay_Gmelina' ? "#a50f15"
                                        :_layer_name == 'Barangay_Mangium' ? "#54278f"
                                        : "#08519c",
                            color: "black",
                            weight: .5,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }

                }
            },
            maxZoom: 22,
            indexMaxZoom: 5,
            interactive: true,
            getFeatureId: function(feature) {
                var uniq = feature.BGY_CODE+'_'+feature.MUN_CODE
                return uniq
            },
            name: _layer_name
        });
        map.addLayer(BRGYtileLayer)
        toogleAreaStatsByBrgy = true;
    }
    if (_coverage_type == "City/Municipality"){
        if(_layer_name == 'City/Municipality_Falcata'){
            stats = munRepoFalcata1;
        }
        if(_layer_name == 'City/Municipality_Gmelina'){
            stats = munRepoGmelina1;
        }
        if(_layer_name == 'City/Municipality_Mangium'){
            stats = munRepoMangium1
        }
        if(_layer_name == 'City/Municipality_Bagras'){
            stats = munRepoBagras1
        }
        //MUNtileLayer =L.vectorGrid.slicer(null);
        MUNtileLayer = L.vectorGrid.slicer(stats, {
            rendererFactory: L.canvas.tile,
            loadingControl: true,
            vectorTileLayerStyles: {
                sliced: function(properties){
                    var area = parseFloat(properties.Area_sqm/10000);
                    if(area == 0){
                        return {
                            fillColor: "white",
                            color: "black",
                            weight: 1,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }
                    else if(area <= 10 && area > 0){
                        return {
                            fillColor: _layer_name == 'City/Municipality_Falcata' ? "#edf8e9"
                                        :_layer_name == 'City/Municipality_Gmelina' ? "#fee5d9"
                                        :_layer_name == 'City/Municipality_Mangium' ? "#f2f0f7"
                                        : "#eff3ff",
                            color: "black",
                            weight: .5,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else if(area > 10 && area <= 20){
                        return {
                            fillColor: _layer_name == 'City/Municipality_Falcata' ? "#bae4b3"
                                        :_layer_name == 'City/Municipality_Gmelina' ? "#fcae91"
                                        :_layer_name == 'City/Municipality_Mangium' ? "#cbc9e2"
                                        : "#bdd7e7",
                            color: "black",
                            weight: .5,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else if(area > 20 && area <= 30){
                        return {
                            fillColor: _layer_name == 'City/Municipality_Falcata' ? "#74c476"
                                        :_layer_name == 'City/Municipality_Gmelina' ? "#fb6a4a"
                                        :_layer_name == 'City/Municipality_Mangium' ? "#9e9ac8"
                                        : "#6baed6",
                            color: "black",
                            weight: .5,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else if(area > 30 && area <= 40){
                        return {
                            fillColor: _layer_name == 'City/Municipality_Falcata' ? "#31a354"
                                        :_layer_name == 'City/Municipality_Gmelina' ? "#de2d26"
                                        :_layer_name == 'City/Municipality_Mangium' ? "#756bb1"
                                        : "#3182bd",
                            color: "black",
                            weight: .5,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else{
                        return {
                            fillColor: _layer_name == 'City/Municipality_Falcata' ? "#006d2c"
                                        :_layer_name == 'City/Municipality_Gmelina' ? "#a50f15"
                                        :_layer_name == 'City/Municipality_Mangium' ? "#54278f"
                                        : "#08519c",
                            color: "black",
                            weight: .5,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }

                }
            },
            maxZoom: 22,
            indexMaxZoom: 5,
            interactive: true,
            getFeatureId: function(feature) {
                var uniq = feature.MUN_CODE
                return uniq
            },
            name: _layer_name
        });
        map.addLayer(MUNtileLayer)
        toogleAreaStatsByMun=true;
    }
    if (_coverage_type == "Province"){
        if(_layer_name == 'Province_Falcata'){
            stats = provRepoFalcata1;
        }
        if(_layer_name == 'Province_Gmelina'){
            stats = provRepoGmelina1;
        }
        if(_layer_name == 'Province_Mangium'){
            stats = provRepoMangium1;
        }
        if(_layer_name == 'Province_Bagras'){
            stats = provRepoBagras1;
        }
        //PROVtileLayer =L.vectorGrid.slicer(null);
        PROVtileLayer = L.vectorGrid.slicer(stats, {
            rendererFactory: L.canvas.tile,
            loadingControl: true,
            vectorTileLayerStyles: {
                sliced: function(properties){
                    var area = parseFloat(properties.Area_sqm/10000);
                    if(area == 0){
                        return {
                            fillColor: "white",
                            color: "black",
                            weight: 1,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }
                    else if(area <= 10 && area > 0){
                        return {
                            fillColor: _layer_name == 'Province_Falcata' ? "#edf8e9"
                                        :_layer_name == 'Province_Gmelina' ? "#fee5d9"
                                        :_layer_name == 'Province_Mangium' ? "#f2f0f7"
                                        : "#eff3ff",
                            color: "black",
                            weight: .5,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else if(area > 10 && area <= 20){
                        return {
                            fillColor: _layer_name == 'Province_Falcata' ? "#bae4b3"
                                        :_layer_name == 'Province_Gmelina' ? "#fcae91"
                                        :_layer_name == 'Province_Mangium' ? "#cbc9e2"
                                        : "#bdd7e7",
                            color: "black",
                            weight: .5,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else if(area > 20 && area <= 30){
                        return {
                            fillColor: _layer_name == 'Province_Falcata' ? "#74c476"
                                        :_layer_name == 'Province_Gmelina' ? "#fb6a4a"
                                        :_layer_name == 'Province_Mangium' ? "#9e9ac8"
                                        : "#6baed6",
                            color: "black",
                            weight: .5,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else if(area > 30 && area <= 40){
                        return {
                            fillColor: _layer_name == 'Province_Falcata' ? "#31a354"
                                        :_layer_name == 'Province_Gmelina' ? "#de2d26"
                                        :_layer_name == 'Province_Mangium' ? "#756bb1"
                                        : "#3182bd",
                            color: "black",
                            weight: .5,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else{
                        return {
                            fillColor: _layer_name == 'Province_Falcata' ? "#006d2c"
                                        :_layer_name == 'Province_Gmelina' ? "#a50f15"
                                        :_layer_name == 'Province_Mangium' ? "#54278f"
                                        : "#08519c",
                            color: "black",
                            weight: .5,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }

                }
            },
            maxZoom: 22,
            indexMaxZoom: 5,
            interactive: true,
            getFeatureId: function(feature) {
                var uniq = feature.PRO_CODE
                return uniq
            },
            name: _layer_name
        });
        map.addLayer(PROVtileLayer)
        toogleAreaStatsByMProv=true;
    }
}

function loadDoc() {
    var BRGYS = ['AGUSAN DEL  NORTE', 'AGUSAN DEL SUR','SURIGAO DEL NORTE','SURIGAO DEL SUR','DINAGAT ISLANDS'];
    $.getJSON(CARAGA_PLACES, function(res) {
       var province = res['province_list'];
       $.each(province, function(key,val){
            var provNmae = key;
            var muns = val;
            $.each(muns, function(key,val){
               var muns = key;
               var brgys = val;
               $.each(brgys, function(key,val){
                    var munName = key;
                    var bbrgys = val['barangay_list'];
                    for(var i = 0;i<bbrgys.length;i++){
                        if(!BRGYS.includes(munName+', '+provNmae)){
                            BRGYS.push(munName+', '+provNmae);
                        }                        
                        BRGYS.push(bbrgys[i]+', '+munName+', '+provNmae)
                    }
                
                })
           })
       })
     });
     return BRGYS;
}


 $(document).ready(function() {
    $('#staticBackdrop').modal('show');
    var Barangays = loadDoc();
    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
          var matches, substringRegex;
      
          // an array that will be populated with substring matches
          matches = [];
      
          // regex used to determine if a string contains the substring `q`
          substrRegex = new RegExp(q, 'i');
      
          // iterate through the pool of strings and for any string that
          // contains the substring `q`, add it to the `matches` array
          $.each(strs, function(i, str) {
            if (substrRegex.test(str)) {
              matches.push(str);
            }
          });
      
          cb(matches);
        };
      };
      
      
      $('#the-basics .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
      },
      {
        name: 'barangays',
        source: substringMatcher(Barangays)
      });

    //Base Maps
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; OpenStreetMap contributors',
        name:'Open Street Map',
        zIndex: 0
    })
    var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: 'Map data &copy; Google',
        name:'Google Sattelite',
        zIndex: 0
    });
    var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: 'Map data &copy; Google',
        name:'Google Hybrid',
        zIndex: 0
    }).addTo(map);
    var bingMap = L.tileLayer.bing({
        bingMapsKey: 'Ao6UEij7ZblJ1soOx6opo-plK6LyISwyibIqcPQSRWpxE_yQ27qwI7HdoDNN9ePl',
        imagerySet: 'Road',
        
    })
    var bingImagery = L.tileLayer.bing({
        bingMapsKey: 'Ao6UEij7ZblJ1soOx6opo-plK6LyISwyibIqcPQSRWpxE_yQ27qwI7HdoDNN9ePl',
        imagerySet: 'Aerial'
    })
    var bingHybrid= L.tileLayer.bing({
        bingMapsKey: 'Ao6UEij7ZblJ1soOx6opo-plK6LyISwyibIqcPQSRWpxE_yQ27qwI7HdoDNN9ePl',
        imagerySet: 'AerialWithLabels'
    })
    //End Base Map

    //Controls
    var loading = L.Control.loading({
        position:'topleft',
        separate: true
    });
    map.addControl(loading)
    var legend_trees = L.control({ position: "topright" });
    legend_trees.onAdd = function(map) {
        var div = L.DomUtil.create("div", "maplegend");
        div.innerHTML += "<h4>Trees</h4>";
        div.innerHTML += '<i style="background: #006d2c"></i><span>Falcata</span><br>';
        div.innerHTML += '<i style="background: #a50f15"></i><span>Gmelina</span><br>';
        div.innerHTML += '<i style="background: #54278f"></i><span>Mangium</span><br>'; 
        div.innerHTML += '<i style="background: #08519c"></i><span>Bagras</span><br>';
    return div;
    };
    var legend_area = L.control({ position: "topright" });
    //legend.addTo(map);

    var measureControl = new L.Control.Measure({
        position: 'topright',
        primaryLengthUnit: 'feet', secondaryLengthUnit: 'kilometers',
        primaryAreaUnit: 'hectares', secondaryAreaUnit: 'sqmeters' 
    });
    measureControl.addTo(map);

    //End Controls

    // create the sidebar instance and add it to the map
    var sidebar = L.control.sidebar({ container: 'sidebar' }).addTo(map);
    // be notified when a panel is opened
    sidebar.on('content', function (ev) {
        switch (ev.id) {
            case 'autopan':
            sidebar.options.autopan = true;
            break;
            default:
            sidebar.options.autopan = false;
        }
    });


    //LAYERS
    $("select#layers").treeMultiselect({
        allowBatchSelection: false,
        showSectionOnSelected: false,
        onChange: function(allSelectedItems, addedItems, removedItems){
            if(map.hasLayer(FILTERED_LAYER)){
                map.removeLayer(FILTERED_LAYER)
            }
            var layerAdd =  null;
            var layerAddText = null;
            var layerAddDataSection = null;
            var layerRemove = null;
            var layerRemoveText = null;
            
            if(removedItems.length>0){
                
                layerRemove = removedItems[0].value;
                layerRemoveText = removedItems[0].text;
                console.log('removed',layerRemoveText);
                
                $.each(treesRepo1.features, function(idx,val){
                    delete treesRepo1.features[idx][layerRemoveText];
 
                });
                console.log(treesRepo1)
            }
            if(addedItems.length>0){
                console.log('added',addedItems);
                if(!loadedLayers.includes(addedItems[0])){
                    loadedLayers.push(addedItems[0]);
                    console.log(loadedLayers)
                }
               
                layerAdd = addedItems[0].value;
                layerAddText = addedItems[0].text;
                layerAddDataSection = addedItems[0].section.split('/');
                
            }
            if (layerAdd === 'trees'){
                legend_trees.addTo(map);
                map.removeControl(legend_area);
                var idx = LAYERS.indexOf('stats');
                LAYERS.splice(idx,1);
                toogleBAGRAS = false;
                toogleFALCATA = false;
                toogleMANGIUM = false;
                toogleGMELINA = false;
                //START REMOVE OTHER LAYERS
                for(var i=0;i<loadedLayers.length;i++){
                    if(loadedLayers[i].value != 'trees'){
                        var selectionNode = loadedLayers[i].node;
                        selectionNode.getElementsByTagName('input')[0].checked = false;
                        $('.item[data-key="'+loadedLayers[i].id+'"] span.remove-selected').click();
                    }
                }
                if(groupAreaStats.hasLayer(BRGYtileLayer)){
                    map.removeLayer(BRGYtileLayer)
                }
                if(groupAreaStats.hasLayer(MUNtileLayer)){
                    map.removeLayer(MUNtileLayer)
                }
                if(groupAreaStats.hasLayer(PROVtileLayer)){
                    map.removeLayer(PROVtileLayer)
                }
 
                //END REMOVE OTHER LAYERS
                TREES_FILTER = layerAddText;
                if (layerAddText === 'Bagras' && toogleBAGRAS == false){
                    addBAGRAS(BAGRAS_GEOJSON);
                }
                if (layerAddText === 'Bagras' && toogleBAGRAS == true){
                    map.addLayer(BAGRAStileLayer);
                }

                if(layerAddText === 'Falcata' && toogleFALCATA == false){
                    addFALCATA(FALCATA_GEOJSON);
                }
                if(layerAddText === 'Falcata' && toogleFALCATA == true){
                    map.addLayer(FALCATAtileLayer);
                }
                if(layerAddText === 'Gmelina' && toogleGMELINA == false){
                    addGMELINA(GMELINA_GEOJSON);
                }
                if(layerAddText === 'Gmelina' && toogleGMELINA == true){
                    map.addLayer(GMELINAtileLayer);
                }
                if(layerAddText === 'Mangium' && toogleMANGIUM == false){
                    addMANGIUM(MANGIUM_GEOJSON);
                }
                if(layerAddText === 'Mangium' && toogleMANGIUM == true){
                    map.addLayer(MANGIUMtileLayer);
                }

                if(!LAYERS.includes(layerAddText+'_trees')){
                    LAYERS.push(layerAddText+'_trees');
                }
            }

            if (layerAdd === 'green'){
                legend_trees.addTo(map);
                map.removeControl(legend_area);
                var idx = LAYERS.indexOf('stats');
                LAYERS.splice(idx,1);
                toogleBAGRAS = false;
                toogleFALCATA = false;
                toogleMANGIUM = false;
                toogleGMELINA = false;
               
                //START REMOVE AREA STATS LAYERS
                for(var i=0;i<loadedLayers.length;i++){
                    if(loadedLayers[i].value != 'green'){
                        var selectionNode = loadedLayers[i].node;
                        selectionNode.getElementsByTagName('input')[0].checked = false;
                        $('.item[data-key="'+loadedLayers[i].id+'"] span.remove-selected').click();
                    }
                }
                if(groupAreaStats.hasLayer(BRGYtileLayer)){
                    map.removeLayer(BRGYtileLayer)
                }
                if(groupAreaStats.hasLayer(MUNtileLayer)){
                    map.removeLayer(MUNtileLayer)
                }
                if(groupAreaStats.hasLayer(PROVtileLayer)){
                    map.removeLayer(PROVtileLayer)
                }
 
                //END REMOVE AREA STATS LAYERS
                TREES_FILTER = layerAddText;
                if (layerAddText === 'Bagras' && toogleBAGRAS == false){
                    addBAGRAS(NGP_BAGRAS);
                }
                if (layerAddText === 'Bagras' && toogleBAGRAS == true){
                    map.addLayer(BAGRAStileLayer);
                }

                if(layerAddText === 'Falcata' && toogleFALCATA == false){
                    addFALCATA(NGP_FALCATA);
                }
                if(layerAddText === 'Falcata' && toogleFALCATA == true){
                    map.addLayer(FALCATAtileLayer);
                }
                if(layerAddText === 'Gmelina' && toogleGMELINA == false){
                    addGMELINA(NGP_GMELINA);
                }
                if(layerAddText === 'Gmelina' && toogleGMELINA == true){
                    map.addLayer(GMELINAtileLayer);
                }
                if(layerAddText === 'Mangium' && toogleMANGIUM == false){
                    addMANGIUM(NGP_MANGIUM);
                }
                if(layerAddText === 'Mangium' && toogleMANGIUM == true){
                    map.addLayer(MANGIUMtileLayer);
                }

                if(!LAYERS.includes(layerAddText+'_green')){
                    LAYERS.push(layerAddText+'_green');
                }
            }

            if (layerAdd === 'stats'){
                map.removeControl(legend_trees);
                for(var i=0;i<loadedLayers.length;i++){
                    var selectionNode = loadedLayers[i].node;
                    if(loadedLayers[i].id != addedItems[0].id){
                        console.log(loadedLayers[i].id, addedItems[0].id)                   
                        selectionNode.getElementsByTagName('input')[0].checked = false;      
                        $('.item[data-key="'+loadedLayers[i].id+'"] span.remove-selected').click();
                    }else{
                        selectionNode.getElementsByTagName('input')[0].checked = true;
                    }
                }
                console.log('all selected',loadedLayers)
                if(groupAreaStats.hasLayer(BRGYtileLayer)){
                    map.removeLayer(BRGYtileLayer)
                }

                if(groupAreaStats.hasLayer(MUNtileLayer)){
                    map.removeLayer(MUNtileLayer)
                }

                if(groupAreaStats.hasLayer(PROVtileLayer)){
                    map.removeLayer(PROVtileLayer)
                }


                if(groupTrees.hasLayer(FALCATAtileLayer)){
                    map.removeLayer(FALCATAtileLayer)
                }

                if(groupTrees.hasLayer(GMELINAtileLayer)){
                    map.removeLayer(GMELINAtileLayer)
                }

                if(groupTrees.hasLayer(MANGIUMtileLayer)){
                    map.removeLayer(MANGIUMtileLayer)
                }
                if(groupTrees.hasLayer(BAGRAStileLayer)){
                    map.removeLayer(BAGRAStileLayer)
                }
                var idx = LAYERS.indexOf('stats');
                if(idx == -1){
                    LAYERS.push('stats');
                }
               
                var URL = null;
                var layerName = layerAddText+'_'+layerAddDataSection[2];
                var treeName = layerAddDataSection[2];
                if(activeStatsLayer == null){
                    activeStatsLayer = layerName
                }
                if(activeTreeName == null){
                    activeTreeName = 'Nothing'
                }
                if(layerName == 'Barangay_Falcata'){
                    URL = BRGY_FALCATA;
                }
                if(layerName == 'Barangay_Gmelina'){
                    URL = BRGY_GMELINA
                }
                if(layerName == 'Barangay_Mangium'){
                    URL = BRGY_MANGIUM
                }
                if(layerName == 'Barangay_Bagras'){
                    console.log('bagras')
                   URL = BRGY_BAGRAS 
                }
                
                if(layerName == 'City/Municipality_Falcata'){
                    URL = MUN_FALCATA;
                }
                if(layerName == 'City/Municipality_Gmelina'){
                    URL = MUN_GMELINA
                }
                if(layerName == 'City/Municipality_Mangium'){
                    URL = MUN_MANGIUM
                }
                if(layerName == 'City/Municipality_Bagras'){
                    URL = MUN_BAGRAS
                }

                if(layerName == 'Province_Falcata'){
                    URL = PROV_FALCATA
                }
                if(layerName == 'Province_Gmelina'){
                    URL = PROV_GMELINA
                }
                if(layerName == 'Province_Mangium'){
                    URL = PROV_MANGIUM
                }
                if(layerName == 'Province_Bagras'){
                    URL = PROV_BAGRAS
                }

                TREES_FILTER = layerName;
                console.log(treeName)
                legend_area.onAdd = function(map) {
                    var div = L.DomUtil.create("div", "maplegend");
                    var zeroTenColor = treeName == 'Falcata' ? '#edf8e9':treeName == 'Gmelina' ? '#fee5d9':treeName == 'Mangium' ? '#f2f0f7': '#eff3ff';
                    var  zeroTen = "<i style='background: "+zeroTenColor+";border: 1px solid #000'></i><span> > 0&nbsp;&nbsp; to <= 10</span><br>";
                    var tenTwentyColor = treeName == 'Falcata' ? "#bae4b3":treeName == 'Gmelina' ? "#fcae91":treeName == 'Mangium' ? "#cbc9e2":"#bdd7e7";
                    var tenTwenty = "<i style='background: "+tenTwentyColor+";border: 1px solid #000'></i><span> > 10 to <= 20</span><br>";
                    var Twenty30Color = treeName == 'Falcata' ? "#74c476":treeName == 'Gmelina' ? "#fb6a4a":treeName == 'Mangium' ? "#9e9ac8" : "#6baed6";
                    var Twenty30 = "<i style='background: "+Twenty30Color+";border: 1px solid #000'></i><span> > 20 to <=30</span><br>";
                    var thirty40Color = treeName == 'Falcata' ? "#31a354":treeName == 'Gmelina' ? "#de2d26":treeName == 'Mangium' ? "#756bb1" : "#3182bd";
                    var thirty40 = "<i style='background: "+thirty40Color+";border: 1px solid #000'></i><span> > 30 to <= 40</span><br>";
                    var fortyLastColor = treeName == 'Falcata' ? "#006d2c":treeName == 'Gmelina' ? "#a50f15":treeName == 'Mangium' ? "#54278f" : "#08519c";
                    var fortyLast = "<i style='background: "+fortyLastColor+";border: 1px solid #000'></i><span> > 40 </span><br>";
                    
                    
                    div.innerHTML += "<h4>"+treeName+" Area & Statistics in hectare</h4>";
                    div.innerHTML += '<i style="background: #ffffff;border: 1px solid #000"></i><span>&nbsp;&nbsp;&nbsp;0 </span><br>';
                    div.innerHTML += zeroTen;
                    div.innerHTML += tenTwenty;
                    div.innerHTML += Twenty30;
                    div.innerHTML += thirty40;
                    div.innerHTML += fortyLast;
                return div;
                };
                legend_area.addTo(map)
                if((coverage_type != layerAddText || layerName !=activeStatsLayer) && !LAYERS.includes(layerName)){
                    toogleAreaStats = false;
                }

                if(layerName !=activeStatsLayer && treeName !=activeTreeName && !LAYERS.includes(layerName)){
                    toogleAreaStatsByBrgy = false;
                    toogleAreaStatsByMun = false;
                    toogleAreaStatsByMProv = false;
                }

                console.log(layerName, activeStatsLayer);
                console.log(treeName, activeTreeName);
                
                if(!LAYERS.includes(layerName)){
                    LAYERS.push(layerName);
                }
                activeStatsLayer = layerName;
                activeTreeName = treeName;


                console.log('toogleAreaStats',toogleAreaStats);
                console.log('toogleAreaStatsByBrgy',toogleAreaStatsByBrgy);
                console.log('toogleAreaStatsByMun',toogleAreaStatsByMun);
                console.log('toogleAreaStatsByMProv',toogleAreaStatsByMProv);

                if (toogleAreaStats == false && layerAddText == 'Barangay' && toogleAreaStatsByBrgy == false){
                    addLayerStats(URL, layerAddText, layerName);
                }
                if (toogleAreaStats == true && LAYERS.includes(layerName) && layerAddText == 'Barangay' ){
                    loadLayerStats(URL, layerAddText, layerName);
                    console.log('load again..',layerName)
                }
               
                if (toogleAreaStats == false && layerAddText == 'City/Municipality' && toogleAreaStatsByMun == false){
                    addLayerStats(URL,layerAddText,  layerName);
                }
                if (toogleAreaStats == true && LAYERS.includes(layerName) && layerAddText == 'City/Municipality'){
                    loadLayerStats(URL, layerAddText, layerName);
                    console.log('load again..',layerName)
                }

                if (toogleAreaStats == false && layerAddText == 'Province'  && toogleAreaStatsByMProv == false){
                    addLayerStats(URL,layerAddText,  layerName);
                }
                if (toogleAreaStats == true && LAYERS.includes(layerName) && layerAddText == 'Province'){
                    loadLayerStats(URL, layerAddText, layerName);
                    console.log('load again..',layerName)
                }
            }
            
            //toogle hide trees layers
            if (layerRemoveText === 'Falcata' && groupTrees.hasLayer(FALCATAtileLayer)){map.removeLayer(FALCATAtileLayer);}
            if (layerRemoveText === 'Bagras' && groupTrees.hasLayer(BAGRAStileLayer)){map.removeLayer(BAGRAStileLayer);}
            if (layerRemoveText === 'Gmelina' && groupTrees.hasLayer(GMELINAtileLayer)){map.removeLayer(GMELINAtileLayer);}
            if (layerRemoveText === 'Mangium' && groupTrees.hasLayer(MANGIUMtileLayer)){map.removeLayer(MANGIUMtileLayer);}
            
            if (layerRemove === 'stats'){
                if(layerRemoveText == 'Barangay'){
                    map.removeLayer(BRGYtileLayer)
                }
                if(layerRemoveText == 'City/Municipality'){
                    map.removeLayer(MUNtileLayer)
                }
                if(layerRemoveText == 'Province'){
                    map.removeLayer(PROVtileLayer)
                }
            }
          
            
        },
        startCollapsed: true
      });

    $('#base_map').multiselect({
        multiple: false,
        onChange: function(option, checked, select) {
            var base_map =  $(option).val();
            if (base_map == 'osm'){
                map.removeLayer(googleSat);
                map.removeLayer(googleHybrid);
                map.addLayer(osm);
                map.removeLayer(bingMap);
                map.removeLayer(bingHybrid);    
                map.removeLayer(bingImagery);    
            }else if(base_map == 'googleHybrid'){
                map.addLayer(googleHybrid);
                map.removeLayer(googleSat);
                map.removeLayer(osm);
                map.removeLayer(bingMap);  
                map.removeLayer(bingHybrid);    
                map.removeLayer(bingImagery);  
            }else if(base_map == 'bingmap'){
                map.addLayer(bingMap);
                map.removeLayer(googleSat);
                map.removeLayer(osm);
                map.removeLayer(googleHybrid); 
                map.removeLayer(bingHybrid);    
                map.removeLayer(bingImagery);      
            }else if(base_map == 'bingimagery'){
                map.addLayer(bingImagery);
                map.removeLayer(bingMap);   
                map.removeLayer(googleSat);
                map.removeLayer(osm);
                map.removeLayer(googleHybrid);    
                map.removeLayer(bingHybrid);     
            }else if(base_map == 'binghybrid'){
                map.addLayer(bingHybrid);
                map.removeLayer(bingMap);   
                map.removeLayer(googleSat);
                map.removeLayer(osm);
                map.removeLayer(googleHybrid);      
                map.removeLayer(bingImagery);    
            }else{
                map.addLayer(googleSat);
                map.removeLayer(osm);
                map.removeLayer(googleHybrid);     
                map.removeLayer(bingMap);  
                map.removeLayer(bingHybrid);      
            }
        } 
    });
    $('#trees').val('').multiselect({
        multiple: false,
        nonSelectedText: 'Select Tree',
        onChange: function(option, checked, select) {
            if(map.hasLayer(FILTERED_LAYER)){
                map.removeLayer(FILTERED_LAYER)
            }
            var layer =  $(option).val();
            TREES_FILTER = layer;
            if (checked){
                for(var i=0;i<loadedLayers.length;i++){
                    var selectionNode = loadedLayers[i].node;
                    selectionNode.getElementsByTagName('input')[0].checked = false;
                    $('.item[data-key="'+loadedLayers[i].id+'"] span.remove-selected').click();

                }
                var idx = LAYERS.indexOf('stats');
                LAYERS.splice(idx,1);
                if(groupAreaStats.hasLayer(BRGYtileLayer)){
                    map.removeLayer(BRGYtileLayer)
                }

                if(groupAreaStats.hasLayer(MUNtileLayer)){
                    map.removeLayer(MUNtileLayer)
                }

                if(groupAreaStats.hasLayer(PROVtileLayer)){
                    map.removeLayer(PROVtileLayer)
                }


                if(groupTrees.hasLayer(FALCATAtileLayer)){
                    map.removeLayer(FALCATAtileLayer)
                }

                if(groupTrees.hasLayer(GMELINAtileLayer)){
                    map.removeLayer(GMELINAtileLayer)
                }

                if(groupTrees.hasLayer(MANGIUMtileLayer)){
                    map.removeLayer(MANGIUMtileLayer)
                }
                if(groupTrees.hasLayer(BAGRAStileLayer)){
                    map.removeLayer(BAGRAStileLayer)
                }
                console.log(checked);
                if (layer === 'Bagras' && toogleBAGRAS == false){
                    addBAGRAS(BAGRAS_GEOJSON);
                }
                if (layer === 'Bagras' && toogleBAGRAS == true){
                    map.addLayer(BAGRAStileLayer);
                }

                if (layer === 'Falcata' && toogleFALCATA == false){
                    addFALCATA(FALCATA_GEOJSON);
                }
                if(layer === 'Falcata' && toogleFALCATA == true){
                    map.addLayer(FALCATAtileLayer);
                }
                if (layer === 'Gmelina' && toogleGMELINA == false){
                    addGMELINA(GMELINA_GEOJSON);
                }
                if(layer === 'Gmelina' && toogleGMELINA == true){
                    map.addLayer(GMELINAtileLayer);
                }
                if (layer === 'Mangium' && toogleMANGIUM == false){
                    addMANGIUM(MANGIUM_GEOJSON);
                }
                if(layer === 'Mangium' && toogleMANGIUM == true){
                    map.addLayer(MANGIUMtileLayer);
                }
            }
        }
    });
    //END LAYERS

   
    //MAP Interaction
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Area in hectares',
                data: [],
                backgroundColor: []
            }]
        },
        options: {
           legend: {
               labels: {
               boxWidth: 0,
               }
           },
           title: {
               display: true,
               text: ''
           },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    map.on('click', function(e) {
        if (highlight){
            map.removeLayer(highlight)
        }
        var x = e.latlng.lng;
        var y = e.latlng.lat;
        var layerData = leafletPip.pointInLayer([x,y], treesRepo, true);
        var layerData1 = null; 
        var layerName = activeStatsLayer;
        var backgroundColor = "grey";

        if(layerName == 'Barangay_Falcata'){
            layerData1 =  leafletPip.pointInLayer([x,y], brgyRepoFalcata, true);
            backgroundColor = '#006d2c';
        }
        if(layerName == 'Barangay_Gmelina'){
            layerData1 =  leafletPip.pointInLayer([x,y], brgyRepoGmelina, true);
            backgroundColor = '#a50f15';
        }
        if(layerName == 'Barangay_Mangium'){
            layerData1 =  leafletPip.pointInLayer([x,y], brgyRepoMangium, true);
            backgroundColor = '#54278f';
        }
        if(layerName == 'Barangay_Bagras'){
            layerData1 =  leafletPip.pointInLayer([x,y], brgyRepoBagras, true);
            backgroundColor = '#08519c';
        }
        
        if(layerName == 'City/Municipality_Falcata'){
            layerData1 =  leafletPip.pointInLayer([x,y], munRepoFalcata, true);
            backgroundColor = '#006d2c';
        }
        if(layerName == 'City/Municipality_Gmelina'){
            layerData1 =  leafletPip.pointInLayer([x,y], munRepoGmelina, true);
            backgroundColor = '#a50f15';
        }
        if(layerName == 'City/Municipality_Mangium'){
            layerData1 =  leafletPip.pointInLayer([x,y], munRepoMangium, true);
            backgroundColor = '#54278f';
        }
        if(layerName == 'City/Municipality_Bagras'){
            layerData1 =  leafletPip.pointInLayer([x,y], munRepoBagras, true);
            backgroundColor = '#08519c';
        }

        if(layerName == 'Province_Falcata'){
            layerData1 =  leafletPip.pointInLayer([x,y], provRepoFalcata, true);
            backgroundColor = '#006d2c';
        }
        if(layerName == 'Province_Gmelina'){
            layerData1 =  leafletPip.pointInLayer([x,y], provRepoGmelina, true);
            backgroundColor = '#a50f15';
        }
        if(layerName == 'Province_Mangium'){
            layerData1 =  leafletPip.pointInLayer([x,y], provRepoMangium, true);
            backgroundColor = '#54278f';
        }
        if(layerName == 'Province_Bagras'){
            layerData1 =  leafletPip.pointInLayer([x,y], provRepoBagras, true);
            backgroundColor = '#08519c';
        }

       
     
        if (layerData[0] && LAYERS.includes('stats') == false) {
            console.log('no stats')
            var highlightProp = layerData[0].feature.properties;
            console.log(highlightProp)
            var feature = layerData[0].feature;
            highlight = new L.geoJson(feature, {
                style: {
                    color:'white', 
                    fillColor:'white'
                }
            });
            var popup = '<strong>Species:</strong> ' + highlightProp.Species+'</br><strong>Location:</strong> '+highlightProp.Bgy_Name+', '+highlightProp.Mun_Name+', '+highlightProp.Pro_Name+', '+highlightProp.Reg_Name+'</br>'+'<strong>Area in hectares:</strong>'+parseFloat(highlightProp.Area_sqm/10000);
            map.on('popupclose', function() {
                map.removeLayer(highlight)
            });
            setTimeout(function() {
                highlight.addTo(map);
                map.openPopup(popup, e.latlng);
            }, 50);
        
        }

        if (layerData1[0] && LAYERS.includes('stats')) {
            var highlightIndex = layerData1[0].feature.id;
            console.log(highlightIndex);
            var highlightProp = layerData1[0].feature.properties;
            var location = '';
            if(highlightProp.Bgy_Name){
                location = highlightProp.Bgy_Name+', '+highlightProp.Mun_Name+ ', '+highlightProp.Pro_Name;
            }else if(highlightProp.Mun_Name){
                location = highlightProp.Mun_Name+ ', '+highlightProp.Pro_Name;
            }else{
                location =highlightProp.Pro_Name;
            }
            var feature = layerData1[0].feature;
            highlight = new L.geoJson(feature, {
                style: {
                    color:'white', 
                    fillColor:'white'
                },
            });
            var data = parseFloat(highlightProp.Area_sqm/10000);
            var newData = [data];
            myChart.data["datasets"][0]["data"] = newData;
            myChart.data["datasets"][0]["backgroundColor"] = backgroundColor;
            myChart.data["labels"][0] = highlightProp.Species ;
            myChart.options.title.text = location;
            myChart.update();
            setTimeout(function() {
                highlight.addTo(map);
                $('#chartMe').modal('show');
            }, 50);
            $('#chartMe').on('hidden.bs.modal', function (e) {
                map.removeLayer(highlight);
            })
        }
    });

    /*
    var cbr_tile = new L.TileLayer.GWC('./http://127.0.0.1/itps_webapp/data/UAS/EPSG_900913_{z}/{dir_x}_{dir_y}/{x}_{y}.png', {
        minZoom: 8,
        maxZoom: 21,
        tms: true
    });
    cbr_tile.addTo(map)
    **/ 


    //OTHERS
    $("#citymun").remoteChained({
        parents: "#prov",
        url: CARAGA_PLACES,
        data: function (json) {
            var provVal = $('#prov').val();
            var munList = json.province_list[provVal]['municipality_list'];
            var munArr = [];
            munArr.push({
               '-':'Select City/Municipality'
            })
            $.each(munList, function(key){
                var obj = {};
                obj[key] = key;
                munArr.push(obj)
            });
            return munArr;
        }
    });
    $("#brgy").remoteChained({
        parents: "#citymun, #prov",
        url: CARAGA_PLACES,
        data: function (json) {
            var provVal = $('#prov').val();
            var munVal = $('#citymun').val();
            var brgyList = json.province_list[provVal].municipality_list[munVal].barangay_list;
            var brgyArr = [];
            brgyArr.push({
                '-':'Select Barangay'
            })
            brgyList.forEach(element => {
                var obj = {};
                obj[element] = element;
                brgyArr.push(obj)
            });
            return brgyArr;
        }
    });
    $('#btnOK').click(function(){
        sidebar.open('about');
    })
    $('#btnWebMap').click(function(){
        sidebar.open('query');
    })
    $('#btnSearhDL').click(function(){
        sidebar.open('download');
    })
    $('#btnWebMap1').click(function(){
        sidebar.open('query');
    })
    $('#btnSearhDL1').click(function(){
        sidebar.open('download');
    })
    $('#btnAgree').click(function(){
        sidebar.open('welcome');
    })
   
    $("#searchBarangay" ).focus(function() {
        $('#the-basics .typeahead').typeahead('val','');
    });
    
    $('#btnSearchBrgy').click(function(){
        if(map.hasLayer(FILTERED_LAYER)){
            map.removeLayer(FILTERED_LAYER)
        }
        var loc =$('#searchBarangay').val();
        var loc_split = loc.split(',');
        var brgyVal = '-';
        var munVAl = '-';
        var provVal = '-';
        console.log(loc_split);
        if(loc_split.length == 1){
            provVal = loc_split[0].trim();
        }
        if(loc_split.length == 2){
            munVAl = loc_split[0].trim();
            provVal = loc_split[1].trim();
        }
        if(loc_split.length == 3){
            brgyVal = loc_split[0].trim();
            munVAl = loc_split[1].trim();
            provVal = loc_split[2].trim();
        } 

        
        var dataGeojson = null;
        console.log('TREES_FILTER',TREES_FILTER)
        if(TREES_FILTER =='Falcata' || TREES_FILTER =='Mangium' || TREES_FILTER =='Gmelina' || TREES_FILTER =='Bagras' ){
            var features = [];
            $.each(treesRepo1.features, function(idx,val){
                $.each(val, function(key,value){
                    features.push(value)
                });
            });
            console.log(features);
            var treesGeoJSON = {
                type: "FeatureCollection",
                features: features.flat()
            }
            dataGeojson = treesGeoJSON
        }

        if(TREES_FILTER == 'Barangay_Falcata'){
            dataGeojson =  brgyRepoFalcata1;
        }
        if(TREES_FILTER == 'Barangay_Gmelina'){
            dataGeojson =  brgyRepoGmelina1;
        }
        if(TREES_FILTER == 'Barangay_Mangium'){
            dataGeojson =  brgyRepoMangium1;
        }
        if(TREES_FILTER == 'Barangay_Bagras'){
            dataGeojson =  brgyRepoBagras1;
        }
        
        if(TREES_FILTER == 'City/Municipality_Falcata'){
            dataGeojson =  munRepoFalcata1;
        }
        if(TREES_FILTER == 'City/Municipality_Gmelina'){
            dataGeojson =  munRepoGmelina1;
        }
        if(TREES_FILTER == 'City/Municipality_Mangium'){
            dataGeojson =  munRepoMangium1;
        }
        if(TREES_FILTER == 'City/Municipality_Bagras'){
            dataGeojson =  munRepoBagras1;
        }

        if(TREES_FILTER == 'Province_Falcata'){
            dataGeojson =  provRepoFalcata1;
        }
        if(TREES_FILTER == 'Province_Gmelina'){
            dataGeojson =  provRepoGmelina1;
        }
        if(TREES_FILTER == 'Province_Mangium'){
            dataGeojson =  provRepoMangium1;
        }
        if(TREES_FILTER == 'Province_Bagras'){
            dataGeojson =  provRepoBagras1;
        }

        console.log(dataGeojson)
        FILTERED_LAYER = L.geoJson(dataGeojson, {         
                style :{
                    fillColor: "#fff",
                    color: "white",
                    weight: 2,
                    fill: false,
                    stroke: true,
                    fillOpacity: 0
                },
                filter: function(feature) { 
                    if (munVAl != '-' && brgyVal != '-'){
                        return (feature.properties.Bgy_Name == brgyVal && feature.properties.Mun_Name == munVAl && feature.properties.Pro_Name == provVal)
                    }else if(munVAl != '-'){
                        return (feature.properties.Mun_Name == munVAl && feature.properties.Pro_Name == provVal)
                    }else{
                        return (feature.properties.Pro_Name == provVal)
                    }    
            }
        }).addTo(map);   
       if(dataGeojson == null){
        alert('YOU HAVE NOT SELECTED/LOADED A LAYER!')
       }
       else if(FILTERED_LAYER.getLayers().length>0){
            map.fitBounds(FILTERED_LAYER.getBounds())
       }else{
            alert('NO RESULT FOUND, TRY ANOTHER LOCATION!')
        }

        
    })
    $('#btnGo').click(function(){
        if(map.hasLayer(FILTERED_LAYER)){
            map.removeLayer(FILTERED_LAYER)
        }
        var brgyVal = $('#brgy').val();
        var munVAl = $('#citymun').val();
        var provVal = $('#prov').val();
        var dataGeojson = null;
        if(TREES_FILTER =='Falcata'){
            dataGeojson = falcataRepoJSON
        }
        if(TREES_FILTER =='Mangium'){
            dataGeojson = mangiumRepoJSON
        }
        if(TREES_FILTER =='Gmelina'){
            dataGeojson = gmelinaRepoJSON
        }
        if(TREES_FILTER =='Bagras'){
            dataGeojson = bagrasRepoJSON
        }
        FILTERED_LAYER = L.geoJson(dataGeojson, {         
                style :{
                    fillColor: "white",
                    color: "white",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: 0
                },
                filter: function(feature, layer) {    
                    if (munVAl != '-' && brgyVal != '-'){
                        return (feature.properties.Bgy_Name == brgyVal && feature.properties.Mun_Name == munVAl && feature.properties.Pro_Name == provVal)
                    }else if(munVAl != '-'){
                        return (feature.properties.Mun_Name == munVAl && feature.properties.Pro_Name == provVal)
                    }else{
                        return (feature.properties.Pro_Name == provVal)
                    }
                   
            }
        }).addTo(map);   

       if(FILTERED_LAYER.getLayers().length>0){
            map.fitBounds(FILTERED_LAYER.getBounds())
       }else{
            alert('NO RESULT FOUND, TRY ANOTHER LOCATION!')
        }

        
    })
    $('#btnClear').click(function(){
        if(map.hasLayer(FILTERED_LAYER)){
            map.removeLayer(FILTERED_LAYER)
        }
        /**
        var dataGeojson = null;
        if(TREES_FILTER =='Falcata'){
            dataGeojson = falcataRepoJSON
        }
        if(TREES_FILTER =='Mangium'){
            dataGeojson = mangiumRepoJSON
        }
        if(TREES_FILTER =='Gmelina'){
            dataGeojson = gmelinaRepoJSON
        }
        if(TREES_FILTER =='Bagras'){
            dataGeojson = bagrasRepoJSON
        }
        FILTERED_LAYER = L.geoJson(dataGeojson, {         
                style :{
                    fill: false,
                    stroke: false,
                    fillOpacity: 0
                },
        }).addTo(map);   

       if(FILTERED_LAYER.getLayers().length>0){
            map.fitBounds(FILTERED_LAYER.getBounds())
       }else{
            alert('UNABLE TO CLEAR, MAYBE NO FILTERED LAYERS ARE PRESENT.')
        }
        */

    })
   
});

