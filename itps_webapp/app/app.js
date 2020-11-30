
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
const BAGRAS_GEOJSON = "http://127.0.0.1/itps_webapp/data/RescaledRefinedBagras_CaragaRegion.json";
const MANGIUM_GEOJSON = "http://127.0.0.1/itps_webapp/data/RescaledRefinedMangium_CaragaRegion.json";
const GMELINA_GEOJSON = "http://127.0.0.1/itps_webapp/data/RescaledRefinedGmelina_CaragaRegion.json";
const FALCATA_GEOJSON = "http://127.0.0.1/itps_webapp/data/RescaledRefinedFalcata_CaragaRegion.json";

const BRGY_FALCATA = "http://127.0.0.1/itps_webapp/data/Falcata_Stats_BrgyLevel.json";
const BRGY_GMELINA = "http://127.0.0.1/itps_webapp/data/Gmelina_Stats_BrgyLevel.json";
const BRGY_MANGIUM = "http://127.0.0.1/itps_webapp/data/Mangium_Stats_BrgyLevel.json";
const BRGY_BAGRAS = "http://127.0.0.1/itps_webapp/data/Bagras_Stats_BrgyLevel.json";

const MUN_FALCATA = "http://127.0.0.1/itps_webapp/data/Falcata_Stats_MunLevel.json";
const MUN_GMELINA = "http://127.0.0.1/itps_webapp/data/Gmelina_Stats_MunLevel.json";
const MUN_MANGIUM = "http://127.0.0.1/itps_webapp/data/Mangium_Stats_MunLevel.json";
const MUN_BAGRAS = "http://127.0.0.1/itps_webapp/data/Bagras_Stats_MunLevel.json";

const PROV_FALCATA = "http://127.0.0.1/itps_webapp/data/Falcata_Stats_ProvLevel.json";
const PROV_GMELINA = "http://127.0.0.1/itps_webapp/data/Gmelina_Stats_ProvLevel.json";
const PROV_MANGIUM = "http://127.0.0.1/itps_webapp/data/Mangium_Stats_ProvLevel.json";
const PROV_BAGRAS = "http://127.0.0.1/itps_webapp/data/Bagras_Stats_ProvLevel.json";

// standard leaflet map setup
var map = L.map('map');
map.setView([9.1204, 125.59], 8);

var treesRepo = L.geoJson(null);
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
var munRepoMangium = null;
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
var groupAreaStats = new L.layerGroup();
var groupTrees = new L.layerGroup();

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

