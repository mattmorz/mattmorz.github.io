/**
 * Code written by: idsilmat@gmail.com
 * mattmorz.blogspot.com
 * For: ITPs Geodatabase Project
 * v1.0.2
 * Added progress indicator
 * Fixed base map z-index
 * Code refactor
 */
const BASE_URL = window.location.href;
const CARAGA_PLACES = BASE_URL + "js/caraga.json";

const DATA_SOURCE_URL = {
  FALCATA: BASE_URL + "data/RescaledRefinedFalcata_CaragaRegion.json",
  GMELINA: BASE_URL + "data/RescaledRefinedGmelina_CaragaRegion.json",
  MANGIUM: BASE_URL + "data/RescaledRefinedMangium_CaragaRegion.json",
  BAGRAS: BASE_URL + "data/RescaledRefinedBagras_CaragaRegion.json",
  BARANGAY_FALCATA: BASE_URL + "data/ITP_Area_Barangay.json",
  CITY_MUNICIPALITY_FALCATA: BASE_URL + "data/ITP_Area_Municipalit.json",
  PROVINCE_FALCATA: BASE_URL + "data/ITP_Area_Province.json",
  BARANGAY_GMELINA: BASE_URL + "data/ITP_Area_Barangay.json",
  CITY_MUNICIPALITY_GMELINA: BASE_URL + "data/ITP_Area_Municipalit.json",
  PROVINCE_GMELINA: BASE_URL + "data/ITP_Area_Province.json",
  BARANGAY_MANGIUM: BASE_URL + "data/ITP_Area_Barangay.json",
  CITY_MUNICIPALITY_MANGIUM: BASE_URL + "data/ITP_Area_Municipalit.json",
  PROVINCE_MANGIUM: BASE_URL + "data/ITP_Area_Province.json",
  BARANGAY_BAGRAS: BASE_URL + "data/ITP_Area_Barangay.json",
  CITY_MUNICIPALITY_BAGRAS: BASE_URL + "data/ITP_Area_Municipalit.json",
  PROVINCE_BAGRAS: BASE_URL + "data/ITP_Area_Province.json",
  WOOD_PROCESSING_PLANT: BASE_URL + "data/WPPs_Caragaregion.json",
  FURNITURE_STORE : BASE_URL + "data/FurnitureStores_Caragaregion.json",
  ADS_GROUND_TRUTH:  BASE_URL + "data/ADS_Ground_Truth.json",
  CTPO_CENRO_NASIPIT_2011: BASE_URL + "data/TPO_Nasipit_2011.json",
  CTPO_CENRO_NASIPIT_2012: BASE_URL + "data/TPO_Nasipit_2012.json",
  CTPO_CENRO_NASIPIT_2013: BASE_URL + "data/PTPOC2013_CENRONasipit.json",
  CTPO_CENRO_NASIPIT_2015: BASE_URL + "data/PTPOC2015_CENRONasipit.json",
  CTPO_CENRO_NASIPIT_2016: BASE_URL + "data/PTPOC2016_CENRONasipit.json",
  CTPO_CENRO_NASIPIT_2017: BASE_URL + "data/PTPOC2017_CENRONasipit.json",
  CTPO_CENRO_NASIPIT_2019: BASE_URL + "data/PTPOC2019_CENRONasipit.json",
  CTPO_CENRO_NASIPIT_2020: BASE_URL + "data/PTPOC2020_CENRONasipit.json",
  CTPO_CENRO_TALACOGON_FALCATA: BASE_URL + "data/CTPO_CENROTalacogon_Falcata.json",
  CTPO_CENRO_TALACOGON_GMELINA: BASE_URL + "data/CTPO_CENROTalacogon_Gmelina.json",
  CTPO_CENRO_TALACOGON_MANGIUM: BASE_URL + "data/CTPO_CENROTalacogon_Mangium.json",
  CTPO_CENRO_TALACOGON_2012_2013: BASE_URL + "data/CTPO20122013_CENROTalacogon.json",
  CTPO_CENRO_TALACOGON_2016_2017: BASE_URL + "data/CTPO20162017_CENROTalacogon.json",
  CTPO_CENRO_TALACOGON_2017_2018: BASE_URL + "data/CTPO20172018_CENROTalacogon.json",
  CTPO_CENRO_TALACOGON_2018_2019: BASE_URL + "data/CTPO20182019_CENROTalacogon.json",
  CTPO_CENRO_LORETO_FALCATA: BASE_URL + "data/CTPO_CENROLoreto_Falcata.json",
  CTPO_CENRO_LORETO_GMELINA: BASE_URL + "data/CTPO_CENROLoreto_Gmelina.json",
  CTPO_CENRO_TUBAY_POLYGON: BASE_URL + "data/CTPO_CENROTubay.json",
  FALCATA_DENR_CARAGA: BASE_URL + "data/NGP_DENRCaraga_Falcata.json",
  GMELINA_DENR_CARAGA: BASE_URL + "data/NGP_DENRCaraga_Gmelina.json",
  MANGIUM_DENR_CARAGA: BASE_URL + "data/NGP_DENRCaraga_Mangium.json",
  BAGRAS_DENR_CARAGA: BASE_URL + "data/NGP_DENRCaraga_Bagras.json",
  NGP_PENRO_ADN_BAGRAS: BASE_URL + "data/NGP_PENROAdN_Bagras.json",
  FALCATA_PENRO_ADN: BASE_URL + "data/NGP_PENROAdN_Falcata.json",
  MANGIUM_PENRO_ADN: BASE_URL + "data/NGP_PENROAdN_Mangium.json",
  BAGRAS_PENRO_ADN: BASE_URL + "data/NGP_PENROAdS_Bagras.json",
  FALCATA_PENRO_ADS: BASE_URL + "data/NGP_PENROAdS_Falcata.json",
  MANGIUM_PENRO_ADS: BASE_URL + "data/NGP_PENROAdS_Mangium.json",
  BAGRAS_PENRO_ADS: BASE_URL + "data/NGP_PENROAdS_Bagras.json",
  FALCATA_CENRO_TALACOGON: BASE_URL + "data/NGP_CENROTalacogon_Falcata.json",
  FALCATA_CENRO_TUBAY:BASE_URL + "data/NGP_CENROTubay_Falcata.json",
  MANGIUM_CENRO_TUBAY:BASE_URL + "data/NGP_CENROTubay_Mangium.json",
}

//Layergroups for checking if layer is added
var groupAreaStats = new L.layerGroup();
var groupTrees = new L.layerGroup();
var groupTreesNGP = new L.layerGroup();
var groupTreesNGPOther = new L.layerGroup();
var groupOtherLayer = new L.layerGroup();
var groupSurvey = new L.layerGroup();
var groupTPO = new L.layerGroup();

var FILTERED_LAYER = null;
var HIGHLIGHT;

var LAYERS_REPO = [];
var ARR_LAYERS = [];
var ADDED_LAYERS = [];
var LAYER_TYPE = null;
var LAYER_NAME = null;
var LAYER_GEOJSON = L.geoJson(null);
var LOADED_LAYERS = [];
var LAYER_DATA = null;
var LAYER_DATA_GEOJSON = null;
var BRGY_AREA_STATS = null;
var MUN_AREA_STATS = null;
var PROV_AREA_STATS = null;

//Standard leaflet map setup
var map = L.map('map');

/**
 * adding/displaying/hiding tree layers
 * param(<string>,<string>,<boolean>)
 * param(GEOJSON URL, tree species name, checked or unchecked)
 **/
