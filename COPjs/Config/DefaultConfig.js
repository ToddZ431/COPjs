define({
    GeometryServiceUrl: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",
    InitialExtent: {
        CenterLongitude: -88.141930,
        CenterLatitude: 41.774971,
        Level: 13
    },
    Basemaps: {
        StreetBasemapLayers: [
            { url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer" },
            { url: "http://tryitlive.arcgis.com/arcgis/rest/services/PublicSafety/MapServer" }
        ],
        ImageryBasemapLayers: [
            { url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer" }
        ]
    },
    OperationalLayers: [
        {
            Label: "Emergency Operations",
            LayerType: "dynamic",
            Url: "http://tryitlive.arcgis.com/arcgis/rest/services/EmergencyOperations/MapServer",
            Visible: true,
            VisibleLayers: [1,3,4,5],
            RefreshInterval: 5,
            Opacity: 0.9,
            DisableClientCaching: true,
            MaxScale: 0,
            MinScale: 0
        },
        {
            Label: "Shelters",
            LayerType: "feature",
            Url: "http://services.arcgis.com/b6gLrKHqgkQb393u/ArcGIS/rest/services/IncidentCommandTryItLive102/FeatureServer/5",
            Visible: true,
            RefreshInterval: 5,
            Opacity: 0.8,
            DisableClientCaching: true,
            MaxScale: 0,
            MinScale: 0
        },
        {
            Label: "Radar",
            LayerType: "wms",
            Url: "http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?",
            Visible: true,
            VisibleLayers: ["nexrad-n0r"],
            RefreshInterval: 5,
            Opacity: 0.45,
            MaxScale: 0,
            MinScale: 0
        }
    ],
    Proxy: {
        AlwaysUseProxy: false,
        DefaultProxyUrl: "Proxy/Proxy.ashx",
        ProxyRules: [
            {urlPrefix: "traffic.arcgis.com", proxyUrl: "Proxy/Proxy.ashx"}
        ]
    }
});



/* *** Layer Object ***

{
    Label: "Layer Name",                        // Required. Descriptive title of the layer
    LayerType: "dynamic",                       // Required. dynamic, tiled, feature, wms
    Url: "http://svrarcgis2/path/to/MapServer", // Required. URL to map service
    Visible: true,                              // Default visibility of the layer, true or false
    VisibleLayers: [ ],                         // Array of visible layers within the map service, [1,2,3], or empty [ ] to use default layers from service
    RefreshInterval: 0,                         // Time in minutes to automatically refresh the layer, 0 for no refresh
    Opacity: 1.0,                               // Opacity of the layer, 0.0 to 1.0, defaults to 1.0 if omitted
    DisableClientCaching: true,                 // Disable browser caching of the layer, true or false
    MaxScale: 0,                                // Maximum zoomed in scale to display the layer
    MinScale: 0                                 // Minimum zoomed out scale to display the layer
}

*/