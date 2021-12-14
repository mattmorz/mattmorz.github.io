/**
 * Code written by: idsilmat@gmail.com
 * mattmorz.blogspot.com
 * For: ITPs Geodatabase Project
 * v1.0.2
 * Added progress indicator
 * Fixed base map z-index
 * Changed loading/progress indicator
 * Fixed Chrome problem
 * Code refactor
 */
const BASE_URL = window.location.href;
//const BASE_URL = "https://raw.githubusercontent.com/mattmorz/mattmorz.github.io/master/itps_webapp/";
const CARAGA_PLACES = BASE_URL + "js/caraga.json";

const DATA_SOURCE_URL = {
  SUITABILITY_FALCATA : BASE_URL + "data/CaragaRegion_Falcata2019_maxent.json",//ok
  SUITABILITY_GMELINA : BASE_URL + "data/CaragaRegion_Gmelina2019_maxent.json",//ok
  SUITABILITY_MANGIUM : BASE_URL + "data/CaragaRegion_Mangium2019_maxent.json",//ok
  SUITABILITY_BAGRAS : BASE_URL + "data/CaragaRegion_Bagras2019_maxent.json",//ok
  FALCATA: BASE_URL + "data/CaragaRegion_ITP_Falcata2019.json",//ok
  GMELINA: BASE_URL + "data/CaragaRegion_ITP_Gmelina2019.json",//ok
  MANGIUM: BASE_URL + "data/CaragaRegion_ITP_Mangium2019.json",//ok
  BAGRAS: BASE_URL + "data/CaragaRegion_ITP_Bagras2019.json",//ok
  BARANGAY_FALCATA: BASE_URL + "data/ITP_Area_BrgyLevel2019.json",//ok
  CITY_MUNICIPALITY_FALCATA: BASE_URL + "data/ITP_Area_MunLevel2019.json",//ok
  PROVINCE_FALCATA: BASE_URL + "data/ITP_Area_ProLevel2019.json",//ok
  BARANGAY_GMELINA: BASE_URL + "data/ITP_Area_BrgyLevel2019.json",//ok
  CITY_MUNICIPALITY_GMELINA: BASE_URL + "data/ITP_Area_MunLevel2019.json",//ok
  PROVINCE_GMELINA: BASE_URL + "data/ITP_Area_ProLevel2019.json",//ok
  BARANGAY_MANGIUM: BASE_URL + "data/ITP_Area_BrgyLevel2019.json",//ok
  CITY_MUNICIPALITY_MANGIUM: BASE_URL + "data/ITP_Area_MunLevel2019.json",//ok
  PROVINCE_MANGIUM: BASE_URL + "data/ITP_Area_ProLevel2019.json",//ok
  BARANGAY_BAGRAS: BASE_URL + "data/ITP_Area_BrgyLevel2019.json",//ok
  CITY_MUNICIPALITY_BAGRAS: BASE_URL + "data/ITP_Area_MunLevel2019.json",//ok
  PROVINCE_BAGRAS: BASE_URL + "data/ITP_Area_ProLevel2019.json",//ok
  WOOD_PROCESSING_PLANT: BASE_URL + "data/CaragaRegion_WPP_FieldDataPoints.json",//ok
  FURNITURE_STORE: BASE_URL + "data/CaragaRegion_FurnitureStores_FieldDataPoints.json",//ok
  ADS_GROUND_TRUTH: BASE_URL + "data/ADS_Ground_Truth.json",
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
  FALCATA_CENRO_TUBAY: BASE_URL + "data/NGP_CENROTubay_Falcata.json",
  MANGIUM_CENRO_TUBAY: BASE_URL + "data/NGP_CENROTubay_Mangium.json",
}