function toggleTrees(URL, treeType, checked) {
  LAYER_NAME = treeType;
  if ((groupTrees.getLayers().length == 0 || ADDED_LAYERS.includes(treeType) == false) && checked == true) {
    var percentComplete = 0;

    $.ajax({
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        //Download progress
        xhr.addEventListener("progress", function(evt) {
          console.log(evt.lengthComputable);
          if (evt.lengthComputable) {
            
            percentComplete = parseFloat(evt.loaded / evt.total) * 100;
            console.log(percentComplete);
              waitingDialog.progress(percentComplete);
              if (percentComplete == 100){                
                  setTimeout(function () {
                    waitingDialog.hide();
                  }, 1000);
              }
          }
        }, false);
        return xhr;
      },
      type:'GET',
      url: URL,
      beforeSend:function(){
        waitingDialog.show('Initializing...',{dialogSize: 'm', progressType: ' bg-success',rtl:false});      
        waitingDialog.animate(["Fetching data.","Fetching data..","Fetching data...","Fetching data...."]);
        waitingDialog.progress(0);
      },
      success: function(data) {
        console.log('ready');
          //Add canvas layer
          var ddata = omnivore.topojson.parse(data);
          var trees = ddata.toGeoJSON();
          var treeLayer = L.vectorGrid.slicer(trees, {
            rendererFactory: L.canvas.tile,
            vectorTileLayerStyles: {
              sliced: {
                fillColor: treeType == 'Falcata' ? "#006d2c" : treeType == 'Gmelina' ? "#a50f15" : treeType == 'Mangium' ? "#54278f" : "#08519c",
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

          var addedLayer = groupTrees.getLayers();
          var addedLayerId = addedLayer[groupTrees.getLayers().length - 1]._leaflet_id;
          var obj = {}
          obj[treeType] = addedLayerId;
          ARR_LAYERS.push(obj);
          ADDED_LAYERS.push(treeType);

          var geojsonOBj = {};
          trees.features[0].properties.show = true;
          geojsonOBj[treeType] = trees;
          geojsonOBj[treeType]['show'] = true;
          LAYERS_REPO.push(geojsonOBj);

          $.each(LAYERS_REPO, function(idx) {
            if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
              LAYERS_REPO[idx][LAYER_NAME].show = true;
              LAYER_GEOJSON.addData(LAYERS_REPO[idx][LAYER_NAME]);
              console.log('added LAYER_GEOJSON-->', LAYER_NAME)

            };
          })
      } //success
    });

  } else if (ADDED_LAYERS.includes(treeType) && checked == true) {
    for (var i = 0; i < ARR_LAYERS.length; i++) {
      if (ARR_LAYERS[i].hasOwnProperty(treeType)) {
        var showLayer = groupTrees.getLayer(ARR_LAYERS[i][treeType]);
        map.addLayer(showLayer);
      }
    }
    $.each(LAYERS_REPO, function(idx) {
      if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
        LAYERS_REPO[idx][LAYER_NAME].show = true;
        console.log('set show to true-->', LAYER_NAME)
      };
    })
  } else if (checked == false) {
    for (var i = 0; i < ARR_LAYERS.length; i++) {
      if (ARR_LAYERS[i].hasOwnProperty(treeType)) {
        var removeLayer = groupTrees.getLayer(ARR_LAYERS[i][treeType]);
        map.removeLayer(removeLayer);
      }
    }
    $.each(LAYERS_REPO, function(idx) {
      if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
        LAYERS_REPO[idx][LAYER_NAME].show = false;
      };
    })
  } else {
    console.log('ehhh no condition met')
  }

}

function toggleTreesNGPOthers(URL, treeType, layerName, checked) {
  LAYER_NAME = layerName;
  if ((groupTreesNGPOther.getLayers().length == 0 || ADDED_LAYERS.includes(layerName) == false) && checked == true) {
    $.ajax({
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        //Download progress
        xhr.addEventListener("progress", function(evt) {
          console.log(evt.lengthComputable);
          if (evt.lengthComputable) {
            percentComplete = parseFloat(evt.loaded / evt.total) * 100;
            console.log(percentComplete)
              waitingDialog.progress(percentComplete);
              if (percentComplete == 100){
                 
                  setTimeout(function () {
                    waitingDialog.hide();
                  }, 1000);
              }
          }
        }, false);
        return xhr;
      },
      type: 'GET',
      url: URL,
      beforeSend:function(){
        waitingDialog.show('Initializing...',{dialogSize: 'm', progressType: ' bg-success',rtl:false});      
        waitingDialog.animate(["Fetching data.","Fetching data..","Fetching data...","Fetching data...."]);
        waitingDialog.progress(0);
      },
      success: function(data) {
        var trees = data;
        var gp_layer = L.geoJSON(trees, {
          onEachFeature: function(feature, layer) {
            var HIGHLIGHTProp = feature.properties;
            var popup = '<table border="1">';
            for (i in HIGHLIGHTProp) {
              popup += '<tr><td>' + i + '</td>';
              popup += '<td>' + HIGHLIGHTProp[i] + '</td></tr>';
            }
            popup += '</table>';
            layer.bindPopup(popup);
          },
          style: function(feature) {
            //var treeType = feature.properties.Species;
            //var trees = treeType.split(',');
            return {
              fillColor: treeType == 'Falcata' ? "#006d2c" : treeType == 'Gmelina' ? "#a50f15" : treeType == 'Mangium' ? "#54278f" : treeType == 'Bagras' ? "#08519c" : "#fff",
              color: "black",
              weight: .5,
              fill: true,
              stroke: true,
              fillOpacity: .8
            }
          }
        }).addTo(map);
        map.fitBounds(gp_layer.getBounds());
        console.log('added to map');

        groupTreesNGPOther.addLayer(gp_layer);
        console.log(ARR_LAYERS);
        var addedLayer = groupTreesNGPOther.getLayers();
        var addedLayerId = addedLayer[groupTreesNGPOther.getLayers().length - 1]._leaflet_id;
        var obj = {}
        obj[layerName] = addedLayerId;
        ARR_LAYERS.push(obj);
        ADDED_LAYERS.push(layerName);

        var geojsonOBj = {};
        trees.features[0].properties.show = true;
        geojsonOBj[layerName] = trees;
        geojsonOBj[layerName]['show'] = true;
        LAYERS_REPO.push(geojsonOBj);

        $.each(LAYERS_REPO, function(idx) {
          if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
            LAYERS_REPO[idx][LAYER_NAME].show = true;
            LAYER_GEOJSON.addData(LAYERS_REPO[idx][LAYER_NAME]);
            console.log('added LAYER_GEOJSON-->', LAYER_NAME)
          };
        });
        setTimeout(function() {
          $('#loadMe').modal('hide');
        }, 500);


      } //success
    });
  } else if (ADDED_LAYERS.includes(layerName) && checked == true) {
    for (var i = 0; i < ARR_LAYERS.length; i++) {
      console.log(ARR_LAYERS[i].hasOwnProperty(layerName))
      if (ARR_LAYERS[i].hasOwnProperty(layerName)) {
        console.log(ARR_LAYERS[i][layerName]);
        var showLayer = groupTreesNGPOther.getLayer(ARR_LAYERS[i][layerName]);
        map.addLayer(showLayer);
      }
    }
    $.each(LAYERS_REPO, function(idx) {
      if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
        LAYERS_REPO[idx][LAYER_NAME].show = true;
        console.log('set show to true-->', LAYER_NAME)
      };
    })
  } else if (checked == false) {
    for (var i = 0; i < ARR_LAYERS.length; i++) {
      if (ARR_LAYERS[i].hasOwnProperty(layerName)) {
        console.log(ARR_LAYERS[i][layerName]);
        var removeLayer = groupTreesNGPOther.getLayer(ARR_LAYERS[i][layerName]);
        map.removeLayer(removeLayer);
      }
    }
    $.each(LAYERS_REPO, function(idx) {
      if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
        LAYERS_REPO[idx][LAYER_NAME].show = false;
        console.log('set show to false-->', LAYER_NAME)
      };
    })
  } else {
    console.log('ehhh no condition met')
  }

}

