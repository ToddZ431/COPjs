define([
	"dojo/_base/declare",
	"esri/layers/ArcGISDynamicMapServiceLayer",
	"esri/layers/FeatureLayer",
	"esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/WMSLayer"],
	function (
        declare,
		ArcGISDynamicMapServiceLayer,
		FeatureLayer,
		ArcGISTiledMapServiceLayer,
        WMSLayer) {
		
	    return declare(null, {
			Label: null,
			LayerType: null,
			Url: null,
			Visible: null,
			VisibleLayers: null,
			RefreshInterval: null,
			Opacity: null,
			DisableClientCaching: null,
			MaxScale: null,
			MinScale: null,
			
			constructor: function(options) {
				this.Label = options.Label || "";
				this.LayerType = options.LayerType;
				this.Url = options.Url;
				this.Visible = options.Visible || true;
				this.VisibleLayers = options.VisibleLayers || [ ];
				this.RefreshInterval = options.RefreshInterval || 0;
				this.Opacity = options.Opacity || 1.0;
				this.DisableClientCaching = options.DisableClientCaching || false;
				this.MaxScale = options.MaxScale || 0;
				this.MinScale = options.MinScale || 0;
			},
			
			createLayer: function() {
				var layer = null;
				switch (this.LayerType) {
					case "dynamic":
					case "Dynamic":
						layer = new ArcGISDynamicMapServiceLayer(this.Url, {
							opacity: this.Opacity,
							refreshInterval: this.RefreshInterval,
							visible: this.Visible
						});
						if (layer) {
							layer.setDisableClientCaching(this.DisableClientCaching);
							layer.setMaxScale(this.MaxScale);
							layer.setMinScale(this.MinScale);
							if (this.VisibleLayers.length > 0)
								layer.setVisibleLayers(this.VisibleLayers);
						}
						break;
					case "feature":
					case "Feature":
						layer = new FeatureLayer(this.Url, {
							opacity: this.Opacity,
							refreshInterval: this.RefreshInterval,
							visible: this.Visible,
							outFields: ["*"]
						});
						if (layer) {
							layer.setMaxScale(this.MaxScale);
							layer.setMinScale(this.MinScale);
						}
						break;
					case "tiled":
					case "Tiled":
						layer = new ArcGISTiledMapServiceLayer(this.Url, {
							opacity: this.Opacity,
							refreshInterval: this.RefreshInterval,
							visible: this.Visible
						});
						if (layer) {
							layer.setMaxScale(this.MaxScale);
							layer.setMinScale(this.MinScale);
						}
						break;
				    case "wms":
				    case "WMS":
				        layer = new WMSLayer(this.Url, {
                            transparent: true,
				            visibleLayers: this.VisibleLayers
				        });
				        if (layer) {
				            layer.setOpacity(this.Opacity);
				            layer.setMaxScale(this.MaxScale);
				            layer.setMinScale(this.MinScale);
				            layer.setVisibility(this.Visible);
				            layer.setRefreshInterval(this.RefreshInterval);
				        }
				        break;
				    default:
				        console.error("Layer type '" + this.LayerType + "' not recognized for layer '" + this.Label + "'.");
				}
				
				return layer;
			}
		});
	}
);

