var map, urlObject, smallScreen, popup, toc;

require([
    "Config/DefaultConfig",
	"COP/LayerFactory",
    "agsjs/dijit/TOC",
    "dojo/_base/array",
    "dojo/dom",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/parser",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/layout/TabContainer",
    "dijit/form/Button",
    "dijit/form/CheckBox",
    "dijit/form/ToggleButton",
    "dijit/registry",
    "esri/map",
    "esri/basemaps",
    "esri/config",
    "esri/dijit/BasemapToggle",
    "esri/dijit/HomeButton",
    "esri/dijit/LocateButton",
    "esri/dijit/Measurement",
    "esri/dijit/Popup",
    "esri/dijit/PopupMobile",
    "esri/tasks/GeometryService",
    "esri/urlUtils",
    "dojo/domReady!"
],
function (
    mapConfig,
	layerFactory,
    TOC,
    arrayUtils,
    dom,
    domClass,
    domConstruct,
    parser,
    BorderContainer,
    ContentPane,
    TabContainer,
    Button,
    CheckBox,
    ToggleButton,
    registry,
    Map,
    esriBasemaps,
    esriConfig,
    BasemapToggle,
    HomeButton,
    LocateButton,
    Measurement,
    Popup,
    PopupMobile,
    GeometryService,
    urlUtils) {

    parser.parse();
    urlObject = urlUtils.urlToObject(window.location.href);
    dom.byId("appTitle").innerHTML = mapConfig.AppTitle;

    //esri configuration
    esriConfig.defaults.io.alwaysUseProxy = mapConfig.Proxy.AlwaysUseProxy;
    esriConfig.defaults.io.proxyUrl = mapConfig.Proxy.DefaultProxyUrl;
    esriConfig.defaults.geometryService = new GeometryService(mapConfig.GeometryServiceUrl);

    //proxy rules
    arrayUtils.forEach(mapConfig.Proxy.ProxyRules, function (rule) {
        urlUtils.addProxyRule(rule);
    });

    //basemaps
    esriBasemaps.copBasemap1 = {
        baseMapLayers: mapConfig.Basemaps.COPBasemap1.Layers,
        title: mapConfig.Basemaps.COPBasemap1.Label,
        thumbnailUrl: rootPath + "/Images/clear1x1.png"
    };
    esriBasemaps.copBasemap2 = {
        baseMapLayers: mapConfig.Basemaps.COPBasemap2.Layers,
        title: mapConfig.Basemaps.COPBasemap2.Label,
        thumbnailUrl: rootPath + "/Images/clear1x1.png"
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
        initTools();
    });


    function initLayers() {
        var tocInfos = [];
        // load operational layers
		arrayUtils.forEach(mapConfig.OperationalLayers, function (layerInfo) {
		    var factory = new layerFactory(layerInfo);
			var layer = factory.createLayer();
			if (layer) {
			    map.addLayer(layer);
			    if (!layerInfo.ExcludeFromTOC) {
			        var tocInfo = {
			            layer: layer,
			            title: layerInfo.Label,
			            collapsed: !layerInfo.ExpandInTOC || false,
			            slider: false,
			            autoToggle: false
			        }
			        tocInfos.push(tocInfo);
			    }
			    if (layerInfo.QuickToggle) {
			        var nodeId = "qt-" + layer.id;
			        var node = domConstruct.create("div", { id: nodeId }, dom.byId("quickToggleDiv"), "first");
			        new ToggleButton({
			            showLabel: true,
			            checked: layerInfo.Visible,
			            onChange: function (val) { layer.setVisibility(val) },
			            label: layerInfo.Label,
                        iconClass: "toggleIcon"
			        }, nodeId).startup();
			    }
			}
		});

        // initialize TOC
		toc = new TOC({
		    map: map,
		    style: "inline",
		    layerInfos: tocInfos.reverse()
		}, 'tocDiv');
		toc.startup();
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
            visible: true
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
        if (smallScreen || mapConfig.CollapseSidePane) {
            domClass.toggle(registry.byId("sidePane").domNode, "collapsed");
            registry.byId("mainContainer").layout();
            map.resize();
        }
    }

    function initTools() {
        // measure tool
        var measure = new esri.dijit.Measurement({
            map: map,
            defaultAreaUnit: esri.Units.SQUARE_MILES,
            defaultLengthUnit: esri.Units.FEET
                          }, dom.byId("toolForm"));
        measure.startup();
        measure.setTool("distance",false);
    }
});
