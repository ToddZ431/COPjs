﻿define({
    GeometryServiceUrl: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",
    InitialExtent: {
        CenterLongitude: -88.141930,
        CenterLatitude: 41.774971,
        Level: 13
    },
    Proxy: {
        AlwaysUseProxy: false,
        DefaultProxyUrl: "Proxy/Proxy.ashx",
        ProxyRules: [
            {urlPrefix: "traffic.arcgis.com", proxyUrl: "Proxy/Proxy.ashx"}
        ]
    },
    Basemaps: {
        COPBasemap1: {
            Label: "Streets",
            Layers: [
                { url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer" },
                { url: "http://tryitlive.arcgis.com/arcgis/rest/services/PublicSafety/MapServer" }
            ]
        },
        COPBasemap2: {
            Label: "Imagery",
            Layers: [
                { url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer" },
                { url: "http://tryitlive.arcgis.com/arcgis/rest/services/ReferenceOverlay/MapServer" }
            ]
        }
    },
    OperationalLayers: [
        {
            Label: "Government Services",
            LayerType: "dynamic",
            Url: "http://tryitlive.arcgis.com/arcgis/rest/services/GovernmentServices/MapServer",
            Visible: true,
            VisibleLayers: [5,6,7,8],
            RefreshInterval: 0,
            Opacity: 0.9,
            DisableClientCaching: true,
            MaxScale: 0,
            MinScale: 0,
            PopupInfos: [
                {
                    Layer: 5,
                    PopupInfo: {
                        title: "<strong>${NAME}</strong>",
                        content: "${*}"
                    }
                }, {
                    Layer: 8,
                    PopupInfo: {
                        title: "<strong>${NAME}</strong>",
                        content: "${*}"
                    }
                }

            ]
        },{
            Label: "Shelters",
            LayerType: "feature",
            Url: "http://services.arcgis.com/b6gLrKHqgkQb393u/ArcGIS/rest/services/IncidentCommandTryItLive102/FeatureServer/5",
            Visible: true,
            RefreshInterval: 5,
            Opacity: 0.8,
            DisableClientCaching: true,
            MaxScale: 0,
            MinScale: 0,
			PopupInfo: { 
				title: "<strong>${FACNAME}</strong>",
				content: "Organization: ${ORGANIZ}<br />" +
                         "Telephone: ${POCPHONE}"
			}
        },{
            Label: "Radar",
            LayerType: "wms",
            Url: "http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?",
            Visible: true,
            VisibleLayers: ["nexrad-n0r"],
            RefreshInterval: 5,
            Opacity: 0.45,
            MaxScale: 0,
            MinScale: 0
        }]
    });



/* *** Layer Object ***

{
    Label: "Layer Name",                        // Required. Descriptive title of the layer
    LayerType: "dynamic",                       // Required. dynamic, tiled, feature, wms
    Url: "http://host/path/to/MapServer",       // Required. URL to map service
    Visible: true,                              // Default visibility of the layer, true or false
    VisibleLayers: [ ],                         // Array of visible layers within the map service, [1,2,3], or empty [ ] to use default layers from service
    RefreshInterval: 0,                         // Time in minutes to automatically refresh the layer, 0 for no refresh
    Opacity: 1.0,                               // Opacity of the layer, 0.0 to 1.0, defaults to 1.0 if omitted
    DisableClientCaching: true,                 // Disable browser caching of the layer, true or false
    MaxScale: 0,                                // Maximum zoomed in scale to display the layer
    MinScale: 0                                 // Minimum zoomed out scale to display the layer
	PopupInfo: { InfoTemplate }                 // For LayerType = "feature": InfoTemplate object. See: https://developers.arcgis.com/javascript/jshelp/intro_formatinfowindow.html
    PopupInfos: [{Layer: 1,                     // For LayerType = "dynamic" or "tiled": Array of layer indexes and InfoTemplate objects
                  PopupInfo: { InfoTemplate }  //     to define popups for layers within the map service.
                 }
                ]
}

*/