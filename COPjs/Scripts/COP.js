var map, urlObject, windowWidth, popup;

require([
    "Config/DefaultConfig",
	"COP/LayerFactory",
    "dojo/_base/array",
    "dojo/dom-construct",
    "esri/map",
    "esri/config",
    "esri/dijit/Popup",
    "esri/dijit/PopupMobile",
    "esri/tasks/GeometryService",
    "esri/urlUtils",
    "dojo/domReady!"
],
function (
    mapConfig,
	layerFactory,
    arrayUtils,
    domConstruct,
    Map,
    esriConfig,
    Popup,
    PopupMobile,
    GeometryService,
    urlUtils) {

    urlObject = urlUtils.urlToObject(window.location.href);

    //default configuration
    esriConfig.defaults.io.alwaysUseProxy = mapConfig.Proxy.AlwaysUseProxy;
    esriConfig.defaults.io.proxyUrl = mapConfig.Proxy.DefaultProxyUrl;
    esriConfig.defaults.geometryService = new GeometryService(mapConfig.GeometryServiceUrl);

    //proxy rules
    arrayUtils.forEach(mapConfig.Proxy.ProxyRules, function (rule) {
        urlUtils.addProxyRule(rule);
    });

    //basemaps
    esriConfig.defaults.map.basemaps.streetBasemap = {
        baseMapLayers: mapConfig.Basemaps.StreetBasemapLayers,
        title: "Streets"
    };
    esriConfig.defaults.map.basemaps.imageryBasemap = {
        baseMapLayers: mapConfig.Basemaps.ImageryBasemapLayers,
        title: "Imagery"
    };

    //get initial extent from url parameters
    var centerLat, centerLng, level;
    if (urlObject.query) {
        if (urlObject.query.center) {
            try {
                var coords = urlObject.query.center.split(",");
                centerLng = parseFloat(coords[0]);
                centerLat = parseFloat(coords[1]);
            }
            catch (err) { console.log("URL center parameter parse error: " + err.description); }
        }
        if (urlObject.query.level) {
            try {
                level = parseInt(urlObject.query.level);
            }
            catch (err) { console.log("URL level parameter parse error: " + err.description); }
        }
    }
    //if not in url paramenters, use config values
    if (isNaN(centerLat) || isNaN(centerLng)) {
        centerLat = mapConfig.InitialExtent.CenterLatitude;
        centerLng = mapConfig.InitialExtent.CenterLongitude;
    }
    if (isNaN(level))
        level = mapConfig.InitialExtent.Level;
    console.log("Initial Center: " + centerLat + ", " + centerLng + " Level: " + level);

    // if window is small, use mobile popup
    windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (windowWidth < 600) {
        popup = new PopupMobile(null, domConstruct.create("div"));
    }
    else {
        popup = new Popup({ anchor: "auto", titleInBody: false }, domConstruct.create("div", { class: "dark" }));
    }

    map = new Map("mapDiv", {
        center: [centerLng, centerLat ],
        zoom: level,
        basemap: "streetBasemap",
        infoWindow: popup
    });

    map.on("load", initLayers);

    function initLayers() {
		arrayUtils.forEach(mapConfig.OperationalLayers, function (layerInfo) {
		    var factory = new layerFactory(layerInfo);
			var layer = factory.createLayer();
			if (layer)
				map.addLayer(layer);
		});
    }
});
