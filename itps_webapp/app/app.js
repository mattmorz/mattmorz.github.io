var LAYERS = [];
const BAGRAS_GEOJSON = "http://127.0.0.1/itps_webapp/data/RescaledRefinedBagras_CaragaRegion.json";
const MANGIUM_GEOJSON = "http://127.0.0.1/itps_webapp/data/RescaledRefinedMangium_CaragaRegion.json";
const GMELINA_GEOJSON = "http://127.0.0.1/itps_webapp/data/RescaledRefinedGmelina_CaragaRegion.json";
const FALCATA_GEOJSON = "http://127.0.0.1/itps_webapp/data/RescaledRefinedFalcata_CaragaRegion.json";
const BRGY_JSON = "http://127.0.0.1/itps_webapp/data/Falcata_Stats_BrgyLevel.json";

const FALCATA_SHP = "http://127.0.0.1/itps_webapp//data/RescaledRefinedFalcata_CaragaRegion.zip";
// standard leaflet map setup
var map = L.map('map');
map.setView([9.1204, 125.59], 8);

var treesRepo = L.geoJson(null);
var brgyRepo = L.geoJson(null);
var FALCATAtileLayer, BAGRAStileLayer,MANGIUMtileLayer, GMELINAtileLayer;
var BRGYtileLayer;
var toogleFALCATA = false;
var toogleBAGRAS = false;
var toogleGMELINA = false;
var toogleMANGIUM = false; 
var toogleBRGY = false;
var highlight;

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
            toogleBAGRAS = true
            setTimeout(function() {
                $('#loadMe').modal('hide');
            }, 500);
        });
    }

}

//STATS
function addStatsByBrgy(){
    var brgys;
    if(toogleBRGY == false){
        $('#loadMe').modal('show');
        var data = omnivore.geojson(BRGY_JSON);
        data.on('ready', function() {
            console.log('ready');
            brgys = data.toGeoJSON();
            brgyRepo.addData(brgys);
            BRGYtileLayer = L.vectorGrid.slicer(brgys, {
                rendererFactory: L.canvas.tile,
                loadingControl: true,
                vectorTileLayerStyles: {
                    sliced: {
                        fillColor: "white",
                        color: "black",
                        weight: 1,
                        fill: true,
                        stroke: true,
                        fillOpacity: 0
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
            toogleBRGY = true
            setTimeout(function() {
                $('#loadMe').modal('hide');
            }, 500);
        });
    }

}
   
 $(document).ready(function() {

    //Base Maps
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; OpenStreetMap contributors',
        name:'Open Street Map',
        zIndex: 0
    }).addTo(map)
    var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: 'Map data &copy; Google',
        name:'Google Sattelite',
        zIndex: 0
    }).addTo(map);
    var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: 'Map data &copy; Google',
        name:'Google Hybrid',
        zIndex: 0
    }).addTo(map);
    //End Base Maps

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
    $('#layers').multiselect({
        nonSelectedText: 'Select Layers',
        onChange: function(option, checked, select) {
            var layer =  $(option).val();
            if (checked){
                console.log(checked);
                LAYERS.push(layer);
                
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
                if (layer === 'Barangay' && toogleBRGY == false){
                    addStatsByBrgy();
                }
                if (layer === 'Barangay' && toogleBRGY == true){
                    map.addLayer(BRGYtileLayer);
                }
            }else{
                console.log(checked);
                var idx = LAYERS.indexOf(layer);
                LAYERS.splice(idx,1);
                if (layer === 'Falcata'){map.removeLayer(FALCATAtileLayer);}
                if (layer === 'Bagras'){map.removeLayer(BAGRAStileLayer);}
                if (layer === 'Gmelina'){map.removeLayer(GMELINAtileLayer);}
                if (layer === 'Mangium'){map.removeLayer(MANGIUMtileLayer);}
                if (layer === 'Barangay'){map.removeLayer(BRGYtileLayer);}
            }
            console.log(LAYERS.toString());
        }
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
            alert('Changed option ' + $(option).val() + '.');
        }
    });
    
    var shpfile = new L.Shapefile(FALCATA_SHP,function(data){
        console.log(data)
    });
   
    //END LAYERS

   
    //MAP Interaction
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Falcata', 'Bagras', 'Gmelina', 'Mangium'],
            datasets: [{
                label: 'Area in sq. m.',
                data: [],
                backgroundColor: [
                    'skyblue',
                    'green',
                    'red',
                    'orange',
                ]
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
        var layerData1 = leafletPip.pointInLayer([x,y], brgyRepo, true);
     
        if (layerData[0] && LAYERS.includes('Barangay') == false) {
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

        if (layerData1[0] && LAYERS.includes('Barangay')) {
            var highlightIndex = layerData1[0].feature.id;
            console.log(highlightIndex);
            var highlightProp = layerData1[0].feature.properties;
            var loc = highlightProp.Bgy_Name+', '+highlightProp.Mun_Name+', '+highlightProp.Pro_Name;
            var feature = layerData1[0].feature;
            
            
            highlight = new L.geoJson(feature, {
                style: {
                    color:'white', 
                    fillColor:'white'
                },
            });
            var forTestValue = Math.floor(Math.random() * Math.floor(500000));
            var forTestValue1 = Math.floor(Math.random() * Math.floor(500000))
            var forTestValue2 = Math.floor(Math.random() * Math.floor(500000))
            var forTestValue3 = Math.floor(Math.random() * Math.floor(500000))
            var newData = [forTestValue,forTestValue1,forTestValue2,forTestValue3];
            myChart.data["datasets"][0]["data"] = newData
            myChart.options.title.text = loc;
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

});