function toggleTreesNGP(URL, treeType, layerName, checked) {
  LAYER_NAME = layerName;

  if ((groupTreesNGP.getLayers().length == 0 || ADDED_LAYERS.includes(layerName) == false) && checked == true) {
    $.ajax({
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        //Download progress
        xhr.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            percentComplete = parseFloat(evt.loaded / evt.total) * 100;
            console.log(percentComplete)
              waitingDialog.progress(percentComplete);
              if (percentComplete == 100){
                 
                  setTimeout(function () {
                    waitingDialog.hide();
                  }, 1000);
              }
          }
        }, false);
        return xhr;
      },
      type: 'GET',
      url: URL,
      beforeSend:function(){
        waitingDialog.show('Initializing...',{dialogSize: 'm', progressType: ' bg-success',rtl:false});      
        waitingDialog.animate(["Fetching data.","Fetching data..","Fetching data...","Fetching data...."]);
        waitingDialog.progress(0);
      },
      success: function(data) {
        console.log('ready');
        //Add canvas layer
        var ddata = omnivore.topojson.parse(data);
        var trees = ddata.toGeoJSON();
        var treeLayer = L.vectorGrid.slicer(trees, {
          rendererFactory: L.canvas.tile,
          vectorTileLayerStyles: {
            sliced: {
              fillColor: treeType == 'Falcata' ? "#006d2c" : treeType == 'Gmelina' ? "#a50f15" : treeType == 'Mangium' ? "#54278f" : "#08519c",
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
        var addedLayerId = addedLayer[groupTreesNGP.getLayers().length - 1]._leaflet_id;
        var obj = {}
        obj[layerName] = addedLayerId;
        ARR_LAYERS.push(obj);
        ADDED_LAYERS.push(layerName);

        var geojsonOBj = {};
        trees.features[0].properties.show = true;
        geojsonOBj[layerName] = trees;
        geojsonOBj[layerName]['show'] = true;
        LAYERS_REPO.push(geojsonOBj);

        $.each(LAYERS_REPO, function(idx) {
          if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
            LAYERS_REPO[idx][LAYER_NAME].show = true;
            LAYER_GEOJSON.addData(LAYERS_REPO[idx][LAYER_NAME]);
            console.log('added LAYER_GEOJSON-->', LAYER_NAME)
          };
        })
      } //success
    });
  } else if (ADDED_LAYERS.includes(layerName) && checked == true) {
    for (var i = 0; i < ARR_LAYERS.length; i++) {
      console.log(ARR_LAYERS[i].hasOwnProperty(layerName))
      if (ARR_LAYERS[i].hasOwnProperty(layerName)) {
        console.log(ARR_LAYERS[i][layerName]);
        var showLayer = groupTreesNGP.getLayer(ARR_LAYERS[i][layerName]);
        map.addLayer(showLayer);
      }
    }
    $.each(LAYERS_REPO, function(idx) {
      if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
        LAYERS_REPO[idx][LAYER_NAME].show = true;
        console.log('set show to true-->', LAYER_NAME)
      };
    })
  } else if (checked == false) {
    for (var i = 0; i < ARR_LAYERS.length; i++) {
      if (ARR_LAYERS[i].hasOwnProperty(layerName)) {
        console.log(ARR_LAYERS[i][layerName]);
        var removeLayer = groupTreesNGP.getLayer(ARR_LAYERS[i][layerName]);
        map.removeLayer(removeLayer);
      }
    }
    $.each(LAYERS_REPO, function(idx) {
      if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
        LAYERS_REPO[idx][LAYER_NAME].show = false;
        console.log('set show to false-->', LAYER_NAME)
      };
    })
  } else {
    console.log('ehhh no condition met')
  }

}

function toggleAreaStats(URL, layerName, coverage, treeName, checked) {
  LAYER_NAME = layerName;
  if ((ADDED_LAYERS.includes(layerName) == false) && checked == true) {
    $.ajax({
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        //Download progress
        xhr.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            percentComplete = parseFloat(evt.loaded / evt.total) * 100;
            console.log(percentComplete)
              waitingDialog.progress(percentComplete);
              if (percentComplete == 100){
                 
                  setTimeout(function () {
                    waitingDialog.hide();
                  }, 1000);
              }
          }
        }, false);
        return xhr;
      },
      type: 'GET',
      url: URL,
      beforeSend:function(){
        waitingDialog.show('Initializing...',{dialogSize: 'm', progressType: ' bg-success',rtl:false});      
        waitingDialog.animate(["Fetching data.","Fetching data..","Fetching data...","Fetching data...."]);
        waitingDialog.progress(0);
      },
      success: function(data) {
        console.log('ready');
        //Add canvas layer
        var ddata = omnivore.topojson.parse(data);
        var trees = ddata.toGeoJSON();
        console.log('ready');
        //Add canvas layer
        console.log('coverage', coverage);
        if (coverage == 'Barangay' && BRGY_AREA_STATS == null) BRGY_AREA_STATS = trees;
        if (coverage == 'City/Municipality' && MUN_AREA_STATS == null) MUN_AREA_STATS = trees;
        if (coverage == 'Province' && PROV_AREA_STATS == null) PROV_AREA_STATS = trees;
        var treeLayer = L.vectorGrid.slicer(trees, {
          rendererFactory: L.canvas.tile,
          vectorTileLayerStyles: {
            sliced: function(properties) {
              var area = treeName == 'Falcata' ? parseFloat(properties.Falc_Ar_h) : treeName == 'Gmelina' ? parseFloat(properties.Gmel_Ar_h) : treeName == 'Mangium' ? parseFloat(properties.Mang_Ar_h) : parseFloat(properties.Bagr_Ar_h);
              if (area == 0) {
                return {
                  fillColor: "white",
                  color: "black",
                  weight: 1,
                  fill: true,
                  stroke: true,
                  fillOpacity: .8
                }
              } else if (area <= 10 && area > 0) {
                return {
                  fillColor: treeName == 'Falcata' ? "#edf8e9" :
                    treeName == 'Gmelina' ? "#fee5d9" :
                    treeName == 'Mangium' ? "#f2f0f7" :
                    "#eff3ff",
                  color: "black",
                  weight: .5,
                  fill: true,
                  stroke: true,
                  fillOpacity: .8
                }
              } else if (area > 10 && area <= 20) {
                return {
                  fillColor: treeName == 'Falcata' ? "#bae4b3" :
                    treeName == 'Gmelina' ? "#fcae91" :
                    treeName == 'Mangium' ? "#cbc9e2" :
                    "#bdd7e7",
                  color: "black",
                  weight: .5,
                  fill: true,
                  stroke: true,
                  fillOpacity: .8
                }
              } else if (area > 20 && area <= 30) {
                return {
                  fillColor: treeName == 'Falcata' ? "#74c476" :
                    treeName == 'Gmelina' ? "#fb6a4a" :
                    treeName == 'Mangium' ? "#9e9ac8" :
                    "#6baed6",
                  color: "black",
                  weight: .5,
                  fill: true,
                  stroke: true,
                  fillOpacity: .8
                }
              } else if (area > 30 && area <= 40) {
                return {
                  fillColor: treeName == 'Falcata' ? "#31a354" :
                    treeName == 'Gmelina' ? "#de2d26" :
                    treeName == 'Mangium' ? "#756bb1" :
                    "#3182bd",
                  color: "black",
                  weight: .5,
                  fill: true,
                  stroke: true,
                  fillOpacity: .8
                }
              } else {
                return {
                  fillColor: treeName == 'Falcata' ? "#006d2c" :
                    treeName == 'Gmelina' ? "#a50f15" :
                    treeName == 'Mangium' ? "#54278f" :
                    "#08519c",
                  color: "black",
                  weight: .5,
                  fill: true,
                  stroke: true,
                  fillOpacity: .8
                }
              }
            } //sliced
          },
          maxZoom: 22,
          indexMaxZoom: 5,
          interactive: true,
        }).addTo(map);

        console.log('added to map');

        groupAreaStats.addLayer(treeLayer);
        console.log(ARR_LAYERS);
        var addedLayer = groupAreaStats.getLayers();
        var addedLayerId = addedLayer[groupAreaStats.getLayers().length - 1]._leaflet_id;
        var obj = {}
        obj[layerName] = addedLayerId;
        ARR_LAYERS.push(obj);
        ADDED_LAYERS.push(layerName);

        var geojsonOBj = {};
        trees.features[0].properties.show = true;
        geojsonOBj[layerName] = trees;
        geojsonOBj[layerName]['show'] = true;
        LAYERS_REPO.push(geojsonOBj);

        $.each(LAYERS_REPO, function(idx) {
          if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
            LAYERS_REPO[idx][LAYER_NAME].show = true;
            LAYER_GEOJSON = L.geoJson(LAYERS_REPO[idx][LAYER_NAME]);
            console.log('added LAYER_GEOJSON-->', LAYER_NAME);
            waitingDialog.hide();
          };
        })
        setTimeout(function() {
          $('#loadMe').modal('hide');
        }, 500);

      } //success
    });

  } else if (ADDED_LAYERS.includes(layerName) && checked == true) {
    for (var i = 0; i < ARR_LAYERS.length; i++) {
      console.log(ARR_LAYERS[i].hasOwnProperty(layerName))
      if (ARR_LAYERS[i].hasOwnProperty(layerName)) {
        console.log(ARR_LAYERS[i][layerName]);
        var showLayer = groupAreaStats.getLayer(ARR_LAYERS[i][layerName]);
        map.addLayer(showLayer);
      }
    }
    $.each(LAYERS_REPO, function(idx) {
      if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
        LAYERS_REPO[idx][LAYER_NAME].show = true;
        LAYER_GEOJSON = L.geoJson(LAYERS_REPO[idx][LAYER_NAME]);
        console.log('added LAYER_GEOJSON-->', LAYER_NAME)
      };
    })
  } else if (checked == false) {
    console.log(groupAreaStats.getLayers());
    console.log(layerName)
    for (var i = 0; i < ARR_LAYERS.length; i++) {
      console.log(ARR_LAYERS[i].hasOwnProperty(layerName))
      if (ARR_LAYERS[i].hasOwnProperty(layerName)) {
        console.log(ARR_LAYERS[i][layerName]);
        var removeLayer = groupAreaStats.getLayer(ARR_LAYERS[i][layerName]);
        map.removeLayer(removeLayer);
      }
    }
    LAYER_GEOJSON = L.geoJson(null);
  } else {
    console.log('ehhh no condition met')
  }

}

