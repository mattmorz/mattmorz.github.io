var LAYERS = [];
var coverage_type = null;

//GEOJSON FILES, EPSG:32651 coverted to EPSG:4321 for Web Display
const BASE_URL = window.location.href;
const BAGRAS_GEOJSON = BASE_URL+"data/RescaledRefinedBagras_CaragaRegion.json";
const MANGIUM_GEOJSON = BASE_URL+"data/RescaledRefinedMangium_CaragaRegion.json";
const GMELINA_GEOJSON = BASE_URL+"data/RescaledRefinedGmelina_CaragaRegion.json";
const FALCATA_GEOJSON = BASE_URL+"data/RescaledRefinedFalcata_CaragaRegion.json";

const NGP_FALCATA_DENR = BASE_URL+"data/NGP_DENRCaraga_Falcata.json";
const NGP_GMELINA_DENR= BASE_URL+"data/NGP_DENRCaraga_Gmelina.json";
const NGP_MANGIUM_DENR = BASE_URL+"data/NGP_DENRCaraga_Mangium.json";
const NGP_BAGRAS_DENR = BASE_URL+"data/NGP_DENRCaraga_Bagras.json";

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

var groupAreaStats = new L.layerGroup();
var groupTrees = new L.layerGroup();
var groupTreesNGP = new L.layerGroup();
var groupOtherLayers = new L.layerGroup();
var FILTERED_LAYER = null;
var highlight;

var LAYERS_REPO = [];
var ARR_LAYERS = [];
var ADDED_LAYERS = [];
var LAYER_TYPE = null;
var LAYER_NAME = null;
var LAYER_GEOJSON = L.geoJson(null);
var LOADED_LAYERS = [];
var LAYER_DATA = null;
var LAYER_DATA_GEOJSON = null;
/**
 * adding/displaying/hiding tree layers
 * param(<string>,<string>,<boolean>)
 * param(GEOJSON URL, tree species name, checked or unchecked)
 **/