//Layergroups for checking if layer is added
var groupAreaStats = new L.layerGroup();
var groupSuitableAreas = new L.layerGroup();
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
//TOPOJSON
function toggleTrees(URL, treeType, checked) {
  LAYER_NAME = treeType;
  if ((groupTrees.getLayers().length == 0 || ADDED_LAYERS.includes(treeType) == false) && checked == true) {
    var percentComplete = 0;

    $.ajax({
      xhr: function() {
        var xhr = new XMLHttpRequest();
        //Download progress
        xhr.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            percentComplete = parseFloat(evt.loaded / evt.total) * 100;
            console.log(percentComplete);
            waitingDialog.progress(percentComplete);
            if (percentComplete == 100) {
              setTimeout(function() {
                waitingDialog.hide();
              }, 1000);
            }
          } else {
            console.log('chrome');
            var loaded = parseInt(evt.loaded / 10);
            var total = parseInt(evt.target.getResponseHeader('Content-Length'), 10);
            percentComplete = parseFloat(loaded / total) * 100;
            console.log(loaded, total)
            console.log(percentComplete);
            waitingDialog.progress(percentComplete);
            if (percentComplete == 100) {
              setTimeout(function() {
                waitingDialog.hide();
              }, 1000);
            }
          }
        }, false);
        return xhr;
      },
      type: 'GET',
      url: URL,
      beforeSend: function() {
        waitingDialog.show('Initializing...', {
          dialogSize: 'm',
          progressType: ' bg-success',
          rtl: false
        });
        waitingDialog.animate(["Fetching data.", "Fetching data..", "Fetching data...", "Fetching data...."]);
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
              fillColor: treeType == 'Falcata' ? "#1b723f" : treeType == 'Gmelina' ? "#e69800" : treeType == 'Mangium' ? "#e600aa" : "#ffff00",
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

//GEOJSON
function toggleTreesNGPOthers(URL, treeType, layerName, checked) {
  LAYER_NAME = layerName;
  if ((groupTreesNGPOther.getLayers().length == 0 || ADDED_LAYERS.includes(layerName) == false) && checked == true) {
    $.ajax({
      xhr: function() {
        var xhr = new XMLHttpRequest();
        //Download progress
        xhr.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            percentComplete = parseFloat(evt.loaded / evt.total) * 100;
            console.log(percentComplete);
            waitingDialog.progress(percentComplete);
            if (percentComplete == 100) {
              setTimeout(function() {
                waitingDialog.hide();
              }, 1000);
            }
          } else {
            console.log('chrome');
            var loaded = parseInt(evt.loaded / 10);
            var total = parseInt(evt.target.getResponseHeader('Content-Length'), 10);
            percentComplete = parseFloat(loaded / total) * 100;
            console.log(percentComplete);
            waitingDialog.progress(percentComplete);
            if (percentComplete == 100) {
              setTimeout(function() {
                waitingDialog.hide();
              }, 1000);
            }
          }
        }, false);
        return xhr;
      },
      type: 'GET',
      url: URL,
      beforeSend: function() {
        waitingDialog.show('Initializing...', {
          dialogSize: 'm',
          progressType: ' bg-success',
          rtl: false
        });
        waitingDialog.animate(["Fetching data.", "Fetching data..", "Fetching data...", "Fetching data...."]);
        waitingDialog.progress(0);
      },
      success: function(data) {
        var trees = data;
        var gp_layer = L.geoJSON(trees, {
          onEachFeature: function(feature, layer) {
            var html = "<table  class='table table-bordered' style='width:500px;overflow-x:auto;height:auto'>";
            //var HIGHLIGHTProp = feature.properties;
            //var popup = '<strong>Name:</strong> ' + HIGHLIGHTProp.Name + '<strong>';                     
            var properties=feature.properties;
            html+='<tr>';
            for (var x in properties) {
              html+='<td>'+x+'</td>';
            }
            html+='</tr><tr>';
            for (var x in properties){
              html+='<td>'+properties[x]+'</td>';
            }
            html+='</tr></table>';

            layer.bindPopup(html);
          },
          style: function(feature) {
            //var treeType = feature.properties.Species;
            //var trees = treeType.split(',');
            return {
              fillColor: treeType == 'Falcata' ? "#1b723f" : treeType == 'Gmelina' ? "#e69800" : treeType == 'Mangium' ? "#e600aa" : treeType == 'Bagras' ? "#ffff00" : "#fff",
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

//TOPOJSON
function toggleTreesNGP(URL, treeType, layerName, checked) {
  LAYER_NAME = layerName;

  if ((groupTreesNGP.getLayers().length == 0 || ADDED_LAYERS.includes(layerName) == false) && checked == true) {
    $.ajax({
      xhr: function() {
        var xhr = new XMLHttpRequest();
        //Download progress
        xhr.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            percentComplete = parseFloat(evt.loaded / evt.total) * 100;
            console.log(percentComplete);
            waitingDialog.progress(percentComplete);
            if (percentComplete == 100) {
              setTimeout(function() {
                waitingDialog.hide();
              }, 1000);
            }
          } else {
            console.log('chrome');
            var loaded = parseInt(evt.loaded / 10);
            var total = parseInt(evt.target.getResponseHeader('Content-Length'), 10);
            percentComplete = parseFloat(loaded / total) * 100;
            console.log(percentComplete);
            waitingDialog.progress(percentComplete);
            if (percentComplete == 100) {
              setTimeout(function() {
                waitingDialog.hide();
              }, 1000);
            }
          }
        }, false);
        return xhr;
      },
      type: 'GET',
      url: URL,
      beforeSend: function() {
        waitingDialog.show('Initializing...', {
          dialogSize: 'm',
          progressType: ' bg-success',
          rtl: false
        });
        waitingDialog.animate(["Fetching data.", "Fetching data..", "Fetching data...", "Fetching data...."]);
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
              fillColor: treeType == 'Falcata' ? "#1b723f" : treeType == 'Gmelina' ? "#e69800" : treeType == 'Mangium' ? "#e600aa" : "#ffff00",
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

//GEOJSON
function toggleSuitabilityAreas(URL, layerName, treeName, checked) {
  LAYER_NAME = layerName;
  if ((ADDED_LAYERS.includes(layerName) == false) && checked == true) {
    $.ajax({
      xhr: function() {
        var xhr = new XMLHttpRequest();
        //Download progress
        xhr.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            percentComplete = parseFloat(evt.loaded / evt.total) * 100;
            console.log(percentComplete);
            waitingDialog.progress(percentComplete);
            if (percentComplete == 100) {
              setTimeout(function() {
                waitingDialog.hide();
              }, 1000);
            }
          } else {
            console.log('chrome');
            var loaded = parseInt(evt.loaded);
            var total = parseInt(evt.target.getResponseHeader('Content-Length'), 10);
            percentComplete = parseFloat(loaded / total) * 100;
            console.log(percentComplete);
            waitingDialog.progress(percentComplete);
            if (percentComplete == 100) {
              setTimeout(function() {
                waitingDialog.hide();
              }, 1000);
            }
          }
        }, false);
        return xhr;
      },
      type: 'GET',
      url: URL,
      beforeSend: function() {
        waitingDialog.show('Initializing...', {
          dialogSize: 'm',
          progressType: ' bg-success',
          rtl: false
        });
        waitingDialog.animate(["Fetching data.", "Fetching data..", "Fetching data...", "Fetching data...."]);
        waitingDialog.progress(0);
      },
      success: function(data) {
        console.log('ready');
        //Add canvas layer
        //var ddata = omnivore.topojson.parse(data);
        var trees = data;
        console.log('ready');
        //Add canvas layer
        var treeLayer = L.vectorGrid.slicer(trees, {
          rendererFactory: L.canvas.tile,
          vectorTileLayerStyles: {
            sliced: function(properties) {
              var suitability_level = properties.Level ;
              return {
                fillColor: suitability_level == 'High Suitable' ? "#e60000" : suitability_level == 'Moderate Suitable' ? "#e7e600" : suitability_level == 'Low Suitable' ? "#267300" : "#828282",
                color: "black",
                weight: .1,
                fill: true,
                stroke: true,
                fillOpacity: .8
              }

            } //sliced
          },
          maxZoom: 22,
          indexMaxZoom: 5,
          interactive: true,
        }).addTo(map);

        console.log('added to map');

        groupSuitableAreas.addLayer(treeLayer);
        console.log(ARR_LAYERS);
        var addedLayer = groupSuitableAreas.getLayers();
        var addedLayerId = addedLayer[groupSuitableAreas.getLayers().length - 1]._leaflet_id;
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
        var showLayer = groupSuitableAreas.getLayer(ARR_LAYERS[i][layerName]);
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
    console.log(groupSuitableAreas.getLayers());
    console.log(layerName)
    for (var i = 0; i < ARR_LAYERS.length; i++) {
      console.log(ARR_LAYERS[i].hasOwnProperty(layerName))
      if (ARR_LAYERS[i].hasOwnProperty(layerName)) {
        console.log(ARR_LAYERS[i][layerName]);
        var removeLayer = groupSuitableAreas.getLayer(ARR_LAYERS[i][layerName]);
        map.removeLayer(removeLayer);
      }
    }
    LAYER_GEOJSON = L.geoJson(null);
  } else {
    console.log('ehhh no condition met')
  }

}

//TOPOJSON
function toggleAreaStats(URL, layerName, coverage, treeName, checked) {
  LAYER_NAME = layerName;
  if ((ADDED_LAYERS.includes(layerName) == false) && checked == true) {
    $.ajax({
      xhr: function() {
        var xhr = new XMLHttpRequest();
        //Download progress
        xhr.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            percentComplete = parseFloat(evt.loaded / evt.total) * 100;
            console.log(percentComplete);
            waitingDialog.progress(percentComplete);
            if (percentComplete == 100) {
              setTimeout(function() {
                waitingDialog.hide();
              }, 1000);
            }
          } else {
            console.log('chrome');
            var loaded = parseInt(evt.loaded);
            var total = parseInt(evt.target.getResponseHeader('Content-Length'), 10);
            percentComplete = parseFloat(loaded / total) * 100;
            console.log(percentComplete);
            waitingDialog.progress(percentComplete);
            if (percentComplete == 100) {
              setTimeout(function() {
                waitingDialog.hide();
              }, 1000);
            }
          }
        }, false);
        return xhr;
      },
      type: 'GET',
      url: URL,
      beforeSend: function() {
        waitingDialog.show('Initializing...', {
          dialogSize: 'm',
          progressType: ' bg-success',
          rtl: false
        });
        waitingDialog.animate(["Fetching data.", "Fetching data..", "Fetching data...", "Fetching data...."]);
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
              var area = treeName == 'Falcata' ? parseFloat(properties.Fal_Area) : treeName == 'Gmelina' ? parseFloat(properties.Gme_Area) : treeName == 'Mangium' ? parseFloat(properties.Man_Area) : parseFloat(properties.Bag_Area);

              if (treeName == 'Mangium'){
                if (area == 0) {
                  return {
                    fillColor: "white",
                    color: "black",
                    weight: 1,
                    fill: false,
                    stroke: true,
                    fillOpacity: 0
                  }
                } else if (area <= 0.92 && area >= 0.47) {
                  return {
                    fillColor: '#feccff',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                } else if (area >= 0.93 && area <= 2.61) {
                  return {
                    fillColor: '#f5a9f4',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                } else if (area >= 2.62 && area <= 9.01) {
                  return {
                    fillColor:'#ea86e8',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                } else if (area >= 9.02 && area <= 33.25) {
                  return {
                    fillColor:'#df63dd',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                } else if (area >= 33.26 && area <= 125.02) {
                  return {
                    fillColor:'#d33dd2',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                } else {
                  return {
                    fillColor:'#c600c7',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                }
              }
              
              if (treeName == 'Falcata'){
                if (area == 0) {
                  return {
                    fillColor: "white",
                    color: "black",
                    weight: 1,
                    fill: false,
                    stroke: true,
                    fillOpacity: 0
                  }
                } else if (area <= 11.64 && area >= 0.42) {
                  return {
                    fillColor: '#cdffcc',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                } else if (area >= 11.65 && area <= 54.13) {
                  return {
                    fillColor: '#aaf5a3',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                } else if (area >= 54.14 && area <= 214.96) {
                  return {
                    fillColor:'#8bed80',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                } else if (area >= 214.97 && area <= 823.78) {
                  return {
                    fillColor:'#67e35d',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                } else if (area >= 823.79 && area <= 3128.48) {
                  return {
                    fillColor:'#45d63b',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                } else {
                  return {
                    fillColor:'#0ecd0e',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                }
              }

              if (treeName == 'Gmelina'){
                if (area == 0) {
                  return {
                    fillColor: "white",
                    color: "black",
                    weight: 1,
                    fill: false,
                    stroke: true,
                    fillOpacity: 0
                  }
                } else if (area == 0.05) {
                  return {
                    fillColor: '#ffeacb',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                } else if (area >= 0.06 && area <= 0.19) {
                  return {
                    fillColor: '#ffc188',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                } else if (area >= 0.20 && area <= 0.64) {
                  return {
                    fillColor:'#fc9d49',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                }else {
                  return {
                    fillColor:'#f07706',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                }
              }

              if (treeName == 'Bagras'){
                if (area == 0) {
                  return {
                    fillColor: "white",
                    color: "black",
                    weight: 1,
                    fill: false,
                    stroke: true,
                    fillOpacity: 0
                  }
                } else if (area == 0.53) {
                  return {
                    fillColor: '#ecfccd',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                } else if (area >= 0.54 && area <= 1.09) {
                  return {
                    fillColor: '#daf09e',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                } else if (area >= 1.10 && area <= 1.67) {
                  return {
                    fillColor:'#c7e372',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                }else if(area >= 1.68 && area <= 2.28) {
                  return {
                    fillColor:'#b5d945',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
                }else{
                  return {
                    fillColor:'#9ecc11',
                    color: "black",
                    weight: .5,
                    fill: true,
                    stroke: true,
                    fillOpacity: .8
                  }
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

//GEOJSON
function toggleSurveyLoc(URL, layerName, checked) {
  LAYER_NAME = layerName;
  if ((groupSurvey.getLayers().length == 0 || ADDED_LAYERS.includes(layerName) == false) && checked == true) {
    $('#loadMe').modal('show');
    $.ajax({
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        //Download progress
        xhr.addEventListener("progress", function(evt) {
          console.log(evt.lengthComputable);
          console.log(evt.loaded);
          //if (evt.lengthComputable) {

          percentComplete = parseFloat(evt.loaded / evt.total) * 100;
          console.log(percentComplete);
          waitingDialog.progress(percentComplete);
          if (percentComplete == 100) {
            setTimeout(function() {
              waitingDialog.hide();
            }, 1000);
          }
          //}
        }, false);
        return xhr;
      },
      type: 'GET',
      url: URL,
      beforeSend: function() {
        waitingDialog.progress(0);
        waitingDialog.show('Fetching data', {
          dialogSize: 'm',
          progressType: ' bg-success',
          rtl: false
        });
        waitingDialog.animate(["Fetching data.", "Fetching data..", "Fetching data...", "Fetching data...."])
      },
      success: function(data) {

        var trees = data;
        var gp_layer = L.geoJSON(trees, {
          onEachFeature: function(feature, layer) {
            var html = "<table  class='table table-bordered' style='width:500px;overflow-x:auto;height:auto'>";
            //var HIGHLIGHTProp = feature.properties;
            //var popup = '<strong>Name:</strong> ' + HIGHLIGHTProp.Name + '<strong>';                     
            var properties=feature.properties;
            html+='<tr>';
            for (var x in properties) {
              html+='<td>'+x+'</td>';
            }
            html+='</tr><tr>';
            for (var x in properties){
              html+='<td>'+properties[x]+'</td>';
            }
            html+='</tr></table>';

            layer.bindPopup(html);
          },
          style: function(feature) {
            var treeType = feature.properties.Species;
            return {
              fillColor: treeType == 'Falcata' ? "#1b723f" : treeType == 'Gmelina' ? "#e69800" : treeType == 'Mangium' ? "#e600aa" : "#ffff00",
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

//GEOJSON
function toggleTPO(URL, layerName, checked) {
  LAYER_NAME = layerName;

  if ((groupTPO.getLayers().length == 0 || ADDED_LAYERS.includes(layerName) == false) && checked == true) {
    $('#loadMe').modal('show');
    $.ajax({
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        //Download progress
        xhr.addEventListener("progress", function(evt) {
          console.log(evt.lengthComputable);
          console.log(evt.loaded);
          //if (evt.lengthComputable) {

          percentComplete = parseFloat(evt.loaded / evt.total) * 100;
          console.log(percentComplete);
          waitingDialog.progress(percentComplete);
          if (percentComplete == 100) {
            setTimeout(function() {
              waitingDialog.hide();
            }, 1000);
          }
          //}
        }, false);
        return xhr;
      },
      type: 'GET',
      url: URL,
      beforeSend: function() {
        waitingDialog.progress(0);
        waitingDialog.show('Fetching data', {
          dialogSize: 'm',
          progressType: ' bg-success',
          rtl: false
        });
        waitingDialog.animate(["Fetching data.", "Fetching data..", "Fetching data...", "Fetching data...."])
      },
      success: function(data) {
        var trees = data;
        var geom_type = trees.features[0].geometry.type;
        if (geom_type == 'Point') {
          var gp_layer = L.geoJSON(trees, {
            onEachFeature: function(feature, layer) {
              var html = "<table  class='table table-bordered' style='width:500px;overflow-x:auto;height:auto'>";
              //var HIGHLIGHTProp = feature.properties;
              //var popup = '<strong>Name:</strong> ' + HIGHLIGHTProp.Name + '<strong>';                     
              var properties=feature.properties;
              html+='<tr>';
              for (var x in properties) {
                html+='<td>'+x+'</td>';
              }
              html+='</tr><tr>';
              for (var x in properties){
                html+='<td>'+properties[x]+'</td>';
              }
              html+='</tr></table>';
  
              layer.bindPopup(html);
            },
            pointToLayer: function(feature, latlng) {
              var treeType = feature.properties.Species;
              return L.circleMarker(latlng, {
                fillColor: treeType == 'Falcata' ? "#1b723f" : treeType == 'Gmelina' ? "#e69800" : treeType == 'Mangium' ? "#e600aa" : "#ffff00",
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
              var html = "<table  class='table table-bordered' style='width:500px;overflow-x:auto;height:auto'>";
              //var HIGHLIGHTProp = feature.properties;
              //var popup = '<strong>Name:</strong> ' + HIGHLIGHTProp.Name + '<strong>';                     
              var properties=feature.properties;
              html+='<tr>';
              for (var x in properties) {
                html+='<td>'+x+'</td>';
              }
              html+='</tr><tr>';
              for (var x in properties){
                html+='<td>'+properties[x]+'</td>';
              }
              html+='</tr></table>';
  
              layer.bindPopup(html);
            },
            style: function(feature) {
              var treeType = feature.properties.Species;
              return {
                fillColor: treeType == 'Falcata' ? "#1b723f" : treeType == 'Gmelina' ? "#e69800" : treeType == 'Mangium' ? "#e600aa" : "#ffff00",
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

//GEOJSON
function toggleOtherLayer(URL, layerName, checked) {
  LAYER_NAME = layerName;
  if ((groupOtherLayer.getLayers().length == 0 || ADDED_LAYERS.includes(layerName) == false) && checked == true) {
    $.ajax({
      xhr: function() {
        var xhr = new XMLHttpRequest();
        //Download progress
        xhr.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            percentComplete = parseFloat(evt.loaded / evt.total) * 100;
            console.log(percentComplete);
            waitingDialog.progress(percentComplete);
            if (percentComplete == 100) {
              setTimeout(function() {
                waitingDialog.hide();
              }, 1000);
            }
          } else {
            console.log('chrome');
            var loaded = parseInt(evt.loaded / 10);
            var total = parseInt(evt.target.getResponseHeader('Content-Length'), 10);
            percentComplete = parseFloat(loaded / total) * 100;
            console.log(percentComplete);
            waitingDialog.progress(percentComplete);
            if (percentComplete == 100) {
              setTimeout(function() {
                waitingDialog.hide();
              }, 1000);
            }
          }
        }, false);
        return xhr;
      },
      type: 'GET',
      beforeSend: function() {
        waitingDialog.show('Initializing...', {
          dialogSize: 'm',
          progressType: ' bg-success',
          rtl: false
        });
        waitingDialog.animate(["Fetching data.", "Fetching data..", "Fetching data...", "Fetching data...."]);
        waitingDialog.progress(0);
      },
      url: URL,
      success: function(data) {
        var trees = data;
        var gp_layer = L.geoJSON(trees, {
          onEachFeature: function(feature, layer) {
            var html = "<table  class='table table-bordered' style='width:500px;overflow-x:auto;height:auto'>";
            //var HIGHLIGHTProp = feature.properties;
            //var popup = '<strong>Name:</strong> ' + HIGHLIGHTProp.Name + '<strong>';                     
            var properties=feature.properties;
            html+='<tr>';
            for (var x in properties) {
              html+='<td>'+x+'</td>';
            }
            html+='</tr><tr>';
            for (var x in properties){
              html+='<td>'+properties[x]+'</td>';
            }
            html+='</tr></table>';

            layer.bindPopup(html);
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

$(document).ajaxStop(function() {
  console.log('AJAX STOP');
  setTimeout(function() {
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
    $('[data-toggle="tooltip"]').tooltip({
      trigger: "hover"
    })
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
    div.innerHTML += '<i style="background: #1b723f"></i><span>Falcata</span><br>';
    div.innerHTML += '<i style="background: #e69800"></i><span>Gmelina</span><br>';
    div.innerHTML += '<i style="background: #e600aa"></i><span>Mangium</span><br>';
    div.innerHTML += '<i style="background: #ffff00"></i><span>Bagras</span><br>';
    return div;
  };
  var legend_area = L.control({
    position: "topright"
  });

  var legend_suitable = L.control({
    position: "topright"
  });
  legend_suitable.onAdd = function(map) {
    var div = L.DomUtil.create("div", "maplegend");
    var html_legend = "<i style='background:#e60000;border: 1px solid #000'></i><span> High</span><br>"+
    "<i style='background:#e7e600;border: 1px solid #000'></i><span> Moderate </span><br>"+
    "<i style='background:#267300;border: 1px solid #000'></i><span> Low </span><br>"+
    "<i style='background:#828282;border: 1px solid #000'></i><span> Not Suitable</span><br>"+
    "";
    div.innerHTML += "<h4>Suitability Level</h4>";
    div.innerHTML += html_legend;
    return div;
  };

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
        console.log('SUITABILITY_'+layerRemoveText.toUpperCase())
        if (layerRemove == 'stats') {
          var layerName = layerRemoveText.replace(/[\/. ,:-]+/g, "_") + '_' + layerRemoveDataSection[2];
          toggleAreaStats(null, layerName.toUpperCase(), layerRemoveText, layerRemoveDataSection[2], false);
        }
        if (layerRemove == 'trees') toggleTrees(null, layerRemoveText, false);
        if (layerRemove == 'areas') toggleSuitabilityAreas(null, 'SUITABILITY_'+layerRemoveText.toUpperCase(), layerRemoveText, false)
        if (layerRemove == 'survey') toggleSurveyLoc(null, layerRemoveText, false);
        if (layerRemove == 'others') toggleOtherLayer(null, layerRemoveText, false);
        if (layerRemove == 'ownership') {
          var layerName = layerRemoveDataSection[3].replace(/[\/. ,:-]+/g, "_") + '_' + layerRemoveText.replace(/[\/. ,:-]+/g, "_");
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
          map.removeControl(legend_suitable);
          map.removeLayer(groupAreaStats);
          map.removeLayer(groupSuitableAreas);
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
          map.removeControl(legend_suitable);
          map.removeLayer(groupTrees);
          map.removeLayer(groupTreesNGP);
          map.removeLayer(groupSuitableAreas);
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
            var html_legend = '';
            if(treeName == 'Gmelina'){
              html_legend = "<i style='background:#ffeacb;border: 1px solid #000'></i><span> 0.05</span><br>"+
              "<i style='background:#ffc188;border: 1px solid #000'></i><span> 0.06 - 0.19 </span><br>"+
              "<i style='background:#fc9d49;border: 1px solid #000'></i><span> 0.20 - 0.64</span><br>"+
              "<i style='background:#f07706;border: 1px solid #000'></i><span> 0.65 - 2.04</span><br>"+
              "";
            }

            if(treeName == 'Bagras'){
              html_legend = "<i style='background:#ecfccd;border: 1px solid #000'></i><span> 0.53</span><br>"+
              "<i style='background:#daf09e;border: 1px solid #000'></i><span> 0.54 - 1.09 </span><br>"+
              "<i style='background:#c7e372;border: 1px solid #000'></i><span> 1.10 - 1.67</span><br>"+
              "<i style='background:#b5d945;border: 1px solid #000'></i><span> 1.68 - 2.28</span><br>"+
              "<i style='background:#9ecc11;border: 1px solid #000'></i><span> 2.29 - 2.92</span><br>"+
              "";
            }

            if(treeName == 'Falcata'){
              html_legend = "<i style='background:#cdffcc;border: 1px solid #000'></i><span> 0.42 - 11.64</span><br>"+
              "<i style='background:#aaf5a3;border: 1px solid #000'></i><span> 11.65 - 54.13 </span><br>"+
              "<i style='background:#8bed80;border: 1px solid #000'></i><span> 54.14 - 214.96 </span><br>"+
              "<i style='background:#67e35d;border: 1px solid #000'></i><span> 214.97 - 823.78</span><br>"+
              "<i style='background:#61b55b;border: 1px solid #000'></i><span> 823.79 - 3128.48</span><br>"+
              "<i style='background:#0ecd0e;border: 1px solid #000'></i><span> 3128.49 - 11852.95</span><br>"+
              "";
            }

            if(treeName == 'Mangium'){
              html_legend = "<i style='background:#feccff;border: 1px solid #000'></i><span> 0.47 - 0.92</span><br>"+
              "<i style='background:#f5a9f4;border: 1px solid #000'></i><span> 0.93 - 2.61 </span><br>"+
              "<i style='background:#ea86e8;border: 1px solid #000'></i><span> 2.62 - 9.01 </span><br>"+
              "<i style='background:#df63dd;border: 1px solid #000'></i><span> 9.02 - 33.25</span><br>"+
              "<i style='background:#d33dd2;border: 1px solid #000'></i><span> 33.26 - 125.02</span><br>"+
              "<i style='background:#c600c7;border: 1px solid #000'></i><span> 125.03 - 472.40</span><br>"+
              "";
            }
           

            div.innerHTML += "<h4>" + treeName + " Area & Statistics in hectare</h4>";
            div.innerHTML += html_legend;
            return div;
          };
          legend_area.addTo(map);
        }

        if (layerAdd === 'others') {
          map.removeControl(legend_area);
          map.removeControl(legend_trees);
          map.removeControl(legend_suitable);
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
          map.removeControl(legend_suitable);
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
          map.removeControl(legend_suitable);
          for (var i = 0; i < LOADED_LAYERS.length; i++) {
            if (LOADED_LAYERS[i].value != 'ownership') {
              var selectionNode = LOADED_LAYERS[i].node;
              selectionNode.getElementsByTagName('input')[0].checked = false;
              $('.item[data-key="' + LOADED_LAYERS[i].id + '"] span.remove-selected').click();
            }
          }
          var layerName = layerAddDataSection[3].replace(/[\/. ,:-]+/g, "_") + '_' + layerAddText.replace(/[\/. ,:-]+/g, "_");
          toggleTPO(DATA_SOURCE_URL[layerName.toUpperCase()], layerName.toUpperCase(), true);
        }

        if (layerAdd === 'denrcaraga') {
          legend_trees.addTo(map);
          map.removeControl(legend_area);
          map.removeControl(legend_suitable);
          map.removeLayer(groupAreaStats);
          map.removeLayer(groupTrees);
          map.removeLayer(groupSuitableAreas);
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
          map.removeControl(legend_suitable);
          map.removeLayer(groupAreaStats);
          map.removeLayer(groupTrees);
          map.removeLayer(groupSuitableAreas);
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
          map.removeControl(legend_suitable);
          map.removeLayer(groupAreaStats);
          map.removeLayer(groupTrees);
          map.removeLayer(groupSuitableAreas);
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
          map.removeControl(legend_suitable);
          map.removeLayer(groupAreaStats);
          map.removeLayer(groupTrees);
          map.removeLayer(groupSuitableAreas);
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
          map.removeControl(legend_suitable);
          map.removeLayer(groupAreaStats);
          map.removeLayer(groupTrees);
          map.removeLayer(groupSuitableAreas);
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

        if (layerAdd == 'areas'){
          map.removeControl(legend_trees);
          map.removeControl(legend_area);
          map.removeLayer(groupTrees);
          map.removeLayer(groupTreesNGP);
          map.removeLayer(groupAreaStats);
  
          for (var i = 0; i < LOADED_LAYERS.length; i++) {
            var selectionNode = LOADED_LAYERS[i].node;
            if (LOADED_LAYERS[i].id != addedItems[0].id) {
              selectionNode.getElementsByTagName('input')[0].checked = false;
              $('.item[data-key="' + LOADED_LAYERS[i].id + '"] span.remove-selected').click();
            } else {
              selectionNode.getElementsByTagName('input')[0].checked = true;
            }
          }

          var layerName = layerAddText;
          var layerNameUpper = 'SUITABILITY_'+layerName.toUpperCase();
          console.log(DATA_SOURCE_URL[layerNameUpper])
          toggleSuitabilityAreas(DATA_SOURCE_URL[layerNameUpper], layerNameUpper, layerName, true)

          legend_suitable.addTo(map);
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
        if (key == base_map) {
          map.addLayer(BASE_MAP[key]);
        } else {
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
      console.log(typeofQ)
      if (checked && typeofQ == 'distri') {
        legend_trees.addTo(map);
        map.removeControl(legend_area);
        map.removeControl(legend_suitable);
        var treesInput = $('div.item[data-value="trees"');
        for (var i = 0; i < treesInput.length; i++) {
          if (typeof treesInput[i].children[1] != 'undefined') {
            if (treesInput[i].children[1].textContent == layer) {
              console.log(treesInput[i].children[1].textContent, layer);
              $('div.item[data-value="trees"')[i].children[0].click();
            } else {
              if ($('div.item[data-value="trees"')[i].children[0].checked) {
                $('div.item[data-value="trees"')[i].children[0].click();
              };
            }
          }
        }

      }

      if (checked && typeofQ == 'suitable') {
        legend_suitable.addTo(map);
        map.removeControl(legend_area);
        map.removeControl(legend_trees);
        var treesInput = $('div.item[data-value="areas"');
        for (var i = 0; i < treesInput.length; i++) {
          if (typeof treesInput[i].children[1] != 'undefined') {
            if (treesInput[i].children[1].textContent == layer) {
              console.log(treesInput[i].children[1].textContent, layer);
              $('div.item[data-value="areas"')[i].children[0].click();
            } else {
              if ($('div.item[data-value="areas"')[i].children[0].checked) {
                $('div.item[data-value="areas"')[i].children[0].click();
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
        backgroundColor: ['#1b723f', '#e69800', '#e600aa', '#ffff00']
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

    if (LAYER_TYPE == 'areas') {
      LAYER_DATA = leafletPip.pointInLayer([x, y], LAYER_GEOJSON, true);
      if (LAYER_DATA[0]) {
        var HIGHLIGHTProp = LAYER_DATA[0].feature.properties;
        var feature = LAYER_DATA[0].feature;
        HIGHLIGHT = new L.geoJson(feature, {
          style: {
            color: 'blue',
            fillColor: 'white'
          }
        });
        var popup = '<strong>Suitability Level:</strong> ' + HIGHLIGHTProp.Level + '</br><strong>Location:</strong> '+ HIGHLIGHTProp.Mun_Name + ', ' + HIGHLIGHTProp.Pro_Name + ', ' + HIGHLIGHTProp.Reg_Name + '</br>' + '<strong>Area in hectares:</strong>' + parseFloat(HIGHLIGHTProp.Area_ha).toFixed(2);
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
        var dataFalcata = HIGHLIGHTProp.Fal_Area;
        var dataGmelina = HIGHLIGHTProp.Gme_Area;
        var dataMangium = HIGHLIGHTProp.Man_Area;
        var dataBagras = HIGHLIGHTProp.Bag_Area;
        var newData = [dataFalcata.toFixed(2), dataGmelina.toFixed(2), dataMangium.toFixed(2), dataBagras.toFixed(2)];
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
    var type_q = $('#q').val();
    LAYER_NAME = $('#trees').val();
    if (type_q == 'suitable') LAYER_NAME = 'SUITABILITY_'+LAYER_NAME.toUpperCase();
    console.log(LAYER_NAME)
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
        color: "blue",
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