function toggleSurveyLoc(URL, layerName, checked) {
  LAYER_NAME = layerName;
  if ((groupSurvey.getLayers().length == 0 || ADDED_LAYERS.includes(layerName) == false) && checked == true) {
    $('#loadMe').modal('show');
    $.ajax({
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        //Download progress
        xhr.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            percentComplete = parseFloat(evt.loaded / evt.total) * 100;
            console.log(percentComplete)
              waitingDialog.progress(percentComplete);
              if (percentComplete == 100){
                 
                  setTimeout(function () {
                    waitingDialog.hide();
                  }, 1000);
              }
          }
        }, false);
        return xhr;
      },
      type: 'GET',
      url: URL,
      beforeSend:function(){
        waitingDialog.progress(0);
        waitingDialog.show('Fetching data',{dialogSize: 'm', progressType: ' bg-success',rtl:false});      
        waitingDialog.animate(["Fetching data.","Fetching data..","Fetching data...","Fetching data...."])
      },
      success: function(data) {

        var trees = data;
        var gp_layer = L.geoJSON(trees, {
          onEachFeature: function(feature, layer) {
            var HIGHLIGHTProp = feature.properties;
            var popup = '<strong>Species:</strong> ' + HIGHLIGHTProp.Species + '</br><strong>Location:</strong> ' + HIGHLIGHTProp.Bgy_Name + ', ' + HIGHLIGHTProp.Mun_Name + ', ' + HIGHLIGHTProp.Pro_Name + ', ' + HIGHLIGHTProp.Reg_Name + '</br>' + '<strong>Area in hectares:</strong>' + parseFloat(HIGHLIGHTProp.Area_sqm / 10000).toFixed(2);
            layer.bindPopup(popup);
          },
          style: function(feature) {
            var treeType = feature.properties.Species;
            return {
              fillColor: treeType == 'Falcata' ? "#006d2c" : treeType == 'Gmelina' ? "#a50f15" : treeType == 'Mangium' ? "#54278f" : "#08519c",
              color: "black",
              weight: .1,
              fill: true,
              stroke: true,
              fillOpacity: .8
            }
          }
        }).addTo(map);
        map.fitBounds(gp_layer.getBounds());
        console.log('added to map');

        groupSurvey.addLayer(gp_layer);
        console.log(ARR_LAYERS);
        var addedLayer = groupSurvey.getLayers();
        var addedLayerId = addedLayer[groupSurvey.getLayers().length - 1]._leaflet_id;
        var obj = {}
        obj[layerName] = addedLayerId;
        ARR_LAYERS.push(obj);
        ADDED_LAYERS.push(layerName);

        var geojsonOBj = {};
        trees.features[0].properties.show = true;
        geojsonOBj[layerName] = trees;
        geojsonOBj[layerName]['show'] = true;
        LAYERS_REPO.push(geojsonOBj);

        $.each(LAYERS_REPO, function(idx) {
          if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
            LAYERS_REPO[idx][LAYER_NAME].show = true;
            LAYER_GEOJSON.addData(LAYERS_REPO[idx][LAYER_NAME]);
            console.log('added LAYER_GEOJSON-->', LAYER_NAME)
          };
        })
        setTimeout(function() {
          $('#loadMe').modal('hide');
        }, 500);


      } //success
    });


  } else if (ADDED_LAYERS.includes(layerName) && checked == true) {
    for (var i = 0; i < ARR_LAYERS.length; i++) {
      console.log(ARR_LAYERS[i].hasOwnProperty(layerName))
      if (ARR_LAYERS[i].hasOwnProperty(layerName)) {
        console.log(ARR_LAYERS[i][layerName]);
        var showLayer = groupSurvey.getLayer(ARR_LAYERS[i][layerName]);
        map.addLayer(showLayer);
        map.fitBounds(showLayer.getBounds());
      }
    }
    $.each(LAYERS_REPO, function(idx) {
      if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
        LAYERS_REPO[idx][LAYER_NAME].show = true;
        console.log('set show to true-->', LAYER_NAME)
      };
    })
  } else if (checked == false) {
    for (var i = 0; i < ARR_LAYERS.length; i++) {
      if (ARR_LAYERS[i].hasOwnProperty(layerName)) {
        console.log(ARR_LAYERS[i][layerName]);
        var removeLayer = groupSurvey.getLayer(ARR_LAYERS[i][layerName]);
        map.removeLayer(removeLayer);
      }
    }
    $.each(LAYERS_REPO, function(idx) {
      if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
        LAYERS_REPO[idx][LAYER_NAME].show = false;
        console.log('set show to false-->', LAYER_NAME)
      };
    })
  } else {
    console.log('ehhh no condition met')
  }
}

function toggleTPO(URL, layerName, checked) {
  LAYER_NAME = layerName;
 
  if ((groupTPO.getLayers().length == 0 || ADDED_LAYERS.includes(layerName) == false) && checked == true) {
    $('#loadMe').modal('show');
    $.ajax({
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        //Download progress
        xhr.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            percentComplete = parseFloat(evt.loaded / evt.total) * 100;
            console.log(percentComplete)
              waitingDialog.progress(percentComplete);
              if (percentComplete == 100){
                 
                  setTimeout(function () {
                    waitingDialog.hide();
                  }, 1000);
              }
          }
        }, false);
        return xhr;
      },
      type: 'GET',
      url: URL,
      beforeSend:function(){
        waitingDialog.progress(0);
        waitingDialog.show('Fetching data',{dialogSize: 'm', progressType: ' bg-success',rtl:false});      
        waitingDialog.animate(["Fetching data.","Fetching data..","Fetching data...","Fetching data...."])
      },
      success: function(data) {
        var trees = data;
        var geom_type = trees.features[0].geometry.type;
        if (geom_type == 'Point') {
          var gp_layer = L.geoJSON(trees, {
            onEachFeature: function(feature, layer) {
              var HIGHLIGHTProp = feature.properties;
              var popup = '<strong>Species:</strong> ' + HIGHLIGHTProp.Species + '</br><strong>Location:</strong> ' + HIGHLIGHTProp.Bgy_Name + ', ' + HIGHLIGHTProp.Mun_Name + ', ' + HIGHLIGHTProp.Pro_Name + ', ' + HIGHLIGHTProp.Reg_Name + '</br>' + '<strong>Area in hectare:</strong>' + parseFloat(HIGHLIGHTProp.Area).toFixed(2) + '</br>' + '<strong>Owner:</strong>' + HIGHLIGHTProp.Owner;
              layer.bindPopup(popup);
            },
            pointToLayer: function(feature, latlng) {
              var treeType = feature.properties.Species;
              return L.circleMarker(latlng, {
                fillColor: treeType == 'Falcata' ? "#006d2c" : treeType == 'Gmelina' ? "#a50f15" : treeType == 'Mangium' ? "#54278f" : "#08519c",
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                stroke: false,
                fillOpacity: 0.8
              });
            }

          }).addTo(map);
        } else {
          var gp_layer = L.geoJSON(trees, {
            onEachFeature: function(feature, layer) {
              var HIGHLIGHTProp = feature.properties;
              var popup = '<strong>Species:</strong> ' + HIGHLIGHTProp.Species + '</br><strong>Location:</strong> ' + HIGHLIGHTProp.Bgy_Name + ', ' + HIGHLIGHTProp.Mun_Name + ', ' + HIGHLIGHTProp.Pro_Name + ', ' + HIGHLIGHTProp.Reg_Name + '</br>' + '<strong>Area in hectare:</strong>' + parseFloat(HIGHLIGHTProp.Area).toFixed(2) + '</br>' + '<strong>Owner:</strong>' + HIGHLIGHTProp.Owner;
              layer.bindPopup(popup);
            },
            style: function(feature) {
              var treeType = feature.properties.Species;
              return {
                fillColor: treeType == 'Falcata' ? "#006d2c" : treeType == 'Gmelina' ? "#a50f15" : treeType == 'Mangium' ? "#54278f" : "#08519c",
                color: "black",
                weight: .1,
                fill: true,
                stroke: true,
                fillOpacity: .8
              };
            }

          }).addTo(map);
        }

        map.fitBounds(gp_layer.getBounds());
        console.log('added to map');

        groupTPO.addLayer(gp_layer);
        console.log(ARR_LAYERS);
        var addedLayer = groupTPO.getLayers();
        var addedLayerId = addedLayer[groupTPO.getLayers().length - 1]._leaflet_id;
        var obj = {}
        obj[layerName] = addedLayerId;
        ARR_LAYERS.push(obj);
        ADDED_LAYERS.push(layerName);

        var geojsonOBj = {};
        trees.features[0].properties.show = true;
        geojsonOBj[layerName] = trees;
        geojsonOBj[layerName]['show'] = true;
        LAYERS_REPO.push(geojsonOBj);

        $.each(LAYERS_REPO, function(idx) {
          if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
            LAYERS_REPO[idx][LAYER_NAME].show = true;
            LAYER_GEOJSON.addData(LAYERS_REPO[idx][LAYER_NAME]);
            console.log('added LAYER_GEOJSON-->', LAYER_NAME)
          };
        })

      } //success
    });

  } else if (ADDED_LAYERS.includes(layerName) && checked == true) {
    for (var i = 0; i < ARR_LAYERS.length; i++) {
      console.log(ARR_LAYERS[i].hasOwnProperty(layerName))
      if (ARR_LAYERS[i].hasOwnProperty(layerName)) {
        console.log(ARR_LAYERS[i][layerName]);
        var showLayer = groupTPO.getLayer(ARR_LAYERS[i][layerName]);
        map.addLayer(showLayer);
        map.fitBounds(showLayer.getBounds());
      }
    }
    $.each(LAYERS_REPO, function(idx) {
      if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
        LAYERS_REPO[idx][LAYER_NAME].show = true;
        console.log('set show to true-->', LAYER_NAME)
      };
    })
  } else if (checked == false) {
    for (var i = 0; i < ARR_LAYERS.length; i++) {
      if (ARR_LAYERS[i].hasOwnProperty(layerName)) {
        console.log(ARR_LAYERS[i][layerName]);
        var removeLayer = groupTPO.getLayer(ARR_LAYERS[i][layerName]);
        map.removeLayer(removeLayer);
      }
    }
    $.each(LAYERS_REPO, function(idx) {
      if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
        LAYERS_REPO[idx][LAYER_NAME].show = false;
        console.log('set show to false-->', LAYER_NAME)
      };
    })
  } else {
    console.log('ehhh no condition met')
  }
}