function addFALCATA(){
    var trees;
    if (toogleFALCATA == false){
        $('#loadMe').modal('show');
        var data = omnivore.geojson(FALCATA_GEOJSON);
       
        data.on('ready', function() {
            console.log('ready');
            trees = data.toGeoJSON();
            treesRepo.addData(trees);
            FALCATAtileLayer = L.vectorGrid.slicer(trees, {
                rendererFactory: L.canvas.tile,
                vectorTileLayerStyles: {
                    sliced: {
                        fillColor: "skyblue",
                        color: "blue",
                        weight: .1,
                        fill: true,
                        stroke: true,
                        fillOpacity: .8
                    }
                },
                maxZoom: 22,
                indexMaxZoom: 5,
                interactive: true,
                getFeatureId: function(feature) {
                    return feature.id
                }
            }).addTo(map);
            toogleFALCATA = true;
            console.log('added to map');
            groupTrees.addLayer(FALCATAtileLayer);
            setTimeout(function() {
                $('#loadMe').modal('hide');
            }, 500);          
           
        });   
    }
}
function addMANGIUM(){
    var trees;
    if (toogleMANGIUM == false){
        $('#loadMe').modal('show');
        var data = omnivore.geojson(MANGIUM_GEOJSON);
        data.on('ready', function() {
            console.log('ready');
            trees = data.toGeoJSON();
            treesRepo.addData(trees);
            MANGIUMtileLayer = L.vectorGrid.slicer(trees, {
                rendererFactory: L.canvas.tile,
                vectorTileLayerStyles: {
                    sliced: {
                        fillColor: "orange",
                        color: "orange",
                        weight: .1,
                        fill: true,
                        stroke: true,
                        fillOpacity: .8
                    }
                },
                maxZoom: 22,
                indexMaxZoom: 5,
                interactive: true,
                getFeatureId: function(feature) {
                    return feature.id
                }
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
function addGMELINA(){
    var trees;
    if (toogleGMELINA == false){
         $('#loadMe').modal('show');
        var data = omnivore.geojson(GMELINA_GEOJSON);
        data.on('ready', function() {
            console.log('ready');
            trees = data.toGeoJSON();
            treesRepo.addData(trees);
            GMELINAtileLayer = L.vectorGrid.slicer(trees, {
                rendererFactory: L.canvas.tile,
                vectorTileLayerStyles: {
                    sliced: {
                        fillColor: "red",
                        color: "red",
                        weight: .1,
                        fill: true,
                        stroke: true,
                        fillOpacity: .8
                    }
                },
                maxZoom: 22,
                indexMaxZoom: 5,
                interactive: true,
                getFeatureId: function(feature) {
                    return feature.id
                }
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
function addBAGRAS(){
    var trees;
    if(toogleBAGRAS == false){
        $('#loadMe').modal('show');
        var data = omnivore.geojson(BAGRAS_GEOJSON);
        data.on('ready', function() {
            console.log('ready');
           
            trees = data.toGeoJSON();
            treesRepo.addData(trees);
            BAGRAStileLayer = L.vectorGrid.slicer(trees, {
                rendererFactory: L.canvas.tile,
                loadingControl: true,
                vectorTileLayerStyles: {
                    sliced: {
                        fillColor: "green",
                        color: "blue",
                        weight: .1,
                        fill: true,
                        stroke: true,
                        fillOpacity: .8
                    }
                },
                maxZoom: 22,
                indexMaxZoom: 5,
                interactive: true,
                getFeatureId: function(feature) {
                    return feature.id
                }
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
        var data = omnivore.geojson(URL);
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
                        sliced: function(properties, zoom){
                            var area = properties.Area_sqm;
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
                            else if(area <= 20000){
                                return {
                                    fillColor: "yellow",
                                    color: "black",
                                    weight: 1,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 20000 && area <= 40000){
                                return {
                                    fillColor: "orange",
                                    color: "black",
                                    weight: 1,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else{
                                return {
                                    fillColor: "red",
                                    color: "black",
                                    weight: 1,
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
                        sliced: function(properties, zoom){
                            var area = properties.Area_sqm;
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
                            else if(area <= 20000){
                                return {
                                    fillColor: "yellow",
                                    color: "black",
                                    weight: 1,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 20000 && area <= 40000){
                                return {
                                    fillColor: "orange",
                                    color: "black",
                                    weight: 1,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else{
                                return {
                                    fillColor: "red",
                                    color: "black",
                                    weight: 1,
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
                        sliced: function(properties, zoom){
                            var area = properties.Area_sqm;
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
                            else if(area <= 20000){
                                return {
                                    fillColor: "yellow",
                                    color: "black",
                                    weight: 1,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 20000 && area <= 40000){
                                return {
                                    fillColor: "orange",
                                    color: "black",
                                    weight: 1,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else{
                                return {
                                    fillColor: "red",
                                    color: "black",
                                    weight: 1,
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
        BRGYtileLayer =L.vectorGrid.slicer(null);
        BRGYtileLayer = L.vectorGrid.slicer(stats, {
            rendererFactory: L.canvas.tile,
            loadingControl: true,
            vectorTileLayerStyles: {
                sliced: function(properties, zoom){
                    var area = properties.Area_sqm;
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
                    else if(area <= 20000){
                        return {
                            fillColor: "yellow",
                            color: "black",
                            weight: 1,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else if(area > 20000 && area <= 40000){
                        return {
                            fillColor: "orange",
                            color: "black",
                            weight: 1,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else{
                        return {
                            fillColor: "red",
                            color: "black",
                            weight: 1,
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
        MUNtileLayer =L.vectorGrid.slicer(null);
        MUNtileLayer = L.vectorGrid.slicer(stats, {
            rendererFactory: L.canvas.tile,
            loadingControl: true,
            vectorTileLayerStyles: {
                sliced: function(properties, zoom){
                    var area = properties.Area_sqm;
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
                    else if(area <= 20000){
                        return {
                            fillColor: "yellow",
                            color: "black",
                            weight: 1,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else if(area > 20000 && area <= 40000){
                        return {
                            fillColor: "orange",
                            color: "black",
                            weight: 1,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else{
                        return {
                            fillColor: "red",
                            color: "black",
                            weight: 1,
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
        PROVtileLayer =L.vectorGrid.slicer(null);
        PROVtileLayer = L.vectorGrid.slicer(stats, {
            rendererFactory: L.canvas.tile,
            loadingControl: true,
            vectorTileLayerStyles: {
                sliced: function(properties, zoom){
                    var area = properties.Area_sqm;
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
                    else if(area <= 20000){
                        return {
                            fillColor: "yellow",
                            color: "black",
                            weight: 1,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else if(area > 20000 && area <= 40000){
                        return {
                            fillColor: "orange",
                            color: "black",
                            weight: 1,
                            fill: true,
                            stroke: true,
                            fillOpacity: .8
                        }
                    }else{
                        return {
                            fillColor: "red",
                            color: "black",
                            weight: 1,
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

 $(document).ready(function() {

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
    //End Base Map

    //Controls
    var loading = L.Control.loading({
        position:'topleft',
        separate: true
    });
    map.addControl(loading)
    var legend = L.control({ position: "topright" });
    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "maplegend");
        div.innerHTML += "<h4>Trees</h4>";
        div.innerHTML += '<i style="background: skyblue"></i><span>Falcata</span><br>';
        div.innerHTML += '<i style="background: green"></i><span>Bagras</span><br>';
        div.innerHTML += '<i style="background: red"></i><span>Gmelina</span><br>';
        div.innerHTML += '<i style="background: orange"></i><span>Mangium</span><br>'; 
       
    return div;
    };
    legend.addTo(map);
    //End Controls

    // create the sidebar instance and add it to the map
    var sidebar = L.control.sidebar({ container: 'sidebar' }).addTo(map).open('home');
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
            var layerAdd =  null;
            var layerAddText = null;
            var layerAddDataSection = null;
            var layerRemove = null;
            var layerRemoveText = null;
            
            if(removedItems.length>0){
                console.log('removed',removedItems);
                layerRemove = removedItems[0].value;
                layerRemoveText = removedItems[0].text;
            }
            if(addedItems.length>0){
                console.log('added',addedItems);
                if(!loadedLayers.includes(addedItems[0])){
                    loadedLayers.push(addedItems[0]);
                }
               
                layerAdd = addedItems[0].value;
                layerAddText = addedItems[0].text;
                layerAddDataSection = addedItems[0].section.split('/');
                
            }
            if (layerAdd === 'trees'){

                var idx = LAYERS.indexOf('stats');
                LAYERS.splice(idx,1);

                //START REMOVE AREA STATS LAYERS
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

                if (layerAddText === 'Bagras' && toogleBAGRAS == false){
                    addBAGRAS();
                }
                if (layerAddText === 'Bagras' && toogleBAGRAS == true){
                    map.addLayer(BAGRAStileLayer);
                }
                if(layerAddText === 'Falcata' && toogleFALCATA == false){
                    addFALCATA();
                }
                if(layerAddText === 'Falcata' && toogleFALCATA == true){
                    map.addLayer(FALCATAtileLayer);
                }
                if(layerAddText === 'Gmelina' && toogleGMELINA == false){
                    addGMELINA();
                }
                if(layerAddText === 'Gmelina' && toogleGMELINA == true){
                    map.addLayer(GMELINAtileLayer);
                }
                if(layerAddText === 'Mangium' && toogleMANGIUM == false){
                    addMANGIUM();
                }
                if(layerAddText === 'Mangium' && toogleMANGIUM == true){
                    map.addLayer(MANGIUMtileLayer);
                }
            }

            if (layerAdd === 'stats'){
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
                    activeStatsLayer = 'Nothing'
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

              

                if(coverage_type != layerAddText && layerName !=activeStatsLayer){
                    toogleAreaStats = false;
                }

                if(layerName !=activeStatsLayer && treeName !=activeTreeName && !LAYERS.includes(layerName) && coverage_type != layerAddText){
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
                

                console.log(layerAdd,layerAddText,coverage_type, toogleAreaStats, layerName)

                if (toogleAreaStats == false && layerAddText == 'Barangay' && toogleAreaStatsByBrgy == false){
                    addLayerStats(URL, layerAddText, layerName);
                }
                if (toogleAreaStatsByBrgy == true && layerAddText == 'Barangay'){
                    loadLayerStats(URL, layerAddText, layerName);
                    console.log('load again..',layerAddText)
                }

                if (toogleAreaStats == false && layerAddText == 'City/Municipality' && toogleAreaStatsByMun == false){
                    addLayerStats(URL,layerAddText,  layerName);
                }
                if (toogleAreaStatsByMun == true && layerAddText == 'City/Municipality'){
                    loadLayerStats(URL, layerAddText, layerName);
                    console.log('load again..',layerAddText)
                }
                

                if (toogleAreaStats == false && layerAddText == 'Province'  && toogleAreaStatsByMProv == false){
                    addLayerStats(URL,layerAddText,  layerName);
                }
                if (toogleAreaStatsByMProv == true && layerAddText == 'Province'){
                    loadLayerStats(URL, layerAddText, layerName);
                    console.log('load again..',layerAddText)
                }
               
                
               
            }
            

            if (layerRemoveText === 'Falcata'){map.removeLayer(FALCATAtileLayer);}
            if (layerRemoveText === 'Bagras'){map.removeLayer(BAGRAStileLayer);}
            if (layerRemoveText === 'Gmelina'){map.removeLayer(GMELINAtileLayer);}
            if (layerRemoveText === 'Mangium'){map.removeLayer(MANGIUMtileLayer);}
            
            if (layerRemove === 'stats'){
                if (layerRemoveText == 'Barangay'){
                    map.removeLayer(BRGYtileLayer);
                    console.log('remove',layerRemoveText)
                }
                if(layerRemoveText == 'City/Municipality'){
                    map.removeLayer(MUNtileLayer)
                    console.log('remove',layerRemoveText)
                }
                if(layerRemoveText == 'Province'){
                    map.removeLayer(PROVtileLayer)
                    console.log('remove',layerRemoveText)
                }
            }
            console.log(LAYERS)
            
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
            }else if(base_map == 'googleHybrid'){
                map.addLayer(googleHybrid);
                map.removeLayer(googleSat);
                map.removeLayer(osm);
            }else{
                map.addLayer(googleSat);
                map.removeLayer(osm);
                map.removeLayer(googleHybrid);             
            }
        } 
    });
    $('#trees').val('').multiselect({
        multiple: false,
        nonSelectedText: 'Select Tree',
        onChange: function(option, checked, select) {
            var layer =  $(option).val();
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
                    addBAGRAS();
                }
                if (layer === 'Bagras' && toogleBAGRAS == true){
                    map.addLayer(BAGRAStileLayer);
                }

                if (layer === 'Falcata' && toogleFALCATA == false){
                    addFALCATA();
                }
                if(layer === 'Falcata' && toogleFALCATA == true){
                    map.addLayer(FALCATAtileLayer);
                }
                if (layer === 'Gmelina' && toogleGMELINA == false){
                    addGMELINA();
                }
                if(layer === 'Gmelina' && toogleGMELINA == true){
                    map.addLayer(GMELINAtileLayer);
                }
                if (layer === 'Mangium' && toogleMANGIUM == false){
                    addMANGIUM();
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
                label: 'Area in sq. m.',
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
        }
        if(layerName == 'Barangay_Gmelina'){
            layerData1 =  leafletPip.pointInLayer([x,y], brgyRepoGmelina, true);
        }
        if(layerName == 'Barangay_Mangium'){
            layerData1 =  leafletPip.pointInLayer([x,y], brgyRepoMangium, true);
        }
        if(layerName == 'Barangay_Bagras'){
            layerData1 =  leafletPip.pointInLayer([x,y], brgyRepoBagras, true);
        }
        
        if(layerName == 'City/Municipality_Falcata'){
            layerData1 =  leafletPip.pointInLayer([x,y], munRepoFalcata, true);
        }
        if(layerName == 'City/Municipality_Gmelina'){
            layerData1 =  leafletPip.pointInLayer([x,y], munRepoGmelina, true);
        }
        if(layerName == 'City/Municipality_Mangium'){
            layerData1 =  leafletPip.pointInLayer([x,y], munRepoMangium, true);
        }
        if(layerName == 'City/Municipality_Bagras'){
            layerData1 =  leafletPip.pointInLayer([x,y], munRepoBagras, true);
        }

        if(layerName == 'Province_Falcata'){
            layerData1 =  leafletPip.pointInLayer([x,y], provRepoFalcata, true);
        }
        if(layerName == 'Province_Gmelina'){
            layerData1 =  leafletPip.pointInLayer([x,y], provRepoGmelina, true);
        }
        if(layerName == 'Province_Mangium'){
            layerData1 =  leafletPip.pointInLayer([x,y], provRepoMangium, true);
        }
        if(layerName == 'Province_Bagras'){
            layerData1 =  leafletPip.pointInLayer([x,y], provRepoBagras, true);
        }

       
     
        if (layerData[0] && LAYERS.includes('stats') == false) {
            var highlightProp = layerData[0].feature.properties;
            var feature = layerData[0].feature;
            highlight = new L.geoJson(feature, {
                style: {
                    color:'deepskyblue', 
                    fillColor:'deepskyblue'
                }
            });
            var popup = '<strong>Species:</strong> ' + highlightProp.Species+'</br><strong>Location:</strong> '+highlightProp.Bgy_Name+', '+highlightProp.Mun_Name+', '+highlightProp.Pro_Name+', '+highlightProp.Reg_Name+'</br>'+'<strong>Area in square meters:</strong>'+highlightProp.Area_sqm.toFixed(2) ;
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
            var data = highlightProp.Area_sqm.toFixed(2);
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
    var cbr_tile = new L.TileLayer.GWC('./data/UAS/EPSG_900913_{z}/{dir_x}_{dir_y}/{x}_{y}.png', {
        minZoom: 8,
        maxZoom: 21,
        tms: true
    });
    cbr_tile.addTo(map)
    **/ 


    //OTHERS
    $('#btnOK').click(function(){
        sidebar.open('query');
    })
});

