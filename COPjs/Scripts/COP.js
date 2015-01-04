var map, urlObject, smallScreen, popup;

require([
    "Config/DefaultConfig",
	"COP/LayerFactory",
    "dojo/_base/array",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/parser",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/layout/TabContainer",
    "dijit/form/Button",
    "dijit/registry",
    "esri/map",
    "esri/config",
    "esri/dijit/BasemapToggle",
    "esri/dijit/HomeButton",
    "esri/dijit/LocateButton",
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
    domClass,
    domConstruct,
    parser,
    BorderContainer,
    ContentPane,
    TabContainer,
    Button,
    registry,
    Map,
    esriConfig,
    BasemapToggle,
    HomeButton,
    LocateButton,
    Popup,
    PopupMobile,
    GeometryService,
    urlUtils) {

    parser.parse();
    urlObject = urlUtils.urlToObject(window.location.href);

    //esri configuration
    esriConfig.defaults.io.alwaysUseProxy = mapConfig.Proxy.AlwaysUseProxy;
    esriConfig.defaults.io.proxyUrl = mapConfig.Proxy.DefaultProxyUrl;
    esriConfig.defaults.geometryService = new GeometryService(mapConfig.GeometryServiceUrl);

    //proxy rules
    arrayUtils.forEach(mapConfig.Proxy.ProxyRules, function (rule) {
        urlUtils.addProxyRule(rule);
    });

    //basemaps
    esriConfig.defaults.map.basemaps.copBasemap1 = {
        baseMapLayers: mapConfig.Basemaps.COPBasemap1.Layers,
        title: mapConfig.Basemaps.COPBasemap1.Label
    };
    esriConfig.defaults.map.basemaps.copBasemap2 = {
        baseMapLayers: mapConfig.Basemaps.COPBasemap2.Layers,
        title: mapConfig.Basemaps.COPBasemap2.Label
    };

    //get initial extent from url parameters
    var centerY, centerX, level;
    if (urlObject.query) {
        if (urlObject.query.center) {
            try {
                var coords = urlObject.query.center.split(",");
                centerX = parseFloat(coords[0]);
                centerY = parseFloat(coords[1]);
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
    if (isNaN(centerY) || isNaN(centerX)) {
        centerY = mapConfig.InitialExtent.CenterY;
        centerX = mapConfig.InitialExtent.CenterX;
    }
    if (isNaN(level))
        level = mapConfig.InitialExtent.ZoomLevel;
    console.log("Initial Center: " + centerX + ", " + centerY + " Level: " + level);

    // if window is small, use mobile popup
    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (windowWidth < 600) { smallScreen = true; } else { smallScreen = false; }
    if (smallScreen) {
        popup = new PopupMobile(null, domConstruct.create("div"));
    }
    else {
        popup = new Popup({ anchor: "auto", titleInBody: false, visibleWhenEmpty: false }, domConstruct.create("div", { class: "dark" }));
    }

    // initialize the map
    map = new Map("mapDiv", {
        center: [centerX, centerY ],
        zoom: level,
        minZoom: mapConfig.MinZoomLevel,
        maxZoom: mapConfig.MaxZoomLevel,
        basemap: "copBasemap1",
        infoWindow: popup,
        sliderPosition: "top-right"
    });
    
    map.on("load", function () {
        initLayers();
        initUI();
    });


    function initLayers() {
		arrayUtils.forEach(mapConfig.OperationalLayers, function (layerInfo) {
		    var factory = new layerFactory(layerInfo);
			var layer = factory.createLayer();
			if (layer)
				map.addLayer(layer);
		});
    }

    function initUI() {
        // home button
        var homeButton = new HomeButton({
            map: map,
            extent: null,
            visible: true
        }, "homeBtn");
        homeButton.startup();

        // locate button
        var locateButton = new LocateButton({
            map: map,
            highlightLocation: true,
            useTracking: true,
            visible: true
        }, "locateBtn");
        locateButton.startup();

        // basemap toggle
        var bmToggle = new BasemapToggle({
            map: map,
            basemap: "copBasemap2",
            visible: true,
            basemaps: {
                "copBasemap1": {
                    "label": mapConfig.Basemaps.COPBasemap1.Label,
                    "url": rootPath + "/Images/clear1x1.png"
                },
                "copBasemap2": {
                    "label": mapConfig.Basemaps.COPBasemap2.Label,
                    "url": rootPath + "/Images/clear1x1.png"
                }
            }
        }, "basemapToggle");
        bmToggle.startup();

        // menu button
        var myButton = new Button({
            label: "Menu",
            showLabel: false,
            iconClass: "menuIcon",
            onClick: function () {
                domClass.toggle(registry.byId("sidePane").domNode, "collapsed");
                registry.byId("mainContainer").layout();
                map.resize();
            }
        }, "menuBtn").startup();

        // collapse side pane on small screen
        if (smallScreen) {
            domClass.toggle(registry.byId("sidePane").domNode, "collapsed");
            registry.byId("mainContainer").layout();
            map.resize();
        }
    }
});