function toggleOtherLayer(URL, layerName, checked) {
  LAYER_NAME = layerName;
  if ((groupOtherLayer.getLayers().length == 0 || ADDED_LAYERS.includes(layerName) == false) && checked == true) {
    $.ajax({
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        //Download progress
        xhr.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            percentComplete = parseFloat(evt.loaded / evt.total) * 100;
            console.log(percentComplete)
              waitingDialog.progress(percentComplete);
              if (percentComplete == 100){
                 
                  setTimeout(function () {
                    waitingDialog.hide();
                  }, 1000);
              }
          }
        }, false);
        return xhr;
      },
      type: 'GET',
      beforeSend:function(){
        waitingDialog.show('Initializing...',{dialogSize: 'm', progressType: ' bg-success',rtl:false});      
        waitingDialog.animate(["Fetching data.","Fetching data..","Fetching data...","Fetching data...."]);
        waitingDialog.progress(0);
      },
      url: URL,
      success: function(data) {
        var trees = data;
        var gp_layer = L.geoJSON(trees, {
          onEachFeature: function(feature, layer) {
            var HIGHLIGHTProp = feature.properties;
            var popup = '<strong>Name:</strong> ' + HIGHLIGHTProp.Name + '<strong>';
            layer.bindPopup(popup);
          },
          pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
              fillColor: layerName == "Wood Processing Plant" ? "yellow" : "brown",
              radius: 8,
              color: "#000",
              weight: 1,
              opacity: 1,
              stroke: true,
              fillOpacity: 0.8
            });
          }

        }).addTo(map);


        map.fitBounds(gp_layer.getBounds());
        console.log('added to map');

        groupOtherLayer.addLayer(gp_layer);
        console.log(ARR_LAYERS);
        var addedLayer = groupOtherLayer.getLayers();
        var addedLayerId = addedLayer[groupOtherLayer.getLayers().length - 1]._leaflet_id;
        var obj = {}
        obj[layerName] = addedLayerId;
        ARR_LAYERS.push(obj);
        ADDED_LAYERS.push(layerName);

        var geojsonOBj = {};
        trees.features[0].properties.show = true;
        geojsonOBj[layerName] = trees;
        geojsonOBj[layerName]['show'] = true;
        LAYERS_REPO.push(geojsonOBj);

        $.each(LAYERS_REPO, function(idx) {
          if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
            LAYERS_REPO[idx][LAYER_NAME].show = true;
            LAYER_GEOJSON.addData(LAYERS_REPO[idx][LAYER_NAME]);
            console.log('added LAYER_GEOJSON-->', LAYER_NAME)
          };
        })

      } //success
    });

  } else if (ADDED_LAYERS.includes(layerName) && checked == true) {
    for (var i = 0; i < ARR_LAYERS.length; i++) {
      console.log(ARR_LAYERS[i].hasOwnProperty(layerName))
      if (ARR_LAYERS[i].hasOwnProperty(layerName)) {
        console.log(ARR_LAYERS[i][layerName]);
        var showLayer = groupOtherLayer.getLayer(ARR_LAYERS[i][layerName]);
        map.addLayer(showLayer);
        map.fitBounds(showLayer.getBounds());
      }
    }
    $.each(LAYERS_REPO, function(idx) {
      if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
        LAYERS_REPO[idx][LAYER_NAME].show = true;
        console.log('set show to true-->', LAYER_NAME)
      };
    })
  } else if (checked == false) {
    for (var i = 0; i < ARR_LAYERS.length; i++) {
      if (ARR_LAYERS[i].hasOwnProperty(layerName)) {
        console.log(ARR_LAYERS[i][layerName]);
        var removeLayer = groupOtherLayer.getLayer(ARR_LAYERS[i][layerName]);
        map.removeLayer(removeLayer);
      }
    }
    $.each(LAYERS_REPO, function(idx) {
      if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
        LAYERS_REPO[idx][LAYER_NAME].show = false;
        console.log('set show to false-->', LAYER_NAME)
      };
    })
  } else {
    console.log('ehhh no condition met')
  }
}

function loadLocs() {
  var BRGYS = ['AGUSAN DEL NORTE', 'AGUSAN DEL SUR', 'SURIGAO DEL NORTE', 'SURIGAO DEL SUR', 'DINAGAT ISLANDS'];
  $.getJSON(CARAGA_PLACES, function(res) {
    var province = res['province_list'];
    $.each(province, function(key, val) {
      var provNmae = key;
      var muns = val;
      $.each(muns, function(key, val) {
        var muns = key;
        var brgys = val;
        $.each(brgys, function(key, val) {
          var munName = key;
          var bbrgys = val['barangay_list'];
          for (var i = 0; i < bbrgys.length; i++) {
            if (!BRGYS.includes(munName + ', ' + provNmae)) {
              BRGYS.push(munName + ', ' + provNmae);
            }
            BRGYS.push(bbrgys[i] + ', ' + munName + ', ' + provNmae)
          }

        })
      })
    })
  });
  return BRGYS;
}

$(document).ajaxStart(function() {
  console.log('AJAX START')
});

$(document).ajaxStop(function(){
  console.log('AJAX STOP');
  setTimeout(function () {
    waitingDialog.hide();
  }, 1000);
});