function toogleTrees(URL,treeType,checked){
    console.log(groupTrees.getLayers());
    console.log(ADDED_LAYERS.includes(treeType));
    LAYER_NAME = treeType;
    //console.log(ARR_LAYERS.trees[treeType]);
    if((groupTrees.getLayers().length == 0 || ADDED_LAYERS.includes(treeType) == false) && checked == true){
        $('#loadMe').modal('show');
        var data = omnivore.topojson(URL);
        data.on('ready', function() {
            console.log('ready');
            //Add canvas layer
            var trees = data.toGeoJSON();
            var treeLayer = L.vectorGrid.slicer(trees, {
                rendererFactory: L.canvas.tile,
                vectorTileLayerStyles: {
                    sliced: {
                        fillColor: treeType == 'Falcata' ? "#006d2c" : treeType == 'Gmelina' ? "#a50f15" : treeType == 'Mangium' ? "#54278f" : "#08519c" ,
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
            groupTrees.addLayer(treeLayer);
            console.log(ARR_LAYERS);
            var addedLayer = groupTrees.getLayers();
            var addedLayerId = addedLayer[groupTrees.getLayers().length-1]._leaflet_id;
            var obj = {}
            obj[treeType]= addedLayerId;
            ARR_LAYERS.push(obj);
            ADDED_LAYERS.push(treeType);

            var geojsonOBj = {};
            trees.features[0].properties.show = true;
            geojsonOBj[treeType]= trees;
            geojsonOBj[treeType]['show']= true;
            LAYERS_REPO.push(geojsonOBj);

            $.each(LAYERS_REPO, function(idx){
                if(LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)){
                    LAYERS_REPO[idx][LAYER_NAME].show = true;
                    LAYER_GEOJSON.addData(LAYERS_REPO[idx][LAYER_NAME]);
                    console.log('added LAYER_GEOJSON-->',LAYER_NAME)  
                };
            })
            setTimeout(function() {
                $('#loadMe').modal('hide');
            }, 500);
        });  
    }else if(ADDED_LAYERS.includes(treeType) && checked == true){
        for(var i=0;i<ARR_LAYERS.length;i++){
            console.log(ARR_LAYERS[i].hasOwnProperty(treeType))
            if(ARR_LAYERS[i].hasOwnProperty(treeType)){
                console.log(ARR_LAYERS[i][treeType]);
                var showLayer = groupTrees.getLayer(ARR_LAYERS[i][treeType]);
                map.addLayer(showLayer);
            }
        }
        $.each(LAYERS_REPO, function(idx){
            if(LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)){
                LAYERS_REPO[idx][LAYER_NAME].show = true;
                //LAYER_GEOJSON.addData(LAYERS_REPO[idx][LAYER_NAME]);
                console.log('set show to true-->',LAYER_NAME)  
            };
        })
    }else if (checked == false){
        console.log(groupTrees.getLayers());
        console.log(treeType)
        for(var i=0;i<ARR_LAYERS.length;i++){
            console.log(ARR_LAYERS[i].hasOwnProperty(treeType))
            if(ARR_LAYERS[i].hasOwnProperty(treeType)){
                console.log(ARR_LAYERS[i][treeType]);
                var removeLayer = groupTrees.getLayer(ARR_LAYERS[i][treeType]);
                map.removeLayer(removeLayer);
            }
        }
        $.each(LAYERS_REPO, function(idx){
            if(LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)){
                LAYERS_REPO[idx][LAYER_NAME].show = false;
            };
        })
    }else{
        console.log('ehhh no condition met')
    }
    
}

function toogleTreesNGP(URL,treeType,layerName,checked){
    console.log(groupTreesNGP.getLayers());
    console.log(ADDED_LAYERS.includes(treeType));
    LAYER_NAME = layerName;
    //console.log(ARR_LAYERS.trees[treeType]);
    if((groupTreesNGP.getLayers().length == 0 || ADDED_LAYERS.includes(layerName) == false) && checked == true){
        $('#loadMe').modal('show');
        var data = omnivore.topojson(URL);
        data.on('ready', function() {
            console.log('ready');
            //Add canvas layer
            var trees = data.toGeoJSON();
            var treeLayer = L.vectorGrid.slicer(trees, {
                rendererFactory: L.canvas.tile,
                vectorTileLayerStyles: {
                    sliced: {
                        fillColor: treeType == 'Falcata' ? "#006d2c" : treeType == 'Gmelina' ? "#a50f15" : treeType == 'Mangium' ? "#54278f" : "#08519c" ,
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
            groupTreesNGP.addLayer(treeLayer);
            console.log(ARR_LAYERS);
            var addedLayer = groupTreesNGP.getLayers();
            var addedLayerId = addedLayer[groupTreesNGP.getLayers().length-1]._leaflet_id;
            var obj = {}
            obj[layerName]= addedLayerId;
            ARR_LAYERS.push(obj);
            ADDED_LAYERS.push(layerName);

            var geojsonOBj = {};
            trees.features[0].properties.show = true;
            geojsonOBj[layerName]= trees;
            geojsonOBj[layerName]['show']= true;
            LAYERS_REPO.push(geojsonOBj);

            $.each(LAYERS_REPO, function(idx){
                if(LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)){
                    LAYERS_REPO[idx][LAYER_NAME].show = true;
                    LAYER_GEOJSON.addData(LAYERS_REPO[idx][LAYER_NAME]);
                    console.log('added LAYER_GEOJSON-->',LAYER_NAME)  
                };
            })
            setTimeout(function() {
                $('#loadMe').modal('hide');
            }, 500);
        });  
    }else if(ADDED_LAYERS.includes(layerName) && checked == true){
        for(var i=0;i<ARR_LAYERS.length;i++){
            console.log(ARR_LAYERS[i].hasOwnProperty(layerName))
            if(ARR_LAYERS[i].hasOwnProperty(layerName)){
                console.log(ARR_LAYERS[i][layerName]);
                var showLayer = groupTreesNGP.getLayer(ARR_LAYERS[i][layerName]);
                map.addLayer(showLayer);
            }
        }
        $.each(LAYERS_REPO, function(idx){
            if(LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)){
                LAYERS_REPO[idx][LAYER_NAME].show = true;
                //LAYER_GEOJSON.addData(LAYERS_REPO[idx][LAYER_NAME]);
                console.log('set show to true-->',LAYER_NAME)  
            };
        })
    }else if (checked == false){
        for(var i=0;i<ARR_LAYERS.length;i++){
            if(ARR_LAYERS[i].hasOwnProperty(layerName)){
                console.log(ARR_LAYERS[i][layerName]);
                var removeLayer = groupTreesNGP.getLayer(ARR_LAYERS[i][layerName]);
                map.removeLayer(removeLayer);
            }
        }
        $.each(LAYERS_REPO, function(idx){
            if(LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)){
                LAYERS_REPO[idx][LAYER_NAME].show = false;
                console.log('set show to false-->',LAYER_NAME)  
            };
        })
    }else{
        console.log('ehhh no condition met')
    }
    
}

function toogleAreaStats(URL,treeType,coverage,checked){
    LAYER_NAME = treeType;
    if((ADDED_LAYERS.includes(treeType) == false) && checked == true){
        $('#loadMe').modal('show');
        var data = omnivore.topojson(URL);
        data.on('ready', function() {
            console.log('ready');
            //Add canvas layer
            var trees = data.toGeoJSON();
            var treeLayer = L.vectorGrid.slicer(trees, {
                rendererFactory: L.canvas.tile,
                vectorTileLayerStyles: {
                    sliced: function(properties){
                        var area = parseFloat(properties.Area_sqm/10000);
                        if(coverage == "Barangay"){
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
                                    fillColor: treeType == 'Barangay_Falcata' ? "#edf8e9"
                                                :treeType == 'Barangay_Gmelina' ? "#fee5d9"
                                                :treeType == 'Barangay_Mangium' ? "#f2f0f7"
                                                : "#eff3ff",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 10 && area <= 20){
                                return {
                                    fillColor: treeType == 'Barangay_Falcata' ? "#bae4b3"
                                                :treeType == 'Barangay_Gmelina' ? "#fcae91"
                                                :treeType == 'Barangay_Mangium' ? "#cbc9e2"
                                                : "#bdd7e7",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 20 && area <= 30){
                                return {
                                    fillColor: treeType == 'Barangay_Falcata' ? "#74c476"
                                                :treeType == 'Barangay_Gmelina' ? "#fb6a4a"
                                                :treeType == 'Barangay_Mangium' ? "#9e9ac8"
                                                : "#6baed6",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 30 && area <= 40){
                                return {
                                    fillColor: treeType == 'Barangay_Falcata' ? "#31a354"
                                                :treeType == 'Barangay_Gmelina' ? "#de2d26"
                                                :treeType == 'Barangay_Mangium' ? "#756bb1"
                                                : "#3182bd",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else{
                                return {
                                    fillColor: treeType == 'Barangay_Falcata' ? "#006d2c"
                                                :treeType == 'Barangay_Gmelina' ? "#a50f15"
                                                :treeType == 'Barangay_Mangium' ? "#54278f"
                                                : "#08519c",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }
                        }else if (coverage == 'City/Municipality'){
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
                                    fillColor: treeType == 'City/Municipality_Falcata' ? "#edf8e9"
                                                :treeType == 'City/Municipality_Gmelina' ? "#fee5d9"
                                                :treeType == 'City/Municipality_Mangium' ? "#f2f0f7"
                                                : "#eff3ff",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 10 && area <= 20){
                                return {
                                    fillColor: treeType == 'City/Municipality_Falcata' ? "#bae4b3"
                                                :treeType == 'City/Municipality_Gmelina' ? "#fcae91"
                                                :treeType == 'City/Municipality_Mangium' ? "#cbc9e2"
                                                : "#bdd7e7",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 20 && area <= 30){
                                return {
                                    fillColor: treeType == 'City/Municipality_Falcata' ? "#74c476"
                                                :treeType == 'City/Municipality_Gmelina' ? "#fb6a4a"
                                                :treeType == 'City/Municipality_Mangium' ? "#9e9ac8"
                                                : "#6baed6",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 30 && area <= 40){
                                return {
                                    fillColor: treeType == 'City/Municipality_Falcata' ? "#31a354"
                                                :treeType == 'City/Municipality_Gmelina' ? "#de2d26"
                                                :treeType == 'City/Municipality_Mangium' ? "#756bb1"
                                                : "#3182bd",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else{
                                return {
                                    fillColor: treeType == 'City/Municipality_Falcata' ? "#006d2c"
                                                :treeType == 'City/Municipality_Gmelina' ? "#a50f15"
                                                :treeType == 'City/Municipality_Mangium' ? "#54278f"
                                                : "#08519c",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }
                        }else{
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
                                    fillColor: treeType == 'Province_Falcata' ? "#edf8e9"
                                                :treeType == 'Province_Gmelina' ? "#fee5d9"
                                                :treeType == 'Province_Mangium' ? "#f2f0f7"
                                                : "#eff3ff",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 10 && area <= 20){
                                return {
                                    fillColor: treeType == 'Province_Falcata' ? "#bae4b3"
                                                :treeType == 'Province_Gmelina' ? "#fcae91"
                                                :treeType == 'Province_Mangium' ? "#cbc9e2"
                                                : "#bdd7e7",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 21 && area <= 30){
                                return {
                                    fillColor: treeType == 'Province_Falcata' ? "#74c476"
                                                :treeType == 'Province_Gmelina' ? "#fb6a4a"
                                                :treeType == 'Province_Mangium' ? "#9e9ac8"
                                                : "#6baed6",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else if(area > 31 && area <= 40){
                                return {
                                    fillColor: treeType == 'Province_Falcata' ? "#31a354"
                                                :treeType == 'Province_Gmelina' ? "#de2d26"
                                                :treeType == 'Province_Mangium' ? "#756bb1"
                                                : "#3182bd",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }else{
                                return {
                                    fillColor: treeType == 'Province_Falcata' ? "#006d2c"
                                                :treeType == 'Province_Gmelina' ? "#a50f15"
                                                :treeType == 'Province_Mangium' ? "#54278f"
                                                : "#08519c",
                                    color: "black",
                                    weight: .5,
                                    fill: true,
                                    stroke: true,
                                    fillOpacity: .8
                                }
                            }

                        }
                        
                    }//sliced
                },
                maxZoom: 22,
                indexMaxZoom: 5,
                interactive: true,
            }).addTo(map);
           
            console.log('added to map');
            groupAreaStats.addLayer(treeLayer);
            console.log(ARR_LAYERS);
            var addedLayer = groupAreaStats.getLayers();
            var addedLayerId = addedLayer[groupAreaStats.getLayers().length-1]._leaflet_id;
            var obj = {}
            obj[treeType]= addedLayerId;
            ARR_LAYERS.push(obj);
            ADDED_LAYERS.push(treeType);

            var geojsonOBj = {};
            trees.features[0].properties.show = true;
            geojsonOBj[treeType]= trees;
            geojsonOBj[treeType]['show']= true;
            LAYERS_REPO.push(geojsonOBj);

            $.each(LAYERS_REPO, function(idx){
                if(LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)){
                    LAYERS_REPO[idx][LAYER_NAME].show = true;
                    LAYER_GEOJSON = L.geoJson(LAYERS_REPO[idx][LAYER_NAME]);
                    console.log('added LAYER_GEOJSON-->',LAYER_NAME)  
                };
            })
            setTimeout(function() {
                $('#loadMe').modal('hide');
            }, 500);
        });  
    }else if(ADDED_LAYERS.includes(treeType) && checked == true){
        for(var i=0;i<ARR_LAYERS.length;i++){
            console.log(ARR_LAYERS[i].hasOwnProperty(treeType))
            if(ARR_LAYERS[i].hasOwnProperty(treeType)){
                console.log(ARR_LAYERS[i][treeType]);
                var showLayer = groupAreaStats.getLayer(ARR_LAYERS[i][treeType]);
                map.addLayer(showLayer);
            }
        }
        $.each(LAYERS_REPO, function(idx){
            if(LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)){
                LAYERS_REPO[idx][LAYER_NAME].show = true;
                console.log(LAYERS_REPO[idx][LAYER_NAME]);
                LAYER_GEOJSON = L.geoJson(LAYERS_REPO[idx][LAYER_NAME]);
                console.log('added LAYER_GEOJSON-->',LAYER_NAME)  
            };
        })
    }else if (checked == false){
        console.log(groupAreaStats.getLayers());
        console.log(treeType)
        for(var i=0;i<ARR_LAYERS.length;i++){
            console.log(ARR_LAYERS[i].hasOwnProperty(treeType))
            if(ARR_LAYERS[i].hasOwnProperty(treeType)){
                console.log(ARR_LAYERS[i][treeType]);
                var removeLayer = groupAreaStats.getLayer(ARR_LAYERS[i][treeType]);
                map.removeLayer(removeLayer);
            }
        }
        LAYER_GEOJSON = L.geoJson(null);
    }else{
        console.log('ehhh no condition met')
    }
    
}


function loadLocs() {
    var BRGYS = ['AGUSAN DEL NORTE', 'AGUSAN DEL SUR','SURIGAO DEL NORTE','SURIGAO DEL SUR','DINAGAT ISLANDS'];
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
    //Welcom Prompt
    $('#staticBackdrop').modal('show');

    var Barangays = loadLocs();
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
    }).addTo(map);
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
    })
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
    var measureControl = new L.Control.Measure({
        position: 'topleft',
        primaryLengthUnit: 'feet', secondaryLengthUnit: 'kilometers',
        primaryAreaUnit: 'hectares', secondaryAreaUnit: 'sqmeters' 
    });
    measureControl.addTo(map);
    var loading = L.Control.loading({
        position:'topleft',
        separate: true
    });
    map.addControl(loading)
    var legend_trees = L.control({ position: "topright" });
    legend_trees.onAdd = function(map) {
        var div = L.DomUtil.create("div", "maplegend");
        div.innerHTML += "<h4>ITP Species</h4>";
        div.innerHTML += '<i style="background: #006d2c"></i><span>Falcata</span><br>';
        div.innerHTML += '<i style="background: #a50f15"></i><span>Gmelina</span><br>';
        div.innerHTML += '<i style="background: #54278f"></i><span>Mangium</span><br>'; 
        div.innerHTML += '<i style="background: #08519c"></i><span>Bagras</span><br>';
    return div;
    };
    var legend_area = L.control({ position: "topright" });
    var sidebar = L.control.sidebar({ container: 'sidebar' }).addTo(map);
    sidebar.on('content', function (ev) {
        switch (ev.id) {
            case 'autopan':
            sidebar.options.autopan = true;
            break;
            default:
            sidebar.options.autopan = false;
        }
    });
    //End Controls

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
            var layerRemoveDataSection = null;
            var layerRemoveLayerName = null;
            
            if(removedItems.length>0){           
                layerRemove = removedItems[0].value;
                layerRemoveText = removedItems[0].text;
                layerRemoveDataSection = removedItems[0].section.split('/');
                layerRemoveLayerName = layerRemoveText+'_'+layerRemoveDataSection[2];
                
                
                if (layerRemove == 'stats')toogleAreaStats(null,layerRemoveLayerName,layerRemoveText,false);
                if (layerRemove == 'trees')toogleTrees(null,layerRemoveText,false);
                if (layerRemove == 'denrcaraga'){
                    var layerName = layerRemoveText+'_'+layerRemoveDataSection[3].replace(' ','');
                    toogleTreesNGP(null,layerRemoveText,layerName,false);
                }
            }
            if(addedItems.length>0){               
                if(!LOADED_LAYERS.includes(addedItems[0])){
                    LOADED_LAYERS.push(addedItems[0]);
                    console.log(LOADED_LAYERS)
                }
                layerAdd = addedItems[0].value;
                layerAddText = addedItems[0].text;
                layerAddDataSection = addedItems[0].section.split('/');
                LAYER_TYPE = layerAdd;
                if (layerAdd === 'trees'){
                    legend_trees.addTo(map);
                    map.removeControl(legend_area);
                    map.removeLayer(groupAreaStats);
                    for(var i=0;i<LOADED_LAYERS.length;i++){
                        if(LOADED_LAYERS[i].value != 'trees'){
                            var selectionNode = LOADED_LAYERS[i].node;
                            selectionNode.getElementsByTagName('input')[0].checked = false;
                            $('.item[data-key="'+LOADED_LAYERS[i].id+'"] span.remove-selected').click();
                        }
                    }
                    if(layerAddText === 'Falcata'){
                        toogleTrees(FALCATA_GEOJSON,layerAddText,true);
                    }
                    if(layerAddText === 'Gmelina'){
                        toogleTrees(GMELINA_GEOJSON,layerAddText,true);
                    }
                    if(layerAddText === 'Mangium'){
                        toogleTrees(MANGIUM_GEOJSON,layerAddText,true);
                    }
                    if(layerAddText === 'Bagras'){
                        toogleTrees(BAGRAS_GEOJSON,layerAddText,true);
                    }
                   
                }

                if (layerAdd === 'denrcaraga'){
                    legend_trees.addTo(map);
                    map.removeControl(legend_area);
                    map.removeLayer(groupAreaStats);
                    map.removeLayer(groupTrees);
                    for(var i=0;i<LOADED_LAYERS.length;i++){
                        if(LOADED_LAYERS[i].value != 'denrcaraga'){
                            var selectionNode = LOADED_LAYERS[i].node;
                            selectionNode.getElementsByTagName('input')[0].checked = false;
                            $('.item[data-key="'+LOADED_LAYERS[i].id+'"] span.remove-selected').click();
                        }
                    }

                    var layerName = layerAddText+'_'+layerAddDataSection[3].replace(' ','');
                    var treeType = layerAddText;
                    var URL = layerName == 'Falcata_DENRCaraga' ? NGP_FALCATA_DENR: layerName == 'Gmelina_DENRCaraga' ? NGP_GMELINA_DENR : layerName == 'Mangium_DENRCaraga' ? NGP_MANGIUM_DENR : NGP_BAGRAS_DENR;
                    
                    toogleTreesNGP(URL,treeType,layerName,true)
                   
                }
                
    
                if (layerAdd === 'stats'){
                    map.removeControl(legend_trees);
                    map.removeLayer(groupTrees);
                    map.removeLayer(groupTreesNGP);
                    //map.removeLayer(groupAreaStats);
                    for(var i=0;i<LOADED_LAYERS.length;i++){
                        var selectionNode = LOADED_LAYERS[i].node;
                        if(LOADED_LAYERS[i].id != addedItems[0].id){
                            console.log(LOADED_LAYERS[i].id, addedItems[0].id)                   
                            selectionNode.getElementsByTagName('input')[0].checked = false;      
                            $('.item[data-key="'+LOADED_LAYERS[i].id+'"] span.remove-selected').click();
                        }else{
                            selectionNode.getElementsByTagName('input')[0].checked = true;
                        }
                    }
    
                    var URL = null;
                    var layerName = layerAddText+'_'+layerAddDataSection[2];
                    var treeName = layerAddDataSection[2];
    
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
    
                    toogleAreaStats(URL,layerName,layerAddText,true);
    
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
                    legend_area.addTo(map);
                    LAYER_NAME = layerName;
    
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
        nonSelectedText: 'Select ITP Species',
        onChange: function(option, checked, select) {
            if(map.hasLayer(FILTERED_LAYER)){
                map.removeLayer(FILTERED_LAYER)
            }
            var layer =  $(option).val();
            var typeofQ = $('#q').val()
            if (checked && typeofQ == 'distri'){
                LAYER_TYPE = 'trees';
                for(var i=0;i<LOADED_LAYERS.length;i++){
                    var selectionNode = LOADED_LAYERS[i].node;
                    selectionNode.getElementsByTagName('input')[0].checked = false;
                    $('.item[data-key="'+LOADED_LAYERS[i].id+'"] span.remove-selected').click();

                }
                legend_trees.addTo(map);
                map.removeControl(legend_area);
                map.removeLayer(groupAreaStats);
                for(var i=0;i<LOADED_LAYERS.length;i++){
                    if(LOADED_LAYERS[i].value != 'trees'){
                        var selectionNode = LOADED_LAYERS[i].node;
                        selectionNode.getElementsByTagName('input')[0].checked = false;
                        $('.item[data-key="'+LOADED_LAYERS[i].id+'"] span.remove-selected').click();
                    }
                }
                if(layer === 'Falcata'){
                    toogleTrees(FALCATA_GEOJSON,layer,true);
                }
                if(layer === 'Gmelina'){
                    toogleTrees(GMELINA_GEOJSON,layer,true);
                }
                if(layer === 'Mangium'){
                    toogleTrees(MANGIUM_GEOJSON,layer,true);
                }
                if(layer === 'Bagras'){
                    toogleTrees(BAGRAS_GEOJSON,layer,true);
                }
            }
                
        }
    });
    //END LAYERS

   
    //Charts
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Falcata','Gmelina','Mangium','Bagras'],
            datasets: [{
                label: 'ITP Species Area in Hectares',
                data: [],
                backgroundColor: ['#006d2c','#a50f15','#54278f','#08519c']
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

    //MAP Interaction
    map.on('click', function(e) {
        if (highlight){
            map.removeLayer(highlight)
        }
        var x = e.latlng.lng;
        var y = e.latlng.lat;


        if (LAYER_TYPE == 'trees' || LAYER_TYPE == 'denrcaraga') {
            LAYER_DATA = leafletPip.pointInLayer([x,y], LAYER_GEOJSON, true);
            if(LAYER_DATA[0]){
                var highlightProp = LAYER_DATA[0].feature.properties;
                var feature = LAYER_DATA[0].feature;
                highlight = new L.geoJson(feature, {
                    style: {
                        color:'yellow', 
                        fillColor:'white'
                    }
                });
                var popup = '<strong>Species:</strong> ' + highlightProp.Species+'</br><strong>Location:</strong> '+highlightProp.Bgy_Name+', '+highlightProp.Mun_Name+', '+highlightProp.Pro_Name+', '+highlightProp.Reg_Name+'</br>'+'<strong>Area in hectares:</strong>'+parseFloat(highlightProp.Area_sqm/10000).toFixed(2);
                map.on('popupclose', function() {
                    map.removeLayer(highlight)
                });
                setTimeout(function() {
                    highlight.addTo(map);
                    map.openPopup(popup, e.latlng);
                }, 50);
            }else{
                console.log('no feature found...')
            }
        }
 
        if (LAYER_TYPE == 'stats') {
            LAYER_DATA = leafletPip.pointInLayer([x,y], LAYER_GEOJSON, true);
            if(LAYER_DATA[0]){
                var highlightProp = LAYER_DATA[0].feature.properties;
                var location = '';
                if(highlightProp.Bgy_Name){
                    location = highlightProp.Bgy_Name+', '+highlightProp.Mun_Name+ ', '+highlightProp.Pro_Name;
                }else if(highlightProp.Mun_Name){
                    location = highlightProp.Mun_Name+ ', '+highlightProp.Pro_Name;
                }else{
                    location =highlightProp.Pro_Name;
                }
                var feature = LAYER_DATA[0].feature;
                highlight = new L.geoJson(feature, {
                    style: {
                        color:'yellow', 
                        fillColor:'white'
                    },
                });
                var dataFalcata= parseFloat(highlightProp.Area_sqm/10000).toFixed(2);
                var dataGmelina = Math.floor(Math.random() * Math.floor(40));
                var dataMangium = Math.floor(Math.random() * Math.floor(40));
                var dataBagras = Math.floor(Math.random() * Math.floor(40));
                var newData = [dataFalcata,dataGmelina,dataMangium,dataBagras];
                myChart.data["datasets"][0]["data"] = newData;
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
        }
    });

    //OTHERS UX
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
        $.each(LAYERS_REPO, function(idx){
            if(LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)){
                dataGeojson = LAYERS_REPO[idx][LAYER_NAME];
            };
        })
        FILTERED_LAYER = L.geoJson(dataGeojson, {         
                style :{
                    fillColor: "#fff",
                    color: "yellow",
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
        $.each(LAYERS_REPO, function(idx){
            if(LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)){
                dataGeojson = LAYERS_REPO[idx][LAYER_NAME];
            };
        })
        FILTERED_LAYER = L.geoJson(dataGeojson, {         
                style :{
                    fillColor: "#fff",
                    color: "yellow",
                    weight: 2,
                    fill: false,
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