$(document).ready(function() {

  //set map view on Caraga Region Area
  map.setView([9.1204, 125.59], 8);

  //Welcome Prompt
  $('#staticBackdrop').modal('show');

  //Enable tooltip
  $(function() {
    $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" })
  });

  //Base Maps
  var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; OpenStreetMap contributors',
    name: 'Open Street Map',
    zIndex: 0
  }).addTo(map);
  var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Map data &copy; Google',
    name: 'Google Sattelite',
    zIndex: 0
  });
  var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Map data &copy; Google',
    name: 'Google Hybrid',
    zIndex: 0
  })
  var bingMap = L.tileLayer.bing({
    bingMapsKey: 'Ao6UEij7ZblJ1soOx6opo-plK6LyISwyibIqcPQSRWpxE_yQ27qwI7HdoDNN9ePl',
    imagerySet: 'Road',
    zIndex: 0

  })
  var bingImagery = L.tileLayer.bing({
    bingMapsKey: 'Ao6UEij7ZblJ1soOx6opo-plK6LyISwyibIqcPQSRWpxE_yQ27qwI7HdoDNN9ePl',
    imagerySet: 'Aerial',
    zIndex: 0
  })
  var bingHybrid = L.tileLayer.bing({
    bingMapsKey: 'Ao6UEij7ZblJ1soOx6opo-plK6LyISwyibIqcPQSRWpxE_yQ27qwI7HdoDNN9ePl',
    imagerySet: 'AerialWithLabels',
    zIndex: 0
  })
  const BASE_MAP = {
    osm: osm,
    googleHybrid: googleHybrid,
    googleSat: googleSat,
    bingmap: bingMap,
    bingimagery: bingImagery,
    binghybrid: bingHybrid
  }
  //End Base Map

  //Controls
  var measureControl = new L.Control.Measure({
    position: 'topleft',
    primaryLengthUnit: 'feet',
    secondaryLengthUnit: 'kilometers',
    primaryAreaUnit: 'hectares',
    secondaryAreaUnit: 'sqmeters'
  });
  measureControl.addTo(map);
  var loading = L.Control.loading({
    position: 'topleft',
    separate: true
  });
  map.addControl(loading)
  var legend_trees = L.control({
    position: "topright"
  });
  legend_trees.onAdd = function(map) {
    var div = L.DomUtil.create("div", "maplegend");
    div.innerHTML += "<h4>ITP Species</h4>";
    div.innerHTML += '<i style="background: #006d2c"></i><span>Falcata</span><br>';
    div.innerHTML += '<i style="background: #a50f15"></i><span>Gmelina</span><br>';
    div.innerHTML += '<i style="background: #54278f"></i><span>Mangium</span><br>';
    div.innerHTML += '<i style="background: #08519c"></i><span>Bagras</span><br>';
    return div;
  };
  var legend_area = L.control({
    position: "topright"
  });
  var sidebar = L.control.sidebar({
    container: 'sidebar'
  }).addTo(map);
  sidebar.on('content', function(ev) {
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
    onChange: function(allSelectedItems, addedItems, removedItems) {
      if (map.hasLayer(FILTERED_LAYER)) {
        map.removeLayer(FILTERED_LAYER)
      }
      var layerAdd = null;
      var layerAddText = null;
      var layerAddDataSection = null;
      var layerRemove = null;
      var layerRemoveText = null;
      var layerRemoveDataSection = null;
      var layerRemoveLayerName = null;

      //unchecked items on Layers
      if (removedItems.length > 0) {
        layerRemove = removedItems[0].value;
        layerRemoveText = removedItems[0].text;
        layerRemoveDataSection = removedItems[0].section.split('/');
        layerRemoveLayerName = layerRemoveText + '_' + layerRemoveDataSection[2];

        if (layerRemove == 'stats') {
          var layerName = layerRemoveText.replace(/[\/. ,:-]+/g, "_") + '_' + layerRemoveDataSection[2];
          toggleAreaStats(null, layerName.toUpperCase(), layerRemoveText, layerRemoveDataSection[2], false);
        }
        if (layerRemove == 'trees') toggleTrees(null, layerRemoveText, false);
        if (layerRemove == 'survey') toggleSurveyLoc(null, layerRemoveText, false);
        if (layerRemove == 'others') toggleOtherLayer(null, layerRemoveText, false);
        if (layerRemove == 'ownership') {
          var layerName = layerRemoveDataSection[3].replace(/[\/. ,:-]+/g, "_")+'_'+layerRemoveText.replace(/[\/. ,:-]+/g, "_");
          toggleTPO(null, layerName.toUpperCase(), false)
        }
        if (layerRemove == 'denrcaraga') {
          var layerName = layerRemoveText + '_' + layerRemoveDataSection[3].replace(/\s/g, '_');
          toggleTreesNGP(null, layerRemoveText, layerName.toUpperCase(), false);
        }
        if (layerRemove == 'penroadn' || layerRemove == 'penroads' || layerRemove == 'cenrotalacogon' || layerRemove == 'cenrotubay') {
          var layerName = layerRemoveText + '_' + layerRemoveDataSection[3].replace(/\s/g, '_');
          toggleTreesNGPOthers(null, layerRemoveText, layerName.toUpperCase(), false);
        }
      }

      //checked items on Layers
      if (addedItems.length > 0) {
        if (!LOADED_LAYERS.includes(addedItems[0])) {
          LOADED_LAYERS.push(addedItems[0]);
        }

        layerAdd = addedItems[0].value;
        layerAddText = addedItems[0].text;
        layerAddDataSection = addedItems[0].section.split('/');
        LAYER_TYPE = layerAdd;

        if (layerAdd === 'trees') {
          legend_trees.addTo(map);
          map.removeControl(legend_area);
          map.removeLayer(groupAreaStats);
          for (var i = 0; i < LOADED_LAYERS.length; i++) {
            if (LOADED_LAYERS[i].value != 'trees') {
              var selectionNode = LOADED_LAYERS[i].node;
              selectionNode.getElementsByTagName('input')[0].checked = false;
              $('.item[data-key="' + LOADED_LAYERS[i].id + '"] span.remove-selected').click();
            }
          }
          var layerName = layerAddText.toUpperCase();
          toggleTrees(DATA_SOURCE_URL[layerName], layerAddText, true);
        }

        if (layerAdd === 'stats') {
          map.removeControl(legend_trees);
          map.removeLayer(groupTrees);
          map.removeLayer(groupTreesNGP);
          for (var i = 0; i < LOADED_LAYERS.length; i++) {
            var selectionNode = LOADED_LAYERS[i].node;
            if (LOADED_LAYERS[i].id != addedItems[0].id) {
              selectionNode.getElementsByTagName('input')[0].checked = false;
              $('.item[data-key="' + LOADED_LAYERS[i].id + '"] span.remove-selected').click();
            } else {
              selectionNode.getElementsByTagName('input')[0].checked = true;
            }
          }

          var layerName = layerAddText.replace(/[\/. ,:-]+/g, "_") + '_' + layerAddDataSection[2];
          var treeName = layerAddDataSection[2];
          var layerNameUpper = layerName.toUpperCase();

          toggleAreaStats(DATA_SOURCE_URL[layerNameUpper], layerNameUpper, layerAddText, treeName, true);
          legend_area.onAdd = function(map) {
            var div = L.DomUtil.create("div", "maplegend");
            var zeroTenColor = treeName == 'Falcata' ? '#edf8e9' : treeName == 'Gmelina' ? '#fee5d9' : treeName == 'Mangium' ? '#f2f0f7' : '#eff3ff';
            var zeroTen = "<i style='background: " + zeroTenColor + ";border: 1px solid #000'></i><span> > 0&nbsp;&nbsp; to <= 10</span><br>";
            var tenTwentyColor = treeName == 'Falcata' ? "#bae4b3" : treeName == 'Gmelina' ? "#fcae91" : treeName == 'Mangium' ? "#cbc9e2" : "#bdd7e7";
            var tenTwenty = "<i style='background: " + tenTwentyColor + ";border: 1px solid #000'></i><span> > 10 to <= 20</span><br>";
            var Twenty30Color = treeName == 'Falcata' ? "#74c476" : treeName == 'Gmelina' ? "#fb6a4a" : treeName == 'Mangium' ? "#9e9ac8" : "#6baed6";
            var Twenty30 = "<i style='background: " + Twenty30Color + ";border: 1px solid #000'></i><span> > 20 to <=30</span><br>";
            var thirty40Color = treeName == 'Falcata' ? "#31a354" : treeName == 'Gmelina' ? "#de2d26" : treeName == 'Mangium' ? "#756bb1" : "#3182bd";
            var thirty40 = "<i style='background: " + thirty40Color + ";border: 1px solid #000'></i><span> > 30 to <= 40</span><br>";
            var fortyLastColor = treeName == 'Falcata' ? "#006d2c" : treeName == 'Gmelina' ? "#a50f15" : treeName == 'Mangium' ? "#54278f" : "#08519c";
            var fortyLast = "<i style='background: " + fortyLastColor + ";border: 1px solid #000'></i><span> > 40 </span><br>";


            div.innerHTML += "<h4>" + treeName + " Area & Statistics in hectare</h4>";
            div.innerHTML += '<i style="background: #ffffff;border: 1px solid #000"></i><span>&nbsp;&nbsp;&nbsp;0 </span><br>';
            div.innerHTML += zeroTen;
            div.innerHTML += tenTwenty;
            div.innerHTML += Twenty30;
            div.innerHTML += thirty40;
            div.innerHTML += fortyLast;
            return div;
          };
          legend_area.addTo(map);
        }

        if (layerAdd === 'others') {
          map.removeControl(legend_area);
          map.removeControl(legend_trees);
          for (var i = 0; i < LOADED_LAYERS.length; i++) {
            if (LOADED_LAYERS[i].value != 'others') {
              var selectionNode = LOADED_LAYERS[i].node;
              selectionNode.getElementsByTagName('input')[0].checked = false;
              $('.item[data-key="' + LOADED_LAYERS[i].id + '"] span.remove-selected').click();
            }
          }
          var layerName = layerAddText.replace(/\s/g, '_');
          toggleOtherLayer(DATA_SOURCE_URL[layerName.toUpperCase()], layerAddText, true);
        }

        if (layerAdd === 'survey') {
          legend_trees.addTo(map);
          map.removeControl(legend_area);
          for (var i = 0; i < LOADED_LAYERS.length; i++) {
            if (LOADED_LAYERS[i].value != 'survey') {
              var selectionNode = LOADED_LAYERS[i].node;
              selectionNode.getElementsByTagName('input')[0].checked = false;
              $('.item[data-key="' + LOADED_LAYERS[i].id + '"] span.remove-selected').click();
            }
          }
          var URL = null;
          var layerName = layerAddText.replace(/\s/g, '_');          
          toggleSurveyLoc(DATA_SOURCE_URL[layerName.toUpperCase()], layerAddText, true)
        }

        if (layerAdd === 'ownership') {
          legend_trees.addTo(map);
          map.removeControl(legend_area);
          for (var i = 0; i < LOADED_LAYERS.length; i++) {
            if (LOADED_LAYERS[i].value != 'ownership') {
              var selectionNode = LOADED_LAYERS[i].node;
              selectionNode.getElementsByTagName('input')[0].checked = false;
              $('.item[data-key="' + LOADED_LAYERS[i].id + '"] span.remove-selected').click();
            }
          }
          var layerName = layerAddDataSection[3].replace(/[\/. ,:-]+/g, "_")+'_'+layerAddText.replace(/[\/. ,:-]+/g, "_");
          toggleTPO(DATA_SOURCE_URL[layerName.toUpperCase()], layerName.toUpperCase(), true);
        }

        if (layerAdd === 'denrcaraga') {
          legend_trees.addTo(map);
          map.removeControl(legend_area);
          map.removeLayer(groupAreaStats);
          map.removeLayer(groupTrees);
          for (var i = 0; i < LOADED_LAYERS.length; i++) {
            if (LOADED_LAYERS[i].value != 'denrcaraga') {
              var selectionNode = LOADED_LAYERS[i].node;
              selectionNode.getElementsByTagName('input')[0].checked = false;
              $('.item[data-key="' + LOADED_LAYERS[i].id + '"] span.remove-selected').click();
            }
          }
          var layerName = layerAddText + '_' + layerAddDataSection[3].replace(/\s/g, '_');
          var treeType = layerAddText;
          toggleTreesNGP(DATA_SOURCE_URL[layerName.toUpperCase()], treeType, layerName.toUpperCase(), true)
        }

        if (layerAdd == 'penroadn') {
          legend_trees.addTo(map);
          map.removeControl(legend_area);
          map.removeLayer(groupAreaStats);
          map.removeLayer(groupTrees);
          for (var i = 0; i < LOADED_LAYERS.length; i++) {
            if (LOADED_LAYERS[i].value != 'penroadn') {
              var selectionNode = LOADED_LAYERS[i].node;
              selectionNode.getElementsByTagName('input')[0].checked = false;
              $('.item[data-key="' + LOADED_LAYERS[i].id + '"] span.remove-selected').click();
            }
          }
          var layerName = layerAddText + '_' + layerAddDataSection[3].replace(/\s/g, '_');
          var treeType = layerAddText;
          toggleTreesNGPOthers(DATA_SOURCE_URL[layerName.toUpperCase()], treeType, layerName.toUpperCase(), true)
        }

        if (layerAdd == 'penroads') {
          legend_trees.addTo(map);
          map.removeControl(legend_area);
          map.removeLayer(groupAreaStats);
          map.removeLayer(groupTrees);
          for (var i = 0; i < LOADED_LAYERS.length; i++) {
            if (LOADED_LAYERS[i].value != 'penroads') {
              var selectionNode = LOADED_LAYERS[i].node;
              selectionNode.getElementsByTagName('input')[0].checked = false;
              $('.item[data-key="' + LOADED_LAYERS[i].id + '"] span.remove-selected').click();
            }
          }

          var layerName = layerAddText + '_' + layerAddDataSection[3].replace(/\s/g, '_');
          var treeType = layerAddText;
          toggleTreesNGPOthers(DATA_SOURCE_URL[layerName.toUpperCase()], treeType, layerName.toUpperCase(), true)
        }

        if (layerAdd == 'cenrotalacogon') {
          legend_trees.addTo(map);
          map.removeControl(legend_area);
          map.removeLayer(groupAreaStats);
          map.removeLayer(groupTrees);
          for (var i = 0; i < LOADED_LAYERS.length; i++) {
            if (LOADED_LAYERS[i].value != 'cenrotalacogon') {
              var selectionNode = LOADED_LAYERS[i].node;
              selectionNode.getElementsByTagName('input')[0].checked = false;
              $('.item[data-key="' + LOADED_LAYERS[i].id + '"] span.remove-selected').click();
            }
          }
          var layerName = layerAddText + '_' + layerAddDataSection[3].replace(/\s/g, '_');
          var treeType = layerAddText;
          toggleTreesNGPOthers(DATA_SOURCE_URL[layerName.toUpperCase()], treeType, layerName.toUpperCase(), true)
        }

        if (layerAdd == 'cenrotubay') {
          legend_trees.addTo(map);
          map.removeControl(legend_area);
          map.removeLayer(groupAreaStats);
          map.removeLayer(groupTrees);
          for (var i = 0; i < LOADED_LAYERS.length; i++) {
            if (LOADED_LAYERS[i].value != 'cenrotubay') {
              var selectionNode = LOADED_LAYERS[i].node;
              selectionNode.getElementsByTagName('input')[0].checked = false;
              $('.item[data-key="' + LOADED_LAYERS[i].id + '"] span.remove-selected').click();
            }
          }
          var layerName = layerAddText + '_' + layerAddDataSection[3].replace(/\s/g, '_');
          var treeType = layerAddText;
          toggleTreesNGPOthers(DATA_SOURCE_URL[layerName.toUpperCase()], treeType, layerName.toUpperCase(), true) 
        }


      }

    },
    startCollapsed: true
  });

  $('#base_map').multiselect({
    multiple: false,
    onChange: function(option) {
      var base_map = $(option).val();
      for (var key in BASE_MAP) {
          if(key == base_map){
            map.addLayer(BASE_MAP[key]);
          }else{
            map.removeLayer(BASE_MAP[key]);
          }
      }
    }
  });

  $('#trees').val('').multiselect({
    multiple: false,
    nonSelectedText: 'Select ITP Species',
    onChange: function(option, checked, select) {
      if (map.hasLayer(FILTERED_LAYER)) {
        map.removeLayer(FILTERED_LAYER)
      }
      var layer = $(option).val();
      var typeofQ = $('#q').val()
      if (checked && typeofQ == 'distri') {
        legend_trees.addTo(map);
        map.removeControl(legend_area);
        var treesInput = $('div.item[data-value="trees"');
        for(var i=0;i<treesInput.length;i++){
          if(typeof treesInput[i].children[1] != 'undefined'){
            if(treesInput[i].children[1].textContent == layer){
              console.log(treesInput[i].children[1].textContent,layer);
              $('div.item[data-value="trees"')[i].children[0].click();
            }else{
              if($('div.item[data-value="trees"')[i].children[0].checked){
                $('div.item[data-value="trees"')[i].children[0].click();
              };  
            }
          }
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
      labels: ['Falcata', 'Gmelina', 'Mangium', 'Bagras'],
      datasets: [{
        label: 'ITP Species Area in Hectares',
        data: [],
        backgroundColor: ['#006d2c', '#a50f15', '#54278f', '#08519c']
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
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'top',
          //formatter: null,
          font: {
            weight: 'bold'
          }
        }
      }
    }
  });

  //MAP Interaction
  map.on('click', function(e) {
    if (HIGHLIGHT) {
      map.removeLayer(HIGHLIGHT)
    }
    var x = e.latlng.lng;
    var y = e.latlng.lat;


    if (LAYER_TYPE == 'trees' || LAYER_TYPE == 'denrcaraga') {
      LAYER_DATA = leafletPip.pointInLayer([x, y], LAYER_GEOJSON, true);
      if (LAYER_DATA[0]) {
        var HIGHLIGHTProp = LAYER_DATA[0].feature.properties;
        var feature = LAYER_DATA[0].feature;
        HIGHLIGHT = new L.geoJson(feature, {
          style: {
            color: 'yellow',
            fillColor: 'white'
          }
        });
        var popup = '<strong>Species:</strong> ' + HIGHLIGHTProp.Species + '</br><strong>Location:</strong> ' + HIGHLIGHTProp.Bgy_Name + ', ' + HIGHLIGHTProp.Mun_Name + ', ' + HIGHLIGHTProp.Pro_Name + ', ' + HIGHLIGHTProp.Reg_Name + '</br>' + '<strong>Area in hectares:</strong>' + parseFloat(HIGHLIGHTProp.Area_sqm / 10000).toFixed(2);
        map.on('popupclose', function() {
          map.removeLayer(HIGHLIGHT)
        });
        setTimeout(function() {
          HIGHLIGHT.addTo(map);
          map.openPopup(popup, e.latlng);
        }, 50);
      } else {
        console.log('no feature found...')
      }
    }

    if (LAYER_TYPE == 'stats') {
      LAYER_DATA = leafletPip.pointInLayer([x, y], LAYER_GEOJSON, true);
      if (LAYER_DATA[0]) {
        var HIGHLIGHTProp = LAYER_DATA[0].feature.properties;
        var location = '';
        if (HIGHLIGHTProp.Bgy_Name) {
          location = HIGHLIGHTProp.Bgy_Name + ', ' + HIGHLIGHTProp.Mun_Name + ', ' + HIGHLIGHTProp.Pro_Name;
        } else if (HIGHLIGHTProp.Mun_Name) {
          location = HIGHLIGHTProp.Mun_Name + ', ' + HIGHLIGHTProp.Pro_Name;
        } else {
          location = HIGHLIGHTProp.Pro_Name;
        }
        var feature = LAYER_DATA[0].feature;
        HIGHLIGHT = new L.geoJson(feature, {
          style: {
            color: 'yellow',
            fillColor: 'white'
          },
        });
        var dataFalcata = HIGHLIGHTProp.Falc_Ar_h;
        var dataGmelina = HIGHLIGHTProp.Gmel_Ar_h;
        var dataMangium = HIGHLIGHTProp.Mang_Ar_h;
        var dataBagras = HIGHLIGHTProp.Bagr_Ar_h;
        var newData = [dataFalcata, dataGmelina, dataMangium, dataBagras];
        myChart.data["datasets"][0]["data"] = newData;
        myChart.options.title.text = location;
        myChart.update();
        setTimeout(function() {
          HIGHLIGHT.addTo(map);
          $('#chartMe').modal('show');
        }, 50);
        $('#chartMe').on('hidden.bs.modal', function(e) {
          map.removeLayer(HIGHLIGHT);
        })
      }
    }
  });

  //OTHERS UX
  var Barangays = loadLocs();
  var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
      var matches = [];
      substrRegex = new RegExp(q, 'i');
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
    HIGHLIGHT: true,
    minLength: 1
  }, {
    name: 'barangays',
    source: substringMatcher(Barangays)
  });

  $("#citymun").remoteChained({
    parents: "#prov",
    url: CARAGA_PLACES,
    data: function(json) {
      var provVal = $('#prov').val();
      var munList = json.province_list[provVal]['municipality_list'];
      var munArr = [];
      munArr.push({
        '-': 'Select City/Municipality'
      })
      $.each(munList, function(key) {
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
    data: function(json) {
      var provVal = $('#prov').val();
      var munVal = $('#citymun').val();
      var brgyList = json.province_list[provVal].municipality_list[munVal].barangay_list;
      var brgyArr = [];
      brgyArr.push({
        '-': 'Select Barangay'
      })
      brgyList.forEach(element => {
        var obj = {};
        obj[element] = element;
        brgyArr.push(obj)
      });
      return brgyArr;
    }
  });

  $('#btnOK').click(function() {
    sidebar.open('about');
  })

  $('#btnWebMap').click(function() {
    sidebar.open('query');
  })

  $('#btnSearhDL').click(function() {
    sidebar.open('download');
  })

  $('#btnWebMap1').click(function() {
    sidebar.open('query');
  })

  $('#btnSearhDL1').click(function() {
    sidebar.open('download');
  })

  $('#btnAgree').click(function() {
    sidebar.open('welcome');
  })

  $("#searchBarangay").focus(function() {
    $('#the-basics .typeahead').typeahead('val', '');
  });

  $('#btnSearchBrgy').click(function() {
    if (map.hasLayer(FILTERED_LAYER)) {
      map.removeLayer(FILTERED_LAYER)
    }
    var loc = $('#searchBarangay').val();
    var loc_split = loc.split(',');
    var brgyVal = '-';
    var munVAl = '-';
    var provVal = '-';
    console.log(loc_split);
    if (loc_split.length == 1) {
      provVal = loc_split[0].trim();
    }
    if (loc_split.length == 2) {
      munVAl = loc_split[0].trim();
      provVal = loc_split[1].trim();
    }
    if (loc_split.length == 3) {
      brgyVal = loc_split[0].trim();
      munVAl = loc_split[1].trim();
      provVal = loc_split[2].trim();
    }

    var dataGeojson = null;
    $.each(LAYERS_REPO, function(idx) {
      if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
        dataGeojson = LAYERS_REPO[idx][LAYER_NAME];
      };
    })
    FILTERED_LAYER = L.geoJson(dataGeojson, {
      style: {
        fillColor: "#fff",
        color: "yellow",
        weight: 2,
        fill: false,
        stroke: true,
        fillOpacity: 0
      },
      filter: function(feature) {
        if (munVAl != '-' && brgyVal != '-') {
          return (feature.properties.Bgy_Name == brgyVal && feature.properties.Mun_Name == munVAl && feature.properties.Pro_Name == provVal)
        } else if (munVAl != '-') {
          return (feature.properties.Mun_Name == munVAl && feature.properties.Pro_Name == provVal)
        } else {
          return (feature.properties.Pro_Name == provVal)
        }
      }
    }).addTo(map);

    if (dataGeojson == null) {
      alert('YOU HAVE NOT SELECTED/LOADED A LAYER!')
    } else if (FILTERED_LAYER.getLayers().length > 0) {
      map.fitBounds(FILTERED_LAYER.getBounds())
    } else {
      alert('NO RESULT FOUND, TRY ANOTHER LOCATION!')
    }
  })

  $('#btnGo').click(function() {
    if (map.hasLayer(FILTERED_LAYER)) {
      map.removeLayer(FILTERED_LAYER)
    }
    var brgyVal = $('#brgy').val();
    var munVAl = $('#citymun').val();
    var provVal = $('#prov').val();
    LAYER_NAME = $('#trees').val();
    var dataGeojson = null;
    $.each(LAYERS_REPO, function(idx) {
      if (LAYERS_REPO[idx].hasOwnProperty(LAYER_NAME)) {
        dataGeojson = LAYERS_REPO[idx][LAYER_NAME];
        console.log(dataGeojson)
      };
    })
    FILTERED_LAYER = L.geoJson(dataGeojson, {
      style: {
        fillColor: "#fff",
        color: "yellow",
        weight: 2,
        fill: false,
        stroke: true,
        fillOpacity: 0
      },
      filter: function(feature) {
        if (munVAl != '-' && brgyVal != '-') {
          return (feature.properties.Bgy_Name == brgyVal && feature.properties.Mun_Name == munVAl && feature.properties.Pro_Name == provVal)
        } else if (munVAl != '-') {
          return (feature.properties.Mun_Name == munVAl && feature.properties.Pro_Name == provVal)
        } else {
          return (feature.properties.Pro_Name == provVal)
        }

      }
    }).addTo(map);

    if (FILTERED_LAYER.getLayers().length > 0) {
      map.fitBounds(FILTERED_LAYER.getBounds())
    } else {
      alert('NO RESULT FOUND, TRY ANOTHER LOCATION!')
    }
  })

});
